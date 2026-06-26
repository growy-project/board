import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";

interface StockActionsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onAddToWatchlist: () => void;
  onTagTopGrowth: () => void;
}

export default function StockActionsMenu({
  anchorEl,
  onClose,
  onAddToWatchlist,
  onTagTopGrowth,
}: StockActionsMenuProps) {
  const t = useTranslations("dashboard.actions");
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onAddToWatchlist}>{t("watchlist")}</MenuItem>
      <MenuItem onClick={onTagTopGrowth}>{t("topGrowth")}</MenuItem>
    </Menu>
  );
}
