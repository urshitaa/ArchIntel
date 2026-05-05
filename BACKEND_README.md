# CodeBase Explainer — Backend Engineer README

Welcome. This document is the single source of truth for everything a backend engineer needs to take the **CodeBase Explainer** frontend (currently fully simulated) and turn it into a real, production AI-powered code intelligence platform.

Read this top-to-bottom before writing any code.

---

## 1. What the product does

CodeBase Explainer lets a developer paste a GitHub repository URL and get back an AI-generated, explorable understanding of that codebase:

- Repo metadata (stars, forks, license, contributors)
- Detected tech stack (languages, frameworks, libraries, tooling)
- File tree with per-file AI summaries (easy / concise / detailed / technical)
- Architecture diagram (layers + data flow)
- Dependency graph (direct + transitive)
- Security insights (severity-ranked findings)
- Contributor / commit-velocity analytics
- “Ask AI” chat grounded in the repo (RAG)

The frontend is **done**. The backend is **not**. Everything currently runs from in-memory mock data in `src/components/workspace/data.ts` and a simulated pipeline in `src/components/analyze/AnalysisPipeline.tsx`.

Your job: replace the mocks with real services without changing the frontend contracts more than necessary.

---

## 2. Current frontend stack (do not change)

| Layer        | Tech                                              |
|--------------|---------------------------------------------------|
| Build        | Vite 5 + SWC                                      |
| UI           | React 18 + TypeScript 5                           |
| Styling      | Tailwind CSS v3 + shadcn/ui (semantic tokens)     |
| Motion       | Framer Motion + Lenis (smooth scroll)             |
| Icons        | lucide-react                                      |
| Charts       | Recharts                                          |
| Routing      | react-router-dom                                  |
| Auth (mock)  | `src/hooks/useAuth.ts` → `localStorage`           |

Key entry points to read before doing anything:

- `src/pages/Index.tsx` — public landing page
- `src/pages/Signup.tsx` — mock signup form
- `src/pages/Welcome.tsx` — authenticated home, owns the analyze flow
- `src/components/analyze/AnalysisPipeline.tsx` — fake 10-step streaming pipeline
- `src/components/workspace/Workspace.tsx` — 13-panel results grid
- `src/components/workspace/data.ts` — **all mock data + types you must implement against**
- `src/hooks/useAuth.ts` — mock auth hook

---

## 3. Data contracts the frontend already expects

These types live in `src/components/workspace/data.ts`. The backend MUST return JSON shaped like this. If you need to evolve a shape, update the type and every consumer in the same PR.

### 3.1 Repository
```ts
type RepoMeta = { owner: string; name: string; full: string };
```

### 3.2 Tech stack (returned by `guessStack`)
```ts
type Stack = {
  languages: { name: string; value: number; color: string }[]; // value = % of LOC
  frameworks: string[];
  libraries: string[];
  tooling: string[];
  highlights: string[]; // short bullet strings
};
```

### 3.3 File tree
```ts
type FileNode = {
  name: string;
  type: "folder" | "file";
  path: string;
  children?: FileNode[];
  ext?: string;
  size?: string;     // human readable, e.g. "2.1 KB"
  loc?: number;
  modified?: string; // human readable, e.g. "2 days ago"
  summary?: string;  // AI-generated one-liner
  imports?: string[];
  exports?: string[];
  preview?: string;  // first ~10 lines of code
};
```

Per-file detailed summaries come in 4 styles (see `summaryStyles`): `easy`, `concise`, `detailed`, `technical`. The frontend lets the user toggle between them, so the backend should be able to return all four (or generate on demand and cache).

### 3.4 Dependencies
```ts
type Dependency = {
  name: string;
  version: string;
  type: "direct" | "transitive";
  deps: string[]; // names of packages it depends on
};
```

### 3.5 Ask-AI
The frontend calls a single function `answerFor(question: string): string`. Replace with an API call returning a streamed string (see §6 streaming).

### 3.6 Security findings, contributors, architecture
See `src/components/workspace/SecurityInsights.tsx`, `Contributors.tsx`, `ArchitectureView.tsx` for the exact shapes those panels render. They are currently inline mocks — promote them to typed contracts in `data.ts` when you wire the real API.

---

## 4. Required backend endpoints (v1)

All endpoints are JSON over HTTPS, authenticated with a bearer token (see §5).

