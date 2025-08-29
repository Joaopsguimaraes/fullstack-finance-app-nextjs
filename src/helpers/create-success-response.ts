import { type ApiResponse } from '../@types/api-response'

export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      message,
    } as ApiResponse<T>),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
