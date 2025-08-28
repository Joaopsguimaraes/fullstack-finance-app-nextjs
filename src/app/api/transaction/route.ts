import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTransactionSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const validatedData = createTransactionSchema.parse(body);

    if (!session.user.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }

    const result = await prisma.transaction.create({
      data: {
        ...validatedData,
        amount: Number(validatedData.amount),
        userId: user?.id,
      },
    });

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { searchParams } = new URL(request.url);

    if (!session.user.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const category = searchParams.get("category")
    const search = searchParams.get("search");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (type && type !== "all") {
      where.type = type.toUpperCase();
    }

    if (category && category !== "all") {
      where.category = category.toUpperCase();
    }

    if (search) {
      where.description = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    const result = {
      transactions,
      total,
      page,
      limit,
      totalPages,
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unknown error";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}
