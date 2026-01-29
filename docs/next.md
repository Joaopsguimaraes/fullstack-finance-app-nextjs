# Next.js Documentation

## Library and Version

This application uses **Next.js 16.1.3** with the **App Router** architecture.

**Key Configuration:**
- Framework: Next.js 16.1.3
- React: 19.1.0
- Build Tool: Turbopack (enabled by default in Next.js 16)
- TypeScript: Enabled (5.9.3)

**Development Scripts:**
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

**Note:** In Next.js 16, Turbopack is enabled by default for `next dev` and `next build`, so the `--turbopack` flag is no longer needed.

**Configuration File:** [`next.config.ts`](../next.config.ts)

Currently, the configuration is minimal with no custom settings. The framework uses default App Router conventions.

## Framework Conventions and Standards

This project follows Next.js App Router conventions:

### File-Based Routing

- **Pages**: `src/app/**/page.tsx` - Defines route segments
- **Layouts**: `src/app/**/layout.tsx` - Shared UI for route segments
- **Loading States**: `src/app/**/loading.tsx` - Loading UI boundaries
- **Error Boundaries**: `src/app/**/error.tsx` - Error UI boundaries
- **Route Handlers**: `src/app/api/**/route.ts` - API endpoints

### Route Groups

Route groups (parentheses) organize routes without affecting URL structure:

- `(admin)` - Groups protected admin routes (`/dashboard`, `/transactions`)
- Routes inside groups don't appear in the URL path

**Example Structure:**
```
src/app/
├── (admin)/
│   ├── layout.tsx          # Protected layout wrapper
│   ├── loading.tsx         # Loading state for admin routes
│   ├── dashboard/
│   │   └── page.tsx        # /dashboard route
│   └── transactions/
│       └── page.tsx        # /transactions route
├── auth/
│   ├── layout.tsx          # Auth-specific layout
│   ├── signin/
│   │   └── page.tsx        # /auth/signin route
│   └── signup/
│       └── page.tsx        # /auth/signup route
└── layout.tsx              # Root layout
```

## Routing

### App Router Architecture

The application uses Next.js App Router (not Pages Router). All routes are defined in the `src/app` directory.

### Route Structure

**Public Routes:**
- `/` - Landing page (redirects to `/dashboard`)
- `/auth/signin` - Sign-in page
- `/auth/signup` - Registration page
- `/auth/error` - Authentication error page

**Protected Routes:**
- `/dashboard` - Dashboard page (requires authentication)
- `/transactions` - Transactions page (requires authentication)

**API Routes:**
- `/api/auth/[...nextauth]` - NextAuth catch-all handler
- `/api/auth/register` - Custom registration endpoint
- `/api/bank-account` - Bank account CRUD operations
- `/api/bank-account/[id]` - Bank account by ID operations
- `/api/transaction` - Transaction CRUD operations
- `/api/transaction/[id]` - Transaction by ID operations

### Route Protection

Route protection is implemented at two levels:

#### 1. Proxy Protection (Middleware)

**File:** [`src/proxy.ts`](../src/proxy.ts)

**Note:** In Next.js 16, `middleware` has been renamed to `proxy` to clarify network boundaries. The functionality remains the same.

The proxy runs on every request and enforces authentication rules:

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

  // Allow public assets and API routes to pass through
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

