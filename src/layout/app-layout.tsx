import { Sidebar } from "@/layout/sidebar";
import { Session } from "next-auth";
import { PropsWithChildren } from "react";

type Props = Readonly<
  PropsWithChildren & {
    session: Session;
  }
>;

export function AppLayout({ children, session }: Props) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={session.user} />
      <main className="p-6 w-full">{children}</main>
    </div>
  );
}
