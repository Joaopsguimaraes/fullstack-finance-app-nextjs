import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to transactions page for now
  redirect("/transactions");
}
