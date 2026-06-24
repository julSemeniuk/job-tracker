# Frontend

The frontend is a React and TypeScript application built with Vite. It uses domain-driven modules, module/submodule boundaries, and component colocation.

This project does **not** use Feature-Sliced Design (FSD).

## Architecture Approach

Business functionality belongs in domain modules. Reusable, business-agnostic infrastructure lives in flat folders directly under `src` rather than inside a `shared/` folder.

The project intentionally has no `app/` layer. `App.tsx` is currently sufficient for provider composition, routing, and global application wiring. An `app/` layer may be introduced later if dedicated bootstrap logic, guards, layouts, or application-level configuration make it valuable.

## Source Structure

```text
src/
├── modules/       # business domains and their submodules
├── layouts/       # route-level application layouts
├── providers/     # global React providers
├── router/        # routes and route configuration
├── theme/         # MUI theme factory and design tokens
├── hooks/         # business-agnostic reusable hooks
├── utils/         # business-agnostic helper functions
├── constants/     # shared application constants
├── types/         # cross-cutting TypeScript types
├── services/      # business-agnostic infrastructure services
├── assets/        # images, icons, and fonts
├── App.tsx        # application composition root
├── main.tsx       # browser entry point
└── vite-env.d.ts
```

Not every planned folder must exist before it contains code. Infrastructure folders should be introduced when their first concrete responsibility appears.

## Application Entry Points

### `App.tsx`

The application composition root is responsible for:

- composing global providers;
- rendering the router;
- connecting layouts and route content;
- global application wiring.

### `main.tsx`

The browser entry point mounts React and renders `App`.

## UI System

The base UI system uses Material UI with Emotion:

- `@mui/material` for components and theming;
- `@mui/icons-material` for Material icons;
- `@emotion/react` and `@emotion/styled` as the styling engine.

Global browser normalization is provided by MUI `CssBaseline` inside the application theme provider. Layout components use MUI primitives and theme tokens rather than hard-coded page-level styling.

## Theme

The theme is split by token responsibility and composed by a single factory:

```text
src/theme/
├── createAppTheme.ts
├── palette.ts
└── typography.ts
```

- `createAppTheme.ts` combines palette and typography options with MUI defaults.
- `palette.ts` defines the light and dark Modern SaaS Indigo palettes and selects tokens by mode.
- `typography.ts` defines fonts, weights, sizes, line heights, and button text behavior.

Breakpoints, component overrides, shape, and shadows use MUI defaults. They should receive dedicated files only if the product develops a concrete customization that makes the extra abstraction worthwhile.

### Color-mode decision

Both light and dark themes use the approved **Modern SaaS Indigo** visual direction. The light palette combines indigo and violet accents with cool neutral surfaces. The dark palette uses neutral ink backgrounds with brighter accents and status colors for readable contrast.

The provider follows the user's operating-system preference through `prefers-color-scheme`. Manual theme selection and persistence are intentionally deferred until the application has settings UI. Mode-specific tokens remain behind `createAppTheme(mode)`, so consumers use semantic MUI tokens and do not branch on color mode.

## Theme Provider

```text
src/providers/theme/
├── ThemeProvider.tsx
└── index.ts
```

The application `ThemeProvider` detects the system color preference, memoizes the matching MUI theme, wraps its children with MUI's provider, and applies `CssBaseline`. `App.tsx` owns this provider composition.

Additional global providers, such as TanStack Query, authentication, localization, or feature flags, should be colocated in their own folders under `src/providers`.

## Main Layout

```text
src/layouts/MainLayout/
├── MainLayout.tsx
├── styles.ts
├── types.ts
└── index.ts
```

- `MainLayout.tsx` renders the header placeholder, main content container, and React Router `Outlet`.
- `styles.ts` contains theme-aware MUI `sx` definitions.
- `types.ts` contains the layout's public TypeScript contract.
- `index.ts` exposes the layout's public API.

The layout is intentionally named `MainLayout`; the project does not use `AppShell` naming.

## Module Structure

```text
src/modules/jobs/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── services/
├── store/
├── types/
├── utils/
├── submodules/
└── index.ts
```

- `api` contains API clients and query hooks.
- `components` contains module-specific UI.
- `hooks` contains module-specific hooks.
- `pages` contains route pages.
- `schemas` contains validation schemas.
- `services` contains business services.
- `store` contains local state management.
- `types` contains module TypeScript types.
- `utils` contains module helper functions.
- `submodules` contains child business domains.
- `index.ts` defines the module's public API.

