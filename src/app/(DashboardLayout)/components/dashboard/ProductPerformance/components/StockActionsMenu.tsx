import React from "react";
import { Menu, MenuItem } from "@mui/material";

interface StockActionsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onAddToWatchlist: () => void;
  onTagToxic: () => void;
  onTagTopGrowth: () => void;
}

export default function StockActionsMenu({
  anchorEl,
  onClose,
  onAddToWatchlist,
  onTagToxic,
  onTagTopGrowth,
}: StockActionsMenuProps) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onAddToWatchlist}>Add to my watchlist</MenuItem>
      <MenuItem onClick={onTagToxic}>Tag as Toxic</MenuItem>
      <MenuItem onClick={onTagTopGrowth}>Tag as Top Growth</MenuItem>
    </Menu>
  );
}
