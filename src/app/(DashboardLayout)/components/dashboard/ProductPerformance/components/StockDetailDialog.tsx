import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";

interface ChartDataPoint {
  [key: string]: unknown;
  closePrice: number;
  ema20: number | null;
  date: string;
}

interface StockDetailDialogProps {
  open: boolean;
  symbol: string | undefined;
  chartDataset: ChartDataPoint[] | null;
  onClose: () => void;
}

export default function StockDetailDialog({
  open,
  symbol,
  chartDataset,
  onClose,
}: StockDetailDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxWidth: "1035px" } }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Stock Details - {symbol}</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {chartDataset ? (
          <LineChart
            dataset={chartDataset}
            xAxis={[{ dataKey: "date", scaleType: "point", tickNumber: 6 }]}
            series={[
              { dataKey: "closePrice", label: "Close Price", showMark: false },
              { dataKey: "ema20", label: "EMA 20", showMark: false },
            ]}
            height={350}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
