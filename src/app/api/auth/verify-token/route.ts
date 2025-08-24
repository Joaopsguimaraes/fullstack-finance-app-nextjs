import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const result = await AuthService.verifyRecoveryToken(token);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { valid: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
