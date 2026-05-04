$ErrorActionPreference = "Stop"

function Write-Info($Message) { Write-Host "[info]  $Message" -ForegroundColor Cyan }
function Write-Ok($Message) { Write-Host "[ok]    $Message" -ForegroundColor Green }
function Write-Warn($Message) { Write-Host "[warn]  $Message" -ForegroundColor Yellow }
function Write-Fail($Message) { Write-Host "[error] $Message" -ForegroundColor Red }
function Write-Section($Message) {
  Write-Host ""
  Write-Host $Message -ForegroundColor White
}

function Assert-Command($Name, $InstallUrl, $VersionArgs) {
  $Command = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $Command) {
    Write-Fail "'$Name' not found. Please install it first."
    Write-Fail "  -> $InstallUrl"
    exit 1
  }

  $Version = & $Name @VersionArgs 2>&1 | Select-Object -First 1
  Write-Ok "$Name $Version"
}

$Root = Split-Path -Parent $PSCommandPath
Set-Location $Root

Write-Host ""
Write-Host "StrongerNotes - dev bootstrap" -ForegroundColor Cyan

Write-Section "1/5  Checking prerequisites..."
Assert-Command "node" "https://nodejs.org" @("--version")
Assert-Command "npm" "https://nodejs.org" @("--version")
Assert-Command "docker" "https://docs.docker.com/get-docker/" @("--version")

docker info *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Fail "Docker daemon is not running. Please start Docker Desktop and try again."
  exit 1
}
Write-Ok "Docker daemon is running"

Write-Section "2/5  Setting up environment files..."

$BackEnv = Join-Path $Root "back\.env"
if (-not (Test-Path $BackEnv)) {
  $JwtSecret = node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))"
  @"
NODE_ENV=dev
PORT=3333
MONGODB_URI=mongodb://127.0.0.1:27017/strongernotes
JWT_SECRET=$JwtSecret
"@ | Set-Content -Path $BackEnv -Encoding UTF8
  Write-Ok "Created back/.env  (JWT_SECRET auto-generated)"
} else {
  Write-Ok "back/.env already exists - skipping"
}

$FrontEnv = Join-Path $Root "front\.env"
if (-not (Test-Path $FrontEnv)) {
  Copy-Item -Path (Join-Path $Root "front\.env.example") -Destination $FrontEnv
  Write-Ok "Created front/.env"
} else {
  Write-Ok "front/.env already exists - skipping"
}

Write-Section "3/5  Installing dependencies..."

if (-not (Test-Path (Join-Path $Root "back\node_modules"))) {
  Write-Info "Installing backend dependencies..."
  Push-Location (Join-Path $Root "back")
  npm install --silent
  Pop-Location
  Write-Ok "Backend dependencies installed"
} else {
  Write-Ok "Backend node_modules already present - skipping"
}

if (-not (Test-Path (Join-Path $Root "front\node_modules"))) {
  Write-Info "Installing frontend dependencies..."
  Push-Location (Join-Path $Root "front")
  npm install --silent
  Pop-Location
  Write-Ok "Frontend dependencies installed"
} else {
  Write-Ok "Frontend node_modules already present - skipping"
}

Write-Section "4/5  Starting MongoDB..."

Push-Location (Join-Path $Root "db")
docker compose up -d
$ComposeExitCode = $LASTEXITCODE
Pop-Location

if ($ComposeExitCode -ne 0) {
  Write-Fail "Failed to start MongoDB container."
  exit 1
}

Write-Info "Waiting for MongoDB to accept connections..."
$MongoReady = $false
for ($i = 1; $i -le 30; $i++) {
  docker exec mongo-local mongosh --quiet --eval "db.runCommand({ping:1})" *> $null
  if ($LASTEXITCODE -eq 0) {
    $MongoReady = $true
    break
  }
  Start-Sleep -Seconds 1
}

if (-not $MongoReady) {
  Write-Fail "MongoDB did not become ready in time. Check: docker logs mongo-local"
  exit 1
}
Write-Ok "MongoDB is ready"

Write-Section "5/5  Starting services..."

$LogDir = Join-Path $Root ".logs"
New-Item -ItemType Directory -Force -Path $LogDir *> $null

$BackLog = Join-Path $LogDir "backend.log"
$FrontLog = Join-Path $LogDir "frontend.log"

$BackJob = Start-Job -Name "StrongerNotesBackend" -ArgumentList (Join-Path $Root "back"), $BackLog -ScriptBlock {
  param($WorkingDirectory, $LogPath)
  Set-Location $WorkingDirectory
  & cmd.exe /d /s /c "npm run dev" *> $LogPath
}
Write-Info "Backend started (job $($BackJob.Id)) - logs: .logs/backend.log"

Write-Info "Waiting for backend API..."
$BackendReady = $false
for ($i = 1; $i -le 20; $i++) {
  try {
    Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3333/health" -TimeoutSec 2 *> $null
    $BackendReady = $true
    break
  } catch {
    Start-Sleep -Seconds 1
  }
}

if ($BackendReady) {
  Write-Ok "Backend API is ready at http://localhost:3333"
} else {
  Write-Warn "Backend did not respond in time. Check .logs/backend.log for errors."
}

$FrontJob = Start-Job -Name "StrongerNotesFrontend" -ArgumentList (Join-Path $Root "front"), $FrontLog -ScriptBlock {
  param($WorkingDirectory, $LogPath)
  Set-Location $WorkingDirectory
  & cmd.exe /d /s /c "npm run dev" *> $LogPath
}
Write-Info "Frontend started (job $($FrontJob.Id)) - logs: .logs/frontend.log"

Start-Sleep -Seconds 3
$FrontUrl = "http://localhost:5173"
if (Test-Path $FrontLog) {
  $DetectedUrl = Select-String -Path $FrontLog -Pattern "http://localhost:\d+" | Select-Object -First 1
  if ($DetectedUrl) {
    $FrontUrl = $DetectedUrl.Matches[0].Value
  }
}

Write-Host ""
Write-Host "StrongerNotes is running!" -ForegroundColor Green
Write-Host "  App  -> $FrontUrl"
Write-Host "  API  -> http://localhost:3333"
Write-Host "  Logs -> .logs/"
Write-Host ""
Write-Host "Press Ctrl+C to stop backend and frontend." -ForegroundColor Yellow

try {
  while ($true) {
    if ($BackJob.State -ne "Running" -or $FrontJob.State -ne "Running") {
      Write-Warn "One of the services stopped. Check the logs in .logs/."
      break
    }
    Start-Sleep -Seconds 1
  }
} finally {
  Write-Warn "Shutting down..."
  Stop-Job -Job $BackJob, $FrontJob -ErrorAction SilentlyContinue
  Remove-Job -Job $BackJob, $FrontJob -Force -ErrorAction SilentlyContinue
  Write-Ok "Backend and frontend stopped."
  Write-Info "MongoDB container is still running. To stop it: cd db; docker compose stop"
}