| Method | Path                                  | Purpose                                              |
|--------|---------------------------------------|------------------------------------------------------|
| POST   | `/api/auth/signup`                    | Email/password (or magic link) signup                |
| POST   | `/api/auth/login`                     | Login → returns JWT + refresh token                  |
| POST   | `/api/auth/logout`                    | Invalidate refresh token                             |
| GET    | `/api/me`                             | Current user profile                                 |
| POST   | `/api/repos/analyze`                  | Body `{ url }` → returns `{ jobId }`                 |
| GET    | `/api/repos/analyze/:jobId/stream`    | **SSE** stream of pipeline events (see §6)           |
| GET    | `/api/repos/:repoId`                  | Full analysis result (RepoMeta + Stack + tree + …)   |
| GET    | `/api/repos/:repoId/files/:path`      | Single file detail (all 4 summary styles + preview)  |
| GET    | `/api/repos/:repoId/deps`             | Dependency graph                                     |
| GET    | `/api/repos/:repoId/security`         | Security findings                                    |
| GET    | `/api/repos/:repoId/contributors`     | Contributor + commit-velocity data                   |
| POST   | `/api/repos/:repoId/ask`              | RAG chat — body `{ question }`, **streams** tokens   |
| GET    | `/api/repos`                          | List user’s analyzed repos (recent + starred)        |

---

## 5. Authentication

- The current `useAuth` hook stores `{ name, email, avatarSeed, signedUpAt }` in localStorage. Replace `signUp` / `signOut` to call `/api/auth/*` and store **only** the JWT (httpOnly cookie preferred; if you must use localStorage, document the XSS risk).
- Roles must live in a separate `user_roles` table — never on the users table. See the project’s user-roles convention.
- v1 supports public repos only. v2 adds GitHub OAuth for private repos (scopes: `repo`, `read:user`).

---

## 6. The analysis pipeline (the hard part)

The frontend already renders a 10-step pipeline (`AnalysisPipeline.tsx`) with terminal-style logs and a live SVG graph. The backend must produce the same conceptual stages and stream progress so the UI stays in sync.

### 6.1 Pipeline stages (match these IDs)

1. `validate`  — check the repo URL, GitHub access, default branch
2. `meta`      — fetch stars/forks/license/contributors
3. `tree`      — walk file tree, count LOC, detect languages
4. `stack`     — detect frameworks / libraries / tooling
5. `parse`     — AST-parse source files; extract imports/exports
6. `deps`      — resolve direct + transitive dependency graph
7. `arch`      — infer layered architecture (client / api / services / data)
8. `security`  — run vuln scan (e.g. `osv-scanner`, `npm audit`, Semgrep ruleset)
9. `embed`     — chunk + embed files for RAG (pgvector)
10. `summarize`— per-file AI summaries (4 styles) + repo-level overview

### 6.2 Streaming protocol (Server-Sent Events)

`GET /api/repos/analyze/:jobId/stream` emits:
```
event: step
data: { "stepId": "tree", "status": "running", "log": "walking 1,284 files…" }

event: step
data: { "stepId": "tree", "status": "done", "log": "✓ tree mapped · 486k LOC" }

event: graph
data: { "nodes": [...], "edges": [...] }   // incremental graph updates

event: done
data: { "repoId": "abc123" }
```

Use SSE (simpler, one-way) unless you also need bidirectional control — then WebSockets.

### 6.3 Job runner

Analysis can take 30s–5min for a real repo. Required from day 1:
- Job queue (BullMQ on Redis, or pg-boss on Postgres)
- Worker process(es) separate from the API
- Idempotent jobs keyed by `(userId, repoUrl, commitSha)` so re-analysis is cached

---

## 7. Data model (Postgres + pgvector)

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  created_at timestamptz default now()
);

create type app_role as enum ('admin', 'user');
create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

create table repos (
  id uuid primary key default gen_random_uuid(),
  owner text not null,
  name text not null,
  full text generated always as (owner || '/' || name) stored,
  default_branch text,
  stars int, forks int, watchers int,
  license text,
  last_indexed_sha text,
  last_indexed_at timestamptz,
  unique (owner, name)
);

