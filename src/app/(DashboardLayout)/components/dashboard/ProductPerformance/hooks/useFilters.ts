import { useState, useEffect, useRef, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import { SelectChangeEvent } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as symbolService from "../../../../services/symbolService";

const ALL_EXCHANGES = ["NASDAQ", "NYSE", "CEDEAR"] as const;

const dateRangeQueryOptions = (exchange: string) => ({
  queryKey: ["date-range", exchange] as const,
  queryFn: () => symbolService.getExchangeDateRange(exchange),
});

export function useFilters() {
  const [exchange, setExchange] = useState<string>("NASDAQ");
  const [minPercentageChange, setMinPercentageChange] = useState<number>(30);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [needsSearch, setNeedsSearch] = useState(false);
  const [triggerInitialSearch, setTriggerInitialSearch] = useState(false);
  const hasInitiallySearched = useRef<boolean>(false);
  const lastSeededExchange = useRef<string | null>(null);

  const queryClient = useQueryClient();

  const { data: dateRange, isFetching: dateRangeLoading } = useQuery({
    ...dateRangeQueryOptions(exchange),
  });

  // Seed start/end dates when the selected exchange's range arrives or changes
  useEffect(() => {
    if (!dateRange || lastSeededExchange.current === exchange) return;
    lastSeededExchange.current = exchange;
    const end = dayjs(dateRange.lastDate);
    setStartDate(end.subtract(3, "month"));
    setEndDate(end);
  }, [dateRange, exchange]);

  // Prefetch the other two exchanges in the background after first paint
  useEffect(() => {
    ALL_EXCHANGES
      .filter((e) => e !== exchange)
      .forEach((e) => queryClient.prefetchQuery(dateRangeQueryOptions(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    dateRange: dateRange ?? null,
    dateRangeLoading,
    triggerInitialSearch,
    handleExchangeChange,
    handleMinPercentageChange,
    handleStartDateChange,
    handleEndDateChange,
    clearNeedsSearch,
  };
}
