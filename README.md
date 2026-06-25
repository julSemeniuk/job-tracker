# Job Tracker

Job Tracker is a full-stack application for managing job applications, tracking vacancies, organizing application statuses, and generating AI-assisted cover letters.

## Main Features

Planned and current product capabilities include:

- job vacancy tracking;
- application status management;
- company and contact notes;
- AI-assisted cover letter generation;
- application history;
- dashboard and analytics in the future.

## Monorepo Structure

```text
job-tracker/
├── frontend/
├── backend/
├── docs/
├── .cursor/
└── README.md
```

- `frontend/` — React frontend application.
- `backend/` — NestJS backend application.
- `docs/` — project documentation.
- `.cursor/` — Cursor rules, workflows, and AI-assisted development instructions.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- NestJS
- TypeScript
- Prisma
- PostgreSQL

### Tooling

- pnpm
- GitHub
- Cursor / Codex-assisted workflow

## Getting Started

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd job-tracker
```

### Run the full stack with Docker

Create the local environment files:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Fill in the required Google OAuth and JWT values in `backend/.env`, then build
and start PostgreSQL, the backend, and the frontend:

```bash
docker compose up --build
```

The services are available at:

- frontend: `http://localhost:5173`;
- backend API: `http://localhost:3001`;
- backend health check: `http://localhost:3001/health`;
- PostgreSQL: `localhost:5432`.

The backend connects to PostgreSQL through Docker networking at
`postgres:5432`. Prisma Client is generated when the backend container starts.
Database migrations remain an explicit operation:

```bash
docker compose exec backend pnpm exec prisma migrate deploy
```

Stop the stack:

```bash
docker compose down
```

To also remove the local PostgreSQL data volume:

```bash
docker compose down -v
```

### Run applications on the host

Install dependencies in each application workspace:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

Each application currently manages its own package configuration and lockfile.

## Backend Development

Copy `backend/.env.example` to `backend/.env`, start PostgreSQL, and run the
development server:

```bash
cd backend
pnpm install
pnpm db:start
pnpm db:generate
pnpm db:migrate
pnpm start:dev
```

Health check endpoint: `GET http://localhost:3001/health`.

## Frontend Development

Copy `frontend/.env.example` to `frontend/.env`, install dependencies, and start
the Vite development server:

```powershell
cd frontend
Copy-Item .env.example .env
pnpm install
pnpm dev
```

The frontend is available at `http://localhost:5173`.

## Documentation

- `docs/` contains project-wide architecture, planning, and task documentation.
- `frontend/README.md` documents the planned frontend architecture and conventions.
- `backend/README.md` contains backend-specific documentation.

## Development Approach

Development is iterative and sprint-based. Important technical choices follow a documentation-first approach: architecture decisions are recorded before implementation. Cursor and Codex support the workflow with AI-assisted planning, implementation, and review.

## Status

Current status: PostgreSQL, backend, and frontend support a shared Docker Compose
development workflow.
