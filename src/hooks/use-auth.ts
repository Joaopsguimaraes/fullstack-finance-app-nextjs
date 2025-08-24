import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { AuthData, RegisterData, ResetPasswordData } from "@/lib/schemas";

/**
 * Hook for authentication operations
 */
export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(async (credentials: AuthData) => {
    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      return {
        success: true,
        message: "Login successful",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred during login",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Registration failed",
        };
      }

      return result;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  }, []);

  const requestPasswordRecovery = useCallback(async (email: string) => {
    try {
      const response = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Recovery request failed",
        };
      }

      return result;
    } catch (error) {
      console.error("Recovery error:", error);
      return {
        success: false,
        message: "An error occurred during recovery request",
      };
    }
  }, []);

  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Password reset failed",
        };
      }

      return result;
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        message: "An error occurred during password reset",
      };
    }
  }, []);

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    login,
    logout,
    register,
    requestPasswordRecovery,
    resetPassword,
  };
};
