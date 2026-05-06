import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://growy-api.eastus.cloudapp.azure.com"}/my-list`;

export const addToWatchlist = async (
  symbol: string,
  exchange: string,
  token: string
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/symbol`,
    { symbol, exchange },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const removeFromWatchlist = async (
  symbol: string,
  exchange: string,
  token: string
): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/symbol`, {
    params: { symbol, exchange },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const startWatchlistJob = async (
  startUnixDate: number,
  endUnixDate: number,
  token: string
): Promise<string> => {
  const response = await axios.get(API_BASE_URL, {
    params: { startUnixDate, endUnixDate },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.jobId;
};
