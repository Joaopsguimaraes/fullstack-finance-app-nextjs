import { createErrorResponse, createSuccessResponse } from '@/helpers'
import { withAuthDynamic } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { updateTransactionSchema } from '@/lib/schemas'

export const GET = withAuthDynamic(async (_: Request, { user }, { params }) => {
  try {
    const { id } = await params

    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
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
    })

    if (!transaction) {
      return createErrorResponse('Transaction not found', 404)
    }

    return createSuccessResponse(
      transaction,
      200,
      'Transaction retrieved successfully'
    )
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return createErrorResponse(message, 500)
  }
})

export const PUT = withAuthDynamic(
  async (request: Request, { user }, { params }) => {
    try {
      const { id } = await params
      const body = await request.json()
      const validatedData = updateTransactionSchema.parse({ id, ...body })

      if (validatedData.accountId) {
        const bankAccount = await prisma.bankAccount.findUnique({
          where: {
            id: validatedData.accountId,
            userId: user.id,
          },
        })

        if (!bankAccount) {
          return createErrorResponse('Bank account not found', 404)
        }
      }

      const { description, type, amount, category, date, accountId } =
        validatedData

      const data = {
        description,
        type,
        category,
        date,
        bankAccountId: accountId,
      }

      if (amount) {
        const parsedAmount = parseFloat(
          typeof amount === 'string'
            ? amount.replace(',', '.').replace(/[^0-9.-]+/g, '')
            : amount
        )
        if (isNaN(parsedAmount))
          return createErrorResponse('Invalid amount value', 400)

        data['amount'] = parsedAmount
      }

      const updatedTransaction = await prisma.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
        },
      })

      return createSuccessResponse(
        updatedTransaction,
        200,
        'Transaction updated successfully'
      )
    } catch (reason) {
      if (
        reason instanceof Error &&
        reason.message.includes('Record to update not found')
      ) {
        return createErrorResponse('Transaction not found', 404)
      }

      const message = reason instanceof Error ? reason.message : 'Unknown error'
      return createErrorResponse(message, 500)
    }
  }
)

export const DELETE = withAuthDynamic(
  async (_: Request, { user }, { params }) => {
    try {
      const { id } = await params

      await prisma.transaction.delete({
        where: {
          id,
          userId: user.id,
        },
      })

      return new Response(null, { status: 204 })
    } catch (reason) {
      if (
        reason instanceof Error &&
        reason.message.includes('Record to delete does not exist')
      ) {
        return createErrorResponse('Transaction not found', 404)
      }

      const message = reason instanceof Error ? reason.message : 'Unknown error'
      return createErrorResponse(message, 500)
    }
  }
)
