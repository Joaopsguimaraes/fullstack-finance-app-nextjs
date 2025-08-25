"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTransactionForm } from "../hooks/use-transaction-form";

export function ButtonCreateTransaction() {
  const { openCreateForm } = useTransactionForm();

  return (
    <Button onClick={openCreateForm}>
      <Plus className="h-4 w-4 mr-2" />
      Add Transaction
    </Button>
  );
}
