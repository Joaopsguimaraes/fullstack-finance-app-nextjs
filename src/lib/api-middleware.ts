import { SessionService } from '@/services/session-service'
import type { NextRequest } from 'next/server'
import { type AuthenticatedApiHandler } from '../@types/authenticated-api-handler'
import { type AuthenticatedDynamicApiHandler } from '../@types/authenticated-dynamic-api-handler'
import { createErrorResponse } from '../helpers/create-error-response'

/**
 * Middleware wrapper for API routes that require authentication.
 *
 * Validates the user's session before invoking the provided handler.
 * Returns a 401 error response if authentication fails.
 *
 * @param handler - The API route handler to be protected by authentication.
 * @returns A function that handles the request with authentication validation.
 *
 * @example
 * import { withAuth } from '@/lib/api-middleware'
 * import type { AuthenticatedApiHandler } from '@/@types/authenticated-api-handler'
 *
 * const myHandler: AuthenticatedApiHandler = async (req, context) => {
 *   // Your authenticated logic here
 *   return new Response(JSON.stringify({ user: context.user }))
 * }
 *
 * export const POST = withAuth(myHandler)
 */

export function withAuth(handler: AuthenticatedApiHandler) {
  return async (req: NextRequest, params?: unknown): Promise<Response> => {
    try {
      const validation = await SessionService.validateSession()

      if (!validation) {
        return createErrorResponse('Authentication required', 401)
      }

      return await handler(
        req,
        {
          user: validation.user,
          session: validation.session,
        },
        params
      )
    } catch (error) {
      console.error('API middleware error:', error)
      return createErrorResponse('Internal server error', 500)
    }
  }
}

/**
 * Middleware wrapper for dynamic API routes that require authentication.
 *
 * Validates the user's session before invoking the provided handler.
 * Returns a 401 error response if authentication fails.
 *
 * @param handler - The dynamic API route handler to be protected by authentication.
 * @returns A function that handles the request with authentication validation and dynamic route parameters.
 *
 * @example
 * import { withAuthDynamic } from '@/lib/api-middleware'
 * import type { AuthenticatedDynamicApiHandler } from '@/@types/authenticated-dynamic-api-handler'
 *
 * const myDynamicHandler: AuthenticatedDynamicApiHandler = async (req, context, routeParams) => {
 *   // Your authenticated logic here
 *   const params = await routeParams.params
 *   return new Response(JSON.stringify({ user: context.user, params }))
 * }
 *
 * export const GET = withAuthDynamic(myDynamicHandler)
 */
export function withAuthDynamic(handler: AuthenticatedDynamicApiHandler) {
  return async (
    req: NextRequest,
    routeParams: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    try {
      const validation = await SessionService.validateSession()

      if (!validation) {
        return createErrorResponse('Authentication required', 401)
      }

      return await handler(
        req,
        {
          user: validation.user,
          session: validation.session,
        },
        routeParams
      )
    } catch (error) {
      console.error('API middleware error:', error)
      return createErrorResponse('Internal server error', 500)
    }
  }
}
