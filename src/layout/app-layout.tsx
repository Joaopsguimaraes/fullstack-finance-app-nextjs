"use client";

import { Sidebar } from "@/layout/sidebar";
import { PropsWithChildren, useState } from "react";

type Props = Readonly<PropsWithChildren>;

export function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = {
    id: "123",
    email: "john.doe@email.com",
    firstName: "John",
    lastName: "Doe",
    isAuthenticated: true,
  };

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      <main className="p-6 w-full">{children}</main>
    </div>
  );
}
