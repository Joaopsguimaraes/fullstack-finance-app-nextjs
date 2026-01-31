import { type AuthenticatedApiHandler } from '@/@types/authenticated-api-handler'
import { createErrorResponse } from '@/helpers/create-error-response'
import { withAuth } from '@/lib/api-middleware'
import { createCategorySchema } from '@/lib/schemas'
import { CategoryService } from '@/services/category-service'

const getHandler: AuthenticatedApiHandler = async (_req, context) => {
  try {
    const categories = await CategoryService.getUserCategories(context.user.id)

    return Response.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return createErrorResponse('Failed to fetch categories', 500)
  }
}

const postHandler: AuthenticatedApiHandler = async (req, context) => {
  try {
    const body = await req.json()
    const validatedData = createCategorySchema.parse(body)

    const category = await CategoryService.createCategory(
      context.user.id,
      validatedData.name
    )

    return Response.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Category already exists') {
        return createErrorResponse(error.message, 409)
      }
    }

    console.error('Failed to create category:', error)
    return createErrorResponse('Failed to create category', 500)
  }
}

export const GET = withAuth(getHandler)
export const POST = withAuth(postHandler)