**Proxy Matcher:**
```typescript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

This ensures proxy runs on all routes except:
- API routes (`/api/*`)
- Static files (`/_next/static/*`)
- Image optimization (`/_next/image/*`)
- Files with extensions (`.*\\..*`)

#### 2. Layout-Level Protection

**File:** [`src/app/(admin)/layout.tsx`](../src/app/(admin)/layout.tsx)

Provides a second layer of protection for admin routes:

```typescript
export default async function Layout({ children }: PropsWithChildren) {
  const session: Session | null = await auth()

  if (!session) {
    redirect('auth/signin')
  }

  return <AppLayout session={session}>{children}</AppLayout>
}
```

This ensures that even if middleware is bypassed, protected routes require authentication.

### Dynamic Routes

Dynamic routes use bracket notation:

- `/api/bank-account/[id]/route.ts` - Handles `/api/bank-account/:id`
- `/api/transaction/[id]/route.ts` - Handles `/api/transaction/:id`

**Example:** [`src/app/api/bank-account/[id]/route.ts`](../src/app/api/bank-account/[id]/route.ts)

```typescript
export const GET = withAuthDynamic(async (_: Request, { user }, { params }) => {
  const { id } = await params  // Next.js 16: params is async
  // ... handler logic
})
```

**Important:** In Next.js 16, route parameters are asynchronous and must be awaited. This pattern was introduced in Next.js 15 and continues in Next.js 16.

### Navigation

Client-side navigation uses Next.js `Link` component and `useRouter`:

**Example:** [`src/app/auth/signin/page.tsx`](../src/app/auth/signin/page.tsx)

```typescript
import Link from 'next/link'

<Link href='/auth/signup'>Sign up</Link>
```

**Programmatic Navigation:**

```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/dashboard')
```

## Client Components

Client Components are React components that run in the browser. They must be explicitly marked with `'use client'`.

### When to Use Client Components

Client Components are used for:
- Interactive UI (forms, buttons, modals)
- Browser APIs (localStorage, window, document)
- React hooks (`useState`, `useEffect`, `useContext`)
- Event handlers (`onClick`, `onChange`)
- Third-party libraries that require client-side execution

### Identifying Client Components

Look for the `'use client'` directive at the top of the file:

```typescript
'use client'

import { useState } from 'react'

export function MyComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Client Component Examples in This Repo

**1. Providers (Session, Query, Theme):**

**File:** [`src/providers/session-provider.tsx`](../src/providers/session-provider.tsx)

```typescript
'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
```

**File:** [`src/providers/query-provider.tsx`](../src/providers/query-provider.tsx)

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 60 * 1000, retry: 1 }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**2. Forms:**

**File:** [`src/features/auth/components/signin-form.tsx`](../src/features/auth/components/signin-form.tsx)

```typescript
'use client'

export function SigninForm() {
  const form = useForm<AuthData>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' }
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* form fields */}
      </form>
    </Form>
  )
}
```

**3. Layout Components:**

**File:** [`src/layout/layout-provider.tsx`](../src/layout/layout-provider.tsx)

```typescript
'use client'

export function LayoutProvider({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // ... interactive layout logic
}
```

**4. Custom Hooks:**

**File:** [`src/hooks/use-auth.ts`](../src/hooks/use-auth.ts)

```typescript
'use client'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  // ... authentication logic
}
```

### Client Component Boundaries

The `'use client'` directive creates a boundary. All imported components below this boundary become Client Components unless they have their own `'use server'` directive.

**Pattern:** Keep Client Components as leaf nodes when possible. Pass Server Component data as props.

## Server Components

Server Components are the default in Next.js App Router. They run on the server and are not sent to the client.

### When to Use Server Components

Server Components are used for:
- Data fetching (database queries, API calls)
- Accessing backend resources (file system, environment variables)
- Keeping sensitive data on the server (API keys, tokens)
- Reducing client-side JavaScript bundle size
- Direct database access without API routes

### Identifying Server Components

Server Components are components **without** the `'use client'` directive:

```typescript
// This is a Server Component (no 'use client')
import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()
  const data = await fetchData()
  return <Dashboard data={data} />
}
```

### Server Component Examples in This Repo

**1. Page Components:**

**File:** [`src/app/(admin)/dashboard/page.tsx`](../src/app/(admin)/dashboard/page.tsx)

```typescript
import { DashboardService } from '@/features/dashboard'

