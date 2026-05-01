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
*   ~~**Fase 3:** rotas de treino (`exercises`, `workouts`, `sessions`, `sets`)~~ ✅
*   **Fase 4:** visualização de progresso (gráficos de carga e cardio)

## 📊 Status Atual (Fase 3 concluída)

### O que já foi implementado

**Infraestrutura e banco de dados**
- Servidor Fastify com CORS e handler global de erros
- Conexão com MongoDB Atlas via Mongoose
- Docker Compose para MongoDB local (desenvolvimento)
- Scripts de inicialização das coleções `users` e `exercises` com validação de schema e seed de 34 exercícios padrão

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

**Backend — engine de treinos (Fase 3)**
- `GET /api/v1/exercises` — lista biblioteca pública + exercícios personalizados do usuário (protegida)
- `POST /api/v1/exercises` — cria exercício personalizado (protegida)
- `GET /api/v1/workouts` — lista fichas do usuário (protegida)
- `POST /api/v1/workouts` — cria ficha com lista de exercícios (protegida)
- `GET /api/v1/workouts/:id` — detalha ficha com exercícios populados (protegida)
- `PUT /api/v1/workouts/:id` — edita nome e/ou exercícios (protegida, somente owner)
- `DELETE /api/v1/workouts/:id` — exclui ficha (protegida, somente owner)
- `GET /api/v1/sessions` — lista sessões do usuário (protegida)
- `POST /api/v1/sessions` — inicia sessão a partir de uma ficha (protegida)
- `GET /api/v1/sessions/:id` — detalha sessão com suas séries populadas (protegida)
- `DELETE /api/v1/sessions/:id` — remove sessão e todas as séries (protegida, somente owner)
- `POST /api/v1/sessions/:id/sets` — registra série (protegida)
- `PUT /api/v1/sessions/:id/sets/:setId` — edita série (protegida)
- `DELETE /api/v1/sessions/:id/sets/:setId` — remove série (protegida)

**Testes automatizados**
- 55 testes com `vitest` + MongoDB em memória (`mongodb-memory-server`)
- Cobrem Fases 1, 2 e 3 (exercises, workouts, sessions, sets — incluindo erros de autorização)
- Executar com `npm test` na pasta `back/`

**Frontend (Fases 1, 2 e 3)**
- Landing page com alternância de tema claro/escuro
- Página de cadastro (`/register`) com erros de validação por campo
- Página de login (`/login`) integrada com JWT
- `AuthContext` — gerencia token e dados do usuário via `localStorage`
- Interceptor Axios — injeta `Authorization: Bearer <token>` automaticamente
- `ProtectedRoute` — redireciona para `/login` se não autenticado
- Dashboard (`/dashboard`) — estatísticas reais (sessões na semana, total de sessões, fichas ativas) + lista de fichas com botão "Start Session"
- Perfil (`/profile`) — edição de nome/e-mail e exclusão de conta
- Fichas (`/workouts/:id`) — criação, edição de nome, adição/remoção de exercícios com busca inline, exclusão
- Sessão (`/sessions/:id`) — registro de séries por exercício em tempo real com edição e exclusão inline
- Biblioteca (`/exercises`) — listagem com filtros por categoria e grupo muscular, criação de exercícios personalizados

---

## 🗺️ Roadmap de Desenvolvimento

*   **Fase 1 (Concluída):** Fundação da API (Fastify) e conexão com banco de dados (Mongoose).
*   **Fase 2 (Concluída):** Sistema de autenticação (JWT + bcrypt) e gerenciamento de perfil.
*   **Fase 3 (Concluída):** Engine de treinos — exercícios, fichas, sessões e registro de séries.
*   **Fase 4 (Atual):** Visualização de dados — gráficos de evolução de carga e cardio.

---

## 🚧 Próximos Passos — Fase 4

A Fase 4 adiciona visualização de progresso: gráficos de evolução de carga (força) e de duração/pace (cardio) por exercício ao longo do tempo.

### Backend

1. `GET /api/v1/exercises/:id/progress` — retorna histórico de máximos por data (peso × reps para força; duração para cardio)

### Frontend

2. **Página de progresso** (`/exercises/:id/progress`) — gráfico de linha com Recharts ou Chart.js
3. **Integração no dashboard** — atalho para ver progresso de exercícios recentes

### Sequência sugerida (Fase 4)

```
back/feat: progress endpoint
front/feat: progress chart page
front/feat: dashboard progress shortcuts
```

---

*Este documento serve como guia para manter a organização do time de 4 pessoas. Vamos evoluir juntos!* 🏋️‍♂️
