import { createErrorResponse } from '@/helpers/create-error-response'
import { createSuccessResponse } from '@/helpers/create-success-response'
import { withAuth } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { createTransactionSchema } from '@/lib/schemas'

export const POST = withAuth(async (request, { user }) => {
  try {
    const body = await request.json()
    const validatedData = createTransactionSchema.parse(body)

    const result = await prisma.transaction.create({
      data: {
        ...validatedData,
        bankAccountId: '', // TODO: Implements Bank account
        amount: Number(validatedData.amount),
        userId: user.id,
      },
    })

    return createSuccessResponse(
      result,
      201,
      'Transaction created successfully'
    )
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return createErrorResponse(message, 500)
  }
})

export const GET = withAuth(async (request, { user }) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {
      userId: user.id,
    }

    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }

    if (category && category !== 'all') {
      where.category = category.toUpperCase()
    }

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive',
      }
    }

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)

    const result = {
      transactions,
      total,
      page,
      limit,
      totalPages,
    }

    return createSuccessResponse(
      result,
      200,
      'Transactions retrieved successfully'
    )
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return createErrorResponse(message, 500)
  }
})
