import { useState, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";

export function useWatchlistFilters() {
  const today = dayjs();
  const [startDate, setStartDate] = useState<Dayjs | null>(today.subtract(3, "month"));
  const [endDate, setEndDate] = useState<Dayjs | null>(today);
  const [needsSearch, setNeedsSearch] = useState(false);

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
    startDate,
    endDate,
    needsSearch,
    handleStartDateChange,
    handleEndDateChange,
    clearNeedsSearch,
  };
}
