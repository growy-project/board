import { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import * as symbolService from "../../../../services/symbolService";
import * as realService from "../../../../services/statisticJobService";
import * as watchlistService from "../../../../services/watchlistService";
import { useAuth } from "@/app/context/AuthContext";
import { ADMIN_EMAIL } from "../constants";
import type { StockPerformance } from "../types";

export function useSymbolActions(exchange: string, startUnixDate?: number | null, endUnixDate?: number | null) {
  const { user, token } = useAuth();
  const tFeedback = useTranslations("dashboard.watchlistFeedback");
  const tTag = useTranslations("dashboard.tagRequest");
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionsMenuStock, setActionsMenuStock] = useState<StockPerformance | null>(null);
  const [notAdminDialogOpen, setNotAdminDialogOpen] = useState(false);
  const [notAdminAction, setNotAdminAction] = useState<"toxic" | "topGrowth" | null>(null);
  const [notAdminMessage, setNotAdminMessage] = useState("");
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [tagRequestSuccess, setTagRequestSuccess] = useState<string | null>(null);
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);
  const [symbolHistory, setSymbolHistory] = useState<unknown>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockPerformance | null>(null);
  const [watchlistFeedback, setWatchlistFeedback] = useState<
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
    realService.getSymbolHistory(product.symbol, { exchange, startUnixDate, endUnixDate }).then(setSymbolHistory);
  }, [exchange, startUnixDate, endUnixDate]);

  const closeActionsMenu = useCallback(() => setActionsMenuAnchor(null), []);

  const handleTagToxic = useCallback(async () => {
    setActionsMenuAnchor(null);
    if (!user || !token) {
      setLoginPromptOpen(true);
      return;
    }
    if (user.email === ADMIN_EMAIL) {
      if (actionsMenuStock) await symbolService.setToxic(actionsMenuStock.symbol, true, token);
    } else {
      setNotAdminAction("toxic");
      setNotAdminMessage("");
      setNotAdminDialogOpen(true);
    }
  }, [user, token, actionsMenuStock]);

  const handleTagTopGrowth = useCallback(async () => {
    setActionsMenuAnchor(null);
    if (!user || !token) {
      setLoginPromptOpen(true);
      return;
    }
    if (user.email === ADMIN_EMAIL) {
      if (actionsMenuStock) await symbolService.setTopGrowth(actionsMenuStock.symbol, true, token);
    } else {
      setNotAdminAction("topGrowth");
      setNotAdminMessage("");
      setNotAdminDialogOpen(true);
    }
  }, [user, token, actionsMenuStock]);

  const handleAddToWatchlist = useCallback(async () => {
    setActionsMenuAnchor(null);
    if (!user || !token) {
      setLoginPromptOpen(true);
      return;
    }
    if (!actionsMenuStock) return;
    try {
      await watchlistService.addToWatchlist(actionsMenuStock.symbol, exchange, token);
      setWatchlistFeedback({
        severity: "success",
        message: tFeedback("added", { symbol: actionsMenuStock.symbol }),
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const message = (err.response.data as { message?: string })?.message
          ?? tFeedback("addConflictFallback");
        setWatchlistFeedback({ severity: "warning", message });
      } else {
        setWatchlistFeedback({
          severity: "error",
          message: tFeedback("addError"),
        });
      }
    }
  }, [user, token, actionsMenuStock, exchange, tFeedback]);

  const handleNotAdminMessageChange = useCallback((value: string) => {
    if (value.length <= 300) setNotAdminMessage(value);
  }, []);

  const handleSubmitTag = useCallback(async () => {
    if (actionsMenuStock && notAdminAction && user && token) {
      setIsSubmittingTag(true);
      try {
        await symbolService.requestTag(
          actionsMenuStock.symbol,
          notAdminAction,
          notAdminMessage.trim(),
          user.email,
          token
        );
        const tagLabel = notAdminAction === "toxic" ? tTag("labelToxic") : tTag("labelTopGrowth");
        setTagRequestSuccess(tTag("submitted", { symbol: actionsMenuStock.symbol, tag: tagLabel }));
      } finally {
        setIsSubmittingTag(false);
      }
    }
    setNotAdminDialogOpen(false);
  }, [actionsMenuStock, notAdminAction, notAdminMessage, user, token, tTag]);

  return {
    actionsMenuAnchor,
    actionsMenuStock,
    notAdminDialogOpen,
    setNotAdminDialogOpen,
    notAdminAction,
    notAdminMessage,
    loginPromptOpen,
    setLoginPromptOpen,
    tagRequestSuccess,
    setTagRequestSuccess,
    isSubmittingTag,
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
    handleAddToWatchlist,
    watchlistFeedback,
    setWatchlistFeedback,
    handleNotAdminMessageChange,
    handleSubmitTag,
  };
}
