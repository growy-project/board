import { Dayjs } from "dayjs";

const FILTER_STORAGE_KEY = "dashboard_filters";

export interface SavedDashboardFilters {
  exchange: string;
  minPct: number;
  startDate: number;
  endDate: number;
}

export function saveDashboardFilters(params: {
  exchange: string;
  minPct: number;
  startDate: Dayjs;
  endDate: Dayjs;
}) {
  const payload: SavedDashboardFilters = {
    exchange: params.exchange,
    minPct: params.minPct,
    startDate: params.startDate.unix(),
    endDate: params.endDate.unix(),
  };
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(payload));
}
