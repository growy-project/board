import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://growy-api.eastus.cloudapp.azure.com"}/Statistics`;

export const startStatisticJob = async (params: any) => {

  const response = await axios.post(`${API_BASE_URL}/start`, params);
  return response.data.jobId;
};

export const getJobStatus = async (
  jobId: any,
  page: number = 1,
  pageSize: number = 20
) => {
  const response = await axios.get(`${API_BASE_URL}/status/${jobId}`);
  return response.data;
};

export const getSymbolHistory = async (symbol: string, exchange: string) => {
  const response = await axios.get(`${API_BASE_URL}/history/${symbol}`, {
    params: { exchange },
  });
  return response.data;
};