export default async function DashboardPage() {
  const dashboardData = await DashboardService.getDashboardData()

  const stats = transformApiStatsData(dashboardData.stats)
  const recentTransactions = transformApiTransactionData(
    dashboardData.recentTransactions
  )

  return (
    <Dashboard
      stats={stats}
      recentTransactions={recentTransactions}
      chartData={dashboardData.chartData}
    />
  )
}
```

**2. Layout Components:**

**File:** [`src/app/layout.tsx`](../src/app/layout.tsx)

```typescript
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Finance App - Take Control of Your Finances',
  description: 'A modern, secure, and intuitive finance management app...',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${openSans.variable} antialiased`}>
        <ThemeProvider>
          <SessionProvider>
            <QueryProvider>
              {children}
              <SonnerProvider />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**3. Protected Layout:**

**File:** [`src/app/(admin)/layout.tsx`](../src/app/(admin)/layout.tsx)

```typescript
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Layout({ children }) {
  const session = await auth()

  if (!session) {
    redirect('auth/signin')
  }

  return <AppLayout session={session}>{children}</AppLayout>
}
```

**4. Service Layer (Server-Side):**

**File:** [`src/features/dashboard/services/dashboard-service.ts`](../src/features/dashboard/services/dashboard-service.ts)

```typescript
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export class DashboardService {
  static async getCurrentMonthTransactions() {
    const session = await auth()
    if (!session?.user?.id) {
      throw new GenericError('User not authenticated')
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      // ... query logic
    })

    return transactions
  }
}
```

### Server Component Patterns

**1. Async Data Fetching:**

Server Components can be `async` and directly await promises:

```typescript
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  return <div>{json.title}</div>
}
```

**2. Direct Database Access:**

Server Components can directly access the database:

```typescript
import { prisma } from '@/lib/prisma'

export default async function Page() {
  const users = await prisma.user.findMany()
  return <UserList users={users} />
}
```

**3. Server-Only Utilities:**

Server Components can use server-only utilities:

```typescript
import { auth } from '@/lib/auth'
import { cookies } from 'next/headers'

export default async function Page() {
  const session = await auth()
  const cookieStore = await cookies()
  // ... server-only logic
}
```

## SSR (Server-Side Rendering)

SSR in Next.js App Router happens automatically for Server Components. Pages are rendered on the server for each request.

### How SSR Works in This Repo

**1. Page Rendering:**

When a user requests `/dashboard`:

1. Proxy (middleware) runs and validates authentication
2. Server Component (`dashboard/page.tsx`) executes on the server
3. Data fetching occurs (`DashboardService.getDashboardData()`)
4. HTML is generated on the server
5. HTML is sent to the client
6. React hydrates the page on the client

**Example:** [`src/app/(admin)/dashboard/page.tsx`](../src/app/(admin)/dashboard/page.tsx)

```typescript
export default async function DashboardPage() {
  // This runs on the server for each request
  const dashboardData = await DashboardService.getDashboardData()

  return <Dashboard {...dashboardData} />
}
```

**2. Route Handler Rendering:**

Route handlers (`route.ts`) are server-side by default:

**File:** [`src/app/api/bank-account/route.ts`](../src/app/api/bank-account/route.ts)

```typescript
export const GET = withAuth(async (request, { user }) => {
  // This runs on the server
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { userId: user.id }
  })
  return createSuccessResponse(bankAccounts)
})
```

### SSR Benefits

- **SEO:** Content is available in initial HTML
- **Performance:** Initial page load includes data
- **Security:** Sensitive operations stay on the server
- **Data Freshness:** Each request fetches fresh data

### SSR Considerations

- **Latency:** Each request waits for server processing
- **Server Load:** More server resources required
- **Caching:** Use Next.js caching strategies to optimize

## SSG (Static Site Generation)

**Status:** SSG is **not currently used** in this application.

### When SSG Would Be Appropriate

SSG is ideal for:
- Content that doesn't change frequently (blog posts, documentation)
- Public pages that don't require authentication
- Marketing pages, landing pages
- Pages that can be pre-rendered at build time

### How to Implement SSG

To enable SSG in Next.js App Router, use `generateStaticParams` for dynamic routes:

```typescript
// Example: If we had a blog with dynamic routes
export async function generateStaticParams() {
  const posts = await prisma.post.findMany()
  return posts.map(post => ({ slug: post.slug }))
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })
  return <article>{post.content}</article>
}
```

### Revalidation

For ISR (Incremental Static Regeneration), use `revalidate`:

```typescript
export const revalidate = 3600 // Revalidate every hour

export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### Why SSG Isn't Used Here

This application requires:
- **User-specific data** (dashboard, transactions)
- **Authentication** (protected routes)
- **Dynamic content** (real-time financial data)
- **Server-side session validation**

These requirements make SSR more appropriate than SSG.

## Server Actions

**Status:** Server Actions are **not currently used** in this application.

### What Are Server Actions?

Server Actions are functions that run on the server and can be called directly from Client Components. They use the `'use server'` directive.

### Current Pattern: Route Handlers

Instead of Server Actions, this application uses **Route Handlers** (`route.ts` files):

