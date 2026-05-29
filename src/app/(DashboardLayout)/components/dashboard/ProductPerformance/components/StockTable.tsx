import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  Typography,
  Pagination,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import StockTableHead from "./StockTableHead";
import StockTableRow from "./StockTableRow";
import TickerCard from "./TickerCard";
import { GradientCircularProgress } from "./StockLoadingOverlay";
import type { StockPerformance } from "../types";
import type { SortableColumn } from "../utils";

interface StockTableProps {
  sortedResults: StockPerformance[];
  exchange: string;
  isPageLoading: boolean;
  isStale: boolean;
  orderBy: SortableColumn;
  order: "asc" | "desc";
  currentPage: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
  onSort: (col: SortableColumn) => void;
  onPageChange: (e: React.ChangeEvent<unknown>, page: number) => void;
  onDetailClick: (product: StockPerformance) => void;
  onActionsClick: (e: React.MouseEvent<HTMLButtonElement>, product: StockPerformance) => void;
}

const SORT_COLUMNS: Array<{ key: SortableColumn; labelKey: string }> = [
  { key: "percentageChange", labelKey: "percentageChange" },
  { key: "volatility", labelKey: "volatility" },
  { key: "percentPositiveDays", labelKey: "percentPositiveDays" },
  { key: "returnStdDev", labelKey: "returnStdDev" },
  { key: "maxDrawdown", labelKey: "maxDrawdown" },
  { key: "eps", labelKey: "eps" },
  { key: "rsi", labelKey: "rsi" },
  { key: "oldestPrice", labelKey: "oldestPrice" },
  { key: "newestPrice", labelKey: "newestPrice" },
  { key: "targetPrice", labelKey: "targetPrice" },
  { key: "marketCapitalization", labelKey: "marketCap" },
];

export default function StockTable({
  sortedResults,
  exchange,
  isPageLoading,
  isStale,
  orderBy,
  order,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onSort,
  onPageChange,
  onDetailClick,
  onActionsClick,
}: StockTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tTable = useTranslations("table");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const activeColumnLabel = SORT_COLUMNS.find((col) => col.key === orderBy)?.labelKey || "percentageChange";

  return (
    <Box sx={{ width: "100%" }}>
      {/* Mobile: Ticker Cards */}
      {isMobile && (
        <Box
          sx={{
            position: "relative",
            transition: "opacity 200ms ease, filter 200ms ease",
            ...(isStale && {
              opacity: 0.55,
              filter: "grayscale(40%)",
            }),
          }}
        >
          {isPageLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
                minHeight: "300px",
              }}
            >
              <GradientCircularProgress />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Button
              size="small"
              variant="text"
              endIcon={order === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {tTable("sortBy")}: {tTable(`columns.${activeColumnLabel}`)}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {SORT_COLUMNS.map(({ key, labelKey }) => (
                <MenuItem
                  key={key}
                  selected={orderBy === key}
                  onClick={() => {
                    onSort(key);
                    setAnchorEl(null);
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {tTable(`columns.${labelKey}`)}
                    </Typography>
                    {orderBy === key && (order === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ mt: 2 }}>
            {sortedResults.map((product) => (
              <TickerCard
                key={product.symbol}
                product={product}
                exchange={exchange}
                onDetailClick={onDetailClick}
                onActionsClick={onActionsClick}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Desktop: Traditional Table */}
      {!isMobile && (
        <Box
          sx={{
            position: "relative",
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "500px",
            transition: "opacity 200ms ease, filter 200ms ease",
            ...(isStale && {
              opacity: 0.55,
              filter: "grayscale(40%)",
            }),
          }}
        >
          {isPageLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
                minHeight: "400px",
              }}
            >
              <GradientCircularProgress />
            </Box>
          )}
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <StockTableHead orderBy={orderBy} order={order} onSort={onSort} />
            <TableBody>
              {sortedResults.map((product) => (
                <StockTableRow
                  key={product.symbol}
                  product={product}
                  exchange={exchange}
                  onDetailClick={onDetailClick}
                  onActionsClick={onActionsClick}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {totalItems && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
          </Typography>
          {totalPages && totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={onPageChange}
              disabled={isPageLoading}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          )}
        </Box>
      )}
    </Box>
  );
}
