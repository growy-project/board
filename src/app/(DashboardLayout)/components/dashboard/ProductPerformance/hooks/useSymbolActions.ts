import { useState, useMemo, useCallback } from "react";
import * as symbolService from "../../../../services/symbolService";
import * as realService from "../../../../services/statisticJobService";
import { useAuth } from "@/app/context/AuthContext";
import { ADMIN_EMAIL } from "../constants";
import type { StockPerformance } from "../types";

export function useSymbolActions(exchange: string, startUnixDate?: number | null, endUnixDate?: number | null) {
  const { user } = useAuth();
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionsMenuStock, setActionsMenuStock] = useState<StockPerformance | null>(null);
  const [notAdminDialogOpen, setNotAdminDialogOpen] = useState(false);
  const [notAdminAction, setNotAdminAction] = useState<"toxic" | "topGrowth" | null>(null);
  const [notAdminMessage, setNotAdminMessage] = useState("");
  const [symbolHistory, setSymbolHistory] = useState<unknown>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockPerformance | null>(null);

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
    realService.getSymbolHistory(product.symbol, { exchange, startUnixDate, endUnixDate }).then(setSymbolHistory);
  }, [exchange, startUnixDate, endUnixDate]);

  const closeActionsMenu = useCallback(() => setActionsMenuAnchor(null), []);

  const handleTagToxic = useCallback(async () => {
    setActionsMenuAnchor(null);
    if (user?.email === ADMIN_EMAIL) {
      if (actionsMenuStock) await symbolService.setToxic(actionsMenuStock.symbol, true);
    } else {
      setNotAdminAction("toxic");
      setNotAdminMessage("");
      setNotAdminDialogOpen(true);
    }
  }, [user, actionsMenuStock]);

  const handleTagTopGrowth = useCallback(async () => {
    setActionsMenuAnchor(null);
    if (user?.email === ADMIN_EMAIL) {
      if (actionsMenuStock) await symbolService.setTopGrowth(actionsMenuStock.symbol, true);
    } else {
      setNotAdminAction("topGrowth");
      setNotAdminMessage("");
      setNotAdminDialogOpen(true);
    }
  }, [user, actionsMenuStock]);

  const handleNotAdminMessageChange = useCallback((value: string) => {
    if (value.length <= 300) setNotAdminMessage(value);
  }, []);

  const handleSubmitTag = useCallback(async () => {
    if (actionsMenuStock && notAdminAction) {
      await symbolService.requestTag(
        actionsMenuStock.symbol,
        notAdminAction,
        notAdminMessage.trim(),
        user?.email ?? "unknown"
      );
    }
    setNotAdminDialogOpen(false);
  }, [actionsMenuStock, notAdminAction, notAdminMessage, user]);

  return {
    actionsMenuAnchor,
    actionsMenuStock,
    notAdminDialogOpen,
    setNotAdminDialogOpen,
    notAdminAction,
    notAdminMessage,
    symbolHistory,
    chartDataset,
    dialogOpen,
    setDialogOpen,
    selectedStock,
    handleActionsClick,
    handleDetailClick,
    closeActionsMenu,
    handleTagToxic,
    handleTagTopGrowth,
    handleNotAdminMessageChange,
    handleSubmitTag,
  };
}
