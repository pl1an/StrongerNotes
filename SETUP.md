# 🛠️ Guia de Instalação — StrongerNotes

Este tutorial explica como colocar o projeto em funcionamento do zero na sua máquina local.

---

## Pré-requisitos

Certifique-se de ter instalado:

| Ferramenta | Versão mínima | Como verificar |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18 | `node --version` |
| npm | 9 | `npm --version` |
| [Git](https://git-scm.com/) | qualquer | `git --version` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | qualquer | `docker --version` |

> **Docker** é necessário para subir o MongoDB localmente. Se preferir usar o MongoDB Atlas (nuvem), veja a [seção alternativa](#opção-b--mongodb-atlas-nuvem).

---

## 1. Clonar o repositório

```bash
git clone https://github.com/pl1an/StrongerNotes.git
cd StrongerNotes
```

A estrutura do projeto é:

```
StrongerNotes/
├── back/      # API (Node.js + Fastify)
├── front/     # Interface web (React + Vite)
└── db/        # Docker Compose para MongoDB local
```

---

## 2. Banco de dados

### Opção A — MongoDB local com Docker (recomendado)

1. Abra o Docker Desktop e aguarde o ícone ficar verde (*Engine running*).

2. Na pasta `db/`, suba o container:

```bash
cd db
docker compose up -d
```

3. Confirme que está ativo:

```bash
docker compose ps
```

A saída deve mostrar `mongo-local` com status `running`.

4. A URI do banco para usar no backend será:

```
mongodb://127.0.0.1:27017/strongernotes
```

> Para parar o banco: `docker compose stop`
> Para apagar os dados e recomeçar do zero: `docker compose down -v && docker compose up -d`

---

### Opção B — MongoDB Atlas (nuvem)

Se preferir não usar Docker:

1. Acesse [mongodb.com/atlas](https://www.mongodb.com/atlas) e crie uma conta gratuita.
2. Crie um **cluster** (o plano M0 gratuito é suficiente).
3. Em *Database Access*, crie um usuário com senha.
4. Em *Network Access*, adicione `0.0.0.0/0` para liberar seu IP.
5. Em *Connect → Drivers*, copie a URI no formato:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/strongernotes?retryWrites=true&w=majority
   ```
6. Use essa URI como `MONGODB_URI` no passo seguinte.

---

## 3. Configurar o backend

### 3.1 Instalar dependências

```bash
cd back
npm install
```

### 3.2 Criar o arquivo de variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Abra o `.env` e preencha os valores:

```env
NODE_ENV=dev
PORT=3333
MONGODB_URI=mongodb://127.0.0.1:27017/strongernotes
JWT_SECRET=cole-aqui-uma-chave-secreta-de-pelo-menos-32-caracteres
```

**Gerando um `JWT_SECRET` seguro:**

No terminal, execute um dos comandos abaixo e cole o resultado no `.env`:

```bash
# Com Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Com OpenSSL (Linux/Mac)
openssl rand -hex 32
```

> O `JWT_SECRET` deve ter **no mínimo 32 caracteres**. Nunca compartilhe esse valor nem o envie para o repositório.

### 3.3 Iniciar o servidor

```bash
npm run dev
```

Você verá no terminal:

```
✅ Connected to MongoDB Atlas
🚀 StrongerNotes API running on http://localhost:3333
```

Verifique se a API está respondendo:

```bash
curl http://localhost:3333/health
# {"status":"ok","timestamp":"..."}
```

---

## 4. Configurar o frontend

Abra um **novo terminal** (o backend deve continuar rodando).

### 4.1 Instalar dependências

```bash
cd front
npm install
```

### 4.2 Criar o arquivo de variáveis de ambiente

```bash
cp .env.example .env
```

O conteúdo já está correto para desenvolvimento local:

```env
VITE_API_URL=http://localhost:3333
```

> Se você alterou a porta do backend no `.env` do `back/`, atualize esse valor aqui também.

### 4.3 Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Você verá:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## 5. Testar o sistema

Com backend e frontend rodando, o fluxo completo pode ser testado:

### 5.1 Cadastro de conta

1. Acesse [http://localhost:5173/register](http://localhost:5173/register)
2. Preencha nome, e-mail e senha (mínimo 8 caracteres)
3. Clique em **Get Started**
4. Você será redirecionado para a página de login

### 5.2 Login

1. Acesse [http://localhost:5173/login](http://localhost:5173/login)
2. Entre com o e-mail e senha cadastrados
3. Ao autenticar, você será redirecionado para o **Dashboard**

### 5.3 Dashboard

A tela inicial mostra uma saudação com o seu nome. As estatísticas de treino serão implementadas na Fase 3.

### 5.4 Perfil

1. Clique no ícone de usuário no canto superior direito do Dashboard
2. Edite seu nome ou e-mail e salve
3. Na **Danger Zone**, é possível excluir a conta permanentemente

---

## 6. Executar os testes automatizados

Os testes cobrem todas as rotas da **Fase 1** (cadastro e consulta de usuários) e **Fase 2** (autenticação JWT, edição e exclusão de perfil).

> Os testes usam um **MongoDB em memória** — não é necessário que o Docker ou o banco estejam ativos.

```bash
cd back
npm test
```

Saída esperada:

```
 RUN  v4.x.x

 Test Files  2 passed (2)
      Tests  25 passed (25)
   Duration  ~8s
```

Para ver a cobertura de código:

```bash
npm run test:coverage
```

---

## 7. Referência rápida de endpoints

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/health` | — | Verifica se a API está no ar |
| `GET` | `/api/v1/users` | — | Lista todos os usuários |
| `POST` | `/api/v1/users` | — | Cria uma conta |
| `GET` | `/api/v1/users/:id` | — | Busca usuário por ID |
| `POST` | `/api/v1/auth/login` | — | Autentica e retorna JWT |
| `PUT` | `/api/v1/users/:id` | Bearer JWT | Edita nome ou e-mail |
| `DELETE` | `/api/v1/users/:id` | Bearer JWT | Exclui a conta |

Para testar os endpoints protegidos via `curl`:

```bash
# 1. Criar conta
curl -s -X POST http://localhost:3333/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Seu Nome","email":"voce@exemplo.com","password":"suasenha123"}' | jq

# 2. Fazer login e salvar o token
TOKEN=$(curl -s -X POST http://localhost:3333/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@exemplo.com","password":"suasenha123"}' | jq -r '.data.token')

# 3. Editar nome (substitua <ID> pelo _id retornado no cadastro)
curl -s -X PUT http://localhost:3333/api/v1/users/<ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Nome Novo"}' | jq
```

> `jq` é opcional — os comandos funcionam sem ele, mas a saída fica sem formatação.

---

## 8. Solução de problemas

**`Invalid environment variables`** ao iniciar o backend
→ Verifique se o arquivo `back/.env` existe e se `JWT_SECRET` tem pelo menos 32 caracteres.

**`MongoServerError: connect ECONNREFUSED`**
→ O container do banco não está ativo. Rode `docker compose up -d` na pasta `db/`.

**`MongoServerError: Authentication failed`** (Atlas)
→ Usuário ou senha na URI estão incorretos. Verifique o *Database Access* no painel do Atlas.

**Porta 3333 já em uso**
→ Altere `PORT` no `back/.env` para outro valor (ex: `3334`) e atualize `VITE_API_URL` no `front/.env` correspondentemente.

**Porta 5173 já em uso**
→ O Vite escolhe automaticamente a próxima porta disponível. A URL correta aparece no terminal.

**Erro `CORS` no browser**
→ Confirme que `VITE_API_URL` no `front/.env` aponta para a porta correta do backend e que o backend está rodando.
