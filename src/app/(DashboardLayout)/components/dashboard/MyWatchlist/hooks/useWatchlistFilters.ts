import { useState, useEffect, useRef, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { dateRangeQueryOptions } from "@/app/(DashboardLayout)/queries/dateRangeQuery";

const WATCHLIST_RANGE_ANCHOR_EXCHANGE = "NASDAQ";

export function useWatchlistFilters() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [needsSearch, setNeedsSearch] = useState(false);
  const [triggerInitialSearch, setTriggerInitialSearch] = useState(false);
  const hasSeeded = useRef(false);
  const hasInitiallySearched = useRef(false);

  const { data: dateRange, isFetching: dateRangeLoading } = useQuery({
    ...dateRangeQueryOptions(WATCHLIST_RANGE_ANCHOR_EXCHANGE),
  });

  useEffect(() => {
    if (!dateRange || hasSeeded.current) return;
    hasSeeded.current = true;
    const end = dayjs(dateRange.lastDate);
    setStartDate(end.subtract(3, "month"));
    setEndDate(end);
  }, [dateRange]);

  useEffect(() => {
    if (
      !dateRangeLoading &&
      startDate !== null &&
      endDate !== null &&
      !hasInitiallySearched.current
    ) {
      hasInitiallySearched.current = true;
      setTriggerInitialSearch(true);
    }
  }, [dateRangeLoading, startDate, endDate]);

  const handleStartDateChange = useCallback((newValue: Dayjs | null) => {
    setStartDate(newValue);
    setNeedsSearch(true);
  }, []);

  const handleEndDateChange = useCallback((newValue: Dayjs | null) => {
    setEndDate(newValue);
    setNeedsSearch(true);
  }, []);

  const clearNeedsSearch = useCallback(() => setNeedsSearch(false), []);
  const clearTriggerInitialSearch = useCallback(
    () => setTriggerInitialSearch(false),
    []
  );

  return {
    startDate,
    endDate,
    needsSearch,
    dateRange: dateRange ?? null,
    dateRangeLoading,
    triggerInitialSearch,
    handleStartDateChange,
    handleEndDateChange,
    clearNeedsSearch,
    clearTriggerInitialSearch,
  };
}
