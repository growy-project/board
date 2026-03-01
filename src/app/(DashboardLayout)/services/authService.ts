import axios from "axios";

const API_BASE_URL = "https://localhost:7138";

export const googleLogin = async (idToken: string) =>
  axios.post(`${API_BASE_URL}/Auth/google-login`, { idToken }).then((r) => r.data);
