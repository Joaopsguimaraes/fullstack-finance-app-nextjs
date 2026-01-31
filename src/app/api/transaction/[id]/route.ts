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

      let parsedAmount: number | undefined
      if (amount) {
        parsedAmount = parseFloat(
          typeof amount === 'string'
            ? amount.replace(',', '.').replace(/[^0-9.-]+/g, '')
            : amount
        )
        if (isNaN(parsedAmount))
          return createErrorResponse('Invalid amount value', 400)

        data['amount'] = parsedAmount
      }

      const updatedTransaction = await prisma.$transaction(async (tx) => {
        // Get the old transaction to reverse its balance effect
        const oldTransaction = await tx.transaction.findUnique({
          where: { id, userId: user.id },
        })

        if (!oldTransaction) {
          throw new Error('Transaction not found')
        }

        // Update the transaction
        const updated = await tx.transaction.update({
          where: { id, userId: user.id },
          data: { ...data },
        })

        // Calculate balance changes
        const oldAmount = oldTransaction.amount
        const newAmount = parsedAmount ?? oldAmount
        const oldType = oldTransaction.type
        const newType = type ?? oldType
        const oldAccountId = oldTransaction.bankAccountId
        const newAccountId = accountId ?? oldAccountId

        const oldBalanceEffect = oldType === 'INCOME' ? oldAmount : -oldAmount
        const newBalanceEffect = newType === 'INCOME' ? newAmount : -newAmount

        if (oldAccountId === newAccountId) {
          // Same account: apply the net change
          const netChange = newBalanceEffect - oldBalanceEffect
          if (netChange !== 0) {
            await tx.bankAccount.update({
              where: { id: oldAccountId },
              data: { balance: { increment: netChange } },
            })
          }
        } else {
          // Different account: reverse old effect and apply new effect
          await tx.bankAccount.update({
            where: { id: oldAccountId },
            data: { balance: { increment: -oldBalanceEffect } },
          })
          await tx.bankAccount.update({
            where: { id: newAccountId },
            data: { balance: { increment: newBalanceEffect } },
          })
        }

        return updated
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

      await prisma.$transaction(async (tx) => {
        // Get the transaction to reverse its balance effect
        const transaction = await tx.transaction.findUnique({
          where: { id, userId: user.id },
        })

        if (!transaction) {
          throw new Error('Transaction not found')
        }

        // Delete the transaction
        await tx.transaction.delete({
          where: { id, userId: user.id },
        })

        // Reverse the balance effect
        const balanceChange =
          transaction.type === 'INCOME'
            ? -transaction.amount
            : transaction.amount

        await tx.bankAccount.update({
          where: { id: transaction.bankAccountId },
          data: { balance: { increment: balanceChange } },
        })
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
