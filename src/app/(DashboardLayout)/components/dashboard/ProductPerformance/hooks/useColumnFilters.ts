import { useState, useMemo, useCallback } from "react";
import type { StockPerformance } from "../types";

export type MomentumFilter = "all" | "yes" | "no";

// Market-cap input is entered in millions, so the raw cap is compared against value * 1e6.
const MILLION = 1_000_000;

export interface UseColumnFiltersResult {
  symbol: string;
  momentum: MomentumFilter;
  bouncing: MomentumFilter;
  sector: string;
  minMarketCap: string;
  setSymbol: (v: string) => void;
  setMomentum: (v: MomentumFilter) => void;
  setBouncing: (v: MomentumFilter) => void;
  setSector: (v: string) => void;
  setMinMarketCap: (v: string) => void;
  sectorOptions: string[];
  filteredResults: StockPerformance[];
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

/**
 * Client-side, in-memory column filtering for the stock grids.
 *
 * @param rows    The already-sorted rows to filter (e.g. `useStockSort`'s `sortedResults`).
 * @param dataKey The full loaded result set (`status.result`). Sector options are derived from
 *                this so they are computed once per data load and never shrink as filters change.
 */
export function useColumnFilters(
  rows: StockPerformance[],
  dataKey: StockPerformance[] | undefined,
): UseColumnFiltersResult {
  const [symbol, setSymbol] = useState<string>("");
  const [momentum, setMomentum] = useState<MomentumFilter>("all");
  const [bouncing, setBouncing] = useState<MomentumFilter>("all");
  const [sector, setSector] = useState<string>("");
  const [minMarketCap, setMinMarketCap] = useState<string>("");

  const sectorOptions = useMemo(() => {
    const unique = new Set(
      (dataKey ?? [])
        .map((r) => r.sector)
        .filter((s): s is string => s != null && s.trim() !== ""),
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [dataKey]);

  const filteredResults = useMemo(() => {
    const symbolQuery = symbol.trim().toLowerCase();
    const minCap = minMarketCap.trim() === "" ? NaN : Number(minMarketCap);
    const minCapActive = !Number.isNaN(minCap);

    return rows.filter((row) => {
      if (symbolQuery !== "" && !row.symbol.toLowerCase().includes(symbolQuery)) return false;

      if (momentum === "yes" && row.isInMomentum !== true) return false;
      if (momentum === "no" && row.isInMomentum !== false) return false;

      if (bouncing === "yes" && row.isBouncing !== true) return false;
      if (bouncing === "no" && row.isBouncing !== false) return false;

      if (sector !== "" && row.sector !== sector) return false;

      if (minCapActive) {
        if (row.marketCapitalization == null) return false;
        if (row.marketCapitalization < minCap * MILLION) return false;
      }

      return true;
    });
  }, [rows, symbol, momentum, bouncing, sector, minMarketCap]);

  const hasActiveFilters =
    symbol.trim() !== "" ||
    momentum !== "all" ||
    bouncing !== "all" ||
    sector !== "" ||
    minMarketCap.trim() !== "";

  const resetFilters = useCallback(() => {
    setSymbol("");
    setMomentum("all");
    setBouncing("all");
    setSector("");
    setMinMarketCap("");
  }, []);

  return {
    symbol,
    momentum,
    bouncing,
    sector,
    minMarketCap,
    setSymbol,
    setMomentum,
    setBouncing,
    setSector,
    setMinMarketCap,
    sectorOptions,
    filteredResults,
    hasActiveFilters,
    resetFilters,
  };
}
