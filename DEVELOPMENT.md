# 🛠️ Fluxo de Desenvolvimento - StrongerNotes

Este documento detalha o processo de colaboração e os padrões técnicos que estabelecemos para garantir a qualidade e a consistência do projeto.

## 🚀 Ciclo de Trabalho

Adotamos o modelo de **Feature Branches**. Nunca trabalhe diretamente na branch `main`.

1.  **Criação de Branch:** Para cada nova funcionalidade ou correção, crie uma branch descritiva (ex: `front/feat/login-page` ou `db/fix/db-connection`).
2.  **Desenvolvimento:** Realize suas alterações na sua branch.
3.  **Pull Request (PR):** Ao finalizar, abra um PR para a branch `main` do repositório original.
4.  **Revisão:** Pelo menos um colega deve revisar o código antes do merge.
5.  **Merge:** Após a aprovação e a garantia de que os testes/build estão passando, o código é integrado à `main`.

## 🎨 Padrões de Código e UI

*   **Idioma:** Todo o código (nomes de variáveis, funções, comentários) e a interface do usuário (UI) **devem ser em Inglês**. O README permanece em Português por ser um requisito acadêmico.
*   **Tema Científico:** Utilizamos uma paleta baseada em psicologia das cores para transmitir precisão e foco:
    *   **Primary (Cyan):** Para ações principais e destaque técnico.
    *   **Surface (Slate/Neutral):** Para sobriedade e robustez.
*   **Dark Mode:** O sistema deve sempre suportar os temas Light e Dark de forma consistente.

### Sequência de implementação

*   ~~**Fase 1.1:** `GET /health` + `GET /api/v1/users`~~ ✅
*   ~~**Fase 1.2:** `POST /api/v1/users` (cadastro)~~ ✅
*   ~~**Fase 2.1:** `POST /api/v1/auth/login` + JWT~~ ✅
*   ~~**Fase 2.2:** rotas protegidas com JWT (`preHandler`) + perfil~~ ✅
*   **Fase 3:** rotas de treino (`exercises`, `workouts`, `sessions`, `sets`)
*   **Fase 4:** visualização de progresso (gráficos de carga e cardio)

## 📊 Status Atual (Fase 2 concluída)

### O que já foi implementado

**Infraestrutura e banco de dados**
- Servidor Fastify com CORS e handler global de erros
- Conexão com MongoDB Atlas via Mongoose
- Docker Compose para MongoDB local (desenvolvimento)
- Script de inicialização da coleção `users` com validação de schema no nível do banco

**Backend — módulo de usuários (Fase 1)**
- `GET /health` — health check
- `GET /api/v1/users` — lista todos os usuários (sem expor `passwordHash`)
- `POST /api/v1/users` — cria usuário com senha encriptada via `bcryptjs` (12 salt rounds)
- `GET /api/v1/users/:id` — busca usuário por ID
- Validação de entrada com Zod; índice único em `email` com tratamento HTTP 409

**Backend — autenticação e perfil (Fase 2)**
- `POST /api/v1/auth/login` — autentica com e-mail/senha, retorna JWT (7 dias)
- `PUT /api/v1/users/:id` — edita nome e/ou e-mail (protegida, somente o próprio usuário)
- `DELETE /api/v1/users/:id` — exclui a conta (protegida, somente o próprio usuário)
- Decorator `authenticate` aplicado via `preHandler` nas rotas protegidas
- Validação de propriedade: HTTP 403 se o token pertence a outro usuário

**Testes automatizados**
- 25 testes com `vitest` + MongoDB em memória (`mongodb-memory-server`)
- Cobrem Fase 1 (CRUD de usuários) e Fase 2 (login, edição, exclusão, erros de autorização)
- Executar com `npm test` na pasta `back/`

