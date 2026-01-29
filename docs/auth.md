# Authentication Documentation

## Overview

This application uses **NextAuth v5** (also known as **Auth.js**) for authentication. NextAuth v5 is the latest version of the authentication library for Next.js applications, providing a flexible and secure authentication system.

**Key Technologies:**
- `next-auth@5.0.0-beta.29` - Core authentication library
- `@auth/prisma-adapter@^2.10.0` - Prisma adapter for database integration
- `bcryptjs@^3.0.2` - Password hashing
- Prisma ORM - Database access layer

## Authentication Flow

The following diagram illustrates the authentication flow in the application:

```mermaid
sequenceDiagram
    participant User
    participant SignInPage as /auth/signin
    participant NextAuthAPI as /api/auth/[...nextauth]
    participant AuthService as AuthService.validateCredentials
    participant Prisma as Database
    participant Middleware as middleware.ts
    participant ProtectedRoute as /dashboard

    User->>SignInPage: Navigate to sign-in page
    User->>SignInPage: Submit credentials (email, password)
    SignInPage->>NextAuthAPI: signIn('credentials', {...})
    NextAuthAPI->>AuthService: authorize(credentials)
    AuthService->>Prisma: Find user by email
    Prisma-->>AuthService: User data
    AuthService->>AuthService: Compare password (bcrypt)
    AuthService-->>NextAuthAPI: User object (id, email, name)
    NextAuthAPI->>NextAuthAPI: Create JWT token
    NextAuthAPI->>NextAuthAPI: Set cookie with JWT
    NextAuthAPI-->>SignInPage: Success response
    SignInPage->>ProtectedRoute: Redirect to /dashboard

    User->>ProtectedRoute: Request protected route
    ProtectedRoute->>Middleware: Check authentication
    Middleware->>NextAuthAPI: Verify JWT from cookie
    NextAuthAPI-->>Middleware: Session data
    alt Authenticated
        Middleware->>ProtectedRoute: Allow access
        ProtectedRoute->>ProtectedRoute: auth() - Get session
        ProtectedRoute-->>User: Render protected content
    else Not Authenticated
        Middleware->>SignInPage: Redirect to /auth/signin?callbackUrl=...
    end
```

## Configuration

The main NextAuth configuration is located in [`src/lib/auth.ts`](../src/lib/auth.ts):

```typescript
import { AuthService } from '@/services/auth-service'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ... rest of configuration
})
```

### Exported Functions

The configuration exports three main functions:

- **`handlers`** - HTTP handlers for the authentication API routes (GET, POST)
- **`signIn`** - Server-side function to sign in a user
- **`signOut`** - Server-side function to sign out a user
- **`auth`** - Server-side function to get the current session

## Adapter: PrismaAdapter

The application uses the **PrismaAdapter** to integrate NextAuth with Prisma ORM. While the adapter is configured, the current implementation uses **JWT session strategy**, meaning session tokens are stored in HTTP-only cookies rather than the database.

### Database Models

The Prisma schema includes the following authentication-related models (defined in [`prisma/schema.prisma`](../prisma/schema.prisma)):

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

**Key Fields:**
- `id` - Unique identifier (CUID)
- `email` - Unique email address (used for authentication)
- `password` - Hashed password (bcrypt, 12 rounds)
- `name` - User's full name

#### Account Model

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

**Purpose:** Stores OAuth provider account information. Currently used for Credentials provider compatibility, but primarily intended for future OAuth integrations.

#### Session Model

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

**Important Note:** While this model exists in the schema, it is **not actively used** in the current implementation because the app uses `session.strategy: 'jwt'`. Sessions are stored in HTTP-only cookies as JWT tokens. This model would be used if switching to database session strategy.

### Prisma Client Setup

The Prisma client is initialized in [`src/lib/prisma.ts`](../src/lib/prisma.ts):

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

**Features:**
- Singleton pattern to prevent multiple Prisma instances in development
- Query logging enabled for debugging
- Pretty error formatting

## Providers

### Credentials Provider

The application uses the **Credentials Provider** for email/password authentication.

**Configuration:**

```typescript
providers: [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      const { email, password } = credentials

      return await AuthService.validateCredentials(
        email as string,
        password as string
      )
    },
  }),
]
```

