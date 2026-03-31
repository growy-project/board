import { useState, useMemo, useCallback } from "react";
import type { JobStatus } from "../types";
import { descendingComparator, type SortableColumn } from "../utils";

export function useStockSort(status: JobStatus | null) {
  const [orderBy, setOrderBy] = useState<SortableColumn>("percentageChange");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

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

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  }, []);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  return { orderBy, order, currentPage, pageSize, sortedResults, handleSort, handlePageChange, resetPage };
}
