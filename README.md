# job-tracker

Job application tracker with AI-powered cover letter generation.

## Directory structure

- `frontend/` — frontend application
- `backend/` — backend application
- `docs/` — project documentation
- `.cursor/` — Cursor workflows and rules

## Backend

```bash
cd backend
pnpm install
pnpm start:dev
```

Copy `.env.example` to `.env` if you do not already have a local `.env` file.

Health check: `GET http://localhost:3001/health`
