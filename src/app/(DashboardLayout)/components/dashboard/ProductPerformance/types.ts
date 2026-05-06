export interface StockPerformance {
  symbol: string;
  exchange?: string | null;
  percentageChange: number;
  oldestPrice: number;
  newestPrice: number;
  marketCapitalization: number | null;
  eps: number | null;
  companyName: string | null;
  description: string | null;
  sector: string | null;
  targetPrice: number | null;
  rsi: number;
  volatility: number;
}

export interface JobStatus {
  result: StockPerformance[];
  percentComplete: number;
  isFinished: boolean;
  errors?: string;
  status: string;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  processingMessage?: string;
}
