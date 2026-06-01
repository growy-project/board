import { useState, useMemo, useCallback, useEffect } from "react";
import type { JobStatus } from "../types";
import { descendingComparator, type SortableColumn } from "../utils";

const SORT_KEY = "dashboard_sort";

const SORTABLE_COLUMNS: SortableColumn[] = [
  "percentageChange",
  "volatility",
  "eps",
  "rsi",
  "oldestPrice",
  "newestPrice",
  "targetPrice",
  "marketCapitalization",
  "percentPositiveDays",
  "returnStdDev",
  "maxDrawdown",
];

function readSavedSort(): { orderBy: SortableColumn; order: "asc" | "desc" } | null {
  try {
    const raw = localStorage.getItem(SORT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!SORTABLE_COLUMNS.includes(parsed.orderBy)) return null;
    if (parsed.order !== "asc" && parsed.order !== "desc") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useStockSort(status: JobStatus | null) {
  const saved = typeof window !== "undefined" ? readSavedSort() : null;
  const [orderBy, setOrderBy] = useState<SortableColumn>(saved?.orderBy ?? "percentageChange");
  const [order, setOrder] = useState<"asc" | "desc">(saved?.order ?? "desc");

  useEffect(() => {
    localStorage.setItem(SORT_KEY, JSON.stringify({ orderBy, order }));
  }, [orderBy, order]);

  const sortedResults = useMemo(() => {
    if (!status || !Array.isArray(status.result)) return [];
    return [...status.result].sort((a, b) =>
      order === "desc"
        ? descendingComparator(a, b, orderBy)
        : -descendingComparator(a, b, orderBy)
    );
  }, [status, order, orderBy]);

  const handleSort = useCallback((column: SortableColumn) => {
    if (orderBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrder("desc");
    }
  }, [orderBy]);

  return { orderBy, order, sortedResults, handleSort };
}
