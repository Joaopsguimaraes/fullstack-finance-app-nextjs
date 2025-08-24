import { AppLayout } from "@/layout/app-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
