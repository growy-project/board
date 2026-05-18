import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel, Typography, Box, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { EpsTooltipContent, RsiTooltipContent } from "../constants";
import type { SortableColumn } from "../utils";

interface StockTableHeadProps {
  orderBy: SortableColumn;
  order: "asc" | "desc";
  onSort: (column: SortableColumn) => void;
}

const stickyCell = {
  position: "sticky" as const,
  top: 0,
  zIndex: 1,
  backgroundColor: "background.paper",
};

export default function StockTableHead({ orderBy, order, onSort }: StockTableHeadProps) {
  const t = useTranslations("table.columns");
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
        <TableCell sx={{ ...stickyCell, left: 0, zIndex: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>{t("symbol")}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ ...stickyCell, width: "120px" }}>
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
        <TableCell align="right" sx={stickyCell}>
          <Typography variant="subtitle2" fontWeight={600}>{t("isMomentum")}</Typography>
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
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("marketCapitalization", t("marketCap"))}
        </TableCell>
        <TableCell sx={{ ...stickyCell, width: "90px" }}>
          <Typography variant="subtitle2" fontWeight={600}>{t("sector")}</Typography>
        </TableCell>
        <TableCell sx={stickyCell}>
          <Typography variant="subtitle2" fontWeight={600}>{t("description")}</Typography>
        </TableCell>
        <TableCell sx={{ ...stickyCell, right: 80, width: "80px", zIndex: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>{t("details")}</Typography>
        </TableCell>
        <TableCell sx={{ ...stickyCell, right: 0, width: "80px", zIndex: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>{t("actions")}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
