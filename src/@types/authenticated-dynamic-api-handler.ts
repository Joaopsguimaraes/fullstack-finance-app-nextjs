import { type Session } from 'next-auth'
import { type NextRequest } from 'next/server'

export type AuthenticatedDynamicApiHandler = (
  req: NextRequest,
  context: {
    user: Session['user']
    session: unknown
  },
  routeParams: { params: Promise<Record<string, string>> }
) => Promise<Response>
