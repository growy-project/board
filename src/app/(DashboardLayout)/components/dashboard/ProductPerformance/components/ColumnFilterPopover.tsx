import React, { useState } from "react";
import { IconButton, Popover, Box, Button } from "@mui/material";
import { FilterAlt, FilterAltOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface ColumnFilterPopoverProps<T> {
  /** Whether a value is currently applied for this column (drives the icon highlight). */
  active: boolean;
  /** The committed filter value. The draft is re-synced from this each time the popover opens. */
  value: T;
  /** Commits the draft to the live filter. Called on Apply and on click-outside / Escape. */
  onCommit: (value: T) => void;
  /** Accessible label for the icon button. */
  label: string;
  /** Renders the control bound to the draft; `commit` lets inputs apply on Enter. */
  children: (draft: T, setDraft: (value: T) => void, commit: () => void) => React.ReactNode;
}

/**
 * A small filter icon in a column header that opens a popover holding the column's filter
 * control plus an Apply button. The control edits a local draft; the draft is committed to the
 * live filter when the user clicks Apply or dismisses the popover (click-outside / Escape).
 */
export default function ColumnFilterPopover<T>({
  active,
  value,
  onCommit,
  label,
  children,
}: ColumnFilterPopoverProps<T>) {
  const tf = useTranslations("table.filters");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draft, setDraft] = useState<T>(value);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setDraft(value); // re-sync the draft from the committed value on each open
    setAnchorEl(e.currentTarget);
  };

  const commit = () => {
    onCommit(draft);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={label}
        onClick={handleOpen}
        sx={{
          ml: 0.25,
          p: 0.25,
          color: active ? "#278ab0" : "text.secondary",
          "&:hover": { backgroundColor: "#eaeae0", color: "#1c4670" },
        }}
      >
        {active ? <FilterAlt fontSize="small" /> : <FilterAltOutlined fontSize="small" />}
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={commit}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 200 }}>
          {children(draft, setDraft, commit)}
          <Button
            variant="contained"
            size="small"
            onClick={commit}
            sx={{
              alignSelf: "flex-end",
              backgroundColor: "#278ab0",
              "&:hover": { backgroundColor: "#1c4670" },
            }}
          >
            {tf("apply")}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
