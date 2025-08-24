import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const result = await prisma.transaction.create({
      data: res,
    });

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      where: {
        userId: "", // TODO: Replace with actual user ID
      },
    });

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}
