#!/usr/bin/env bash
# ---------------------------------------------------------------
# StrongerNotes — dev bootstrap
# Usage:  ./start.sh
# Stops:  Ctrl+C
# ---------------------------------------------------------------
set -euo pipefail

# ── colours ────────────────────────────────────────────────────
C_CYAN='\033[0;36m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[1;33m'
C_RED='\033[0;31m'
C_BOLD='\033[1m'
C_OFF='\033[0m'

info()    { echo -e "${C_CYAN}[info]${C_OFF}  $*"; }
ok()      { echo -e "${C_GREEN}[ok]${C_OFF}    $*"; }
warn()    { echo -e "${C_YELLOW}[warn]${C_OFF}   $*"; }
err()     { echo -e "${C_RED}[error]${C_OFF}  $*" >&2; }
section() { echo -e "\n${C_BOLD}$*${C_OFF}"; }

# ── root of project ────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${C_CYAN}"
echo "  ███████╗████████╗██████╗  ██████╗ ███╗   ██╗ ██████╗ ███████╗██████╗ "
echo "  ██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝ ██╔════╝██╔══██╗"
echo "  ███████╗   ██║   ██████╔╝██║   ██║██╔██╗ ██║██║  ███╗█████╗  ██████╔╝"
echo "  ╚════██║   ██║   ██╔══██╗██║   ██║██║╚██╗██║██║   ██║██╔══╝  ██╔══██╗"
echo "  ███████║   ██║   ██║  ██║╚██████╔╝██║ ╚████║╚██████╔╝███████╗██║  ██║"
echo "  ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝"
echo "                         N O T E S"
echo -e "${C_OFF}"

# ── 1. prerequisite checks ─────────────────────────────────────
section "1/5  Checking prerequisites…"

check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    err "'$1' not found. Please install it first."
    err "  → ${2}"
    exit 1
  fi
  ok "$1 $(${3:-$1 --version 2>&1 | head -1})"
}

check_cmd node  "https://nodejs.org"           "node --version"
check_cmd npm   "https://nodejs.org"           "npm --version"
check_cmd docker "https://docs.docker.com/get-docker/" "docker --version"
check_cmd curl  "https://curl.se/download.html" "curl --version"

if ! docker info &>/dev/null; then
  err "Docker daemon is not running. Please start Docker and try again."
  exit 1
fi
ok "Docker daemon is running"

# ── 2. environment files ───────────────────────────────────────
section "2/5  Setting up environment files…"

generate_secret() {
  node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))"
}

if [ ! -f back/.env ]; then
  JWT_SECRET=$(generate_secret)
  cat > back/.env <<EOF
NODE_ENV=dev
PORT=3333
MONGODB_URI=mongodb://127.0.0.1:27017/strongernotes
JWT_SECRET=${JWT_SECRET}
EOF
  ok "Created back/.env  (JWT_SECRET auto-generated)"
else
  ok "back/.env already exists — skipping"
fi

if [ ! -f front/.env ]; then
  cp front/.env.example front/.env
  ok "Created front/.env"
else
  ok "front/.env already exists — skipping"
fi

# ── 3. install dependencies ────────────────────────────────────
section "3/5  Installing dependencies…"

if [ ! -d back/node_modules ]; then
  info "Installing backend dependencies…"
  (cd back && npm install --silent)
  ok "Backend dependencies installed"
else
  ok "Backend node_modules already present — skipping"
fi

if [ ! -d front/node_modules ]; then
  info "Installing frontend dependencies…"
  (cd front && npm install --silent)
  ok "Frontend dependencies installed"
else
  ok "Frontend node_modules already present — skipping"
fi

# ── 4. start MongoDB ───────────────────────────────────────────
section "4/5  Starting MongoDB…"

(cd db && docker compose up -d 2>&1) || {
  err "Failed to start MongoDB container."
  exit 1
}

info "Waiting for MongoDB to accept connections…"
MAX_RETRIES=30
for i in $(seq 1 $MAX_RETRIES); do
  if docker exec mongo-local mongosh --quiet --eval "db.runCommand({ping:1})" &>/dev/null 2>&1; then
    ok "MongoDB is ready"
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    err "MongoDB did not become ready in time. Check: docker logs mongo-local"
    exit 1
  fi
  sleep 1
done

# ── 5. start backend + frontend ────────────────────────────────
section "5/5  Starting services…"

LOG_DIR=".logs"
mkdir -p "$LOG_DIR"

BACK_LOG="$LOG_DIR/backend.log"
FRONT_LOG="$LOG_DIR/frontend.log"

# start backend
(cd back && npm run dev) > "$BACK_LOG" 2>&1 &
BACK_PID=$!
info "Backend started (PID $BACK_PID) — logs: $BACK_LOG"

# wait for backend to be ready
info "Waiting for backend API…"
for i in $(seq 1 20); do
  if curl -sf http://localhost:3333/health &>/dev/null; then
    ok "Backend API is ready at http://localhost:3333"
    break
  fi
  if [ "$i" -eq 20 ]; then
    warn "Backend did not respond in time. Check $BACK_LOG for errors."
  fi
  sleep 1
done

# start frontend
(cd front && npm run dev) > "$FRONT_LOG" 2>&1 &
FRONT_PID=$!
info "Frontend started (PID $FRONT_PID) — logs: $FRONT_LOG"

# wait a moment then grab the actual Vite URL
sleep 3
FRONT_URL=$(grep -Eo 'http://localhost:[0-9]+' "$FRONT_LOG" 2>/dev/null | head -1 || echo "http://localhost:5173")

# ── ready ──────────────────────────────────────────────────────
echo ""
echo -e "${C_GREEN}${C_BOLD}┌──────────────────────────────────────────┐${C_OFF}"
echo -e "${C_GREEN}${C_BOLD}│        StrongerNotes is running!         │${C_OFF}"
echo -e "${C_GREEN}${C_BOLD}├──────────────────────────────────────────┤${C_OFF}"
echo -e "${C_GREEN}${C_BOLD}│${C_OFF}  App   →  ${C_CYAN}${FRONT_URL}${C_OFF}"
echo -e "${C_GREEN}${C_BOLD}│${C_OFF}  API   →  ${C_CYAN}http://localhost:3333${C_OFF}"
echo -e "${C_GREEN}${C_BOLD}│${C_OFF}  Logs  →  ${C_YELLOW}.logs/${C_OFF}"
echo -e "${C_GREEN}${C_BOLD}│${C_OFF}"
echo -e "${C_GREEN}${C_BOLD}│${C_OFF}  Press ${C_BOLD}Ctrl+C${C_OFF} to stop all services"
echo -e "${C_GREEN}${C_BOLD}└──────────────────────────────────────────┘${C_OFF}"

# ── graceful shutdown ──────────────────────────────────────────
cleanup() {
  echo ""
  warn "Shutting down…"
  kill "$BACK_PID" "$FRONT_PID" 2>/dev/null || true
  wait "$BACK_PID" "$FRONT_PID" 2>/dev/null || true
  ok "Backend and frontend stopped."
  info "MongoDB container is still running. To stop it:"
  info "  cd db && docker compose stop"
  exit 0
}
trap cleanup SIGINT SIGTERM

# keep script alive, tail logs to stdout
tail -f "$BACK_LOG" "$FRONT_LOG" &
TAIL_PID=$!
trap 'kill $TAIL_PID 2>/dev/null; cleanup' SIGINT SIGTERM
wait $BACK_PID $FRONT_PID
