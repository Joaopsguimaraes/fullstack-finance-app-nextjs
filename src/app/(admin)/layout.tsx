import { AppLayout } from "@/layout/app-layout";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <AppLayout>{children}</AppLayout>;
}
