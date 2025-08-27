"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  DEFAULT_FILTERS,
  TransactionFilters,
} from "../constants/default-filters";

/**
 * Hook to manage transaction filters using URL search params
 */
export const useTransactionFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current filters from URL
  const currentFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams);

    return {
      page: parseInt(params.get("page") || "1"),
      limit: parseInt(params.get("limit") || "10"),
      type: params.get("type") || "all",
      category: params.get("category") || "all",
      search: params.get("search") || "",
    };
  }, [searchParams]);

  // Update filters in URL
  const updateFilters = useCallback(
    (updates: Partial<TransactionFilters>) => {
      const params = new URLSearchParams(searchParams);

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "string" && value === "") {
            params.delete(key);
          } else {
            params.set(key, value.toString());
          }
        }
      });

      // Reset page to 1 when filters change (except when page itself is being set)
      if (!updates.hasOwnProperty("page")) {
        params.set("page", "1");
      }

      // Remove default values to keep URL clean
      Object.entries(DEFAULT_FILTERS).forEach(([key, defaultValue]) => {
        if (params.get(key) === defaultValue.toString()) {
          params.delete(key);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  // Set a single filter
  const setFilter = useCallback(
    (key: keyof TransactionFilters, value: any) => {
      updateFilters({ [key]: value });
    },
    [updateFilters],
  );

  // Set multiple filters at once
  const setMultipleFilters = useCallback(
    (filters: Partial<TransactionFilters>) => {
      updateFilters(filters);
    },
    [updateFilters],
  );

  return {
    filters: currentFilters,
    setFilter,
    setFilters: setMultipleFilters,
    resetFilters,
    updateFilters,
  };
};
