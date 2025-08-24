"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionSchema, type Transaction } from "@/lib/schemas";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, DollarSign, FileText, Tag } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface TransactionFormProps {
  readonly mode: "create" | "edit";
}

const transactionCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Housing",
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Insurance",
  "Healthcare",
  "Education",
  "Shopping",
  "Travel",
  "Other",
];

const transactionTypes = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export function TransactionForm({ mode }: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { accounts, addTransaction, updateTransaction } = useAppStore();

  const isFormOpen = useStore.use.isFormOpen();
  const setIsFormOpen = useStore.use.setIsFormOpen();
  const setEditingTransaction = useStore.use.setEditingTransaction();
  const transaction = useStore.use.editingTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Transaction>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction || {
      amount: 0,
      description: "",
      category: "",
      type: "expense",
      date: new Date(),
      accountId: accounts[0]?.id || "",
    },
  });

  const onClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const watchedType = watch("type");

  const onSubmit = async (data: Transaction) => {
    setIsLoading(true);
    try {
      if (mode === "create") {
        addTransaction(data);
      } else if (transaction?.id) {
        updateTransaction(transaction.id, data);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Transaction" : "Edit Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={watchedType}
              onValueChange={(value) =>
                setValue("type", value as "income" | "expense")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-10"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("description")}
                placeholder="Enter description"
                className="pl-10"
              />
            </div>
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {transactionCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Account</label>
            <Select
              value={watch("accountId")}
              onValueChange={(value) => setValue("accountId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id || ""}>
                    {account.name} ({formatCurrency(account.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-destructive">
                {errors.accountId.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("date", { valueAsDate: true })}
                type="date"
                className="pl-10"
              />
            </div>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : mode === "create"
                ? "Add Transaction"
                : "Update Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
