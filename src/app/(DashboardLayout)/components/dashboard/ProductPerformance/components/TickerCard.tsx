import React from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import { Visibility, MoreVert } from "@mui/icons-material";
import { useFormatter, useTranslations } from "next-intl";
import type { StockPerformance } from "../types";

export interface TickerCardProps {
  product: StockPerformance;
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

const TickerCard = React.memo(function TickerCard({
  product,
  onDetailClick,
  onActionsClick,
}: TickerCardProps) {
  const format = useFormatter();
  const tv = useTranslations("table.values");

  return (
    <Card
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      {/* Top section: Symbol, Company, % Change */}
      <Stack spacing={1.5}>
        {/* Header with symbol and change */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            pb: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="span"
              onClick={() => onDetailClick(product)}
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "text.primary",
                cursor: "pointer",
                textDecoration: "underline",
                textDecorationThickness: "1px",
                textUnderlineOffset: "2px",
              }}
            >
              {product.symbol}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 200,
              }}
            >
              {product.companyName || EMPTY}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Chip
              sx={{
                px: "8px",
                backgroundColor:
                  product.percentageChange > 0 ? "#1dc690" : "#1c4670",
                color: "#fff",
                fontWeight: 500,
              }}
              size="small"
              label={format.number(product.percentageChange / 100, "percent2")}
            />
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              {format.number(product.newestPrice, "currency")}
            </Typography>
          </Box>
        </Box>

        {/* Metrics grid: RSI, Target Price, Market Cap, etc */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                RSI
              </Typography>
              <Chip
                sx={{
                  display: "block",
                  width: "100%",
                  mt: 0.5,
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
            </Box>
          </Box>

          <Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Target Price
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "text.primary",
                }}
              >
                {product.targetPrice != null
                  ? format.number(product.targetPrice, "currency")
                  : EMPTY}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Market Cap
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "text.primary",
                }}
              >
                {product.marketCapitalization
                  ? formatMarketCap(product.marketCapitalization, format)
                  : EMPTY}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Volatility
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "text.primary",
                }}
              >
                {format.number(product.volatility / 100, "percent1")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tags and actions footer */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Chip
            size="small"
            label={
              product.isInMomentum == null
                ? EMPTY
                : product.isInMomentum
                  ? "Is Momentum: Yes"
                  : "Is Momentum: No"
            }
            sx={{
              backgroundColor:
                product.isInMomentum === true ? "#e8f5e9" : "transparent",
              color:
                product.isInMomentum === true
                  ? "#1dc690"
                  : "text.secondary",
              border:
                product.isInMomentum === false
                  ? "1px solid"
                  : "none",
              borderColor: product.isInMomentum === false ? "divider" : undefined,
            }}
          />

          <Chip
            size="small"
            label={
              product.isBouncing == null
                ? EMPTY
                : product.isBouncing
                  ? "Is Bouncing: Yes"
                  : "Is Bouncing: No"
            }
            sx={{
              backgroundColor:
                product.isBouncing === true ? "#e8f5e9" : "transparent",
              color:
                product.isBouncing === true
                  ? "#1dc690"
                  : "text.secondary",
              border:
                product.isBouncing === false
                  ? "1px solid"
                  : "none",
              borderColor: product.isBouncing === false ? "divider" : undefined,
            }}
          />

          {product.sector && (
            <Chip
              size="small"
              label={product.sector}
              variant="outlined"
              sx={{
                borderColor: "divider",
                color: "text.secondary",
              }}
            />
          )}

          <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
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
          </Box>
        </Box>
      </Stack>
    </Card>
  );
});

export default TickerCard;
