import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store";
import { Filter, Search } from "lucide-react";
import { useMemo } from "react";
import { categoriesOptions } from "../constants/categories";

export function FilterTransactions() {
  const searchQuery = useStore.use.searchQuery();
  const typeFilter = useStore.use.typeFilter();
  const categoryFilter = useStore.use.categoryFilter();
  const setSearchQuery = useStore.use.setSearchQuery();
  const setTypeFilter = useStore.use.setTypeFilter();
  const setCategoryFilter = useStore.use.setCategoryFilter();

  const transactionsType = useMemo(
    () => new Set(["all", "income", "expense"]),
    []
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(transactionsType).map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categoriesOptions.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
