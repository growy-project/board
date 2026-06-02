import { useState, useCallback, useEffect } from "react";

// Source of truth for the column chooser: order + i18n label key per toggleable column.
// `symbol`, `details` and `actions` are fixed columns and intentionally excluded here.
// `labelKey` reuses the existing `table.columns.*` keys (note marketCapitalization → "marketCap").
export const TOGGLEABLE_COLUMNS = [
  { id: "percentageChange", labelKey: "percentageChange" },
  { id: "volatility", labelKey: "volatility" },
  { id: "percentPositiveDays", labelKey: "percentPositiveDays" },
  { id: "returnStdDev", labelKey: "returnStdDev" },
  { id: "maxDrawdown", labelKey: "maxDrawdown" },
  { id: "isMomentum", labelKey: "isMomentum" },
  { id: "isBouncing", labelKey: "isBouncing" },
  { id: "eps", labelKey: "eps" },
  { id: "rsi", labelKey: "rsi" },
  { id: "oldestPrice", labelKey: "oldestPrice" },
  { id: "newestPrice", labelKey: "newestPrice" },
  { id: "targetPrice", labelKey: "targetPrice" },
  { id: "company", labelKey: "company" },
  { id: "marketCapitalization", labelKey: "marketCap" },
  { id: "sector", labelKey: "sector" },
  { id: "description", labelKey: "description" },
] as const;

export type ColumnId = (typeof TOGGLEABLE_COLUMNS)[number]["id"];

export type ColumnVisibility = Record<ColumnId, boolean>;

const DEFAULT_VISIBLE: ColumnId[] = [
  "percentageChange",
  "volatility",
  "newestPrice",
  "targetPrice",
  "isBouncing",
];

const STORAGE_KEY = "dashboard_columns";

const ALL_IDS = TOGGLEABLE_COLUMNS.map((c) => c.id) as ColumnId[];

function buildVisibility(visibleIds: ColumnId[]): ColumnVisibility {
  const set = new Set(visibleIds);
  return ALL_IDS.reduce((acc, id) => {
    acc[id] = set.has(id);
    return acc;
  }, {} as ColumnVisibility);
}

// Stored as a full id→bool map. We start from the current defaults and only overlay the
// booleans the user actually saved, so columns added after a user's last visit inherit their
// default visibility instead of being forced hidden.
function readSaved(): ColumnVisibility | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const visibility = buildVisibility(DEFAULT_VISIBLE);
    for (const id of ALL_IDS) {
      if (typeof parsed[id] === "boolean") visibility[id] = parsed[id];
    }
    return visibility;
  } catch {
    return null;
  }
}

export interface UseColumnVisibilityResult {
  visible: ColumnVisibility;
  toggle: (id: ColumnId) => void;
  reset: () => void;
}

export function useColumnVisibility(): UseColumnVisibilityResult {
  const saved = typeof window !== "undefined" ? readSaved() : null;
  const [visible, setVisible] = useState<ColumnVisibility>(
    saved ?? buildVisibility(DEFAULT_VISIBLE)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
  }, [visible]);

  const toggle = useCallback((id: ColumnId) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const reset = useCallback(() => {
    setVisible(buildVisibility(DEFAULT_VISIBLE));
  }, []);

  return { visible, toggle, reset };
}
