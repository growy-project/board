import type { StockPerformance } from "./types";

export type SortableColumn = keyof Pick<
  StockPerformance,
  | "percentageChange"
  | "volatility"
  | "eps"
  | "rsi"
  | "oldestPrice"
  | "newestPrice"
  | "targetPrice"
  | "marketCapitalization"
>;

export function descendingComparator(
  a: StockPerformance,
  b: StockPerformance,
  key: SortableColumn
): number {
  const aVal = a[key];
  const bVal = b[key];
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1;
  if (bVal == null) return -1;
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
}
