import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { RegisterData, ResetPasswordData } from "@/lib/schemas";

/**
 * Authentication service for handling auth operations
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: `${data.firstName} ${data.lastName}`,
        },
      });

      return {
        success: true,
        message: "User registered successfully",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Failed to register user",
      };
    }
  }

  /**
   * Request password recovery
   */
  static async requestPasswordRecovery(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Return success even if user doesn't exist for security
        return {
          success: true,
          message: "If an account with this email exists, you will receive a recovery link",
        };
      }

      // Generate recovery token
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store recovery token
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // TODO: Send email with recovery link
      // For now, just return success
      console.log("Recovery token:", token);

      return {
        success: true,
        message: "If an account with this email exists, you will receive a recovery link",
      };
    } catch (error) {
      console.error("Password recovery error:", error);
      return {
        success: false,
        message: "Failed to process recovery request",
      };
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
    try {
      // Find and validate token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token: data.token },
      });

      if (!verificationToken || verificationToken.expires < new Date()) {
        return {
          success: false,
          message: "Invalid or expired recovery token",
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Update user password
      await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { password: hashedPassword },
      });

      // Delete used token
      await prisma.verificationToken.delete({
        where: { token: data.token },
      });

      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        message: "Failed to reset password",
      };
    }
  }

  /**
   * Verify recovery token
   */
  static async verifyRecoveryToken(token: string): Promise<{ valid: boolean; email?: string }> {
    try {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken || verificationToken.expires < new Date()) {
        return { valid: false };
      }

      return {
        valid: true,
        email: verificationToken.identifier,
      };
    } catch (error) {
      console.error("Token verification error:", error);
      return { valid: false };
    }
  }
}
