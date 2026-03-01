"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { googleLogin } from "@/app/(DashboardLayout)/services/authService";
import { useRouter } from "next/navigation";

type AuthUser = {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (googleIdToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("growy_user");
    const storedToken = localStorage.getItem("growy_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (googleIdToken: string) => {
    const data = await googleLogin(googleIdToken);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("growy_user", JSON.stringify(data.user));
    localStorage.setItem("growy_token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("growy_user");
    localStorage.removeItem("growy_token");
    router.replace("/authentication/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
