import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";

interface WatchlistActionsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onRemove: () => void;
}

export default function WatchlistActionsMenu({
  anchorEl,
  onClose,
  onRemove,
}: WatchlistActionsMenuProps) {
  const t = useTranslations("watchlist");
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onRemove}>{t("removeAction")}</MenuItem>
    </Menu>
  );
}
