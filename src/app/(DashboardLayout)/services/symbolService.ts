import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://growy-api.eastus.cloudapp.azure.com"}/Symbol`;

export interface SymbolDateRangeResult {
  firstDate: number;
  lastDate: number;
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const setTopGrowth = async (symbol: string, value: boolean, token: string): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${symbol}/top-growth`, null, {
    params: { value },
    headers: authHeaders(token),
  });
};

export const requestTag = async (
  symbol: string,
  tagType: "topGrowth",
  reason: string,
  requesterEmail: string,
  token: string
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/request-tag`,
    { symbol, tagType, reason, requesterEmail },
    { headers: authHeaders(token) }
  );
};

export const getExchangeDateRange = async (exchange: string): Promise<SymbolDateRangeResult> => {
  const response = await axios.get<SymbolDateRangeResult>(`${API_BASE_URL}/date-range`, {
    params: { exchange },
  });
  return response.data;
};
