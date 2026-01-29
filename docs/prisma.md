# Prisma Documentation

## Overview

This application uses **Prisma** as the Object-Relational Mapping (ORM) layer for database access. Prisma provides type-safe database queries, migrations, and schema management.

**Key Technologies:**
- `prisma@^6.14.0` - Prisma CLI and migration tools
- `@prisma/client@^6.15.0` - Prisma Client (generated TypeScript client)
- PostgreSQL - Database provider

## Library and Versions

The project uses Prisma version 6.x:

```json
{
  "dependencies": {
    "@prisma/client": "^6.15.0"
  },
  "devDependencies": {
    "prisma": "^6.14.0"
  }
}
```

**Version Alignment:** The `prisma` CLI and `@prisma/client` should be kept at the same major version. Minor version differences are acceptable but should be aligned when possible.

## Configuration

### Datasource

Prisma is configured to use PostgreSQL as the database provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The `DATABASE_URL` environment variable must be set in your `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### Generator

The Prisma Client generator uses a custom output path:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "./.generated/prisma"
}
```

This generates the Prisma Client to `prisma/.generated/prisma` instead of the default `node_modules/.prisma/client`. This allows for better control over the generated client location.

### Client Initialization

The Prisma Client is initialized as a singleton in [`src/lib/prisma.ts`](../src/lib/prisma.ts):

```typescript
import { PrismaClient } from '../../prisma/.generated/prisma'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Key Features:**
- **Singleton Pattern:** Prevents multiple Prisma Client instances in development (Next.js hot reload)
- **Query Logging:** All query logs enabled for debugging (`query`, `info`, `warn`, `error`)
- **Error Formatting:** Pretty error formatting for better developer experience
- **Global Caching:** Stores Prisma instance in `globalThis` during development

**Usage Pattern:**

```typescript
import { prisma } from '@/lib/prisma'

