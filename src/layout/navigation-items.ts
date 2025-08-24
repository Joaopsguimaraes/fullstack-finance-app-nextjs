import Home from "@/app/page";
import { BarChart3, CreditCard, PiggyBank, Settings, Target } from "lucide-react";

export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Accounts", href: "/accounts", icon: PiggyBank },
  { name: "Budgets", href: "/budgets", icon: BarChart3 },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Settings", href: "/settings", icon: Settings },
];
