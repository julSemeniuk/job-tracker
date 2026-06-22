# Frontend Architecture

## Architecture Approach

We will use a hybrid architecture based on:

- Domain-driven modules
- Module/Submodule architecture
- Component colocation pattern

At the current stage, we intentionally avoid introducing an `app/` layer because the application does not yet require dedicated bootstrap logic, layouts, guards, or application-level configuration.

If the application grows and requires those concerns, an `app/` layer may be introduced later.

## Planned Project Structure

```text
src/
├── modules/
├── shared/
├── providers/
├── router/
├── assets/
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## Folder Responsibilities

### App.tsx

Application composition root.

Responsible for:

- composing providers;
- rendering router;
- global application wiring.

### main.tsx

Application entry point.

Responsible for:

- mounting React application;
- rendering App component.

### modules

Business domains.

Examples:

- auth
- jobs
- profile
- dashboard
- settings

Modules should be isolated and communicate only through public APIs.

### shared

Reusable code without business-specific knowledge.

Examples:

- ui
- hooks
- utils
- constants
- types
- services

### providers

Global providers.

Examples:

- QueryClientProvider
- ThemeProvider
- AuthProvider
- LocalizationProvider

### router

Application routes and route configuration.

### assets

Static assets.

Examples:

- images
- icons
- fonts

## Module Structure

Example:

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

Responsibilities:

- api → API clients and query hooks
- components → module-specific UI
- hooks → module hooks
- pages → route pages
- schemas → validation schemas
- services → business services
- store → local state management
- types → TypeScript types
- utils → helper functions
- submodules → child business domains
- index.ts → public API exports

## Submodule Structure

Example:

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

## Component Colocation Pattern

Each meaningful component may have its own folder:

```text
JobCard/
├── JobCard.tsx
├── JobCard.types.ts
├── JobCard.styles.ts
├── JobCard.test.tsx
└── index.ts
```

## When to Create a Module

- separate business domain;
- has its own routes;
- has its own API and state;
- can exist independently.

## When to Create a Submodule

- belongs to a parent module;
- shares the same business context;
- cannot reasonably exist independently.

## Import Boundaries

Allowed:

- `App.tsx` → modules
- `App.tsx` → providers
- `App.tsx` → router
- modules → shared
- modules → own submodules
- submodules → shared
- providers → shared
- router → shared

Forbidden:

- shared → modules
- shared → router
- shared → providers
- module → another module internals
- submodule → another module internals
- deep imports

Good:

```ts
import { JobsPage } from '@modules/jobs';
```

Bad:

```ts
import { JobsPage } from '@modules/jobs/pages/JobsPage';
```