create table analyses (
  id uuid primary key default gen_random_uuid(),
  repo_id uuid references repos(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  commit_sha text not null,
  status text not null,            -- queued | running | done | failed
  started_at timestamptz,
  finished_at timestamptz,
  error text
);

create table files (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references analyses(id) on delete cascade,
  path text not null,
  ext text, size_bytes int, loc int,
  imports text[], exports text[],
  preview text,
  summary_easy text,
  summary_concise text,
  summary_detailed text,
  summary_technical text
);

create extension if not exists vector;
create table file_chunks (
  id uuid primary key default gen_random_uuid(),
  file_id uuid references files(id) on delete cascade,
  chunk_idx int,
  content text,
  embedding vector(1536)
);
create index on file_chunks using ivfflat (embedding vector_cosine_ops);

create table dependencies (
  analysis_id uuid references analyses(id) on delete cascade,
  name text not null,
  version text,
  type text check (type in ('direct','transitive')),
  deps text[],
  primary key (analysis_id, name)
);

create table security_findings (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references analyses(id) on delete cascade,
  severity text check (severity in ('critical','high','medium','low','info')),
  title text, description text, file_path text, line int, rule_id text
);
```

RLS: enable on every user-scoped table. Use a `has_role(uid, role)` SECURITY DEFINER function — do not write recursive policies that select from the same table they protect.

---

## 8. AI integrations

- **LLM provider**: default to **Lovable AI Gateway** (`LOVABLE_API_KEY` is provisioned). Fall back to Anthropic only if the user explicitly asks.
- **Embeddings**: `text-embedding-3-small` (1536 dims) is a good default — match the `vector(1536)` column above.
- **Chunking**: 800–1200 token windows, 100-token overlap, language-aware splitting (don’t cut mid-function).
- **Cost control**: cap per-analysis spend; precompute `concise` summaries up front, lazily generate `detailed` / `technical` on first click and cache.
- **Ask-AI prompt**: retrieve top-k=8 chunks by cosine similarity, include file path + language in the system prompt, stream the answer back via SSE.

---

## 9. GitHub integration

- v1: anonymous REST calls (`https://api.github.com`) with a server-side PAT for higher rate limits. Cache aggressively.
- Use the **tarball** endpoint (`/repos/{owner}/{repo}/tarball/{ref}`) to download source — far cheaper than walking the tree API file-by-file.
- Respect rate limits; surface `X-RateLimit-Remaining` in logs.
- v2: GitHub OAuth app for private repos.

---

## 10. Hosting & infra

Recommended starting point:

- **API + workers**: Lovable Cloud edge functions for thin endpoints; a long-running worker on Fly.io / Railway / Render for the analysis pipeline (edge functions are not suited to multi-minute jobs).
- **DB**: Postgres with `pgvector` (Supabase / Neon / RDS).
- **Queue**: Redis (Upstash) + BullMQ, or pg-boss if you want to avoid Redis.
- **Object storage**: S3-compatible bucket for cached repo tarballs and exported PDF/Markdown reports.
- **Observability**: structured logs (pino), OpenTelemetry traces around each pipeline step, Sentry for errors.

---

## 11. Security checklist

- [ ] All secrets in a secret manager — never in the repo, never echoed in logs.
- [ ] JWTs in httpOnly + Secure + SameSite=Lax cookies.
- [ ] Rate-limit `/api/repos/analyze` per user (e.g. 5/hour free tier).
- [ ] Validate the GitHub URL with a strict regex; reject anything that isn’t `github.com/{owner}/{repo}`.
- [ ] Sandbox any code execution. We do **not** run repo code — only parse it. Keep it that way.
- [ ] CORS allow-list is the deployed frontend origin only.
- [ ] RLS enabled on every user-scoped table.
- [ ] Audit log for admin actions.

---

## 12. How to swap the mocks (concrete file map)

| Mock today                                          | Replace with                                                |
|-----------------------------------------------------|-------------------------------------------------------------|
| `src/hooks/useAuth.ts` (localStorage)               | Real `/api/auth/*` calls; store JWT in httpOnly cookie       |
| `parseRepo()` in `data.ts`                          | Keep for client-side URL parsing; add server-side validation |
| `guessStack()` in `data.ts`                         | `GET /api/repos/:id` → `stack` field                         |
| `fileTree` constant                                 | `GET /api/repos/:id` → `tree` field                          |
| `dependencies` constant                             | `GET /api/repos/:id/deps`                                    |
| `answerFor()`                                       | `POST /api/repos/:id/ask` (streaming)                        |
| `AnalysisPipeline` setTimeout choreography          | Subscribe to `/api/repos/analyze/:jobId/stream` SSE          |
| Inline mock data in `SecurityInsights.tsx` etc.     | Dedicated endpoints listed in §4                             |

Keep the same field names. The UI already animates against them — divergence costs you a frontend PR.

---

## 13. Open questions for product before you start

1. LLM provider + monthly budget cap?
2. Public repos only for v1, or do we need GitHub OAuth on day 1?
3. Do we precompute all 4 summary styles, or only `concise` + lazy-generate the rest?
4. Free-tier limits (analyses/day, repo size cap, file count cap)?
5. Do exports (PDF/Markdown) ship in v1 or v2?
6. Team / sharing features in v1 or v2?

Get answers to these before estimating. They each move the timeline by days.

---

## 14. Suggested milestone plan

1. **Week 1** — Auth, users, RLS, `/api/me`, deploy skeleton API + worker.
2. **Week 2** — Pipeline stages 1–4 (validate → stack) end-to-end with SSE streaming.
3. **Week 3** — Stages 5–7 (parse → deps → arch) + persistence + `/api/repos/:id`.
4. **Week 4** — Stages 8–10 (security → embed → summarize) + Ask-AI RAG endpoint.
5. **Week 5** — Caching, rate limits, observability, hardening, load test.
6. **Week 6** — Exports, sharing, billing hooks. Ship v1.

---

## 15. Contact / ownership

- Frontend lead: see repo `CODEOWNERS`.
- Design tokens: `src/index.css` + `tailwind.config.ts` (HSL only — never hardcode colors).
- Anything unclear in this doc → open a discussion before guessing. The frontend contracts in §3 are the load-bearing part of this README; everything else is a recommendation.

Welcome aboard. Build something fast.