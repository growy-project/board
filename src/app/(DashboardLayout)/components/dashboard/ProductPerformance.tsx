import React, { useEffect, useRef, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
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
  Menu,
  Alert,
} from "@mui/material";
import {
  Visibility,
  Close,
  InfoOutlined,
  ErrorOutline,
  MoreVert,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

import * as realService from "../../services/statisticJobService";
import * as symbolService from "../../services/symbolService";
import type { SymbolDateRangeResult } from "../../services/symbolService";
import { useAuth } from "@/app/context/AuthContext";

const ADMIN_EMAIL = "growyserver@gmail.com";
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
  const { user } = useAuth();
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exchange, setExchange] = useState<string>("NASDAQ");
  const [minPercentageChange, setMinPercentageChange] = useState<number>(30);
  //YYYY-MM-DD
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2025-11-01"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs("2026-01-31"));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockPerformance | null>(
    null,
  );
  const [actionsMenuAnchor, setActionsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [actionsMenuStock, setActionsMenuStock] =
    useState<StockPerformance | null>(null);
  const [notAdminDialogOpen, setNotAdminDialogOpen] = useState(false);
  const [notAdminAction, setNotAdminAction] = useState<
    "toxic" | "topGrowth" | null
  >(null);
  const [notAdminMessage, setNotAdminMessage] = useState("");
  const [symbolHistory, setSymbolHistory] = useState<any>(null);
  const [dateRange, setDateRange] = useState<SymbolDateRangeResult | null>(
    null,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isJobFinishedRef = useRef(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Fetch valid date range whenever the selected exchange changes
  useEffect(() => {
    let cancelled = false;
    const fetchDateRange = async () => {
      try {
        const range = await symbolService.getExchangeDateRange(exchange);
        if (!cancelled) {
          setDateRange(range);
        }
      } catch {
        // Non-critical: leave dateRange as null so pickers remain unconstrained
      }
    };
    fetchDateRange();
    return () => {
      cancelled = true;
    };
  }, [exchange]);

  useEffect(() => {
    if (dialogOpen && symbolHistory) {
      console.log(symbolHistory);
    }
  }, [symbolHistory, dialogOpen]);

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
                minDate={dateRange ? dayjs(dateRange.firstDate) : undefined}
                maxDate={
                  endDate ?? (dateRange ? dayjs(dateRange.lastDate) : undefined)
                }
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
                minDate={
                  startDate ??
                  (dateRange ? dayjs(dateRange.firstDate) : undefined)
                }
                maxDate={dateRange ? dayjs(dateRange.lastDate) : undefined}
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
          <Box sx={{ width: { xs: "280px", sm: "auto" } }}>
            {/* Table with loading overlay */}
            <Box
              ref={tableContainerRef}
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
              <Table
                aria-label="simple table"
                sx={{
                  whiteSpace: "nowrap",
                  mt: 2,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Symbol
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "120px", position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Percentage Change
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Volatility %
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
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
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Target Price
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
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
                    <TableCell sx={{ width: "100px", position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Oldest Price
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "100px", position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Newest Price
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Company
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Description
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Sector
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Market Cap
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Detail
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        position: "sticky",
                        top: 0,
                        right: 0,
                        backgroundColor: "background.paper",
                        zIndex: 3,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>
                        Actions
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
                            {product.eps != null ? `$${product.eps.toFixed(2)}` : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.targetPrice != null ? `$${product.targetPrice.toFixed(2)}` : '—'}
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
                            ${product.newestPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.companyName == null ? '—' : product.companyName.length > 25 ? (
                              <Tooltip title={product.companyName} arrow placement="top">
                                <span>{product.companyName.slice(0, 25)}…</span>
                              </Tooltip>
                            ) : product.companyName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.description == null ? '—' : product.description.length > 25 ? (
                              <Tooltip title={product.description} arrow placement="top">
                                <span>{product.description.slice(0, 25)}…</span>
                              </Tooltip>
                            ) : product.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.sector ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {product.marketCapitalization ? `${(product.marketCapitalization / 1_000_000_000).toFixed(2)}B` : '—'}
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
                            onClick={async () => {
                              setSelectedStock(product);
                              setSymbolHistory(null);
                              setDialogOpen(true);
                              const history =
                                await realService.getSymbolHistory(
                                  product.symbol,
                                  exchange,
                                );
                              setSymbolHistory(history);
                            }}
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
                              "&:hover": {
                                backgroundColor: "#eaeae0",
                                color: "#1c4670",
                              },
                            }}
                            onClick={(e) => {
                              setActionsMenuAnchor(e.currentTarget);
                              setActionsMenuStock(product);
                            }}
                          >
                            <MoreVert fontSize="small" />
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

      {/* Not Admin Dialog */}
      <Dialog
        open={notAdminDialogOpen}
        onClose={() => setNotAdminDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Administrator action required</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="warning">
              To mark this item as{" "}
              <strong>
                {notAdminAction === "toxic" ? "Toxic" : "Top Growth"}
              </strong>
              , you must be an administrator. Send a message to the
              administrator to request this.
            </Alert>
            <TextField
              label="Reason"
              multiline
              rows={4}
              value={notAdminMessage}
              onChange={(e) => {
                if (e.target.value.length <= 300)
                  setNotAdminMessage(e.target.value);
              }}
              inputProps={{ maxLength: 300 }}
              helperText={`${notAdminMessage.length}/300`}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotAdminDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={notAdminMessage.trim().length < 5}
            onClick={async () => {
              if (actionsMenuStock && notAdminAction) {
                await symbolService.requestTag(
                  actionsMenuStock.symbol,
                  notAdminAction,
                  notAdminMessage.trim(),
                  user?.email ?? "unknown",
                );
              }
              setNotAdminDialogOpen(false);
            }}
            sx={{
              backgroundColor: "#278ab0",
              "&:hover": { backgroundColor: "#1c4670" },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Actions Menu */}
      <Menu
        anchorEl={actionsMenuAnchor}
        open={Boolean(actionsMenuAnchor)}
        onClose={() => setActionsMenuAnchor(null)}
      >
        <MenuItem
          onClick={async () => {
            setActionsMenuAnchor(null);
            if (user?.email === ADMIN_EMAIL) {
              if (actionsMenuStock)
                await symbolService.setToxic(actionsMenuStock.symbol, true);
            } else {
              setNotAdminAction("toxic");
              setNotAdminMessage("");
              setNotAdminDialogOpen(true);
            }
          }}
        >
          Tag as Toxic
        </MenuItem>
        <MenuItem
          onClick={async () => {
            setActionsMenuAnchor(null);
            if (user?.email === ADMIN_EMAIL) {
              if (actionsMenuStock)
                await symbolService.setTopGrowth(actionsMenuStock.symbol, true);
            } else {
              setNotAdminAction("topGrowth");
              setNotAdminMessage("");
              setNotAdminDialogOpen(true);
            }
          }}
        >
          Tag as Top Growth
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxWidth: "1035px" } }}
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
          {symbolHistory?.prices ? (
            (() => {
              const ema20Map = new Map<number, number>(
                (symbolHistory.ema20 ?? []).map(
                  (e: { value: number; unixDate: number }) => [
                    e.unixDate,
                    e.value,
                  ],
                ),
              );
              return (
                <LineChart
                  dataset={symbolHistory.prices.map(
                    (entry: { closePrice: number; unixDate: number }) => ({
                      closePrice: entry.closePrice,
                      ema20: ema20Map.get(entry.unixDate) ?? null,
                      date: new Date(entry.unixDate).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      ),
                    }),
                  )}
                  xAxis={[
                    { dataKey: "date", scaleType: "point", tickNumber: 6 },
                  ]}
                  series={[
                    {
                      dataKey: "closePrice",
                      label: "Close Price",
                      showMark: false,
                    },
                    { dataKey: "ema20", label: "EMA 20", showMark: false },
                  ]}
                  height={350}
                />
              );
            })()
          ) : (
            <Typography variant="body2" color="textSecondary">
              Loading...
            </Typography>
          )}
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
  marketCapitalization: number | null;
  eps: number | null;
  companyName: string | null;
  description: string | null;
  sector: string | null;
  targetPrice: number | null;
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
