import React from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Typography,
  Box,
  Tooltip,
  TextField,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { EpsTooltipContent, RsiTooltipContent } from "../constants";
import type { SortableColumn } from "../utils";
import type { MomentumFilter, UseColumnFiltersResult } from "../hooks/useColumnFilters";
import ColumnFilterPopover from "./ColumnFilterPopover";

interface StockTableHeadProps {
  orderBy: SortableColumn;
  order: "asc" | "desc";
  onSort: (column: SortableColumn) => void;
  filters: UseColumnFiltersResult;
}

const stickyCell = {
  position: "sticky" as const,
  top: 0,
  zIndex: 1,
  backgroundColor: "background.paper",
};

// Compact accent styling so the in-popover filter controls match the app palette.
const accentField = {
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": { borderColor: "#278ab0" },
    "&.Mui-focused fieldset": { borderColor: "#1c4670" },
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      "& .MuiMenuItem-root": {
        "&:hover": { backgroundColor: "#eaeae0", color: "#1c4670" },
        "&.Mui-selected": {
          backgroundColor: "#278ab0",
          color: "white",
          "&:hover": { backgroundColor: "#1c4670" },
        },
      },
    },
  },
};

// Header cell content: title (or sort label) with its filter icon beside it.
const headerRow = (align: "flex-start" | "flex-end") => ({
  display: "flex",
  alignItems: "center",
  gap: 0.25,
  justifyContent: align,
});

