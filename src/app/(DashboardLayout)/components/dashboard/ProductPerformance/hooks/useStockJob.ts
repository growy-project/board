import { useState, useRef, useCallback } from "react";
import * as realService from "../../../../services/statisticJobService";
import type { JobStatus } from "../types";

interface SearchParams {
  startUnixDate: number;
  endUnixDate: number;
  minimumExpectedGrowth: number;
  exchange: string;
}

export function useStockJob() {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const isJobFinishedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback((startedJobId: string) => {
    const poll = async () => {
      if (isJobFinishedRef.current) return;
      try {
        const info = await realService.getJobStatus(startedJobId);
        setStatus(info);
        if (info.isFinished || info.percentComplete === 100) {
          isJobFinishedRef.current = true;
          if (info.errors) {
            setError("Something went wrong while processing your request. Please try again.");
          }
          return;
        }
        timeoutRef.current = setTimeout(poll, 500);
      } catch (err: unknown) {
        isJobFinishedRef.current = true;
        const e = err as { response?: { data?: { message?: string } | string }; message?: string };
        const message =
          e?.response?.data && typeof e.response.data === "object"
            ? e.response.data.message
            : e?.response?.data ?? e?.message ?? "Error retrieving job status";
        setError(typeof message === "string" ? message : "Error retrieving job status");
      }
    };
    poll();
  }, []);

  const handleSearch = useCallback(async (params: SearchParams) => {
    setStatus(null);
    setJobId(null);
    setError(null);
    setIsPageLoading(false);
    isJobFinishedRef.current = false;

    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }

    try {
      const newJobId = await realService.startStatisticJob(params);
      setJobId(newJobId);
      startPolling(newJobId);
    } catch (err: unknown) {
      console.error(err);
      const e = err as { response?: { data?: { message?: string } | string }; message?: string };
      const message =
        e?.response?.data && typeof e.response.data === "object"
          ? e.response.data.message
          : e?.response?.data ?? e?.message ?? "Error starting the analysis job";
      setError(typeof message === "string" ? message : "Error starting the analysis job");
    }
  }, [startPolling]);

  const clearError = useCallback(() => {
    setError(null);
    setStatus({ result: [], percentComplete: 0, isFinished: true, status: "error" });
  }, []);

  return { status, jobId, error, isPageLoading, handleSearch, clearError };
}
