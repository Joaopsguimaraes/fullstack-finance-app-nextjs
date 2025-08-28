import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { RegisterData } from "@/lib/schemas";

export class AuthService {
  static async register(data: RegisterData) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);

      const result = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: `${data.firstName} ${data.lastName}`,
        },
      });

      return result;
    } catch (error) {
      console.error("Registration error:", error);
    }
  }
}
