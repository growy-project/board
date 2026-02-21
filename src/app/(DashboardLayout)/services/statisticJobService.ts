import axios from "axios";

const API_BASE_URL = "https://localhost:7138/Statistics"; // Reemplazá con tu URL real

export const startStatisticJob = async (params: any) => {

  const response = await axios.post(`${API_BASE_URL}/start`, params);
  console.log(response.data.jobId);
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