**Example:** [`src/app/api/bank-account/route.ts`](../src/app/api/bank-account/route.ts)

```typescript
export const POST = withAuth(async (request, { user }) => {
  const body = await request.json()
  const validatedData = createBankAccountSchema.parse(body)

  const result = await prisma.bankAccount.create({
    data: { ...validatedData, userId: user.id }
  })

  return createSuccessResponse(result, 201)
})
```

**Client-side usage:**

```typescript
const response = await fetch('/api/bank-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

### When to Use Server Actions

Server Actions are ideal for:
- Form submissions without API routes
- Mutations that don't need REST endpoints
- Simpler client-server communication
- Progressive enhancement (forms work without JavaScript)

### Example: How Server Actions Could Be Used

If migrating to Server Actions, the pattern would be:

**Server Action:**

```typescript
// app/actions/bank-account.ts
'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function createBankAccount(data: BankAccountData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const result = await prisma.bankAccount.create({
    data: { ...data, userId: session.user.id }
  })

  return result
}
```

**Client Component:**

```typescript
'use client'

import { createBankAccount } from '@/app/actions/bank-account'

export function BankAccountForm() {
  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData)
    await createBankAccount(data)
  }

  return <form action={handleSubmit}>...</form>
}
```

### Recommendation

For this application, **Route Handlers are appropriate** because:
- They provide explicit API endpoints
- They're easier to test and debug
- They support standard HTTP methods (GET, POST, PUT, DELETE)
- They're compatible with external API consumers

Consider Server Actions if:
- You want to simplify form handling
- You need progressive enhancement
- You prefer fewer API route files

## Recommendations

### 1. Use Server Components by Default

Start with Server Components and only add `'use client'` when necessary:

```typescript
// ✅ Good: Server Component (default)
export default async function Page() {
  const data = await fetchData()
  return <DataDisplay data={data} />
}

// ❌ Avoid: Unnecessary Client Component
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
  return <DataDisplay data={data} />
}
```

### 2. Keep Client Components as Leaf Nodes

Pass Server Component data as props to Client Components:

```typescript
// ✅ Good: Server Component passes data to Client Component
export default async function Page() {
  const data = await fetchData()
  return <InteractiveChart data={data} />
}

// ❌ Avoid: Client Component fetching data
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => { fetchData().then(setData) }, [])
  return <InteractiveChart data={data} />
}
```

### 3. Use Dynamic Imports for Code Splitting

Use `next/dynamic` for large components:

**Example:** [`src/app/(admin)/dashboard/page.tsx`](../src/app/(admin)/dashboard/page.tsx)

```typescript
import dynamic from 'next/dynamic'

const Dashboard = dynamic(() =>
  import('@/features/dashboard').then(mod => ({
    default: mod.Dashboard,
  }))
)

export default async function DashboardPage() {
  const data = await DashboardService.getDashboardData()
  return <Dashboard {...data} />
}
```

**Example:** [`src/app/(admin)/transactions/page.tsx`](../src/app/(admin)/transactions/page.tsx)

```typescript
const Transactions = dynamic(
  () => import('@/features/transactions/components/transactions'),
  {
    loading: () => <LoadingCard variant='skeleton' title='Transactions' />,
  }
)
```

### 4. Use Suspense for Loading States

Wrap dynamic components with Suspense:

**Example:** [`src/app/(admin)/transactions/page.tsx`](../src/app/(admin)/transactions/page.tsx)

```typescript
import { Suspense } from 'react'

export default function TransactionsPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Transactions />
    </Suspense>
  )
}
```

### 5. Leverage Route Groups for Organization

Use route groups `(name)` to organize routes without affecting URLs:

```
app/
├── (admin)/
│   ├── layout.tsx      # Admin-specific layout
│   ├── dashboard/
│   └── transactions/
└── (marketing)/
    ├── layout.tsx       # Marketing-specific layout
    ├── about/
    └── contact/
