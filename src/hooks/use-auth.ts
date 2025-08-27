import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { AuthData, RegisterData, ResetPasswordData } from "@/lib/schemas";
import { toast } from "sonner";

/**
 * Hook for authentication operations
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(
    async (credentials: AuthData) => {
      try {
        setIsLoading(true);
        await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
        });

        router.push("/transactions");
      } catch (reason) {
        const response =
          reason instanceof Error ? reason.message : "Unexpected Error";
        toast.error(response);
        setIsLoading(true);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await response.json();

    } catch (error) {
      setIsLoading(false)
      console.error("Registration error:", error);
      const reasonError = error instanceof Error ? error.message : "Unexpected Error, please try again"
      toast.error(reasonError)
    } finally {
      setIsLoading(false)
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
    isLoading: status === "loading" || isLoading,
    login,
    logout,
    register,
    requestPasswordRecovery,
    resetPassword,
  };
};
