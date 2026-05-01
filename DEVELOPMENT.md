# Fluxo de Desenvolvimento — StrongerNotes

## Ciclo de Trabalho

Adotamos o modelo de **Feature Branches**. Nunca trabalhe diretamente na branch `main`.

1. **Branch:** crie uma branch descritiva (`front/feat/login-page`, `back/fix/token-expiry`)
2. **Desenvolvimento:** implemente, escreva testes e garanta que `npm test` passa
3. **Pull Request:** abra um PR para `main`; descreva o que foi feito e como testar
4. **Revisão:** pelo menos um colega revisa antes do merge
5. **Merge:** após aprovação e CI verde, integre à `main`

---

## Padrões de Código e UI

- **Idioma:** código e UI em Inglês; documentação em Português (requisito acadêmico)
- **Commits:** formato semântico — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- **Tema:** paleta baseada em psicologia das cores (cyan como primário = foco técnico; slate como superfície = sobriedade)
- **Dark Mode:** suporte obrigatório a light/dark de forma consistente em todas as telas

---

## O que foi implementado

### Fase 1 — Fundação ✅

| O que | Detalhe |
|---|---|
| Servidor Fastify | CORS, handler global de erros, logger |
| Conexão MongoDB | Via Mongoose; Docker Compose para dev local |
| `GET /health` | Health check |
| `POST /api/v1/users` | Cadastro com bcrypt (12 rounds) |
| `GET /api/v1/users` | Listagem sem expor passwordHash |
| `GET /api/v1/users/:id` | Busca por ID |
| Validação Zod | Schemas com mensagens de erro por campo |
| DB init script | Coleção `users` com validator e índice único de e-mail |

### Fase 2 — Autenticação e perfil ✅

| O que | Detalhe |
|---|---|
| `POST /api/v1/auth/login` | JWT com 7 dias de validade |
| `PUT /api/v1/users/:id` | Editar nome/e-mail (ownership via JWT) |
| `DELETE /api/v1/users/:id` | Excluir conta (ownership via JWT) |
| `authenticate` decorator | Fastify `preHandler` para rotas protegidas |
| Frontend: AuthContext | Token + dados do usuário em `localStorage` |
| Frontend: ProtectedRoute | Redirect para `/login` se não autenticado |
| Frontend: interceptor Axios | Injeta `Authorization: Bearer <token>` |
| Testes (25) | Cobrindo Fases 1 e 2 com MongoDB em memória |

### Fase 3 — Engine de treinos ✅

| O que | Detalhe |
|---|---|
| Módulo `exercises` | GET (lista pública + custom) + POST (custom) |
| Módulo `workouts` | CRUD completo; owner-only em PUT/DELETE |
| Módulo `sessions` | CRUD; DELETE em cascata apaga as séries |
| Sub-recurso `sets` | POST/PUT/DELETE em `/sessions/:id/sets` |
| DB seed | 34 exercícios públicos em 11 grupos musculares |
| Frontend: Dashboard | Stats reais + lista de fichas + "Start Session" |
| Frontend: `/workouts/:id` | Criação/edição de fichas + busca inline de exercícios |
| Frontend: `/sessions/:id` | Log de séries em tempo real, edição e exclusão inline |
| Frontend: `/exercises` | Biblioteca com filtros e criação de exercícios |
| Testes (30 novos = 55 total) | Cobrindo exercises, workouts, sessions, sets |

### Fase 4 — Visualização de progresso ✅

| O que | Detalhe |
|---|---|
| `GET /api/v1/exercises/:id/progress` | Agrega séries por data de sessão; calcula Est. 1RM (Epley) para força e max duration para cardio |
| Frontend: `/exercises/:id/progress` | Gráfico Recharts (LineChart) + cards de stats + tabela histórica |
| Melhoria ExercisesPage | Link "Progress →" em cada card de exercício |
| Melhoria Dashboard | Seção "Recent Sessions" (últimas 5) + atalho para gráficos |
| Testes (5 novos = 60 total) | Cobrindo 404, 400, dados vazios e dados populados |

---

## Roadmap completo

```
Fase 1  ████████████████████  Fundação da API + banco                ✅
Fase 2  ████████████████████  Autenticação JWT + perfil              ✅
Fase 3  ████████████████████  Engine de treinos (CRUD completo)      ✅
Fase 4  ████████████████████  Gráficos de progresso                  ✅
```

---

## Fases Futuras — Melhorias propostas

### Fase 5 — UX e qualidade de uso

| Melhoria | Descrição | Impacto |
|---|---|---|
| Reordenação de exercícios | Drag-and-drop nas fichas (ex.: `@dnd-kit/core`) | US05 aprimorado |
| Notificação de PR | Alerta na tela quando o usuário supera seu recorde pessoal (1RM ou duração) | Engajamento |
| Busca global | Buscar exercícios, fichas e sessões em um campo único no header | Usabilidade |
| Tema personalizado | Permitir escolha de cor primária além do cyan | Personalização |

### Fase 6 — Dados e análise avançada

| Melhoria | Descrição | Impacto |
|---|---|---|
| Comparação entre exercícios | Gráfico sobreposto para dois exercícios do mesmo grupo muscular | US07 aprimorado |
| Volume por sessão | Gráfico de volume total (peso × reps) por treino ao longo do tempo | Insight analítico |
| Histórico completo de sessões | Página `/sessions` paginada com filtro por data e ficha | Rastreabilidade |
| Export CSV / PDF | Exportar histórico de séries e gráficos de progresso | Portabilidade |

### Fase 7 — Funcionalidades sociais e planejamento

| Melhoria | Descrição | Impacto |
|---|---|---|
| Templates de fichas | Fichas públicas pré-montadas (ex.: "PPL 6 dias", "5×5 força") | Onboarding |
| Planejamento semanal | Calendário para agendar fichas nos dias da semana | Organização |
| Compartilhamento | Link público para compartilhar uma ficha de treino | Social |
| Múltiplos usuários — admin | Página de administração para visualizar métricas de uso agregadas | Escala |

### Fase 8 — Mobile e offline

| Melhoria | Descrição | Impacto |
|---|---|---|
| PWA | Manifest + service worker para instalação no celular | Acessibilidade |
| Modo offline | Salvar séries localmente (IndexedDB) e sincronizar ao reconectar | UX na academia |
| App nativo | Converter para React Native / Expo mantendo o backend existente | Alcance |

---

## Decisões de arquitetura relevantes

| Decisão | Justificativa |
|---|---|
| Fastify em vez de Express | Melhor desempenho, suporte nativo a async/await e plugins tipados |
| Zod para validação | Único schema serve para validação runtime e inferência de tipos TypeScript |
| `sets` como sub-recurso de `sessions` | Reflete a relação de domínio; deleção em cascata simplifica consistência |
| Est. 1RM pela fórmula de Epley | Padrão científico amplamente usado; permite comparar sets de rep ranges diferentes |
| MongoDB em memória nos testes | Isolamento total sem dependência de infra; cada `beforeEach` limpa as coleções |

---

*Este documento serve como guia para o time de 4 pessoas e referência de histórico técnico do projeto.* 🏋️‍♂️
