import { type AuthenticatedDynamicApiHandler } from '@/@types/authenticated-dynamic-api-handler'
import { createErrorResponse } from '@/helpers/create-error-response'
import { withAuthDynamic } from '@/lib/api-middleware'
import { updateCategorySchema } from '@/lib/schemas'
import { CategoryService } from '@/services/category-service'

const getHandler: AuthenticatedDynamicApiHandler = async (
  _req,
  context,
  routeParams
) => {
  try {
    const { id } = await routeParams.params

    const category = await CategoryService.getCategoryById(id, context.user.id)

    if (!category) {
      return createErrorResponse('Category not found', 404)
    }

    return Response.json(category)
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return createErrorResponse('Failed to fetch category', 500)
  }
}

const putHandler: AuthenticatedDynamicApiHandler = async (
  req,
  context,
  routeParams
) => {
  try {
    const { id } = await routeParams.params
    const body = await req.json()
    const validatedData = updateCategorySchema.parse(body)

    const category = await CategoryService.updateCategory(
      id,
      context.user.id,
      validatedData.name
    )

    return Response.json(category)
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Category not found' ||
        error.message === 'Cannot modify system categories'
      ) {
        return createErrorResponse(error.message, 403)
      }
      if (error.message === 'Category name already exists') {
        return createErrorResponse(error.message, 409)
      }
    }

    console.error('Failed to update category:', error)
    return createErrorResponse('Failed to update category', 500)
  }
}

const deleteHandler: AuthenticatedDynamicApiHandler = async (
  _req,
  context,
  routeParams
) => {
  try {
    const { id } = await routeParams.params

    await CategoryService.deleteCategory(id, context.user.id)

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Category not found' ||
        error.message === 'Cannot delete system categories'
      ) {
        return createErrorResponse(error.message, 403)
      }
      if (
        error.message === 'Cannot delete category that is used by transactions'
      ) {
        return createErrorResponse(error.message, 409)
      }
    }

    console.error('Failed to delete category:', error)
    return createErrorResponse('Failed to delete category', 500)
  }
}

export const GET = withAuthDynamic(getHandler)
export const PUT = withAuthDynamic(putHandler)
export const DELETE = withAuthDynamic(deleteHandler)
