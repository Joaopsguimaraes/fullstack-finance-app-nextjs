import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateTransactionSchema } from '@/lib/schemas'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || !session.user.email) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'user not found' }), {
        status: 404,
      })
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })

    if (!transaction) {
      return new Response(
        JSON.stringify({ message: 'Transaction not found' }),
        {
          status: 404,
        }
      )
    }

    return new Response(JSON.stringify(transaction), { status: 200 })
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return new Response(JSON.stringify({ message }), { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || !session.user.email) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateTransactionSchema.parse({ id, ...body })

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'user not found' }), {
        status: 404,
      })
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        ...validatedData,
        amount: Number(validatedData),
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })

    return new Response(JSON.stringify(updatedTransaction), { status: 200 })
  } catch (reason) {
    if (
      reason instanceof Error &&
      reason.message.includes('Record to update not found')
    ) {
      return new Response(
        JSON.stringify({ message: 'Transaction not found' }),
        {
          status: 404,
        }
      )
    }

    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return new Response(JSON.stringify({ message }), { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || !session.user.email) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'user not found' }), {
        status: 404,
      })
    }

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
      return new Response(
        JSON.stringify({ message: 'Transaction not found' }),
        {
          status: 404,
        }
      )
    }

    const message = reason instanceof Error ? reason.message : 'Unknown error'
    return new Response(JSON.stringify({ message }), { status: 500 })
  }
}
