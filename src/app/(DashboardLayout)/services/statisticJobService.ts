import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://growy-api.eastus.cloudapp.azure.com"}/Statistics`;

export const startStatisticJob = async (params: any) => {

  const response = await axios.post(`${API_BASE_URL}/start`, params);
  return response.data.jobId;
};

export const getJobStatus = async (jobId: any) => {
  const response = await axios.get(`${API_BASE_URL}/status/${jobId}`);
  return response.data;
};

export const getSymbolHistory = async (
  symbol: string,
  params: { exchange: string; startUnixDate?: number | null; endUnixDate?: number | null }
) => {
  const response = await axios.get(`${API_BASE_URL}/history/${symbol}`, {
    params,
  });
  return response.data;
};
