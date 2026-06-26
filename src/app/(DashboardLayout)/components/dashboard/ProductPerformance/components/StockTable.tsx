import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
  Collapse,
  Badge,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, FilterList } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import StockTableHead from "./StockTableHead";
import StockTableRow from "./StockTableRow";
import TickerCard from "./TickerCard";
import ColumnFilters from "./ColumnFilters";
import ColumnChooser from "./ColumnChooser";
import { GradientCircularProgress } from "./StockLoadingOverlay";
import type { StockPerformance } from "../types";
import type { SortableColumn } from "../utils";
import type { UseColumnFiltersResult } from "../hooks/useColumnFilters";
import { useColumnVisibility } from "../hooks/useColumnVisibility";

interface StockTableProps {
  sortedResults: StockPerformance[];
  exchange: string;
  isPageLoading: boolean;
  isStale: boolean;
  orderBy: SortableColumn;
  order: "asc" | "desc";
  totalItems?: number;
  filters: UseColumnFiltersResult;
  onSort: (col: SortableColumn) => void;
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
  totalItems,
  filters,
  onSort,
  onDetailClick,
  onActionsClick,
}: StockTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tTable = useTranslations("table");
  const tf = useTranslations("table.filters");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const columns = useColumnVisibility();

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

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Badge color="primary" variant="dot" invisible={!filters.hasActiveFilters}>
              <Button
                size="small"
                variant="text"
                startIcon={<FilterList fontSize="small" />}
                onClick={() => setShowFilters((v) => !v)}
              >
                {tf("filters")}
              </Button>
            </Badge>
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

          <Collapse in={showFilters} unmountOnExit>
            <Box sx={{ mb: 1 }}>
              <ColumnFilters filters={filters} />
            </Box>
          </Collapse>

          <Box sx={{ mt: 2 }}>
            {sortedResults.map((product) => (
              <TickerCard
                key={product.symbol}
                product={product}
                onDetailClick={onDetailClick}
                onActionsClick={onActionsClick}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Desktop: Traditional Table */}
      {!isMobile && (
        <>
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={filters.resetFilters}
            disabled={!filters.hasActiveFilters}
            sx={{
              color: "#1c4670",
              borderColor: "#278ab0",
              "&:hover": { borderColor: "#1c4670", backgroundColor: "#eaeae0" },
            }}
          >
            {tf("clear")}
          </Button>
          <ColumnChooser visible={columns.visible} onToggle={columns.toggle} onReset={columns.reset} />
        </Box>
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
            <StockTableHead orderBy={orderBy} order={order} onSort={onSort} filters={filters} visible={columns.visible} />
            <TableBody>
              {sortedResults.map((product) => (
                <StockTableRow
                  key={product.symbol}
                  product={product}
                  exchange={exchange}
                  visible={columns.visible}
                  onDetailClick={onDetailClick}
                  onActionsClick={onActionsClick}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
        </>
      )}

      {totalItems != null && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {tTable("resultsCount", { count: totalItems })}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
