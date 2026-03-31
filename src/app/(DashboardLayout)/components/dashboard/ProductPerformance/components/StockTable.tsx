import React from "react";
import {
  Box,
  Table,
  TableBody,
  Typography,
  Pagination,
} from "@mui/material";
import StockTableHead from "./StockTableHead";
import StockTableRow from "./StockTableRow";
import { GradientCircularProgress } from "./StockLoadingOverlay";
import type { StockPerformance } from "../types";
import type { SortableColumn } from "../utils";

interface StockTableProps {
  sortedResults: StockPerformance[];
  exchange: string;
  isPageLoading: boolean;
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

export default function StockTable({
  sortedResults,
  exchange,
  isPageLoading,
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
  return (
    <Box sx={{ width: { xs: "280px", sm: "auto" } }}>
      <Box
        sx={{
          position: "relative",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "500px",
        }}
      >
        {isPageLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
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

      {totalItems && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
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
