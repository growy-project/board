import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Visibility, MoreVert } from "@mui/icons-material";
import type { StockPerformance } from "../types";

export interface StockTableRowProps {
  product: StockPerformance;
  exchange: string;
  onDetailClick: (product: StockPerformance) => void;
  onActionsClick: (e: React.MouseEvent<HTMLButtonElement>, product: StockPerformance) => void;
}

const StockTableRow = React.memo(function StockTableRow({
  product,
  exchange,
  onDetailClick,
  onActionsClick,
}: StockTableRowProps) {
  return (
    <TableRow>
      <TableCell
        sx={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          backgroundColor: "background.paper",
        }}
      >
        <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
          <a
            href={`https://www.google.com/finance/quote/${product.symbol}${exchange === "NASDAQ" ? ":NASDAQ" : ""}?window=1Y`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            {product.symbol}
          </a>
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Chip
          sx={{
            px: "4px",
            backgroundColor: product.percentageChange > 0 ? "#1dc690" : "#1c4670",
            color: "#fff",
          }}
          size="small"
          label={`${product.percentageChange.toFixed(2)}%`}
        />
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.volatility.toFixed(1)}%
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.eps != null ? `$${product.eps.toFixed(2)}` : "—"}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Chip
          sx={{
            px: "4px",
            backgroundColor:
              product.rsi > 70
                ? "#1c4670"
                : product.rsi < 30
                  ? "#1dc690"
                  : "#278ab0",
            color: "#fff",
          }}
          size="small"
          label={product.rsi.toFixed(1)}
        />
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          ${product.oldestPrice.toFixed(2)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          ${product.newestPrice.toFixed(2)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.targetPrice != null ? `$${product.targetPrice.toFixed(2)}` : "—"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.companyName == null ? (
            "—"
          ) : product.companyName.length > 25 ? (
            <Tooltip title={product.companyName} arrow placement="top">
              <span>{product.companyName.slice(0, 25)}…</span>
            </Tooltip>
          ) : (
            product.companyName
          )}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.marketCapitalization
            ? `${(product.marketCapitalization / 1_000_000_000).toFixed(2)}B`
            : "—"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.sector ?? "—"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.description == null ? (
            "—"
          ) : product.description.length > 25 ? (
            <Tooltip title={product.description} arrow placement="top">
              <span>{product.description.slice(0, 25)}…</span>
            </Tooltip>
          ) : (
            product.description
          )}
        </Typography>
      </TableCell>
      <TableCell>
        <IconButton
          size="small"
          sx={{
            color: "#278ab0",
            "&:hover": { backgroundColor: "#eaeae0", color: "#1c4670" },
          }}
          onClick={() => onDetailClick(product)}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell
        sx={{
          position: "sticky",
          right: 0,
          backgroundColor: "background.paper",
        }}
      >
        <IconButton
          size="small"
          sx={{
            color: "#278ab0",
            "&:hover": { backgroundColor: "#eaeae0", color: "#1c4670" },
          }}
          onClick={(e) => onActionsClick(e, product)}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export default StockTableRow;