```

### 6. Use Proxy (Middleware) for Cross-Cutting Concerns

Proxy (formerly middleware) is ideal for:
- Authentication checks
- Redirects
- Request/response modification
- Logging

**Example:** [`src/proxy.ts`](../src/proxy.ts)

**Note:** In Next.js 16, `middleware.ts` has been renamed to `proxy.ts` to clarify network boundaries. The `auth()` wrapper pattern from NextAuth.js v5 continues to work correctly.

### 7. Type-Safe Route Parameters

Use TypeScript for route parameters:

```typescript
type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  // TypeScript knows id is a string
}
```

### 8. Optimize Font Loading

Use `next/font/google` for optimized font loading:

**Example:** [`src/app/layout.tsx`](../src/app/layout.tsx)

```typescript
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})
```

## What to Avoid

### 1. Don't Mix Server and Client Code

**❌ Avoid:**

```typescript
'use client'
export default function Page() {
  const data = await fetch('/api/data')  // ❌ Can't await in Client Component
  return <div>{data}</div>
}
```

**✅ Correct:**

```typescript
export default async function Page() {
  const data = await fetchData()  // ✅ Server Component
  return <div>{data}</div>
}
```

### 2. Don't Use Browser APIs in Server Components

**❌ Avoid:**

```typescript
export default function Page() {
  const [data, setData] = useState(null)  // ❌ useState is client-only
  useEffect(() => { ... })                 // ❌ useEffect is client-only
  return <div>{data}</div>
}
```

**✅ Correct:**

```typescript
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => { ... })
  return <div>{data}</div>
}
```

### 3. Don't Fetch Data in Client Components When Server Components Can Do It

**❌ Avoid:**

```typescript
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
  return <div>{data}</div>
}
```

**✅ Correct:**

```typescript
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### 4. Don't Expose Sensitive Data to Client

**❌ Avoid:**

```typescript
'use client'
export default function Page() {
  const apiKey = process.env.API_KEY  // ❌ Won't work, and if it did, exposes secrets
  return <div>{apiKey}</div>
}
```

**✅ Correct:**

```typescript
export default async function Page() {
  const apiKey = process.env.API_KEY  // ✅ Server-only
  const data = await fetchData(apiKey)
  return <div>{data}</div>
}
```

### 5. Don't Use `getServerSideProps` or `getStaticProps`

These are Pages Router APIs. In App Router, use Server Components:

**❌ Avoid:**

```typescript
export async function getServerSideProps() {
  return { props: { data: await fetchData() } }
}
```

**✅ Correct:**

```typescript
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### 6. Don't Use `useRouter` from `next/router`

Use `next/navigation` instead:

**❌ Avoid:**

```typescript
import { useRouter } from 'next/router'  // ❌ Pages Router API
```

**✅ Correct:**

```typescript
import { useRouter } from 'next/navigation'  // ✅ App Router API
```

### 7. Don't Forget to Await Async Params

In Next.js 16, route parameters are async (this was introduced in Next.js 15):

**❌ Avoid:**

```typescript
export default function Page({ params }) {
  const { id } = params  // ❌ params is a Promise
  return <div>{id}</div>
}
```

**✅ Correct:**

```typescript
export default async function Page({ params }) {
  const { id } = await params  // ✅ Await the Promise
  return <div>{id}</div>
}
```

**Note:** This applies to `params`, `searchParams`, `headers`, `cookies`, and `draftMode` in Next.js 16. All these APIs are now fully async and must be awaited.

## How to Use the Framework Correctly

### 1. Component Composition Pattern

**Server Component fetches data, Client Component handles interaction:**

```typescript
// Server Component (page.tsx)
export default async function Page() {
  const data = await fetchData()
  return <InteractiveComponent data={data} />
}

// Client Component (component.tsx)
'use client'
export function InteractiveComponent({ data }) {
  const [state, setState] = useState(data)
  return <button onClick={() => setState(...)}>{state}</button>
}
```

### 2. Data Fetching Pattern

**Fetch data in Server Components or Route Handlers:**

```typescript
// Server Component
export default async function Page() {
  const session = await auth()
  const data = await prisma.user.findMany({
    where: { id: session.user.id }
  })
  return <UserList users={data} />
}

// Route Handler
export const GET = async (request: Request) => {
  const data = await fetchData()
  return Response.json(data)
}
```

### 3. Authentication Pattern

**Use `auth()` in Server Components, `useSession()` in Client Components:**

```typescript
// Server Component
import { auth } from '@/lib/auth'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  return <ProtectedContent />
}

// Client Component
'use client'
import { useSession } from 'next-auth/react'