**Flow:**

1. User submits email and password via the sign-in form
2. NextAuth calls `authorize()` with the credentials
3. `authorize()` delegates to `AuthService.validateCredentials()`
4. The service:
   - Finds the user by email (case-insensitive, trimmed)
   - Compares the provided password with the stored hash using `bcrypt.compare()`
   - Returns `null` if credentials are invalid
   - Returns a user object `{ id, email, name }` if valid

**Example - Password Validation:**

Located in [`src/services/auth-service.ts`](../src/services/auth-service.ts):

```typescript
static async validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  })

  if (!user?.password) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    name: user.name,
  }
}
```

## Session Strategy

The application uses **JWT (JSON Web Token) session strategy**:

```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

### How JWT Sessions Work

1. **Token Creation:** When a user successfully authenticates, NextAuth creates a JWT token containing user information
2. **Cookie Storage:** The JWT is stored in an HTTP-only, secure cookie (name: `authjs.session-token` or similar)
3. **Token Lifetime:** Tokens expire after 30 days (2,592,000 seconds)
4. **Server-Side Access:** The `auth()` function reads the JWT from the cookie and validates it

### Token Structure

The JWT token contains:

```typescript
{
  id: string,        // User ID (added via jwt callback)
  email: string,     // User email
  name: string,      // User name
  // ... standard JWT claims (iat, exp, etc.)
}
```

## Callbacks

### JWT Callback

The JWT callback adds the user ID to the token:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
    }
    return token
  },
  // ...
}
```

**When it runs:**
- On initial sign-in (when `user` object is present)
- On token refresh (when only `token` is present)

**Purpose:** Ensures the user ID is available in the token for later use in the session callback.

### Session Callback

The session callback adds the user ID to the session object:

```typescript
callbacks: {
  // ...
  async session({ session, token }) {
    if (token.id && session.user) {
      session.user.id = token.id as string
    }
    return session
  },
}
```

**When it runs:**
- Every time `auth()` or `useSession()` is called
- Transforms the JWT token data into the session object

**Result:** The session object includes `session.user.id`, making it available throughout the application.

### Type Augmentation

To support the custom `id` field in the session, type augmentation is defined in [`src/@types/next-auth.d.ts`](../src/@types/next-auth.d.ts):

```typescript
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  interface User extends DefaultUser {
    id: string
    email: string
    name?: string | null
    password?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
  }
}
```

This ensures TypeScript recognizes `session.user.id` and `token.id` throughout the codebase.

## Middleware

The middleware (`src/middleware.ts`) protects routes and manages authentication state.

### Route Protection Logic

```typescript
export default auth(req => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isAuthPage = pathname.startsWith('/auth')
  const isPublicPage = pathname === '/'
  const isApiRoute = pathname.startsWith('/api')
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')

  // Allow public assets and API routes
  if (isPublicAsset || isApiRoute) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign-in
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})
```

### Protection Rules

1. **Public Routes:**
   - `/` (landing page)
   - `/api/*` (API routes)
   - `/_next/*` (Next.js internal files)
   - `/favicon.ico` and other static assets

2. **Protected Routes:**
   - All other routes require authentication
   - Unauthenticated users are redirected to `/auth/signin?callbackUrl=<original-url>`

3. **Auth Pages:**
   - `/auth/*` routes are accessible only to unauthenticated users
   - Authenticated users accessing `/auth/*` are redirected to `/dashboard`

### Middleware Matcher

