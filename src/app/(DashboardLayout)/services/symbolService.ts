import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://20.51.170.82:5000"}/Symbol`;

export interface SymbolDateRangeResult {
  firstDate: number;
  lastDate: number;
}

export const setTopGrowth = async (symbol: string, value: boolean): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${symbol}/top-growth`, null, { params: { value } });
};

export const setToxic = async (symbol: string, value: boolean): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${symbol}/toxic`, null, { params: { value } });
};

export const requestTag = async (
  symbol: string,
  tagType: "toxic" | "topGrowth",
  reason: string,
  requesterEmail: string
): Promise<void> => {
  await axios.post(`${API_BASE_URL}/request-tag`, { symbol, tagType, reason, requesterEmail });
};

export const getExchangeDateRange = async (exchange: string): Promise<SymbolDateRangeResult> => {
  const response = await axios.get<SymbolDateRangeResult>(`${API_BASE_URL}/date-range`, {
    params: { exchange },
  });
  return response.data;
};