// Use prisma throughout the application
const bankAccounts = await prisma.bankAccount.findMany({
  where: { userId },
  orderBy: [{ name: 'asc' }],
})
```

## Schema Design

### Database Models

The schema defines five main models:

1. **User** - User accounts and authentication
2. **Account** - OAuth provider accounts (NextAuth)
3. **Session** - User sessions (NextAuth)
4. **BankAccount** - Financial accounts (checking, savings, credit, investment)
5. **Transaction** - Financial transactions

### Entity Relationship Diagram

```mermaid
erDiagram
  User ||--o{ Account : has
  User ||--o{ Session : has
  User ||--o{ BankAccount : owns
  User ||--o{ Transaction : records
  BankAccount ||--o{ Transaction : contains

  User {
    string id PK
    string name
    string email UK
    string password
    string image
    datetime created_at
    datetime updated_at
  }

  Account {
    string id PK
    string user_id FK
    string type
    string provider
    string provider_account_id
  }

  Session {
    string id PK
    string session_token UK
    string user_id FK
    datetime expires
  }

  BankAccount {
    string id PK
    string name
    enum type
    float balance
    string user_id FK
  }

  Transaction {
    string id PK
    string description
    string type
    float amount
    enum category
    datetime date
    string bank_account_id FK
    string user_id FK
  }
```

### Enumerations

The schema defines two enums for categorical data:

#### BankAccountType

```prisma
enum BankAccountType {
  CHECKING
  SAVINGS
  CREDIT
  INVESTMENT
}
```

#### TransactionCategory

```prisma
enum TransactionCategory {
  FOOD
  TRANSPORT
  ENTERTAINMENT
  UTILITIES
  HEALTH
  EDUCATION
  DEBTS
  SALARY
  FREELANCE
  INVESTMENTS
  OTHER
}
```

### Model Details

#### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String   @unique
  image         String?
  password      String
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  accounts     Account[]
  sessions     Session[]
  transactions Transaction[]
  bankAccount  BankAccount[]

  @@map("users")
}
```

**Key Features:**
- Primary key: `cuid()` (Collision-resistant Unique Identifier)
- Email uniqueness constraint
- Timestamps: `createdAt` (auto-set), `updatedAt` (auto-updated)
- Relations: One-to-many with Account, Session, Transaction, BankAccount
- Database mapping: `users` table (snake_case)

#### BankAccount Model

```prisma
model BankAccount {
  id           String          @id @default(uuid())
  name         String
  type         BankAccountType
  balance      Float           @default(0)
  userId       String          @map("user_id")
  user         User            @relation(fields: [userId], references: [id])
  transactions Transaction[]

  @@map("bank_accounts")
}
```

**Key Features:**
- Primary key: `uuid()` (Universally Unique Identifier)
- Default balance: `0`
- Enum type: `BankAccountType`
- Foreign key: `userId` references `User.id`
- Database mapping: `bank_accounts` table

#### Transaction Model

```prisma
model Transaction {
  id            String              @id @default(uuid())
  description   String
  type          String
  amount        Float
  category      TransactionCategory
  date          DateTime            @default(now())
  bankAccountId String              @map("bank_account_id")
  userId        String              @map("user_id")

  user        User        @relation(fields: [userId], references: [id])
  bankAccount BankAccount @relation(fields: [bankAccountId], references: [id])

  @@map("transactions")
}
```

**Key Features:**
- Primary key: `uuid()`
- Enum category: `TransactionCategory`
- Default date: Current timestamp
- Dual foreign keys: `userId` and `bankAccountId`
- Database mapping: `transactions` table

### ID Strategy

The schema uses two different ID strategies:

- **`cuid()`** - Used for `User`, `Account`, `Session` models
  - Collision-resistant, URL-safe
  - Example: `clx1234567890abcdef`

- **`uuid()`** - Used for `BankAccount`, `Transaction` models
  - Standard UUID v4 format
  - Example: `550e8400-e29b-41d4-a716-446655440000`

### Database Naming Conventions

The schema uses **snake_case** for database table and column names, while Prisma models use **camelCase**:

- Model: `BankAccount` → Table: `bank_accounts`
- Field: `userId` → Column: `user_id`
- Field: `createdAt` → Column: `created_at`

This is achieved using `@@map` for tables and `@map` for columns:

```prisma
model BankAccount {
  userId String @map("user_id")
  @@map("bank_accounts")
}
```

## Migrations

### Migration History

The database schema was created through two migrations:

#### 1. Initial Schema (`20250828195019_create_basics_table`)

Created the foundational database structure:

- **Enums:** `BankAccountType`, `TransactionCategory`
- **Tables:** `accounts`, `sessions`, `users`, `bank_accounts`, `transactions`
- **Indexes:** Unique constraints on `accounts.provider + provider_account_id`, `sessions.session_token`, `users.email`
- **Foreign Keys:** All relationships with appropriate cascade/restrict rules

**Key Constraints:**
- `accounts` → `users`: `ON DELETE CASCADE`
- `sessions` → `users`: `ON DELETE CASCADE`
- `bank_accounts` → `users`: `ON DELETE RESTRICT`
- `transactions` → `users`: `ON DELETE RESTRICT`
- `transactions` → `bank_accounts`: `ON DELETE RESTRICT`

#### 2. User Table Update (`20250829115300_update_user_table`)

Refined the `users` table:

- **Removed:** `email_verified` column
- **Made Required:** `name`, `email`, `password` columns (previously nullable)

### Migration Commands

**Create a new migration:**

```bash
npx prisma migrate dev --name migration_name
```

**Apply migrations to production:**

```bash
npx prisma migrate deploy
```

**Generate Prisma Client after schema changes:**

```bash
npx prisma generate
```

**Open Prisma Studio (database GUI):**

```bash
npx prisma studio
```

**Reset database (development only):**

```bash
npx prisma migrate reset
```

## Usage Patterns

### Import Policy

Always import Prisma from the centralized location:

```typescript
import { prisma } from '@/lib/prisma'
```

**Never create a new PrismaClient instance:**

```typescript
// ❌ Don't
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ✅ Do
import { prisma } from '@/lib/prisma'
```

### Multi-Tenant Access Control

All queries must be scoped by `userId` to ensure data isolation:

```typescript
// ✅ Correct: Scoped by userId
const transactions = await prisma.transaction.findMany({
  where: {
    userId: user.id,
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
})

// ❌ Incorrect: Missing userId filter
const transactions = await prisma.transaction.findMany({
  where: {
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
})
```

### Query Patterns

#### Create Operations

```typescript
// Create with explicit field selection
const user = await prisma.user.create({
  data: {
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: `${firstName.trim()} ${lastName.trim()}`,
  },
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true,
  },
})
```

#### Read Operations

**Find Unique:**

```typescript
const user = await prisma.user.findUnique({
  where: { email: email.toLowerCase().trim() },
  select: {
    id: true,
    email: true,
    name: true,
    password: true, // Only when needed for validation
  },
})
```

**Find Many with Pagination:**

```typescript
const page = 1
const limit = 10
const skip = (page - 1) * limit

const [transactions, totalCount] = await Promise.all([
  prisma.transaction.findMany({
    where: { userId },
    include: {
      bankAccount: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    orderBy: { date: 'desc' },
    skip,
    take: limit,
  }),
  prisma.transaction.count({ where: { userId } }),
])
```

**Find First:**

```typescript
const defaultWallet = await prisma.bankAccount.findFirst({
  where: {
    userId,
    name: 'Wallet',
    type: 'CHECKING',
  },
})
```

#### Update Operations

```typescript
const updatedAccount = await prisma.bankAccount.update({
  where: {
    id,
    userId: user.id, // Ensure ownership
  },
  data: {
    name: validatedData.name,
    type: validatedData.type,
  },
})
```

#### Delete Operations

```typescript
// Check for related records before deletion
const transactionCount = await prisma.transaction.count({
  where: { bankAccountId: id },
})

if (transactionCount > 0) {
  throw new Error('Cannot delete account with existing transactions')
}

await prisma.bankAccount.delete({
  where: {
    id,
    userId: user.id,
  },
})
```

### Relation Loading

Use `include` to load relations, and `select` to control the shape:

```typescript
const transaction = await prisma.transaction.findUnique({
  where: { id, userId },
  include: {
    bankAccount: {
      select: {
        id: true,
        name: true,
        type: true,
      },
    },
  },
})
```

### Parallel Queries

Use `Promise.all` for independent queries:

```typescript
const [transactions, chartData] = await Promise.all([
  DashboardService.getCurrentMonthTransactions(),
  ChartDataService.getMonthlyIncomeExpenseData(),
])
```

### Field Selection

Always use `select` to return only necessary fields:

```typescript
// ✅ Good: Explicit field selection
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true,
  },
})

// ❌ Avoid: Returns all fields including password
const user = await prisma.user.findUnique({
  where: { id },
})
```

**Never return sensitive fields:**

```typescript
// ❌ Never return password
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    password: true, // Only use internally for validation
  },
})
```

### Filtering and Sorting

**Date Range Filtering:**

```typescript
const transactions = await prisma.transaction.findMany({
  where: {
    userId,
    date: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  },
})
```

**Text Search (Case-Insensitive):**

```typescript
const transactions = await prisma.transaction.findMany({
  where: {
    userId,
    description: {
      contains: search,
      mode: 'insensitive',
    },
  },
})
```

**Multiple Order By:**

```typescript
const bankAccounts = await prisma.bankAccount.findMany({
  where: { userId },
  orderBy: [{ name: 'asc' }],
})
```

## Standards to Maintain

### Generator Output Path

Keep the custom generator output path (`prisma/.generated/prisma`). This allows better control over the generated client location and avoids conflicts with `node_modules`.

### Database Naming Mapping

Maintain consistent `@@map` and `@map` usage for snake_case database naming:

- All table names use `@@map("snake_case")`
- All column names use `@map("snake_case")`
- Model and field names use camelCase

### Enum Usage

Use Prisma enums for categorical fields:

- `BankAccountType` for account types
- `TransactionCategory` for transaction categories

Avoid string literals for these fields in the schema.

### Single Prisma Client Instance

Always use the singleton instance from `src/lib/prisma.ts`. Never create new `PrismaClient` instances elsewhere.

## Recommendations

### Version Alignment

Keep `prisma` and `@prisma/client` at the same major version. When updating, update both packages together:

```bash
npm install prisma@latest @prisma/client@latest
```

### Money Fields

The current schema uses `Float` for monetary values (`balance`, `amount`). Consider these alternatives for production:

- **Decimal/Decimal.js:** More precise for financial calculations
- **Integer (cents):** Store amounts as integers (e.g., 1000 = $10.00)
- **PostgreSQL `money` type:** Native database type

**Current Implementation:**
```prisma
balance Float @default(0)
amount  Float
```

**Future Consideration:**
```prisma
balance Decimal @db.Decimal(10, 2)
amount  Decimal @db.Decimal(10, 2)
```

### Logging Configuration

The current configuration logs all query levels:

```typescript
log: ['query', 'info', 'warn', 'error']
```

**Production Recommendation:**
- Remove `'query'` logging in production (performance impact)
- Keep `'warn'` and `'error'` for monitoring
- Consider environment-based logging:

```typescript
log: process.env.NODE_ENV === 'development'
  ? ['query', 'info', 'warn', 'error']
  : ['warn', 'error']
```

### Connection Pooling

For production deployments, consider:

- Using a connection pooler (e.g., PgBouncer)
- Configuring `connection_limit` in `DATABASE_URL`
- Monitoring connection usage

## What to Avoid

### Creating Multiple Prisma Client Instances

**Don't:**

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient() // Creates new instance
```

**Do:**

```typescript
import { prisma } from '@/lib/prisma' // Use singleton
```

### Unscoped Queries

**Don't:**

```typescript
// Missing userId filter - security risk
const transactions = await prisma.transaction.findMany({})
```

**Do:**

```typescript
// Always scope by userId
const transactions = await prisma.transaction.findMany({
  where: { userId: user.id },
})
```

### Returning Sensitive Fields

**Don't:**

```typescript
// Returns password in API response
const user = await prisma.user.findUnique({
  where: { id },
})
return user // Includes password!
```

**Do:**

```typescript
// Explicitly select safe fields
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true,
  },
})
```

### Missing Error Handling

**Don't:**

```typescript
const user = await prisma.user.create({ data })
// No error handling
```

**Do:**

```typescript
try {
  const user = await prisma.user.create({ data })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Handle unique constraint violation
    }
  }
  throw error
}
```

### N+1 Query Problems

**Don't:**

```typescript
const accounts = await prisma.bankAccount.findMany({ where: { userId } })
for (const account of accounts) {
  const transactions = await prisma.transaction.findMany({
    where: { bankAccountId: account.id },
  })
}
```

**Do:**

```typescript
const accounts = await prisma.bankAccount.findMany({
  where: { userId },
  include: {
    transactions: true,
  },
})
```

## How to Use Prisma Correctly

### Pattern 1: Service Layer Abstraction

Create service classes that encapsulate Prisma queries:

```typescript
// src/services/bank-account-service.ts
export class BankAccountService {
  static async getUserBankAccounts(userId: string) {
    return await prisma.bankAccount.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        userId: true,
      },
      orderBy: [{ name: 'asc' }],
    })
  }
}
```

### Pattern 2: API Route with Authentication

Always validate user authentication before Prisma queries:

```typescript
// src/app/api/bank-account/route.ts
export const GET = withAuth(async (request, { user }) => {
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { userId: user.id },
  })
  return createSuccessResponse(bankAccounts)
})
```

### Pattern 3: Transaction Validation

Validate related records before operations:

```typescript
const bankAccount = await prisma.bankAccount.findUnique({
  where: { id, userId: user.id },
})

