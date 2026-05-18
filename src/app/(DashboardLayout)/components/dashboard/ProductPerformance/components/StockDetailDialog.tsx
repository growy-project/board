import React from "react";
import { Dialog, Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslations, useFormatter } from "next-intl";

interface ChartDataPoint {
  [key: string]: unknown;
  closePrice: number;
  ema20: number | null;
  unixDate: number;
}

interface StockDetailDialogProps {
  open: boolean;
  symbol: string | undefined;
  chartDataset: ChartDataPoint[] | null;
  onClose: () => void;
}

const CLOSE_COLOR = "#278ab0";
const EMA_COLOR = "#1dc690";

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Box sx={{ width: 10, height: 10, borderRadius: "2px", backgroundColor: color }} />
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{label}</Typography>
    </Box>
  );
}

export default function StockDetailDialog({
  open,
  symbol,
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
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
            {t("title", { symbol: symbol ?? "" })}
          </Typography>
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
    </Dialog>
  );
}
