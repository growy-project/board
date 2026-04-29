"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const USER_QUERY_KEY = ["auth", "user"] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem("growy_user");
    const storedToken = localStorage.getItem("growy_token");
    if (storedUser && storedToken) {
      const parsed: AuthUser = JSON.parse(storedUser);
      setUser(parsed);
      setToken(storedToken);
      queryClient.setQueryData(USER_QUERY_KEY, parsed);
    }
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: (googleIdToken: string) => googleLogin(googleIdToken),
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("growy_user", JSON.stringify(data.user));
      localStorage.setItem("growy_token", data.token);
      queryClient.setQueryData(USER_QUERY_KEY, data.user);
    },
  });

  const login = async (googleIdToken: string) => {
    await loginMutation.mutateAsync(googleIdToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("growy_user");
    localStorage.removeItem("growy_token");
    queryClient.removeQueries({ queryKey: ["auth"] });
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