Create a module when a capability is a separate business domain, has its own routes, API, and state, and can reasonably exist independently.

## Submodule Structure

```text
src/modules/jobs/submodules/applications/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── services/
├── store/
├── types/
├── utils/
└── index.ts
```

Create a submodule when it belongs to a parent module, shares the same business context, and cannot reasonably exist independently.

## Component Colocation

Meaningful components may own a folder containing their implementation and closely related files:

```text
JobCard/
├── JobCard.tsx
├── JobCard.types.ts
├── JobCard.styles.ts
├── JobCard.test.tsx
└── index.ts
```

## Import Boundaries

Allowed dependency directions:

- `App.tsx` → modules, layouts, providers, and router;
- modules → flat reusable infrastructure and their own submodules;
- submodules → flat reusable infrastructure;
- providers → theme and flat reusable infrastructure;
- router → layouts, module public APIs, and flat reusable infrastructure.

Forbidden dependencies:

- reusable infrastructure → business modules;
- one module → another module's internals;
- a submodule → another module's internals;
- deep imports into a module or submodule from outside its boundary.

Cross-module communication must use public APIs exposed from `index.ts`. All local frontend imports use configured aliases and absolute paths. Relative local imports (`./` and `../`) are not allowed. Imports from external npm packages remain package imports.

### Path aliases

| Alias | Source folder |
| --- | --- |
| `@src/*` | `src/*` |
| `@modules/*` | `src/modules/*` |
| `@layouts/*` | `src/layouts/*` |
| `@providers/*` | `src/providers/*` |
| `@router/*` | `src/router/*` |
| `@theme/*` | `src/theme/*` |
| `@hooks/*` | `src/hooks/*` |
| `@utils/*` | `src/utils/*` |
| `@constants/*` | `src/constants/*` |
| `@services/*` | `src/services/*` |
| `@assets/*` | `src/assets/*` |

Use `@src/*` for root files and paths without a dedicated alias, including shared TypeScript types.

```ts
// Public module API.
import { JobsPage } from '@modules/jobs'

// Root source file.
import App from '@src/App'

// Forbidden deep import.
import { JobsPage } from '@modules/jobs/pages/JobsPage'
```

## Development

Create `.env` from `.env.example` and point it to the backend origin:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Environment-specific backend origins are supplied at build or development time;
application modules consume the centralized `API_BASE_URL` value rather than
hard-coding a host.

## Authentication

Authentication is implemented as the `src/modules/auth` business module. It
contains the login and callback pages, route protection, RTK Query endpoints,
and the Redux auth slice.

The frontend follows this token-storage strategy:

- the short-lived access token exists only in the in-memory Redux store;
- the backend stores the refresh token in an HttpOnly cookie, so frontend
  JavaScript cannot read it;
- neither token is stored in `localStorage` or `sessionStorage`;
- tokens are never read from or written to URL query parameters;
- reloading the page clears the in-memory access token, after which the app
  obtains a new one through `POST /auth/refresh` with credentials included.

The application starts by attempting a refresh-cookie bootstrap. The
`/auth/callback` page owns that request after Google redirects back, preventing
concurrent refresh-token rotations. Protected routes wait for this check before
rendering or redirecting to `/login`.

Auth API endpoints:

```text
POST /auth/refresh  Restore or rotate the session and return an access token
GET  /auth/me       Return the current user using the Bearer access token
POST /auth/logout   Revoke the refresh session and clear its cookie
```

To test the flow locally:

1. Start the backend on `http://localhost:3001` with Google OAuth configured.
2. Start the frontend with `pnpm dev`.
3. Open `http://localhost:5173/login`.
4. Select **Continue with Google** and complete Google authentication.
5. Confirm the browser returns through `/auth/callback` and lands on `/`.
6. Confirm `/auth/refresh` sends the HttpOnly cookie and its JSON response
   contains an access token and safe user object.
7. Confirm protected API calls send `Authorization: Bearer <access-token>`.
8. Reload the page and confirm the session is restored through another refresh.
9. Select **Sign out** and confirm the app returns to `/login` and protected
   routes are no longer accessible.

At no point should either token appear in browser storage or the address bar.

## Development commands

```bash
pnpm install
pnpm dev
```

Create a production build and run TypeScript validation with:

```bash
pnpm build
```
