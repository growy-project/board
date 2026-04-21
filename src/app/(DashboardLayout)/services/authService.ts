import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://20.51.170.82:5000";

export const googleLogin = async (idToken: string) =>
  axios.post(`${API_BASE_URL}/Auth/google-login`, { idToken }).then((r) => r.data);
