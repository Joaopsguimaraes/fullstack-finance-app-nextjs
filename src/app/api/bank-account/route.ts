import { createErrorResponse } from '@/helpers/create-error-response'
import { createSuccessResponse } from '@/helpers/create-success-response'
import { withAuth } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { createBankAccountSchema } from '@/lib/schemas'

export const POST = withAuth(async (request, { user }) => {
  try {
    const body = await request.json()
    const validatedData = createBankAccountSchema.parse(body)

    const result = await prisma.bankAccount.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    })

    return createSuccessResponse(
      result,
      201,
      'Bank account created successfully'
    )
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return createErrorResponse(message, 500)
  }
})

export const GET = withAuth(async (request, { user }) => {
  try {
    const { searchParams } = new URL(request.url)
    const includeBalance = searchParams.get('includeBalance') === 'true'

    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        type: true,
        balance: includeBalance,
        userId: true,
      },
      orderBy: [{ name: 'asc' }],
    })

    return createSuccessResponse(
      bankAccounts,
      200,
      'Bank accounts retrieved successfully'
    )
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return createErrorResponse(message, 500)
  }
})
