import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel, Typography, Box, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { EPS_TOOLTIP_CONTENT, RSI_TOOLTIP_CONTENT } from "../constants";
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
          <Typography variant="subtitle2" fontWeight={600}>Symbol</Typography>
        </TableCell>
        <TableCell align="right" sx={{ ...stickyCell, width: "120px" }}>
          {sortLabel("percentageChange", "Percentage Change")}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("volatility", "Volatility %")}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          <TableSortLabel
            active={orderBy === "eps"}
            direction={orderBy === "eps" ? order : "desc"}
            onClick={() => onSort("eps")}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
              <Typography variant="subtitle2" fontWeight={600}>EPS</Typography>
              <Tooltip title={EPS_TOOLTIP_CONTENT} arrow placement="top">
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
              <Typography variant="subtitle2" fontWeight={600}>RSI</Typography>
              <Tooltip title={RSI_TOOLTIP_CONTENT} arrow placement="top">
                <InfoOutlined fontSize="small" sx={{ color: "text.secondary", cursor: "help" }} />
              </Tooltip>
            </Box>
          </TableSortLabel>
        </TableCell>
        <TableCell align="right" sx={{ ...stickyCell, width: "80px" }}>
          {sortLabel("oldestPrice", "Oldest Price")}
        </TableCell>
        <TableCell align="right" sx={{ ...stickyCell, width: "80px" }}>
          {sortLabel("newestPrice", "Newest Price")}
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("targetPrice", "Target Price")}
        </TableCell>
        <TableCell sx={stickyCell}>
          <Typography variant="subtitle2" fontWeight={600}>Company</Typography>
        </TableCell>
        <TableCell align="right" sx={stickyCell}>
          {sortLabel("marketCapitalization", "Market Cap")}
        </TableCell>
        <TableCell sx={{ ...stickyCell, width: "90px" }}>
          <Typography variant="subtitle2" fontWeight={600}>Sector</Typography>
        </TableCell>
        <TableCell sx={stickyCell}>
          <Typography variant="subtitle2" fontWeight={600}>Description</Typography>
        </TableCell>
        <TableCell sx={{ ...stickyCell, right: 80, width: "80px", zIndex: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>Details</Typography>
        </TableCell>
        <TableCell sx={{ ...stickyCell, right: 0, width: "80px", zIndex: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>Actions</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
