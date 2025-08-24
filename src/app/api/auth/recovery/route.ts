import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth-service";
import { recoverySchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = recoverySchema.parse(body);

    const result = await AuthService.requestPasswordRecovery(validatedData.email);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    console.error("Recovery error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
