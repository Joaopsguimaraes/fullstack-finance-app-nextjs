"use client";

import { Sidebar } from "@/layout/sidebar";
import { PropsWithChildren, useState, useCallback, useMemo } from "react";

type Props = Readonly<PropsWithChildren>;

export function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const user = useMemo(() => ({
    id: "123",
    email: "john.doe@email.com",
    firstName: "John",
    lastName: "Doe",
    isAuthenticated: true,
  }), []);

  const handleSidebarToggle = useCallback((value: boolean) => {
    setSidebarOpen(value);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => handleSidebarToggle(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleSidebarToggle}
        user={user}
      />

      <main className="p-6 w-full">{children}</main>
    </div>
  );
}
