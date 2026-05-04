# Guia de Instalação — StrongerNotes

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18 | `node --version` |
| [Docker](https://docs.docker.com/get-docker/) | qualquer | `docker --version` |

> Docker é usado para subir o MongoDB localmente. Veja a [seção alternativa](#opção-b--mongodb-atlas-nuvem) se preferir usar o Atlas na nuvem.

---

## Início rápido (recomendado)

No Linux/macOS/WSL ou Git Bash:

```bash
git clone https://github.com/pl1an/StrongerNotes.git
cd StrongerNotes
./start.sh
```

No Windows PowerShell:

```powershell
git clone https://github.com/pl1an/StrongerNotes.git
cd StrongerNotes
.\start.ps1
```

Se o PowerShell bloquear a execução de scripts, rode:

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

> Antes de rodar o script, abra o Docker Desktop. O `start.sh` é um script Bash; no Windows, use Git Bash/WSL ou `start.ps1`.

O script `start.sh` executa automaticamente:

1. Verifica se Node.js e Docker estão instalados e o daemon do Docker está rodando
2. Cria `back/.env` e `front/.env` caso não existam (JWT\_SECRET gerado aleatoriamente)
3. Instala as dependências npm em `back/` e `front/`
4. Sobe o container MongoDB com `docker compose up -d`
5. Aguarda o banco estar pronto e inicia o backend
6. Aguarda o backend responder e inicia o frontend
7. Exibe as URLs e mantém os logs vivos até `Ctrl+C`

Ao finalizar a inicialização, acesse **[http://localhost:5173](http://localhost:5173)**.

Para parar: pressione `Ctrl+C` no terminal. O MongoDB continua em background.
Para parar também o banco:

```bash
cd db
docker compose stop
```

---

## Configuração manual (alternativa)

Se preferir controlar cada etapa individualmente:

### 1. Banco de dados

#### Opção A — Docker local

```bash
cd db
docker compose up -d
```

#### Opção B — MongoDB Atlas (nuvem)

1. Crie um cluster gratuito em [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Copie a URI de conexão no formato:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/strongernotes
   ```
3. Use essa URI como `MONGODB_URI` no arquivo `back/.env`

### 2. Backend

```bash
cd back
cp .env.example .env
npm install
npm run dev
```

Para usar o MongoDB local do Docker, o `back/.env` deve conter:

```env
NODE_ENV=dev
PORT=3333
MONGODB_URI=mongodb://127.0.0.1:27017/strongernotes
JWT_SECRET=change-this-to-a-random-secret-string-of-at-least-32-characters
```

Gerar um `JWT_SECRET` seguro, se quiser trocar o valor de exemplo:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend

Em um novo terminal:

```bash
cd front
cp .env.example .env          # VITE_API_URL=http://localhost:3333
npm install
npm run dev
```

---

## Testar o sistema

Com o `start.sh` rodando (ou os três passos acima concluídos):

| Fluxo | URL |
|---|---|
| Landing page | http://localhost:5173 |
| Cadastro | http://localhost:5173/register |
| Login | http://localhost:5173/login |
| Dashboard | http://localhost:5173/dashboard |

### Fluxo completo de uso

1. **Cadastre** uma conta em `/register` (senha mínimo 8 caracteres)
2. **Faça login** — você será redirecionado ao dashboard
3. **Crie uma ficha** clicando em "New Routine", dê um nome e confirme
4. **Adicione exercícios** clicando em "Add" e buscando na biblioteca
5. **Inicie uma sessão** com o botão "Start" — a sessão é criada automaticamente
6. **Registre séries** clicando em "Log Set" em cada exercício
7. **Visualize seu progresso** em `/exercises` → botão "Progress" em qualquer exercício

---

## Testes automatizados

```bash
cd back
npm test
```

> Usa MongoDB em memória — não requer Docker nem banco externo.

Saída esperada:

```
 Test Files  5 passed (5)
      Tests  60 passed (60)
   Duration  ~10s
```

---

## Referência de endpoints

**Públicos**

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/users` | Criar conta |
| `POST` | `/api/v1/auth/login` | Login → retorna JWT |

**Protegidos (Bearer JWT)**

| Método | Rota | Descrição |
|---|---|---|
| `PUT` | `/api/v1/users/:id` | Editar perfil |
| `DELETE` | `/api/v1/users/:id` | Excluir conta |
| `GET` | `/api/v1/exercises` | Listar exercícios |
| `POST` | `/api/v1/exercises` | Criar exercício personalizado |
| `GET` | `/api/v1/exercises/:id/progress` | Histórico de progresso |
| `GET/POST` | `/api/v1/workouts` | Listar / criar fichas |
| `GET/PUT/DELETE` | `/api/v1/workouts/:id` | Detalhar / editar / excluir ficha |
| `GET/POST` | `/api/v1/sessions` | Listar / iniciar sessões |
| `GET/DELETE` | `/api/v1/sessions/:id` | Detalhar / excluir sessão |
| `POST` | `/api/v1/sessions/:id/sets` | Registrar série |
| `PUT/DELETE` | `/api/v1/sessions/:id/sets/:setId` | Editar / remover série |

---

## Solução de problemas

| Erro | Solução |
|---|---|
| `Invalid environment variables` | Verifique se `back/.env` existe e `JWT_SECRET` tem ≥ 32 caracteres |
| `connect ECONNREFUSED` (MongoDB) | Execute `cd db && docker compose up -d` |
| `Docker daemon is not running` | Abra o Docker Desktop ou inicie o serviço Docker |
| Porta 3333 ocupada | Altere `PORT` em `back/.env` e `VITE_API_URL` em `front/.env` |
| Porta 5173 ocupada | O Vite escolhe automaticamente a próxima porta — veja o terminal |
| Erro CORS no browser | Confirme que `VITE_API_URL` aponta para a porta correta do backend |