export default function StockTableHead({ orderBy, order, onSort, filters }: StockTableHeadProps) {
  const t = useTranslations("table.columns");
  const tf = useTranslations("table.filters");
  const tv = useTranslations("table.values");
  const sortLabel = (col: SortableColumn, label: string) => (
    <TableSortLabel
      active={orderBy === col}
      direction={orderBy === col ? order : "desc"}
      onClick={() => onSort(col)}
    >
      <Typography variant="subtitle2" fontWeight={600}>{label}</Typography>
    </TableSortLabel>
  );

  return (
    <TableHead>
      <TableRow>
        {/* Symbol — title + filter icon, pinned to the left edge. */}
        <TableCell sx={{ ...stickyCell, left: 0, zIndex: 3 }}>
          <Box sx={headerRow("flex-start")}>
            <Typography variant="subtitle2" fontWeight={600}>{t("symbol")}</Typography>
            <ColumnFilterPopover
              active={filters.symbol.trim() !== ""}
              value={filters.symbol}
              onCommit={filters.setSymbol}
              label={t("symbol")}
            >
              {(draft, setDraft, commit) => (
                <TextField
                  autoFocus
                  size="small"
                  label={t("symbol")}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                  }}
                  sx={accentField}
                />
              )}
            </ColumnFilterPopover>
          </Box>
        </TableCell>
        <TableCell align="right" sx={{ ...stickyCell, width: "80px" }}>
          {sortLabel("percentageChange", t("percentageChange"))}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("volatility", t("volatility"))}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("percentPositiveDays", t("percentPositiveDays"))}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("returnStdDev", t("returnStdDev"))}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("maxDrawdown", t("maxDrawdown"))}
        </TableCell>
        {/* Is Momentum — title + filter icon. */}
        <TableCell align="right" sx={stickyCell}>
          <Box sx={headerRow("flex-end")}>
            <Typography variant="subtitle2" fontWeight={600}>{t("isMomentum")}</Typography>
            <ColumnFilterPopover
              active={filters.momentum !== "all"}
              value={filters.momentum}
              onCommit={filters.setMomentum}
              label={tf("momentum")}
            >
              {(draft, setDraft) => (
                <FormControl size="small" fullWidth sx={accentField}>
                  <Select
                    value={draft}
                    onChange={(e: SelectChangeEvent) => setDraft(e.target.value as MomentumFilter)}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="all">{tf("all")}</MenuItem>
                    <MenuItem value="yes">{tv("yes")}</MenuItem>
                    <MenuItem value="no">{tv("no")}</MenuItem>
                  </Select>
                </FormControl>
              )}
            </ColumnFilterPopover>
          </Box>
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          <TableSortLabel
            active={orderBy === "eps"}
            direction={orderBy === "eps" ? order : "desc"}
            onClick={() => onSort("eps")}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
              <Typography variant="subtitle2" fontWeight={600}>{t("eps")}</Typography>
              <Tooltip title={<EpsTooltipContent />} arrow placement="top">
                <InfoOutlined fontSize="small" sx={{ color: "text.secondary", cursor: "help" }} />
              </Tooltip>
            </Box>
          </TableSortLabel>
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          <TableSortLabel
            active={orderBy === "rsi"}
            direction={orderBy === "rsi" ? order : "desc"}
            onClick={() => onSort("rsi")}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
              <Typography variant="subtitle2" fontWeight={600}>{t("rsi")}</Typography>
              <Tooltip title={<RsiTooltipContent />} arrow placement="top">
                <InfoOutlined fontSize="small" sx={{ color: "text.secondary", cursor: "help" }} />
              </Tooltip>
            </Box>
          </TableSortLabel>
        </TableCell>
        <TableCell align="right" sx={{ ...stickyCell, width: "80px" }}>
          {sortLabel("oldestPrice", t("oldestPrice"))}
        </TableCell>
        <TableCell align="right" sx={{ ...stickyCell, width: "80px" }}>
          {sortLabel("newestPrice", t("newestPrice"))}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("targetPrice", t("targetPrice"))}
        </TableCell>
        <TableCell sx={stickyCell}>
          <Typography variant="subtitle2" fontWeight={600}>{t("company")}</Typography>
        </TableCell>
        {/* Market Cap — sortable title + filter icon (min cap in millions). */}
        <TableCell align="right" sx={stickyCell}>
          <Box sx={headerRow("flex-end")}>
            {sortLabel("marketCapitalization", t("marketCap"))}
            <ColumnFilterPopover
              active={filters.minMarketCap.trim() !== ""}
              value={filters.minMarketCap}
              onCommit={filters.setMinMarketCap}
              label={tf("minMarketCap")}
            >
              {(draft, setDraft, commit) => (
                <TextField
                  autoFocus
                  type="number"
                  size="small"
                  label={tf("minMarketCap")}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                  }}
                  inputProps={{ min: 0 }}
                  sx={accentField}
                />
              )}
            </ColumnFilterPopover>
          </Box>
        </TableCell>
        {/* Sector — title + filter icon. */}
        <TableCell sx={stickyCell}>
          <Box sx={headerRow("flex-start")}>
            <Typography variant="subtitle2" fontWeight={600}>{t("sector")}</Typography>
            <ColumnFilterPopover
              active={filters.sector !== ""}
              value={filters.sector}
              onCommit={filters.setSector}
              label={t("sector")}
            >
              {(draft, setDraft) => (
                <FormControl
                  size="small"
                  fullWidth
                  sx={accentField}
                  disabled={filters.sectorOptions.length === 0}
                >
                  <Select
                    value={draft}
                    displayEmpty
                    onChange={(e: SelectChangeEvent) => setDraft(e.target.value)}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="">{tf("all")}</MenuItem>
                    {filters.sectorOptions.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </ColumnFilterPopover>
          </Box>
        </TableCell>
        <TableCell sx={stickyCell}>
          <Typography variant="subtitle2" fontWeight={600}>{t("description")}</Typography>
        </TableCell>
        <TableCell sx={{ ...stickyCell, position: { xs: "static", sm: "sticky" }, right: { xs: "auto", sm: 80 }, width: "80px", zIndex: { xs: 1, sm: 3 } }}>
          <Typography variant="subtitle2" fontWeight={600}>{t("details")}</Typography>
        </TableCell>
        <TableCell sx={{ ...stickyCell, position: { xs: "static", sm: "sticky" }, right: { xs: "auto", sm: 0 }, width: "80px", zIndex: { xs: 1, sm: 3 } }}>
          <Typography variant="subtitle2" fontWeight={600}>{t("actions")}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
