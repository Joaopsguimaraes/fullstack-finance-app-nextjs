/* eslint-disable @typescript-eslint/no-explicit-any */
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

    const amount = Number(validatedData.data.amount)
    const balanceChange =
      validatedData.data.type === 'INCOME' ? amount : -amount

    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          description: validatedData.data.description,
          type: validatedData.data.type,
          amount,
          category: validatedData.data.category,
          date: validatedData.data.date,
          bankAccountId: validatedData.data.accountId, // TODO refactor this schema from accountId to bankAccountId
          userId: user.id,
        },
      })

      // Update the bank account balance
      await tx.bankAccount.update({
        where: { id: validatedData.data.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      })

      return transaction
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

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const accountId = searchParams.get('accountId')

    const where: any = {
      userId: user.id,
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (accountId && accountId !== 'all') {
      where.bankAccountId = accountId
    }

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive',
      }
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    const orderBy: any = {}
    if (sortBy === 'amount') {
      orderBy.amount = sortOrder
    } else if (sortBy === 'description') {
      orderBy.description = sortOrder
    } else {
      orderBy.date = sortOrder
    }

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          bankAccount: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return createSuccessResponse(
      {
        transactions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      },
      200,
      'Transactions retrieved successfully'
    )
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return createErrorResponse(message, 500)
  }
})
