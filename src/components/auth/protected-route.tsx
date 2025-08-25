"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = useMemo(() => {
    return status === "authenticated" && !!session;
  }, [status, session]);

  const isLoading = useMemo(() => {
    return status === "loading";
  }, [status]);

  const redirectToSignIn = useCallback(() => {
    router.push("/auth/signin");
  }, [router]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      redirectToSignIn();
    }
  }, [isAuthenticated, isLoading, redirectToSignIn]);

  const loadingFallback = useMemo(() => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  ), []);

  if (isLoading) {
    return loadingFallback;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
