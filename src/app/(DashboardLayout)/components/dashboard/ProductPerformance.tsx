import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  TextField,
  Stack,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  Close,
  InfoOutlined,
  ErrorOutline,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

import * as realService from "../../services/statisticJobService";
//import * as mockService from "../../services/mockStatisticJobService";

// const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
// const service = useMock ? mockService : realService;

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </React.Fragment>
  );
}

const ProductPerformance = () => {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exchange, setExchange] = useState<string>("CEDEAR");
  const [minPercentageChange, setMinPercentageChange] = useState<number>(50);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2025-01-01"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs("2025-05-31"));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockPerformance | null>(
    null,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isJobFinishedRef = useRef(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = (startedJobId: string) => {
    const poll = async () => {
      if (isJobFinishedRef.current) return;

      try {
        const info = await realService.getJobStatus(startedJobId, 1, pageSize);
        setStatus(info);
        console.log(info);

        if (info.isFinished || info.percentComplete === 100) {
          isJobFinishedRef.current = true;
          return; // no seguimos reprogramando
        }

        // Reprogramar la siguiente ejecución
        timeoutRef.current = setTimeout(poll, 1000);
      } catch (err: any) {
        isJobFinishedRef.current = true;
        const message =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Error retrieving job status";
        setError(
          typeof message === "string" ? message : "Error retrieving job status",
        );
      }
    };

    poll(); // lanzar la primera vez
  };

  // Load initial data on component mount
  useEffect(() => {
    handleSearch();
  }, []); // Only run once on mount

  const handleSearch = async () => {
    // Reset job state when search is triggered
    setStatus(null);
    setJobId(null);
    setError(null);
    setCurrentPage(1); // Reset to first page
    setIsPageLoading(false); // Reset page loading state

    isJobFinishedRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      const params = {
        startUnixDate: startDate
          ? startDate.unix()
          : dayjs("2025-01-01").unix(),
        endUnixDate: endDate ? endDate.unix() : dayjs("2025-05-31").unix(),
        minimumExpectedGrowth: minPercentageChange,
        exchange: exchange,
      };

      console.log("Starting job with params:", params);
      const newJobId = await realService.startStatisticJob(params);

      console.log("Job iniciado con ID:", newJobId);
      setJobId(newJobId);

      startPolling(newJobId); // 🔹 Aquí arrancamos el polling recursivo
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Error starting the analysis job";
      setError(
        typeof message === "string"
          ? message
          : "Error starting the analysis job",
      );
    }
  };

  // Separate effect for page changes (without resetting the job)

  return (
    <>
      <DashboardCard
        title="Stock Performance"
        action={
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl
                size="small"
                sx={{
                  minWidth: "120px",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#278ab0", // Blue Grotto
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1c4670", // Blue
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "#1c4670", // Blue
                    },
                  },
                }}
              >
                <InputLabel id="exchange-select-label">Exchange</InputLabel>
                <Select
                  labelId="exchange-select-label"
                  id="exchange-select"
                  value={exchange}
                  label="Exchange"
                  onChange={(e) => setExchange(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            backgroundColor: "#eaeae0", // Ivory
                            color: "#1c4670", // Blue
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#278ab0", // Blue Grotto
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#1c4670", // Blue
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="NASDAQ">NASDAQ</MenuItem>
                  <MenuItem value="NYSE">NYSE</MenuItem>
                  <MenuItem value="CEDEAR">CEDEAR</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Minimum Percentage Change"
                color="secondary"
                focused
                type="number"
                value={minPercentageChange}
                onChange={(e) => setMinPercentageChange(Number(e.target.value))}
                size="small"
                sx={{ minWidth: "180px" }}
              />
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: "140px" },
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: "140px" },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={status && !status.isFinished}
                sx={{
                  backgroundColor: "#278ab0", // Blue Grotto
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1c4670", // Blue
                  },
                  "&:disabled": {
                    backgroundColor: "#eaeae0", // Ivory
                    color: "#999",
                  },
                  minWidth: "100px",
                  height: "40px",
                }}
              >
                Search
              </Button>
            </Stack>
          </LocalizationProvider>
        }
      >
        {!error && (!status || !status.isFinished) ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "800px",
              gap: 2,
            }}
          >
            {status?.processingMessage && (
              <Typography variant="body1" color="textSecondary">
                {status.processingMessage}
              </Typography>
            )}
            <GradientCircularProgress />
          </Box>
        ) : (
          <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
            {/* Table with loading overlay */}
            <Box sx={{ position: "relative" }}>
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
                    zIndex: 1,
                    minHeight: "400px",
                  }}
                >
                  <GradientCircularProgress />
                </Box>
              )}
              <Table
                aria-label="simple table"
                sx={{
                  whiteSpace: "nowrap",
                  mt: 2,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Symbol
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "120px" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Percentage Change
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Volatility %
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          EPS
                        </Typography>
                        <Tooltip
                          title={
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ mb: 1 }}
                              >
                                Earnings Per Share(EPS)
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                It tells you how much profit a company makes for
                                each outstanding share.
                              </Typography>
                              <Typography variant="body2">
                                EPS = (Net Income − Preferred Dividends) /
                                Average Outstanding Shares
                              </Typography>
                            </Box>
                          }
                          arrow
                          placement="top"
                        >
                          <InfoOutlined
                            fontSize="small"
                            sx={{ color: "text.secondary", cursor: "help" }}
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Target Price
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          RSI
                        </Typography>
                        <Tooltip
                          title={
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ mb: 1 }}
                              >
                                Relative Strength Index (RSI)
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                Stocks trending up often hold RSI above 50
                                without dipping too much.
                              </Typography>
                              <Typography variant="body2">
                                A sustained RSI between 55–70 indicates
                                controlled growth (not overheated).
                              </Typography>
                            </Box>
                          }
                          arrow
                          placement="top"
                        >
                          <InfoOutlined
                            fontSize="small"
                            sx={{ color: "text.secondary", cursor: "help" }}
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "100px" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Oldest Price
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "100px" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Oldest Date
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "100px" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Newest Price
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Newest Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Market Cap
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Detail
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(status?.result) &&
                    status.result.map((product) => (
                      <TableRow key={product.symbol}>
                        <TableCell>
                          <Typography
                            sx={{ fontSize: "15px", fontWeight: "500" }}
                          >
                            <a
                              href={`https://www.google.com/finance/quote/${product.symbol}:NASDAQ?window=1Y`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "inherit",
                                textDecoration: "underline",
                              }}
                            >
                              {product.symbol}
                            </a>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            sx={{
                              px: "4px",
                              backgroundColor:
                                product.percentageChange > 0
                                  ? "#1dc690" // Neon Green
                                  : "#1c4670", // Blue
                              color: "#fff",
                            }}
                            size="small"
                            label={`${product.percentageChange.toFixed(2)}%`}
                          ></Chip>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.volatility.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            ${product.earningsPerShare.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            ${product.targetPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            sx={{
                              px: "4px",
                              backgroundColor:
                                product.rsi > 70
                                  ? "#1c4670" // Blue (overbought)
                                  : product.rsi < 30
                                    ? "#1dc690" // Neon Green (oversold)
                                    : "#278ab0", // Blue Grotto (neutral)
                              color: "#fff",
                            }}
                            size="small"
                            label={product.rsi.toFixed(1)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            ${product.oldestPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.oldestPriceDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            ${product.newestPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.newestPriceDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            ${(product.marketCap / 1000000000).toFixed(2)}B
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            sx={{
                              color: "#278ab0", // Blue Grotto
                              "&:hover": {
                                backgroundColor: "#eaeae0", // Ivory
                                color: "#1c4670", // Blue on hover
                              },
                            }}
                            onClick={() => {
                              setSelectedStock(product);
                              setDialogOpen(true);
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>

            {/* Pagination Info */}
            {status && status.totalItems && (
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
                  {Math.min(currentPage * pageSize, status.totalItems)} of{" "}
                  {status.totalItems} results
                </Typography>

                {/* Pagination */}
                {status.totalPages && status.totalPages > 1 && (
                  <Pagination
                    count={status.totalPages}
                    page={currentPage}
                    onChange={(event, page) => {
                      if (!isPageLoading) {
                        setCurrentPage(page);
                      }
                    }}
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
        )}
      </DashboardCard>

      {/* Error Dialog */}
      <Dialog
        open={error !== null}
        onClose={() => {
          setError(null);
          setStatus({
            result: [],
            percentComplete: 0,
            isFinished: true,
            status: "error",
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#d32f2f",
            }}
          >
            <ErrorOutline />
            <Typography variant="h6">Error</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setError(null);
              setStatus({
                result: [],
                percentComplete: 0,
                isFinished: true,
                status: "error",
              });
            }}
            variant="contained"
            sx={{
              backgroundColor: "#278ab0",
              "&:hover": { backgroundColor: "#1c4670" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              Stock Details - {selectedStock?.symbol}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textSecondary">
            Detail content will be added here...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export interface StockPerformance {
  symbol: string;
  percentageChange: number;
  oldestPrice: number;
  newestPrice: number;
  oldestPriceDate: string;
  newestPriceDate: string;
  marketCap: number;
  earningsPerShare: number;
  targetPrice: number;
  rsi: number;
  volatility: number;
}

export interface JobStatus {
  result: StockPerformance[];
  percentComplete: number;
  isFinished: boolean;
  errors?: string;
  status: string;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  processingMessage?: string;
}

export default ProductPerformance;
