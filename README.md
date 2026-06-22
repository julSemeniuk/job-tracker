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

Clone the repository, enter the project directory, and install dependencies in each application workspace:

```bash
git clone <repository-url>
cd job-tracker

cd backend
pnpm install

cd ../frontend
pnpm install
```

Each application currently manages its own package configuration and lockfile.

## Backend Development

Copy `backend/.env.example` to `backend/.env`, then install dependencies and start the development server:

```bash
cd backend
pnpm install
pnpm start:dev
```

Health check endpoint: `GET http://localhost:3001/health`.

## Frontend Development

Install dependencies and start the Vite development server:

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend is still being established, so these instructions may evolve as the frontend setup progresses.

## Documentation

- `docs/` contains project-wide architecture, planning, and task documentation.
- `frontend/README.md` documents the planned frontend architecture and conventions.
- `backend/README.md` contains backend-specific documentation.

## Development Approach

Development is iterative and sprint-based. Important technical choices follow a documentation-first approach: architecture decisions are recorded before implementation. Cursor and Codex support the workflow with AI-assisted planning, implementation, and review.

## Status

Current status: initial backend and database setup are completed; frontend architecture is being planned.
