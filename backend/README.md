# Job Tracker Backend

NestJS backend application for Job Tracker.

## Prerequisites

- Node.js
- pnpm
- Docker Desktop with Docker Compose

## Setup

Install dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

`.env.example` contains local-development defaults only. Deployed environments
must provide their own variables through the hosting platform; application code
does not contain deployment hostnames.

The local development defaults are:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FRONTEND_AUTH_CALLBACK_URL=http://localhost:5173/auth/callback
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_tracker_dev?schema=public"
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
JWT_ACCESS_SECRET=<long-random-secret>
JWT_REFRESH_SECRET=<different-long-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REFRESH_TOKEN_COOKIE_NAME=refreshToken
```

`FRONTEND_URL` accepts a comma-separated allowlist when more than one frontend
origin is required:

```env
FRONTEND_URL=https://app.example.com,https://admin.example.com
```

Configuration is validated before Nest starts. Production configuration rejects
HTTP URLs, localhost URLs, JWT secrets shorter than 32 characters, and identical
access/refresh secrets. Invalid token durations, ports, cookie names, and missing
OAuth values also stop startup with a descriptive error.

Generate independent JWT secrets for local development, for example:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Database

Start PostgreSQL:

```bash
pnpm db:start
```

Generate Prisma Client:

```bash
pnpm db:generate
```

Create and apply the initial migration using the migration name `init`:

```bash
pnpm db:migrate --name init
```

For later migrations, use a descriptive migration name:

```bash
pnpm db:migrate --name <migration-name>
```

Open Prisma Studio:

```bash
pnpm db:studio
```

Stop PostgreSQL:

```bash
pnpm db:stop
```

## Database schema

The initial Prisma schema includes:

- User
- Company
- JobApplication
- InterviewStage
- Contact
- Task
- AiGeneration

After schema changes, run:

```bash
pnpm db:migrate
pnpm db:generate
```

## Run locally

Start the backend in development mode:

```bash
pnpm start:dev
```

The API is available at `http://localhost:3001`.

## Health check

```text
GET http://localhost:3001/health
```

## Google OAuth

### Google Cloud setup

1. Create or select a project in Google Cloud Console.
2. Configure the OAuth consent screen.
3. Create an OAuth 2.0 Client ID for a **Web application**.
4. Add this authorized JavaScript origin:

   ```text
   http://localhost:5173
   ```

5. Add this authorized redirect URI exactly as written:

   ```text
   http://localhost:3001/auth/google/callback
   ```

6. Copy the client ID and client secret into `GOOGLE_CLIENT_ID` and
   `GOOGLE_CLIENT_SECRET` in `.env`.

The Google redirect URI must exactly match `GOOGLE_CALLBACK_URL`, including the
protocol, port, and path.

### Authentication flow

1. The browser opens `GET /auth/google`.
2. The backend creates a short-lived OAuth state value in an HttpOnly cookie and
   redirects to Google.
3. Google redirects to `GET /auth/google/callback`. The backend validates the
   state cookie and the verified Google profile, then finds or creates the user
   by normalized email.
4. The backend creates a signed refresh JWT, stores only its HMAC-SHA256 hash in
   the database, places the raw token in the HttpOnly `refreshToken` cookie, and
   redirects to `FRONTEND_AUTH_CALLBACK_URL`. No token is added to the URL.
5. The frontend calls `POST /auth/refresh` with credentials included. The
   backend validates and rotates the refresh token, replaces the cookie, and
   returns a short-lived access token plus safe user fields.
6. The frontend keeps the access token in memory and sends it as
   `Authorization: Bearer <access-token>` to `GET /auth/me`.
7. `POST /auth/logout` removes the stored refresh-token hash and clears the
   cookie.

Only one active refresh-token session is stored per user. Refresh tokens are
rotated on every successful refresh and are never returned in JSON or URLs.

### Manual testing

Start PostgreSQL, apply migrations, and start the backend:

```powershell
pnpm db:start
pnpm db:migrate
pnpm start:dev
```

Then:

1. Open `http://localhost:3001/auth/google` in a browser and complete Google
   login.
2. In browser developer tools, confirm the backend set an HttpOnly
   `refreshToken` cookie scoped to `/auth`. The callback URL must contain no JWT.
3. Request an access token while preserving the browser cookie:

   ```js
   const auth = await fetch('http://localhost:3001/auth/refresh', {
     method: 'POST',
     credentials: 'include',
   }).then((response) => response.json())
   ```

4. Call the protected endpoint using the returned in-memory access token:

   ```js
   await fetch('http://localhost:3001/auth/me', {
     headers: { Authorization: `Bearer ${auth.accessToken}` },
     credentials: 'include',
   }).then((response) => response.json())
   ```

5. Log out and clear the refresh session:

   ```js
   await fetch('http://localhost:3001/auth/logout', {
     method: 'POST',
     credentials: 'include',
   })
   ```

For production, use HTTPS, set `NODE_ENV=production`, and configure production
frontend and callback URLs. This makes the refresh cookie `Secure` while keeping
it HttpOnly and `SameSite=Lax`.

## Build

```bash
pnpm build
```
