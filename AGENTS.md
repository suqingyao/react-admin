# AGENTS.md - Project Context for AI Assistants

## Project Overview
This is a Monorepo project for **Nova Admin**, a modern React-based admin dashboard.
The project is currently in a **migration phase**.

## ⚠️ Important Context regarding Source Code
- **Active Frontend Source**: `src/` (Root Directory). This contains the currently active application code.
- **Target Frontend Location**: `apps/web-antd/`. The root `src` is being migrated here.
- **When writing/reading frontend code**: Unless specifically instructed to work in `apps/web-antd`, assume the code lives in root `src/`.

## Architecture & Tech Stack
- **Monorepo Manager**: PNPM Workspaces + TurboRepo
- **Frontend**: 
  - React 19
  - Vite
  - React Router 7
  - Zustand (State Management)
  - Ant Design 6 + Tailwind CSS 4
- **Tooling**:
  - Biome (Linting & Formatting)
  - Vitest (Unit Testing)
  - TypeScript

## Directory Structure Map

### Applications (`apps/`)
- `web-antd`: The destination for the main admin application (currently empty/WIP).
- `backend`: Backend/Mock service (likely Nitro-based).

### Shared Packages (`packages/`)
Core business logic and UI libraries are modularized here:

- **@core/**: Foundational packages.
  - `base`: Design system tokens, shared constants.
  - `hooks`: Common React hooks.
  - `preferences`: Settings and user preference management.
  - `ui-kit`: Generic, reusable UI components.
- **effects/**: Side-effects and business flows.
- **icons/**: Icon sets and components.
- **types/**: Shared TypeScript definitions/interfaces.
- **utils/**: General utility functions (helpers, formatters).

### Configuration (`internal/`)
Contains shared configuration for build tools (Vite, Tailwind, etc.).

## Key Commands
- `pnpm dev`: Start the dev server (check `package.json` for specific app filters).
- `pnpm build`: Build all apps/packages via Turbo.
- `pnpm lint` / `pnpm format`: Code quality checks via Biome.
- `pnpm check:type`: Type checking.

## Guidelines for AI Agents
1. **Migration Awareness**: Be aware that files in root `src` might have counterparts or dependencies in `packages`.
2. **Style Guide**: Follow `biome.json` rules. Use Tailwind CSS for styling where possible.
3. **Imports**: Use absolute imports or workspace aliases where configured.
