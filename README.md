# Gym Tracker

Next.js frontend and FastAPI backend in one repo.

## Repo layout

- `frontend/`: Next.js app, managed with [bun](https://bun.sh)
- `backend/`: FastAPI app, managed with [uv](https://docs.astral.sh/uv/)
- `.github/workflows/`: CI

## Live URLs

- Production: https://gym-tracker-one-topaz.vercel.app
- Production (team alias, requires Vercel login): https://gym-tracker-maciej-wiatrs-projects.vercel.app
- Latest `main` build (requires Vercel login): https://gym-tracker-git-main-maciej-wiatrs-projects.vercel.app

Every push to `main` on [PJS-Gym/gym-tracker](https://github.com/PJS-Gym/gym-tracker) deploys to production.

## Local development environment (Devenv)

This project includes a root-level `devenv.nix` setup to keep the local toolchain consistent for everyone.

### Requirements

Use one of these:

- macOS
- WSL2 on Windows

Native Windows is not supported for this setup.

### Install Nix

On macOS:

```bash
curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install | sh
```

On WSL2:

```bash
curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install | sh -s -- --daemon
```

Then verify:

```bash
nix --version
```

### Install Devenv

```bash
nix profile install nixpkgs#devenv
```

Then verify:

```bash
devenv --version
```

### Start the project shell

From the repo root:

```bash
devenv shell
```

This opens a shell with the tools needed for the project already available in `PATH`, including:

- Python 3.12
- Bun
- uv
- git
- gh
- PostgreSQL

Once you are inside the shell, you can run the app as usual.

### Devenv vs Docker

`devenv` is mainly for local development environments. It sets up a reproducible shell with the tools you need to code and run the project.

`Docker` is a container runtime. It is useful when you want to run services or apps in an isolated environment that behaves consistently everywhere, such as testing, CI, or deployment-like environments.

In short:

- `devenv` = consistent developer environment
- `Docker` = isolated runtime environment

## Getting started

Frontend, on http://localhost:3000:

```bash
cd frontend
bun install
bun dev
```

Backend, on http://localhost:8000 (API docs at `/docs`):

```bash
cd backend
uv sync
uv run fastapi dev
```

## Database

Postgres runs on [Neon](https://neon.com); `neon.ts` in the repo root declares the services. Only the backend connects to it.

From the repo root:

```bash
npm i -g neon
neon login
neon link --org-id org-rough-cake-25119073 --project-id muddy-wave-76386845 --branch production
neon env pull   # writes DATABASE_URL to .env.local in the repo root
```

The backend reads that root `.env.local` (`backend/app/core/config.py`) and queries Postgres with psycopg (`backend/app/core/db.py`). Check the connection at http://localhost:8000/api/v1/health/db.

Schema changes are Alembic migrations in `backend/migrations/versions/`. Apply them to the branch in `.env.local` from `backend/`:

```bash
uv run alembic upgrade head
```

Import the shared exercises from [free-exercise-db](https://github.com/yuhonas/free-exercise-db), also from `backend/`. Running it again updates them without creating duplicates:

```bash
uv run python -m app.seed.import_exercises
```

Create the demo account with 8 weeks of data, after the import. Running it again rebuilds the account from scratch:

```bash
uv run python -m app.seed.demo
```

The project's settings (region, Postgres version, compute, retention) are managed with Terraform in `infra/neon/`. See its README.

## Authentication

Users sign up and sign in with email or Google through [Clerk](https://clerk.com). The screens are our own (`frontend/src/features/auth`), built on Clerk's hooks and the design system; Clerk's prebuilt components are not used. The frontend's `src/proxy.ts` sends guests to `/sign-in` and back to where they were; `/sign-in`, `/sign-up`, onboarding (`/onboarding`) and public reports (`/r/<id>`) stay open.

A new member fills in onboarding first and creates the account after it. A first visit to `/`, and "Zarejestruj się" on the sign-in page, open `/onboarding`: a welcome screen, one question per step, a short tutorial, then `/sign-up`. Guests who open any other address still go to `/sign-in`. The answers wait in the browser until Clerk opens `/onboarding/zapisz`, which saves them to the new account (`POST /api/v1/me/onboarding`). A signed-in member who has not onboarded is sent to `/onboarding` from every screen, so onboarding shows once, even when everything was skipped. The backend checks the Clerk session token on every route in `protected_router` (`backend/app/api/main.py`), answers 401 without a valid one, and creates the user's row on their first request.

Frontend, in `frontend/.env.local` (see `frontend/.env.example`):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk dashboard → Configure → API keys |
| `API_URL` | Backend URL, e.g. `http://localhost:8000` |

Backend, in the root `.env.local` next to `DATABASE_URL`:

| Variable | Value |
|---|---|
| `CLERK_JWT_KEY` | PEM public key (Clerk dashboard → API keys → JWT public key), or set `CLERK_JWKS_URL` instead |
| `CLERK_AUTHORIZED_PARTIES` | Frontend origins as JSON, e.g. `["http://localhost:3000"]` |
| `CLERK_SECRET_KEY` | Reads a new user's email. Optional if the session token is customized with `{"email": "{{user.primary_email_address}}"}` |

Set the same variables in Vercel for production and previews.

## Tests

```bash
cd backend
TEST_DATABASE_URL=postgresql://localhost/gym_test uv run pytest   # DB tests are skipped without it
```

## CI

On every pull request and push to `main`:

- `frontend`: `bun install --frozen-lockfile`, `bun run lint`, `bun run build`
- `backend`: `uv sync --locked`, then checks that `app.main` imports
