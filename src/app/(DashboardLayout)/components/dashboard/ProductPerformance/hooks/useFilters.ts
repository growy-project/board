import { useState, useEffect, useRef, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import { SelectChangeEvent } from "@mui/material";
import * as symbolService from "../../../../services/symbolService";
import type { SymbolDateRangeResult } from "../../../../services/symbolService";

export function useFilters() {
  const [exchange, setExchange] = useState<string>("NYSE");
  const [minPercentageChange, setMinPercentageChange] = useState<number>(30);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [needsSearch, setNeedsSearch] = useState(false);
  const [dateRange, setDateRange] = useState<SymbolDateRangeResult | null>(null);
  const [dateRangeLoading, setDateRangeLoading] = useState<boolean>(true);
  const [triggerInitialSearch, setTriggerInitialSearch] = useState(false);
  const hasInitiallySearched = useRef<boolean>(false);

  // Fetch valid date range whenever the selected exchange changes; seeds start/end dates
  useEffect(() => {
    let cancelled = false;
    setDateRangeLoading(true);
    const fetchDateRange = async () => {
      try {
        const range = await symbolService.getExchangeDateRange(exchange);
        if (!cancelled) {
          setDateRange(range);
          const end = dayjs(range.lastDate);
          setStartDate(end.subtract(1, "year"));
          setEndDate(end);
        }
      } catch {
        // Non-critical: pickers remain disabled
      } finally {
        if (!cancelled) setDateRangeLoading(false);
      }
    };
    fetchDateRange();
    return () => { cancelled = true; };
  }, [exchange]);

  // Trigger initial search once dates are loaded for the first time
  useEffect(() => {
    if (!dateRangeLoading && startDate !== null && endDate !== null && !hasInitiallySearched.current) {
      hasInitiallySearched.current = true;
      setTriggerInitialSearch(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRangeLoading, startDate, endDate]);

  const handleExchangeChange = useCallback((e: SelectChangeEvent) => {
    setExchange(e.target.value);
    setNeedsSearch(true);
  }, []);

  const handleMinPercentageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPercentageChange(Number(e.target.value));
    setNeedsSearch(true);
  }, []);

  const handleStartDateChange = useCallback((newValue: Dayjs | null) => {
    setStartDate(newValue);
    setNeedsSearch(true);
  }, []);

  const handleEndDateChange = useCallback((newValue: Dayjs | null) => {
    setEndDate(newValue);
    setNeedsSearch(true);
  }, []);

  const clearNeedsSearch = useCallback(() => setNeedsSearch(false), []);

  return {
    exchange,
    minPercentageChange,
    startDate,
    endDate,
    needsSearch,
    dateRange,
    dateRangeLoading,
    triggerInitialSearch,
    handleExchangeChange,
    handleMinPercentageChange,
    handleStartDateChange,
    handleEndDateChange,
    clearNeedsSearch,
  };
}