if (!bankAccount) {
  return createErrorResponse('Bank account not found', 404)
}

// Proceed with operation
```

### Pattern 4: Count Before Delete

Check for related records before deletion:

```typescript
const transactionCount = await prisma.transaction.count({
  where: { bankAccountId: id },
})

if (transactionCount > 0) {
  return createErrorResponse(
    'Cannot delete account with existing transactions',
    400
  )
}
```

## Patterns and Principles

### Single Source of Truth

The Prisma Client instance in `src/lib/prisma.ts` is the single source of truth for database access. All imports should come from this file.

### Least-Privilege Queries

Always use `select` to return only necessary fields. This:
- Reduces payload size
- Prevents accidental exposure of sensitive data
- Improves query performance

### Deterministic Ordering

Always specify `orderBy` for list queries to ensure consistent results:

```typescript
orderBy: [{ name: 'asc' }]
orderBy: { date: 'desc' }
```

### Explicit Relation Loading

Use `include` with `select` to control relation loading:

```typescript
include: {
  bankAccount: {
    select: {
      id: true,
      name: true,
      type: true,
    },
  },
}
```

### User Scoping

All queries must be scoped by `userId` to ensure multi-tenant data isolation. This is a security requirement, not optional.

### Error Handling

Handle Prisma errors appropriately:

- `P2002`: Unique constraint violation
- `P2025`: Record not found
- `P2003`: Foreign key constraint violation

### Type Safety

Leverage Prisma's generated types:

```typescript
import type { User, BankAccount, Transaction } from '@/prisma/.generated/prisma'

type BankAccountWithTransactions = BankAccount & {
  transactions: Transaction[]
}
```

## Summary

This application uses Prisma 6.x with PostgreSQL, following these key patterns:

- **Singleton Client:** Single Prisma instance from `src/lib/prisma.ts`
- **Custom Output:** Generated client at `prisma/.generated/prisma`
- **Snake Case Mapping:** Database uses snake_case, models use camelCase
- **Multi-Tenant Security:** All queries scoped by `userId`
- **Explicit Selection:** Always use `select` to control returned fields
- **Enum Types:** Use Prisma enums for categorical data
- **Migration Management:** Schema changes via Prisma migrations

The Prisma setup provides type-safe database access with comprehensive query logging and error handling, ensuring data integrity and security throughout the application.
