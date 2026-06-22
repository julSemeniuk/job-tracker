# Job Tracker Backend

NestJS backend application for Job Tracker.

## Setup

```bash
pnpm install
```

## Environment

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Variables:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Run locally

```bash
pnpm start:dev
```

The API will be available at:

```text
http://localhost:3001
```

## Health check

```text
GET http://localhost:3001/health
```

Example response:

```json
{
  "status": "ok",
  "timestamp": "2026-06-22T08:01:39.915Z"
}
```

## Build

```bash
pnpm build
```
