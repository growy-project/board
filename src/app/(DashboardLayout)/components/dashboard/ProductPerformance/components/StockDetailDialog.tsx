import React from "react";
import { Dialog, Box, IconButton, Typography, Divider, Button, Chip } from "@mui/material";
import { Close } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslations, useFormatter } from "next-intl";
import type { StockPerformance } from "../types";

interface ChartDataPoint {
  [key: string]: unknown;
  closePrice: number;
  ema20: number | null;
  unixDate: number;
}

interface StockDetailDialogProps {
  open: boolean;
  symbol: string | undefined;
  stock: StockPerformance | null | undefined;
  chartDataset: ChartDataPoint[] | null;
  onClose: () => void;
}

const CLOSE_COLOR = "#278ab0";
const EMA_COLOR = "#1dc690";
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

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Box sx={{ width: 10, height: 10, borderRadius: "2px", backgroundColor: color }} />
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{label}</Typography>
    </Box>
  );
}

function StatBlock({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <Typography sx={{ fontSize: 10, fontWeight: 600, color: "text.secondary", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: valueColor ?? "text.primary" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function StockDetailDialog({
  open,
  symbol,
  stock,
  chartDataset,
  onClose,
}: StockDetailDialogProps) {
  const t = useTranslations("stockDetail");
  const format = useFormatter();

  const formatRangeLabel = React.useCallback(
    (v: number) => format.dateTime(new Date(v), "short"),
    [format],
  );
  const formatAxisLabel = React.useCallback(
    (v: number, context: { location: string }) =>
      context.location.includes("tooltip")
        ? format.dateTime(new Date(v), "short")
        : format.dateTime(new Date(v), "monthYear"),
    [format],
  );

  const range =
    chartDataset && chartDataset.length > 0
      ? `${formatRangeLabel(chartDataset[0].unixDate)} — ${formatRangeLabel(
          chartDataset[chartDataset.length - 1].unixDate
        )}`
      : null;

  const yBounds = React.useMemo(() => {
    if (!chartDataset || chartDataset.length === 0) return null;
    const values: number[] = [];
    for (const point of chartDataset) {
      values.push(point.closePrice);
      if (point.ema20 !== null) values.push(point.ema20);
    }
    if (values.length === 0) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.08 || max * 0.02;
    return { min: Math.max(0, min - padding), max: max + padding };
  }, [chartDataset]);

  const pctChange = stock?.percentageChange;
  const pctLabel =
    pctChange != null
      ? `${pctChange >= 0 ? "+" : ""}${format.number(pctChange, "decimal2")}%`
      : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxWidth: "1035px", borderRadius: 2, p: 3 } }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <linearGradient id="stockDetailAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CLOSE_COLOR} stopOpacity={0.18} />
            <stop offset="100%" stopColor={CLOSE_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
              {stock?.companyName ? `${stock.companyName} — ${symbol ?? ""}` : (symbol ?? "")}
            </Typography>
            {pctLabel && (
              <Chip
                label={pctLabel}
                size="small"
                sx={{
                  backgroundColor: "#1dc690",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  height: 22,
                }}
              />
            )}
          </Box>
          {range && (
            <Typography sx={{ fontSize: 12, color: "text.secondary", mt: "2px" }}>
              {range}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: "18px" }}>
            <LegendSwatch color={CLOSE_COLOR} label={t("legendClose")} />
            <LegendSwatch color={EMA_COLOR} label={t("legendEma")} />
          </Box>
          <IconButton onClick={onClose} size="small" aria-label={t("close")}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Chart */}
      {chartDataset ? (
        <LineChart
          dataset={chartDataset}
          colors={[CLOSE_COLOR, EMA_COLOR]}
          height={320}
          margin={{ left: 48, right: 16, top: 16, bottom: 32 }}
          grid={{ horizontal: true }}
          xAxis={[
            {
              dataKey: "unixDate",
              scaleType: "time",
              valueFormatter: formatAxisLabel,
              disableLine: true,
              disableTicks: true,
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              min: yBounds?.min,
              max: yBounds?.max,
            },
          ]}
          series={[
            {
              id: "closePrice",
              dataKey: "closePrice",
              label: t("legendClose"),
              showMark: false,
              area: true,
              curve: "monotoneX",
            },
            {
              id: "ema20",
              dataKey: "ema20",
              label: t("legendEma"),
              showMark: false,
              curve: "monotoneX",
            },
          ]}
          slots={{ legend: () => null }}
          sx={{
            "& .MuiChartsAxis-tickLabel": { fontSize: 10, fill: (t) => t.palette.text.secondary },
            "& .MuiChartsGrid-line": { stroke: (t) => t.palette.divider },
            "& .MuiAreaElement-series-closePrice": {
              fill: "url(#stockDetailAreaGradient)",
              fillOpacity: 1,
              filter: "none",
            },
            "& .MuiLineElement-series-ema20": { strokeDasharray: "4 3" },
          }}
        />
      ) : (
        <Box sx={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="body2" color="textSecondary">
            {t("loading")}
          </Typography>
        </Box>
      )}

      {/* Stats row + Close button */}
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {stock && (
            <>
              <StatBlock
                label={t("price")}
                value={format.number(stock.newestPrice, "currency")}
              />
              <StatBlock
                label={t("target")}
                value={stock.targetPrice != null ? format.number(stock.targetPrice, "currency") : EMPTY}
                valueColor={stock.targetPrice != null ? EMA_COLOR : undefined}
              />
              <StatBlock
                label={t("rsi")}
                value={format.number(stock.rsi, "decimal2")}
                valueColor={EMA_COLOR}
              />
              <StatBlock
                label={t("marketCap")}
                value={stock.marketCapitalization != null ? formatMarketCap(stock.marketCapitalization, format) : EMPTY}
              />
              <StatBlock
                label={t("sector")}
                value={stock.sector ?? EMPTY}
              />
            </>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ backgroundColor: "#278ab0", "&:hover": { backgroundColor: "#1c4670" } }}
        >
          {t("close")}
        </Button>
      </Box>
    </Dialog>
  );
}
