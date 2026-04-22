import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://growy-api.eastus.cloudapp.azure.com";

export const googleLogin = async (idToken: string) =>
  axios.post(`${API_BASE_URL}/Auth/google-login`, { idToken }).then((r) => r.data);
