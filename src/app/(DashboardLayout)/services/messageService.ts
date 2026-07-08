import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://growy-api.eastus.cloudapp.azure.com"}/messages`;

export const sendMessage = async (
  title: string,
  message: string,
  token: string
): Promise<void> => {
  await axios.post(
    API_BASE_URL,
    { title, message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
