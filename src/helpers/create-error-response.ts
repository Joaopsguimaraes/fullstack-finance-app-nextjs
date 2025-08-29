import { type ApiResponse } from '../@types/api-response'

export function createErrorResponse(
  message: string,
  status: number = 500
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      message,
    } as ApiResponse),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
