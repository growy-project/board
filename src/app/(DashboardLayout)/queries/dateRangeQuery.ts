import { QueryClient } from "@tanstack/react-query";
import * as symbolService from "../services/symbolService";

export const ALL_EXCHANGES = ["NASDAQ", "NYSE", "CEDEAR"] as const;

export const dateRangeQueryOptions = (exchange: string) => ({
  queryKey: ["date-range", exchange] as const,
  queryFn: () => symbolService.getExchangeDateRange(exchange),
});

export const prefetchAllExchangeDateRanges = (queryClient: QueryClient) => {
  ALL_EXCHANGES.forEach((e) =>
    queryClient.prefetchQuery(dateRangeQueryOptions(e))
  );
};
