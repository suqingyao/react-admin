# Repository Guidelines

## Project Structure & Module Organization
Nova Admin is a Vite + React 19 workspace. Source lives under `src/`, grouped by responsibility:
- `src/pages/*` provides routed screens that map to `src/router/modules` and enums in `src/enums`.
- `src/components/core/layouts` contains shell chrome (sidebar, header bar, work tabs) reused across pages.
- `src/lib`, `src/config`, `src/store/modules`, and `src/types` centralize helpers, runtime knobs, Zustand stores, and shared contracts.
Global styles land in `src/styles/index.scss` (with granular partials under `src/styles/core`), while static assets belong in `public/`. Mock data for prototyping resides in `src/mock/`.

## Build, Test, and Development Commands
- `pnpm install` syncs dependencies; commit the updated `pnpm-lock.yaml` when it changes.
- `pnpm dev` starts Vite with React Fast Refresh for day-to-day development.
- `pnpm build` runs `tsc -b` before `vite build`, so TypeScript diagnostics must be resolved.
- `pnpm preview` serves the production bundle for smoke-testing.
- `pnpm lint` executes the flat ESLint config (`eslint.config.js`) that wraps the Antfu preset plus React-focused plugins.

## Coding Style & Naming Conventions
Stick to TypeScript, 2-space indentation, and ES modules. Components, layouts, and providers use PascalCase filenames (for example, `NovaHeaderBar.tsx`), while hooks stay camelCase inside `src/hooks`. Route enums and constants should extend the definitions under `src/enums` and `src/lib/constants` instead of inline strings. Tailwind utilities can supplement SCSS, but prefer colocated `.scss` files under `src/styles/core` for complex themes. Run `pnpm lint --fix` before opening a PR to enforce the shared style.

## Testing Guidelines
A Vitest + React Testing Library stack is expected (install via `pnpm add -D vitest @testing-library/react` if the packages are missing). Place spec files next to their modules (`NovaUserMenu.test.tsx`) or under `src/__tests__`. Mock APIs through helpers in `src/mock/`. Target at least 80% statement coverage per module by running `vitest run --coverage` and attach the summary to your PR description.

## Commit & Pull Request Guidelines
Follow the conventional, scope-aware messages used in the existing log (`feat(layout): ...`, `chore: ...`). Keep PRs small and include: a concise summary, linked issue or task ID, screenshots or GIFs for UI changes, and a checklist covering `pnpm lint`, `pnpm build`, and relevant tests. Flag any config or environment changes in the description so reviewers can reproduce locally.

## Security & Configuration Tips
Secrets must remain outside the repo; load them through `.env.local` (gitignored) and consume via `import.meta.env`. Double-check additions under `src/config/modules` for accidental leakage, and avoid embedding tenant-specific URLs directly inside router modules.
