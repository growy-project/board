import { jwtDecode } from "jwt-decode";

export function isJwtExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (typeof exp !== "number") return true;
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
