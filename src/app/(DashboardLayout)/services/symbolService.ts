import axios from "axios";

const API_BASE_URL = "https://localhost:7138/Symbol";

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
