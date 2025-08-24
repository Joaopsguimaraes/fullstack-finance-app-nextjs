import { prisma } from "@/lib/prisma";
import { updateTransactionSchema } from "@/lib/schemas";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
        userId: "", // TODO: Replace with actual user ID from auth
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
    });

    if (!transaction) {
      return new Response(JSON.stringify({ message: "Transaction not found" }), { 
        status: 404 
      });
    }

    return new Response(JSON.stringify(transaction), { status: 200 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTransactionSchema.parse({ id, ...body });
    
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
        userId: "", // TODO: Replace with actual user ID from auth
      },
      data: validatedData,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(updatedTransaction), { status: 200 });
  } catch (reason) {
    if (reason instanceof Error && reason.message.includes("Record to update not found")) {
      return new Response(JSON.stringify({ message: "Transaction not found" }), { 
        status: 404 
      });
    }
    
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.transaction.delete({
      where: {
        id,
        userId: "", // TODO: Replace with actual user ID from auth
      },
    });

    return new Response(null, { status: 204 });
  } catch (reason) {
    if (reason instanceof Error && reason.message.includes("Record to delete does not exist")) {
      return new Response(JSON.stringify({ message: "Transaction not found" }), { 
        status: 404 
      });
    }
    
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}
