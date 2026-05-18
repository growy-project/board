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
import { useFormatter, useTranslations } from "next-intl";
import type { StockPerformance } from "../types";

export interface StockTableRowProps {
  product: StockPerformance;
  exchange: string;
  onDetailClick: (product: StockPerformance) => void;
  onActionsClick: (e: React.MouseEvent<HTMLButtonElement>, product: StockPerformance) => void;
}

const EMPTY = "—";

function formatMarketCap(
  value: number,
  format: ReturnType<typeof useFormatter>,
): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${format.number(value / 1_000_000_000, "decimal2")}B`;
  }
  if (abs >= 1_000_000) {
    return `${format.number(value / 1_000_000, "decimal2")}M`;
  }
  if (abs >= 1_000) {
    return `${format.number(value / 1_000, "decimal2")}K`;
  }
  return format.number(value, "decimal2");
}

const StockTableRow = React.memo(function StockTableRow({
  product,
  exchange,
  onDetailClick,
  onActionsClick,
}: StockTableRowProps) {
  const format = useFormatter();
  const tv = useTranslations("table.values");
  const effectiveExchange = product.exchange ?? exchange;
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
            href={`https://www.google.com/finance/quote/${product.symbol}${effectiveExchange === "NASDAQ" ? ":NASDAQ" : ""}?window=1Y`}
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
          label={format.number(product.percentageChange / 100, "percent2")}
        />
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {format.number(product.volatility / 100, "percent1")}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.percentPositiveDays != null
            ? format.number(product.percentPositiveDays / 100, "percent1")
            : EMPTY}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.returnStdDev != null
            ? format.number(product.returnStdDev / 100, "percent2")
            : EMPTY}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.maxDrawdown != null
            ? format.number(product.maxDrawdown / 100, "percent2")
            : EMPTY}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.isInMomentum == null ? EMPTY : product.isInMomentum ? tv("yes") : tv("no")}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.eps != null ? format.number(product.eps, "currency") : EMPTY}
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
          label={format.number(product.rsi, "decimal1")}
        />
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {format.number(product.oldestPrice, "currency")}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {format.number(product.newestPrice, "currency")}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.targetPrice != null ? format.number(product.targetPrice, "currency") : EMPTY}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.companyName == null ? (
            EMPTY
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
            ? formatMarketCap(product.marketCapitalization, format)
            : EMPTY}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.sector ?? EMPTY}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
          {product.description == null ? (
            EMPTY
          ) : product.description.length > 25 ? (
            <Tooltip
              title={product.description}
              arrow
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    maxWidth: 360,
                    maxHeight: "60vh",
                    overflowY: "auto",
                    whiteSpace: "normal",
                    fontSize: 12,
                    lineHeight: 1.5,
                  },
                },
                popper: {
                  modifiers: [
                    { name: "preventOverflow", options: { padding: 16 } },
                    { name: "flip", options: { fallbackPlacements: ["bottom", "right", "left"] } },
                  ],
                },
              }}
            >
              <span>{product.description.slice(0, 25)}…</span>
            </Tooltip>
          ) : (
            product.description
          )}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          position: "sticky",
          right: 80,
          width: "80px",
          zIndex: 1,
          backgroundColor: "background.paper",
        }}
      >
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
          width: "80px",
          zIndex: 1,
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
