import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import * as watchlistService from "../../../../services/watchlistService";
import * as statisticJobService from "../../../../services/statisticJobService";
import { useAuth } from "@/app/context/AuthContext";
import type { StockPerformance } from "../../ProductPerformance/types";

interface UseWatchlistActionsArgs {
  startUnixDate?: number | null;
  endUnixDate?: number | null;
  removeSymbolLocally: (symbol: string, exchange: string | null | undefined) => void;
}

export function useWatchlistActions({ startUnixDate, endUnixDate, removeSymbolLocally }: UseWatchlistActionsArgs) {
  const { token } = useAuth();
  const tFeedback = useTranslations("dashboard.watchlistFeedback");
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionsMenuStock, setActionsMenuStock] = useState<StockPerformance | null>(null);
  const [symbolHistory, setSymbolHistory] = useState<unknown>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockPerformance | null>(null);
  const [feedback, setFeedback] = useState<
    { severity: "success" | "warning" | "error"; message: string } | null
  >(null);

  const chartDataset = useMemo(() => {
    const history = symbolHistory as {
      prices?: { closePrice: number; unixDate: number }[];
      ema20?: { value: number; unixDate: number }[];
    } | null;
    if (!history?.prices) return null;
    const ema20Map = new Map<number, number>(
      (history.ema20 ?? []).map((e) => [e.unixDate, e.value])
    );
    return history.prices.map((entry) => ({
      closePrice: entry.closePrice,
      ema20: ema20Map.get(entry.unixDate) ?? null,
      unixDate: entry.unixDate,
    }));
  }, [symbolHistory]);

  const handleActionsClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, product: StockPerformance) => {
    setActionsMenuAnchor(e.currentTarget);
    setActionsMenuStock(product);
  }, []);

  const handleDetailClick = useCallback((product: StockPerformance) => {
    setSelectedStock(product);
    setSymbolHistory(null);
    setDialogOpen(true);
    const exchange = product.exchange ?? "";
    statisticJobService
      .getSymbolHistory(product.symbol, { exchange, startUnixDate, endUnixDate })
      .then(setSymbolHistory);
  }, [startUnixDate, endUnixDate]);

  const closeActionsMenu = useCallback(() => setActionsMenuAnchor(null), []);

  const handleRemove = useCallback(async () => {
    setActionsMenuAnchor(null);
    if (!actionsMenuStock || !token) return;
    const { symbol, exchange } = actionsMenuStock;
    if (!exchange) {
      setFeedback({
        severity: "error",
        message: tFeedback("missingExchange", { symbol }),
      });
      return;
    }
    removeSymbolLocally(symbol, exchange);
    try {
      await watchlistService.removeFromWatchlist(symbol, exchange, token);
      setFeedback({
        severity: "success",
        message: tFeedback("removed", { symbol }),
      });
    } catch {
      setFeedback({
        severity: "error",
        message: tFeedback("removeError", { symbol }),
      });
    }
  }, [actionsMenuStock, token, removeSymbolLocally, tFeedback]);

  return {
    actionsMenuAnchor,
    actionsMenuStock,
    symbolHistory,
    chartDataset,
    dialogOpen,
    setDialogOpen,
    selectedStock,
    feedback,
    setFeedback,
    handleActionsClick,
    handleDetailClick,
    closeActionsMenu,
    handleRemove,
  };
}
