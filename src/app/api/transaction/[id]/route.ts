import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
        AND: {
          userId: "", // TODO: Replace with actual user ID
        },
      },
    });

    return new Response(JSON.stringify(transaction), { status: 200 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const res = await request.json();
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
        AND: {
          userId: "", // TODO: Replace with actual user ID
        },
      },
      data: res,
    });

    return new Response(JSON.stringify(updatedTransaction), { status: 200 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.transaction.delete({
      where: {
        id,
        AND: {
          userId: "", // TODO: Replace with actual user ID
        },
      },
    });

    return new Response(null, { status: 204 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}
