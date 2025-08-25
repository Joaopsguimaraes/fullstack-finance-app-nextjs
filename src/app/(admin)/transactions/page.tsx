import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Transactions = dynamic(
  () => import("@/features/transactions/components/transactions").then(mod => ({ default: mod.Transactions })),
  {
    loading: () => (
      <Card className="w-full shadow-lg">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading transactions...</span>
        </CardContent>
      </Card>
    ),
  }
);

export default function TransactionsPage() {
  return (
    <Suspense 
      fallback={
        <Card className="w-full shadow-lg">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading transactions...</span>
          </CardContent>
        </Card>
      }
    >
      <Transactions />
    </Suspense>
  );
}
