import { useState, useRef, useCallback } from "react";
import * as watchlistService from "../../../../services/watchlistService";
import * as statisticJobService from "../../../../services/statisticJobService";
import type { JobStatus, StockPerformance } from "../../ProductPerformance/types";

interface SearchParams {
  startUnixDate: number;
  endUnixDate: number;
}

export function useWatchlistJob() {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const isJobFinishedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback((startedJobId: string) => {
    const poll = async () => {
      if (isJobFinishedRef.current) return;
      try {
        const info = await statisticJobService.getJobStatus(startedJobId);
        setStatus(info);
        if (info.isFinished || info.percentComplete === 100) {
          isJobFinishedRef.current = true;
          setIsPageLoading(false);
          if (info.errors) {
            setError("Something went wrong while loading your watchlist. Please try again.");
          }
          return;
        }
        timeoutRef.current = setTimeout(poll, 500);
      } catch (err: unknown) {
        isJobFinishedRef.current = true;
        setIsPageLoading(false);
        const e = err as { response?: { data?: { message?: string } | string }; message?: string };
        const message =
          e?.response?.data && typeof e.response.data === "object"
            ? e.response.data.message
            : e?.response?.data ?? e?.message ?? "Error retrieving watchlist status";
        setError(typeof message === "string" ? message : "Error retrieving watchlist status");
      }
    };
    poll();
  }, []);

  const handleSearch = useCallback(async (params: SearchParams, token: string) => {
    setStatus(null);
    setJobId(null);
    setError(null);
    setIsPageLoading(true);
    isJobFinishedRef.current = false;

    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }

    try {
      const newJobId = await watchlistService.startWatchlistJob(
        params.startUnixDate,
        params.endUnixDate,
        token,
      );
      setJobId(newJobId);
      startPolling(newJobId);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } | string }; message?: string };
      const message =
        e?.response?.data && typeof e.response.data === "object"
          ? e.response.data.message
          : e?.response?.data ?? e?.message ?? "Error starting the watchlist job";
      setError(typeof message === "string" ? message : "Error starting the watchlist job");
    }
  }, [startPolling]);

  const removeSymbolLocally = useCallback((symbol: string, exchange: string | null | undefined) => {
    setStatus((prev) => {
      if (!prev || !Array.isArray(prev.result)) return prev;
      const filtered = prev.result.filter(
        (r: StockPerformance) => !(r.symbol === symbol && (r.exchange ?? null) === (exchange ?? null))
      );
      return {
        ...prev,
        result: filtered,
        totalItems: filtered.length,
      };
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setStatus({ result: [], percentComplete: 0, isFinished: true, status: "error" });
  }, []);

  return { status, jobId, error, isPageLoading, handleSearch, clearError, removeSymbolLocally };
}
