import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { ViewColumn, RestartAlt } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { TOGGLEABLE_COLUMNS, type ColumnId, type ColumnVisibility } from "../hooks/useColumnVisibility";

interface ColumnChooserProps {
  visible: ColumnVisibility;
  onToggle: (id: ColumnId) => void;
  onReset: () => void;
}

export default function ColumnChooser({ visible, onToggle, onReset }: ColumnChooserProps) {
  const t = useTranslations("table");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        size="small"
        variant="text"
        startIcon={<ViewColumn fontSize="small" />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: "#278ab0", "&:hover": { backgroundColor: "#eaeae0", color: "#1c4670" } }}
      >
        {t("columnChooser.button")}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {TOGGLEABLE_COLUMNS.map(({ id, labelKey }) => (
          // Toggle without closing the menu so several columns can be picked at once.
          <MenuItem key={id} onClick={() => onToggle(id)} sx={{ py: 0 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={visible[id]}
                  sx={{ "&.Mui-checked": { color: "#278ab0" } }}
                />
              }
              label={t(`columns.${labelKey}`)}
              onClick={(e) => e.preventDefault()}
              sx={{ pointerEvents: "none", m: 0 }}
            />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            onReset();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <RestartAlt fontSize="small" />
          </ListItemIcon>
          {t("columnChooser.reset")}
        </MenuItem>
      </Menu>
    </>
  );
}
