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

### Sequência sugerida de implementação

*   **Fase 1.1:** `GET /health` (já existente) + `GET /api/v1/users`
*   **Fase 1.2:** `POST /api/v1/users` (cadastro inicial)
*   **Fase 2.1:** `POST /api/v1/auth/register` e `POST /api/v1/auth/login`
*   **Fase 2.2:** rotas protegidas com JWT (`preHandler`)
*   **Fase 3+:** rotas de treino (`workouts`, `sessions`, `sets`) e progresso

## 📊 Status Atual (Fase 1 concluída)

### O que já foi implementado

**Infraestrutura e banco de dados**
- Servidor Fastify com CORS e handler global de erros
- Conexão com MongoDB Atlas via Mongoose
- Docker Compose para MongoDB local (desenvolvimento)
- Script de inicialização da coleção `users` com validação de schema no nível do banco

**Backend — módulo de usuários**
- `GET /health` — health check
- `GET /api/v1/users` — lista todos os usuários (sem expor `passwordHash`)
- `POST /api/v1/users` — cria usuário com senha encriptada via `bcryptjs` (12 salt rounds)
- `GET /api/v1/users/:id` — busca usuário por ID
- Validação de entrada com Zod (corpo e parâmetros de rota)
- Índice único no campo `email` com tratamento de conflito (HTTP 409)

**Frontend**
- Landing page com seções de hero, features e footer
- Alternância de tema claro/escuro com persistência em `localStorage`
- Página de cadastro (`/register`) integrada com a API — cria conta real no banco
- Página de login (`/login`) com UI completa — **sem integração com API ainda**
- Cliente Axios configurado via variável de ambiente `VITE_API_URL`

---

## 🗺️ Roadmap de Desenvolvimento

*   **Fase 1 (Concluída):** Fundação da API (Fastify) e Conexão com Banco de Dados (Mongoose).
*   **Fase 2 (Atual):** Sistema de Autenticação (JWT) e rotas de perfil.
*   **Fase 3:** Engine de Treinos (fichas de treino, exercícios e registro de séries).
*   **Fase 4:** Visualização de Dados (gráficos de evolução e progresso).

---

## 🚧 Próximos Passos — Fase 2

### Backend

1. **`POST /api/v1/auth/login`** — autenticar usuário com e-mail/senha e retornar JWT
2. **Middleware JWT (`preHandler`)** — proteger rotas que exigem autenticação
3. **`PUT /api/v1/users/:id`** — editar nome e e-mail do perfil (rota protegida) *(US02)*
4. **`DELETE /api/v1/users/:id`** — excluir conta e todos os dados do usuário (rota protegida) *(US03)*

### Frontend

5. **Integração da página de login** — chamar `POST /auth/login`, armazenar JWT (ex: `localStorage` ou cookie `httpOnly`)
6. **Contexto de autenticação** — prover estado do usuário logado para toda a aplicação
7. **Rotas protegidas** — redirecionar para `/login` se não autenticado
8. **Dashboard principal** — tela inicial pós-login (lista de fichas de treino, futuramente)
9. **Página de perfil** — exibir e editar dados do usuário *(US02, US03)*

### Sequência sugerida de implementação (Fase 2)

```
back/feat: POST /api/v1/auth/login + JWT
back/feat: preHandler JWT middleware
back/feat: PUT /api/v1/users/:id (editar perfil)
back/feat: DELETE /api/v1/users/:id (excluir conta)
front/feat: auth context + login integration
front/feat: protected routes
front/feat: dashboard skeleton
front/feat: profile page
```

---

*Este documento serve como guia para manter a organização do time de 4 pessoas. Vamos evoluir juntos!* 🏋️‍♂️
