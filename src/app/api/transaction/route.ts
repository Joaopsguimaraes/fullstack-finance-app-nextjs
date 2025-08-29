import { createErrorResponse } from '@/helpers/create-error-response'
import { createSuccessResponse } from '@/helpers/create-success-response'
import { withAuth } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { createTransactionSchema } from '@/lib/schemas'

export const POST = withAuth(async (request, { user }) => {
  try {
    const body = await request.json()
    const validatedData = createTransactionSchema.safeParse(body)

    if (!validatedData.success) {
      return createErrorResponse('Data is not valid', 400)
    }

    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        id: validatedData.data.accountId,
        userId: user.id,
      },
    })

    if (!bankAccount) {
      return createErrorResponse('Bank account not found', 404)
    }

    const result = await prisma.transaction.create({
      data: {
        description: validatedData.data.description,
        type: validatedData.data.type,
        amount: Number(validatedData.data.amount),
        category: validatedData.data.category,
        date: validatedData.data.date,
        bankAccountId: validatedData.data.accountId, // TODO refactor this schema from accountId to bankAccountId
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

export const GET = withAuth(async (_, { user }) => {
  try {
    const result = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      include: {
        bankAccount: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

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
