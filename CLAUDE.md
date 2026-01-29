# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 finance management application with authentication, transaction tracking, and dashboard analytics. Uses TypeScript, Prisma with Neon PostgreSQL (serverless), NextAuth v5, Zustand for state, and React Query for data fetching.

## Common Commands

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier formatting
npm run type-check    # TypeScript type checking
npm run check         # Run type-check, lint, and format:check together
npm run fix           # Run lint:fix and format together
```

Playwright is configured for E2E testing but tests are not yet active.

## Architecture

### Source Structure

- `src/app/` - Next.js App Router with route groups: `(admin)` for authenticated pages, `api/` for REST endpoints
- `src/features/` - Feature-based modules (auth, dashboard, transactions, landing-page), each with components, hooks, services, types
- `src/components/ui/` - Shared Radix UI components
- `src/services/` - Business logic (AuthService, BankAccountService, SessionService)
- `src/store/` - Zustand state management with selectors pattern
- `src/lib/` - Core utilities (auth config, API middleware, Zod schemas, Prisma client)
- `src/providers/` - React context providers (Query, Session, Theme, Sonner)

### Key Patterns

**Authentication**: NextAuth v5 with credentials provider and Prisma adapter. API routes protected via `withAuth` and `withAuthDynamic` middleware wrappers from `src/lib/api-middleware.ts`.

**State Management**: Zustand for UI state (filters, dialogs, forms), React Query for server state with 5-minute stale time.

**Forms**: React Hook Form + Zod validation. Schemas defined in `src/lib/schemas.ts`.

**Styling**: Tailwind CSS v4 with dark mode (class-based). Prettier plugin auto-sorts classes.

### Database Models (Prisma)

- **User**: Authentication with accounts, sessions, transactions, bankAccounts relations
- **BankAccount**: CHECKING, SAVINGS, CREDIT, INVESTMENT types with balance tracking
- **Transaction**: Amount, category (FOOD, TRANSPORT, etc.), type, linked to user and bank account

**Neon Connection Pooling (Prisma 7):** The project uses Neon PostgreSQL with PgBouncer for connection pooling:
- `DATABASE_URL` - Pooled connection used by runtime via adapter in `src/lib/prisma.ts`
- `DATABASE_URL_UNPOOLED` - Direct connection used by Prisma CLI (migrations) via `prisma.config.ts`

### Path Alias

`@/*` maps to `./src/*`

## Code Style

- No semicolons, single quotes, trailing commas (ES5)
- Type imports must be inline (`import type { X }` or `import { type X }`)
- No console.log (only warn/error allowed)
- Object shorthand and template literals preferred
