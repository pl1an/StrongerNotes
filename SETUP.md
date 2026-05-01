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

A tela inicial exibe:
- **Estatísticas reais**: sessões na semana, total de sessões, fichas ativas
- **Lista de rotinas** com botão "Start Session" para iniciar um treino
- **Botão "New Routine"** para criar uma nova ficha

### 5.4 Criar uma rotina

1. Clique em **New Routine** no dashboard
2. Digite o nome da ficha (ex: "Push Day A") e confirme com Enter ou ✓
3. Na página da ficha, clique em **Add** para buscar e adicionar exercícios
4. Clique em **Start Session** para iniciar um treino com aquela ficha

### 5.5 Registrar um treino

1. Ao iniciar uma sessão, você é redirecionado para a página de sessão
2. Para cada exercício, clique em **Log Set** e preencha reps, peso (força) ou duração (cardio)
3. Clique em ✓ **Log Set** para salvar
4. Use o ícone de lápis para editar ou lixeira para excluir séries
5. Ao terminar, clique em **Finish Session**

### 5.6 Biblioteca de exercícios

1. Clique em **Exercises** no cabeçalho do dashboard
2. Filtre por categoria (All / Strength / Cardio) ou grupo muscular
3. Use **New Exercise** para criar um exercício personalizado
4. Clique em **Progress** em qualquer card para ver o gráfico de evolução

### 5.8 Visualizar progresso

1. Acesse `/exercises` e clique em **Progress** no card de qualquer exercício
2. A página exibe:
   - **Força**: gráfico com Max Weight e Est. 1RM (fórmula de Epley), cards de melhor 1RM e melhoria percentual
   - **Cardio**: gráfico de duração máxima por sessão
   - Tabela histórica de todas as sessões em ordem cronológica inversa
3. É possível chegar à mesma página pelo atalho **"View exercise progress charts"** no dashboard

### 5.7 Perfil

1. Clique no ícone de usuário no canto superior direito
2. Edite seu nome ou e-mail e salve
3. Na **Danger Zone**, é possível excluir a conta permanentemente

---

## 6. Executar os testes automatizados

Os testes cobrem as Fases 1, 2 e 3: usuários, autenticação, exercícios, fichas, sessões e séries.

> Os testes usam um **MongoDB em memória** — não é necessário que o Docker ou o banco estejam ativos.

```bash
cd back
npm test
```

Saída esperada:

```
 RUN  v4.x.x

 Test Files  5 passed (5)
      Tests  55 passed (55)
   Duration  ~10s
```

Para ver a cobertura de código:

```bash
npm run test:coverage
```

---

## 7. Referência rápida de endpoints

**Públicos**

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar |
| `GET` | `/api/v1/users` | Lista todos os usuários |
| `POST` | `/api/v1/users` | Cria uma conta |
| `GET` | `/api/v1/users/:id` | Busca usuário por ID |
| `POST` | `/api/v1/auth/login` | Autentica e retorna JWT |

**Protegidos (Bearer JWT)**

| Método | Rota | Descrição |
|---|---|---|
| `PUT` | `/api/v1/users/:id` | Edita nome ou e-mail |
| `DELETE` | `/api/v1/users/:id` | Exclui a conta |
| `GET` | `/api/v1/exercises` | Lista a biblioteca de exercícios |
| `POST` | `/api/v1/exercises` | Cria exercício personalizado |
| `GET` | `/api/v1/exercises/:id/progress` | Histórico de progresso por exercício |
| `GET` | `/api/v1/workouts` | Lista fichas do usuário |
| `POST` | `/api/v1/workouts` | Cria nova ficha |
| `GET` | `/api/v1/workouts/:id` | Detalha ficha com exercícios |
| `PUT` | `/api/v1/workouts/:id` | Edita ficha |
| `DELETE` | `/api/v1/workouts/:id` | Exclui ficha |
| `GET` | `/api/v1/sessions` | Lista sessões do usuário |
| `POST` | `/api/v1/sessions` | Inicia sessão a partir de uma ficha |
| `GET` | `/api/v1/sessions/:id` | Detalha sessão com séries |
| `DELETE` | `/api/v1/sessions/:id` | Exclui sessão e séries |
| `POST` | `/api/v1/sessions/:id/sets` | Registra série |
| `PUT` | `/api/v1/sessions/:id/sets/:setId` | Edita série |
| `DELETE` | `/api/v1/sessions/:id/sets/:setId` | Remove série |

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
