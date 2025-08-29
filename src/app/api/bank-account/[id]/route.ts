import { createErrorResponse, createSuccessResponse } from '@/helpers'
import { withAuthDynamic } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { updateBankAccountSchema } from '@/lib/schemas'

export const GET = withAuthDynamic(async (_: Request, { user }, { params }) => {
  try {
    const { id } = await params

    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!bankAccount) {
      return createErrorResponse('Bank account not found', 404)
    }

    return createSuccessResponse(
      bankAccount,
      200,
      'Bank account retrieved successfully'
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
      const validatedData = updateBankAccountSchema.parse({ id, ...body })

      const { balance: _balance, ...updateData } = validatedData

      const updatedBankAccount = await prisma.bankAccount.update({
        where: {
          id,
          userId: user.id,
        },
        data: updateData,
      })

      return createSuccessResponse(
        updatedBankAccount,
        200,
        'Bank account updated successfully'
      )
    } catch (reason) {
      if (
        reason instanceof Error &&
        reason.message.includes('Record to update not found')
      ) {
        return createErrorResponse('Bank account not found', 404)
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

      // Check if this is the default wallet
      const bankAccount = await prisma.bankAccount.findUnique({
        where: {
          id,
          userId: user.id,
        },
      })

      if (!bankAccount) {
        return createErrorResponse('Bank account not found', 404)
      }

      // Prevent deletion of default wallet
      if (bankAccount.name === 'Wallet' && bankAccount.type === 'CHECKING') {
        return createErrorResponse('Cannot delete default wallet account', 400)
      }

      // Check if account has transactions
      const transactionCount = await prisma.transaction.count({
        where: {
          bankAccountId: id,
        },
      })

      if (transactionCount > 0) {
        return createErrorResponse(
          'Cannot delete account with existing transactions',
          400
        )
      }

      await prisma.bankAccount.delete({
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
        return createErrorResponse('Bank account not found', 404)
      }

      const message = reason instanceof Error ? reason.message : 'Unknown error'
      return createErrorResponse(message, 500)
    }
  }
)
