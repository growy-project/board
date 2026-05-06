import React from "react";
import { Menu, MenuItem } from "@mui/material";

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
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onRemove}>Remove from my watchlist</MenuItem>
    </Menu>
  );
}