**Frontend (Fases 1 e 2)**
- Landing page com alternância de tema claro/escuro
- Página de cadastro (`/register`) integrada com a API → redireciona para `/login`
- Página de login (`/login`) integrada com JWT → redireciona para `/dashboard`
- `AuthContext` — gerencia token e dados do usuário via `localStorage`
- Interceptor Axios — injeta `Authorization: Bearer <token>` automaticamente
- `ProtectedRoute` — redireciona para `/login` se não autenticado
- Dashboard (`/dashboard`) — boas-vindas com nome do usuário e placeholders da Fase 3
- Perfil (`/profile`) — edição de nome/e-mail e exclusão de conta

---

## 🗺️ Roadmap de Desenvolvimento

*   **Fase 1 (Concluída):** Fundação da API (Fastify) e conexão com banco de dados (Mongoose).
*   **Fase 2 (Concluída):** Sistema de autenticação (JWT + bcrypt) e gerenciamento de perfil.
*   **Fase 3 (Atual):** Engine de treinos — exercícios, fichas e registro de séries.
*   **Fase 4:** Visualização de dados — gráficos de evolução de carga e cardio.

---

## 🚧 Próximos Passos — Fase 3

A Fase 3 implementa o núcleo do produto: criar fichas de treino, registrar sessões e logar séries individuais. Envolve quatro novos módulos no backend e as telas principais do frontend.

### Modelos de dados

| Coleção | Campos principais |
|---|---|
| `exercises` | `name`, `category` (`strength` \| `cardio`), `muscleGroup`, `isCustom`, `createdBy` |
| `workouts` | `name`, `owner`, `exercises[]` (referência ordenada a `exercises`) |
| `sessions` | `workout`, `owner`, `date`, `notes` |
| `sets` | `session`, `exercise`, `reps`, `weightKg`, `durationSecs`, `restSecs`, `notes` |

### Backend

1. **Módulo `exercises`** *(US09)*
   - `GET /api/v1/exercises` — lista a biblioteca (pública + personalizados do usuário)
   - `POST /api/v1/exercises` — cria exercício personalizado (protegida)

2. **Módulo `workouts`** *(US04, US05)*
   - `GET /api/v1/workouts` — lista fichas do usuário (protegida)
   - `POST /api/v1/workouts` — cria ficha com lista de exercícios (protegida)
   - `GET /api/v1/workouts/:id` — detalha uma ficha (protegida)
   - `PUT /api/v1/workouts/:id` — edita nome e/ou exercícios (protegida)
   - `DELETE /api/v1/workouts/:id` — exclui ficha (protegida)

3. **Módulo `sessions`** *(US06)*
   - `GET /api/v1/sessions` — lista sessões do usuário (protegida)
   - `POST /api/v1/sessions` — inicia uma sessão a partir de uma ficha (protegida)
   - `GET /api/v1/sessions/:id` — detalha uma sessão com suas séries (protegida)
   - `DELETE /api/v1/sessions/:id` — remove a sessão (protegida)

4. **Sub-recurso `sets`** *(US06)*
   - `POST /api/v1/sessions/:id/sets` — registra uma série
   - `PUT /api/v1/sessions/:id/sets/:setId` — edita uma série
   - `DELETE /api/v1/sessions/:id/sets/:setId` — remove uma série

### Frontend

5. **Dashboard** — lista de fichas de treino do usuário com botão de nova ficha
6. **Página de ficha** — criação e edição de rotinas com seleção de exercícios
7. **Página de sessão** — execução do treino, registro de séries em tempo real
8. **Biblioteca de exercícios** — busca e criação de exercícios personalizados

### Sequência sugerida de implementação (Fase 3)

```
back/feat: exercises module (GET + POST)
back/feat: workouts module (CRUD completo)
back/feat: sessions module (CRUD)
back/feat: sets sub-resource (POST, PUT, DELETE)
front/feat: dashboard with workout list
front/feat: workout creation/edit page
front/feat: session execution page (set logging)
front/feat: exercise library page
```

---

*Este documento serve como guia para manter a organização do time de 4 pessoas. Vamos evoluir juntos!* 🏋️‍♂️
