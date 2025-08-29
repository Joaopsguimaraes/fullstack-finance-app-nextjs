import { type Session } from 'next-auth'
import { type NextRequest } from 'next/server'

export type AuthenticatedApiHandler = (
  req: NextRequest,
  context: {
    user: Session['user']
    session: unknown
  },
  params?: unknown
) => Promise<Response>