export function Component() {
  const { data: session } = useSession()
  if (!session) return <div>Not authenticated</div>
  return <div>Authenticated</div>
}
```

### 4. Error Handling Pattern

**Use error boundaries and try-catch:**

```typescript
// error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

// page.tsx
export default async function Page() {
  try {
    const data = await fetchData()
    return <Content data={data} />
  } catch (error) {
    throw error  // Caught by error.tsx
  }
}
```

### 5. Loading State Pattern

**Use `loading.tsx` and Suspense:**

```typescript
// loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}

// page.tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncContent />
    </Suspense>
  )
}
```

### 6. Metadata Pattern

**Export metadata from Server Components:**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
}

export default function Page() {
  return <div>Content</div>
}
```

## Patterns and Principles

### 1. Server-First Architecture

**Principle:** Prefer Server Components for data fetching and business logic.

**Benefits:**
- Reduced client bundle size
- Better security (secrets stay on server)
- Improved performance (no client-side data fetching delay)
- Better SEO (content in initial HTML)

### 2. Progressive Enhancement

**Principle:** Build functionality that works without JavaScript, then enhance with Client Components.

**Example:** Forms can submit via Server Actions without JavaScript, then enhanced with client-side validation.

### 3. Colocation

**Principle:** Keep related files together.

**Structure:**
```
features/
├── dashboard/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── types.ts
```

### 4. Separation of Concerns

**Principle:** Separate data fetching (Server Components) from interactivity (Client Components).

**Pattern:**
- Server Components: Data fetching, business logic
- Client Components: User interaction, state management
- Route Handlers: API endpoints, mutations

### 5. Type Safety

**Principle:** Use TypeScript for type safety across Server and Client boundaries.

**Example:**
```typescript
// Shared types
export type User = {
  id: string
  email: string
  name: string
}

// Server Component
export default async function Page(): Promise<JSX.Element> {
  const user: User = await getUser()
  return <UserProfile user={user} />
}

// Client Component
'use client'
export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

### 6. Caching Strategy

**Principle:** Use Next.js caching appropriately.

**Patterns:**
- **Uncached:** User-specific, real-time data (current implementation)
- **Time-based revalidation:** `revalidate` option
- **On-demand revalidation:** `revalidatePath`, `revalidateTag`

### 7. Route Protection Layering

**Principle:** Use multiple layers of protection.

**Implementation:**
1. Proxy (middleware): First line of defense
2. Layout guards: Second layer
3. Service layer: Business logic validation

**Example:** [`src/proxy.ts`](../src/proxy.ts) + [`src/app/(admin)/layout.tsx`](../src/app/(admin)/layout.tsx)

### 8. Dynamic Imports for Code Splitting

**Principle:** Load components only when needed.

**Example:** [`src/app/(admin)/dashboard/page.tsx`](../src/app/(admin)/dashboard/page.tsx)

```typescript
const Dashboard = dynamic(() => import('@/features/dashboard'))
```

### 9. Suspense Boundaries

**Principle:** Use Suspense for better loading UX.

**Example:** [`src/app/(admin)/transactions/page.tsx`](../src/app/(admin)/transactions/page.tsx)

```typescript
<Suspense fallback={<LoadingCard />}>
  <Transactions />
