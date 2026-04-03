"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "navy";

type ThemeContextType = {
  mode: ThemeMode;
  cycleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const CYCLE_ORDER: ThemeMode[] = ["light", "dark", "navy"];

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem("growy_theme") as ThemeMode | null;
    if (stored && CYCLE_ORDER.includes(stored)) {
      setMode(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("growy_theme", mode);
  }, [mode]);

  const cycleMode = () => {
    setMode((current) => {
      const nextIndex = (CYCLE_ORDER.indexOf(current) + 1) % CYCLE_ORDER.length;
      return CYCLE_ORDER[nextIndex];
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, cycleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used inside AppThemeProvider");
  return ctx;
}
