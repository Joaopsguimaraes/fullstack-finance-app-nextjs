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
import {
  createTransactionSchema,
  type Transaction,
  type CreateTransaction,
} from "@/lib/schemas";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/features/transactions/hooks/use-transactions";
import { useTransactionForm } from "@/features/transactions/hooks/use-transaction-form";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, DollarSign, FileText, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface TransactionFormProps {
  readonly mode: "create" | "edit";
  readonly isOpen: boolean;
  readonly editingTransaction: Transaction | null;
}

const transactionCategories = [
  "FOOD",
  "TRANSPORT",
  "ENTERTAINMENT",
  "UTILITIES",
  "HEALTH",
  "EDUCATION",
  "DEBTS",
  "SALARY",
  "FREELANCE",
  "INVESTMENTS",
  "OTHER",
];

const transactionTypes = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const mockAccounts = [
  { id: "1", name: "Checking Account", balance: 0, type: "CHECKING" },
  { id: "2", name: "Savings Account", balance: 0, type: "SAVINGS" },
];

export function TransactionForm({
  mode,
  isOpen,
  editingTransaction,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeForm } = useTransactionForm();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateTransaction>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "OTHER",
      type: "EXPENSE",
      date: new Date(),
      accountId: mockAccounts[0]?.id || "",
    },
  });

  // Reset form when editing transaction changes
  useEffect(() => {
    if (editingTransaction) {
      reset({
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        category: editingTransaction.category,
        type: editingTransaction.type,
        date: new Date(editingTransaction.date),
        accountId: editingTransaction.accountId,
      });
    } else {
      reset({
        amount: 0,
        description: "",
        category: "OTHER",
        type: "EXPENSE",
        date: new Date(),
        accountId: mockAccounts[0]?.id || "",
      });
    }
  }, [editingTransaction, reset]);

  const onClose = () => {
    closeForm();
  };

  const watchedType = watch("type");

  const onSubmit = async (data: CreateTransaction) => {
    setIsLoading(true);
    try {
      if (mode === "create") {
        await createTransaction.mutateAsync(data);
      } else if (editingTransaction?.id) {
        await updateTransaction.mutateAsync({
          id: editingTransaction.id,
          data: { ...data, id: editingTransaction.id },
        });
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                setValue("type", value as "INCOME" | "EXPENSE")
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
                onValueChange={(value) =>
                  setValue(
                    "category",
                    value as
                      | "FOOD"
                      | "TRANSPORT"
                      | "ENTERTAINMENT"
                      | "UTILITIES"
                      | "HEALTH"
                      | "EDUCATION"
                      | "DEBTS"
                      | "SALARY"
                      | "FREELANCE"
                      | "INVESTMENTS"
                      | "OTHER"
                  )
                }
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
                {mockAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
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