```typescript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

This regex ensures the middleware runs on all routes except:
- API routes (`/api/*`)
- Static files (`/_next/static/*`)
- Image optimization (`/_next/image/*`)
- Files with extensions (`.*\\..*`)

### Example Scenarios

**Scenario 1: Unauthenticated user accessing protected route**

```
Request: GET /dashboard
Middleware: Detects no session → Redirects to /auth/signin?callbackUrl=/dashboard
Result: User sees sign-in page, after login redirects to /dashboard
```

**Scenario 2: Authenticated user accessing auth page**

```
Request: GET /auth/signin
Middleware: Detects valid session → Redirects to /dashboard
Result: User cannot access sign-in page when already logged in
```

**Scenario 3: Authenticated user accessing protected route**

```
Request: GET /dashboard
Middleware: Detects valid session → Allows request
Result: Page renders normally
```

## Sign In

### Client-Side Sign In

The application uses the `signIn` function from `next-auth/react` in the client-side hook [`src/hooks/use-auth.ts`](../src/hooks/use-auth.ts):

```typescript
const login = useCallback(
  async (credentials: AuthData) => {
    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        })

        if (result?.error) {
          notify.error('Invalid email or password')
          return
        }

        if (result?.ok) {
          notify.success('Welcome back!')

          const callbackUrl = searchParams.get('callbackUrl')
          const redirectUrl =
            callbackUrl && callbackUrl !== '/auth/signin'
              ? callbackUrl
              : '/dashboard'

          router.push(redirectUrl)
        }
      } catch (reason) {
        const response =
          reason instanceof Error ? reason.message : 'Unexpected Error'
        notify.error(response)
      }
    })
  },
  [router, searchParams]
)
```

**Key Points:**

1. **`redirect: false`** - Prevents automatic redirect, allowing custom handling
2. **Error Handling** - Shows toast notification on failure
3. **Callback URL** - Reads `callbackUrl` from URL search params and redirects accordingly
4. **Default Redirect** - Falls back to `/dashboard` if no callback URL is present

### Sign-In Form

The sign-in form is located at [`src/features/auth/components/signin-form.tsx`](../src/features/auth/components/signin-form.tsx) and uses the `useSignin` hook:

```typescript
const { onSubmit, isLoading } = useSignin()
```

The hook wraps the `login` function from `useAuth`:

```typescript
export function useSignin() {
  const { login, isLoading } = useAuth()

  const onSubmit = async (data: SignInForm) => {
    await login(data)
  }

  return {
    isLoading,
    onSubmit,
  }
}
```

### Server-Side Sign In

Server-side sign-in can be performed using the exported `signIn` function:

```typescript
import { signIn } from '@/lib/auth'

// Example usage in a server action or API route
await signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
  redirectTo: '/dashboard',
})
```

## Sign Out

The application supports two sign-out patterns:

### Pattern 1: Client Hook (Manual Redirect)

Used in [`src/hooks/use-auth.ts`](../src/hooks/use-auth.ts):

```typescript
const logout = useCallback(async () => {
  startTransition(async () => {
    try {
      await signOut({ redirect: false })
      notify.success('Logged out successfully')
      router.push('/auth/signin')
    } catch (error) {
      console.error('Logout error:', error)
      notify.error('Error logging out')
    }
  })
}, [router])
```

**Features:**
- `redirect: false` - Manual redirect control
- Toast notification on success
- Programmatic navigation to sign-in page

### Pattern 2: Layout Component (Automatic Redirect)

Used in [`src/layout/layout-provider.tsx`](../src/layout/layout-provider.tsx):

```typescript
const handleLogout = useCallback(async () => {
  try {
    await signOut({ redirect: true, callbackUrl: '/auth/signin' })
    toast.success('Logged out successfully')
  } catch (error) {
    toast.error('Failed to logout')
    console.error('Logout error:', error)
  }
}, [])
```

**Features:**
- `redirect: true` - Automatic redirect handled by NextAuth
- `callbackUrl` - Specifies redirect destination
- Toast notification

### What Happens on Sign Out

1. NextAuth clears the session cookie
2. JWT token is invalidated
3. User is redirected to the sign-in page
4. Middleware will now treat the user as unauthenticated

## Register

The registration flow is **separate** from NextAuth's sign-in flow. Users register via a custom API endpoint, then sign in using NextAuth.

### Registration API

**Endpoint:** `POST /api/auth/register`

**Location:** [`src/app/api/auth/register/route.ts`](../src/app/api/auth/register/route.ts)

**Request Body:**

```typescript
{
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "clx1234567890",
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "error": "An account with this email address already exists"
}
```

### Registration Flow

1. **Client submits form** → `SignupForm` component
2. **Validation** → `registerSchema` (Zod) validates:
   - Email format
   - Password minimum length (8 characters)
   - Password confirmation match
   - First and last name presence
3. **API call** → `POST /api/auth/register`
4. **Service layer** → `AuthService.register()`:
   - Checks if email already exists
   - Hashes password with bcrypt (12 rounds)
   - Creates user in database
   - Creates default wallet via `BankAccountService.createDefaultWallet()`
5. **Response** → Returns user data (without password)
6. **Client redirect** → User is redirected to `/auth/signin` (no auto-login)

### Registration Service

Located in [`src/services/auth-service.ts`](../src/services/auth-service.ts):

```typescript
static async register(data: RegisterData) {
  const existingUser = await this.emailExists(data.email)

  if (existingUser) {
    throw new GenericError(
      'An account with this email address already exists'
    )
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  })

  await BankAccountService.createDefaultWallet(user.id)

  return user
}
```

**Security Features:**
- Email normalization (lowercase, trimmed)
- Password hashing with bcrypt (12 rounds)
- Name sanitization (trimmed)
- Email uniqueness check
- Password never returned in response

### Registration Schema

Defined in [`src/lib/schemas.ts`](../src/lib/schemas.ts):

```typescript
export const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
```

## Pages

NextAuth is configured with custom pages:

```typescript
pages: {
  signIn: '/auth/signin',
  signOut: '/auth/signin',
  error: '/auth/error',
}
```

### Sign In Page

**Route:** `/auth/signin`

**Location:** [`src/app/auth/signin/page.tsx`](../src/app/auth/signin/page.tsx)

**Features:**
- Email and password input fields
- Form validation (Zod schema)
- Password visibility toggle
- Link to sign-up page
- Loading states during authentication

**Layout:** Uses `AuthLayout` component with hero section

### Sign Up Page

**Route:** `/auth/signup`

**Location:** [`src/app/auth/signup/page.tsx`](../src/app/auth/signup/page.tsx)

**Features:**
- First name and last name fields
- Email and password fields
- Password confirmation field
- Password strength indicator
- Terms and conditions checkbox
- Link to sign-in page

**Note:** This page is **not** configured in NextAuth's `pages` config because registration uses a custom API endpoint.

### Error Page

**Route:** `/auth/error`

**Location:** [`src/app/auth/error/page.tsx`](../src/app/auth/error/page.tsx)

**Purpose:** Displays user-friendly error messages for authentication failures

**Error Types Handled:**

- `Configuration` - Server configuration problem
- `AccessDenied` - Permission denied
- `Verification` - Token expired or already used
- `CredentialsSignin` - Invalid email or password
- `EmailCreateAccount` - Could not create account with email
- `OAuthCreateAccount` - OAuth account creation failed
- `SessionRequired` - Authentication required
- `Default` - Unexpected error

**Example Error Flow:**

```
User submits invalid credentials
→ NextAuth redirects to /auth/error?error=CredentialsSignin
→ Error page displays: "Invalid email or password. Please check your credentials and try again."
```

## Server-Side Session Usage

### Getting the Current Session

Use the `auth()` function exported from [`src/lib/auth.ts`](../src/lib/auth.ts):

```typescript
import { auth } from '@/lib/auth'

// In a Server Component or API Route
const session = await auth()

if (!session) {
  // User is not authenticated
}

// Access user data
const userId = session.user.id
const userEmail = session.user.email
```

### Example: Protected Layout

Located in [`src/app/(admin)/layout.tsx`](../src/app/(admin)/layout.tsx):

```typescript
export default async function Layout({ children }: PropsWithChildren) {
  const session: Session | null = await auth()

  if (!session) {
    redirect('auth/signin')
  }

  return <AppLayout session={session}>{children}</AppLayout>
}
```

**Note:** This provides a **second layer** of protection in addition to middleware. If middleware fails or is bypassed, the layout ensures authentication.

### Example: Service Layer Usage

Located in [`src/features/dashboard/services/dashboard-service.ts`](../src/features/dashboard/services/dashboard-service.ts):

```typescript
static async getCurrentMonthTransactions(): Promise<Transactions[]> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new GenericError('User not authenticated')
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      // ... other filters
    },
  })

  return transactions
}
```

**Pattern:** Always check `session?.user?.id` before accessing user-specific data.

## Session Validation Service

The application includes a `SessionService` utility for session validation and user data retrieval.

**Location:** [`src/services/session-service.ts`](../src/services/session-service.ts)

### Methods

#### `validateSession()`

Validates the current session and returns user data:

```typescript
const validation = await SessionService.validateSession()

if (validation?.isValid) {
  const userId = validation.user.id
  const userEmail = validation.user.email
}
```

**Returns:** `SessionValidationResult | null`

```typescript
interface SessionValidationResult {
  isValid: boolean
  session: Session
  user: {
    id: string
    email: string
    name: string | null
  }
}
```

#### `getCurrentUser()`

Gets the current authenticated user from the database:

```typescript
const user = await SessionService.getCurrentUser()

if (user) {
  console.log(user.id, user.email, user.createdAt)
}
```

**Returns:** `AuthenticatedUser | null`

```typescript
interface AuthenticatedUser {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}
```

#### `isAuthenticated()`

Quick check if user is authenticated:

```typescript
const isAuth = await SessionService.isAuthenticated()
```

**Returns:** `boolean`

#### `getUserId()`

Extracts user ID from session:

```typescript
const userId = await SessionService.getUserId()
```

**Returns:** `string | null`

### Usage Example

```typescript
import { SessionService } from '@/services/session-service'

// In a server action or API route
export async function myServerAction() {
  const validation = await SessionService.validateSession()

  if (!validation) {
    throw new Error('Unauthorized')
  }

  const userId = validation.user.id
  // Use userId for database queries
}
```

## API Route Handler

The NextAuth API route handler is located at [`src/app/api/auth/[...nextauth]/route.ts`](../src/app/api/auth/[...nextauth]/route.ts):

```typescript
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

**Route Pattern:** `/api/auth/*`

This catch-all route handles all NextAuth endpoints:
- `/api/auth/signin` - Sign-in endpoint
- `/api/auth/signout` - Sign-out endpoint
- `/api/auth/session` - Session endpoint
- `/api/auth/callback/*` - OAuth callback endpoints (if OAuth providers are added)

**HTTP Methods:**
- `GET` - Used for sign-out and session retrieval
- `POST` - Used for sign-in and OAuth callbacks

## Pre-requisites

### Environment Variables

The following environment variables are **recommended/required at runtime** for NextAuth v5 to function properly. These are **not versioned** in the repository (typically stored in `.env.local`):

#### Required

- **`AUTH_SECRET`** - Secret key used to encrypt JWT tokens and cookies
  - Generate with: `openssl rand -base64 32`
  - Example: `AUTH_SECRET=your-secret-key-here`

- **`DATABASE_URL`** - PostgreSQL connection string for Prisma
  - Format: `postgresql://user:password@host:port/database`
  - Example: `DATABASE_URL=postgresql://user:password@localhost:5432/finance_app`

#### Optional

- **`AUTH_URL`** or **`NEXTAUTH_URL`** - Base URL of your application
  - Required in production
  - Example: `AUTH_URL=https://yourdomain.com`
  - Example: `NEXTAUTH_URL=https://yourdomain.com` (legacy name, still supported)

- **`NODE_ENV`** - Environment mode
  - Values: `development`, `production`, `test`
  - Affects debug logging and error formatting

### Example `.env.local`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finance_app

# NextAuth
AUTH_SECRET=your-generated-secret-key-here
AUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Security Notes

1. **Never commit `.env.local`** - Contains sensitive credentials
2. **Use strong `AUTH_SECRET`** - Minimum 32 characters, randomly generated
3. **Use HTTPS in production** - Required for secure cookie transmission
4. **Rotate secrets periodically** - Change `AUTH_SECRET` if compromised

## Summary

This application implements a complete authentication system using NextAuth v5 with:

- **Credentials Provider** for email/password authentication
- **JWT Session Strategy** with 30-day expiration
- **PrismaAdapter** for database integration (User, Account, Session models)
- **Middleware Protection** for route access control
- **Custom Registration API** separate from NextAuth sign-in
- **Type-safe Session** with custom `user.id` field
- **Server and Client-side** authentication utilities

The authentication flow ensures secure password storage (bcrypt), session management (JWT cookies), and comprehensive route protection through middleware and layout-level checks.