</Suspense>
```

### 10. Error Boundaries

**Principle:** Handle errors gracefully at appropriate levels.

**Implementation:**
- `error.tsx` for route-level errors
- Try-catch in Server Components
- Error handling in Route Handlers

## Next.js 16 Notes

This application has been upgraded to **Next.js 16.1.3**. The following notes document the key changes and patterns:

### App Router Stability

The App Router is stable and recommended for new projects. Next.js 16 continues to refine App Router features with some breaking changes that have been addressed in this application.

### Breaking Changes in Next.js 16

#### 1. Middleware → Proxy Rename

**Change:** `middleware.ts` has been renamed to `proxy.ts` to clarify network boundaries.

**Migration:** The file [`src/middleware.ts`](../src/middleware.ts) has been renamed to [`src/proxy.ts`](../src/proxy.ts). The `auth()` wrapper pattern from NextAuth.js v5 continues to work correctly.

**Configuration:** The `skipMiddlewareUrlNormalize` option in `next.config.ts` has been renamed to `skipProxyUrlNormalize` (not currently used in this project).

#### 2. Turbopack Default

**Change:** Turbopack is now enabled by default for `next dev` and `next build`.

**Migration:** Removed `--turbopack` flags from package.json scripts. Turbopack configuration can now be set at the top level of `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  turbopack: {
    // options
  },
}
```

#### 3. Async Request APIs

**Change:** In Next.js 16, async request APIs (`cookies`, `headers`, `draftMode`, `params`, `searchParams`) are now fully async and must be awaited. Synchronous access has been removed.

**Status:** This application was already using the async pattern (`await params`), so no changes were needed.

**Example:**
```typescript
// ✅ Correct (already implemented)
export default async function Page({ params }) {
  const { id } = await params
  return <div>{id}</div>
}
```

#### 4. Build Output Changes

**Change:** Next.js 16 removes `size` and `First Load JS` metrics from build output as they were inaccurate with React Server Components.

**Impact:** No code changes needed. Use tools like Chrome Lighthouse or Vercel Analytics for accurate performance metrics.

### Server Components

Server Components remain the default and recommended approach for data fetching. All patterns used in this application continue to be valid in Next.js 16.

### Route Handlers

Route Handlers continue to be the standard way to create API endpoints. The async `params` pattern is required and properly implemented throughout this application.

### Proxy (Middleware)

The proxy (formerly middleware) implementation uses NextAuth.js v5's `auth()` wrapper, which is fully compatible with Next.js 16. The authentication and route protection logic remains unchanged.

### ESLint Configuration

**Change:** Next.js 16 uses ESLint flat config format natively. The `eslint-config-next` package now exports flat config arrays directly.

**Migration:** Updated [`eslint.config.mjs`](../eslint.config.mjs) to use native flat config exports instead of `FlatCompat`:

```typescript
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  // ... other configs
]
```

### Caching and Revalidation

Next.js 16 maintains the same caching strategies:
- `fetch` caching options
- `revalidatePath` and `revalidateTag` for on-demand revalidation
- `generateStaticParams` for static generation

### TypeScript Support

TypeScript support continues to improve. The application uses TypeScript 5.9.3 with all type-safe patterns (async params, route handlers) working correctly.

### Performance Improvements

Next.js 16 includes significant performance optimizations for `next dev` and `next start` commands, along with improved terminal output and error messages.

### Recommendations for Next.js 16

1. **Continue using Server Components by default** - This remains the recommended pattern
2. **Leverage Route Handlers for APIs** - Consistent with Next.js 15 patterns
3. **Use dynamic imports strategically** - Continue code splitting practices
4. **Implement proper error boundaries** - Error handling patterns remain consistent
5. **Follow App Router conventions** - File-based routing and conventions continue
6. **Use native ESLint flat config** - Avoid `FlatCompat` for Next.js configs when possible

### Migration Status

✅ **Completed Upgrades:**
- Next.js: 15.5.0 → 16.1.3
- Middleware renamed to Proxy
- Turbopack flags removed (now default)
- ESLint config migrated to native flat config
- All async request APIs properly awaited
- Type checking and build verification passed

**Reference:** For detailed migration information, see the [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16).

## Summary

This application uses **Next.js 16.1.3** with the App Router architecture:

- **Routing:** File-based routing with route groups for organization
- **Server Components:** Default for data fetching and page rendering
- **Client Components:** Used for interactivity, forms, and browser APIs
- **SSR:** Automatic server-side rendering for all pages
- **SSG:** Not used (application requires user-specific, dynamic content)
- **Server Actions:** Not used (Route Handlers preferred)
- **Proxy (Middleware):** Authentication and route protection (renamed from middleware in Next.js 16)
- **Build Tool:** Turbopack (enabled by default in Next.js 16)
- **Patterns:** Server-first architecture, progressive enhancement, type safety

### Key Next.js 16 Features

- **Turbopack Default:** Enabled by default for faster development and builds
- **Proxy:** Middleware renamed to proxy for clearer network boundary semantics
- **Async APIs:** All request APIs (`params`, `headers`, `cookies`, etc.) are fully async
- **ESLint Flat Config:** Native support for ESLint flat config format
- **Performance:** Improved dev server and build performance

The implementation follows Next.js 16 best practices and has been fully migrated from Next.js 15.5.0.
