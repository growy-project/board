"use client";
import React, { useEffect } from "react";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useAuth } from "@/app/context/AuthContext";

import { useWatchlistJob } from "./MyWatchlist/hooks/useWatchlistJob";
import { useWatchlistFilters } from "./MyWatchlist/hooks/useWatchlistFilters";
import { useWatchlistActions } from "./MyWatchlist/hooks/useWatchlistActions";
import { useStockSort } from "./ProductPerformance/hooks/useStockSort";

import StockTable from "./ProductPerformance/components/StockTable";
import StockLoadingOverlay from "./ProductPerformance/components/StockLoadingOverlay";
import StockDetailDialog from "./ProductPerformance/components/StockDetailDialog";
import ErrorDialog from "./ProductPerformance/components/ErrorDialog";
import WatchlistFilterToolbar from "./MyWatchlist/components/WatchlistFilterToolbar";
import WatchlistActionsMenu from "./MyWatchlist/components/WatchlistActionsMenu";

const MyWatchlist = () => {
  const { token } = useAuth();
  const filters = useWatchlistFilters();
  const job = useWatchlistJob();
  const sort = useStockSort(job.status);
  const actions = useWatchlistActions({
    startUnixDate: filters.startDate?.unix(),
    endUnixDate: filters.endDate?.unix(),
    removeSymbolLocally: job.removeSymbolLocally,
  });

  useEffect(() => {
    if (!token || !filters.startDate || !filters.endDate) return;
    filters.clearNeedsSearch();
    sort.resetPage();
    job.handleSearch(
      { startUnixDate: filters.startDate.unix(), endUnixDate: filters.endDate.unix() },
      token,
    );
  // Run once when the user is authenticated and dates are seeded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSearch = () => {
    if (!token || !filters.startDate || !filters.endDate) return;
    filters.clearNeedsSearch();
    sort.resetPage();
    job.handleSearch(
      { startUnixDate: filters.startDate.unix(), endUnixDate: filters.endDate.unix() },
      token,
    );
  };

  if (!token) {
    return (
      <DashboardCard title="My Watchlist">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 6,
            gap: 1,
            color: "text.secondary",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 48 }} />
          <Typography variant="h6">Please log in to view your watchlist</Typography>
          <Typography variant="body2">
            Sign in with Google to track and manage your saved symbols.
          </Typography>
        </Box>
      </DashboardCard>
    );
  }

  const isJobRunning = Boolean(job.status && !job.status.isFinished);
  const showTable = !job.error && job.status?.isFinished;
  const hasResults = (job.status?.result?.length ?? 0) > 0;

  return (
    <>
      <DashboardCard
        title="My Watchlist"
        action={
          <WatchlistFilterToolbar
            startDate={filters.startDate}
            endDate={filters.endDate}
            needsSearch={filters.needsSearch}
            isJobRunning={isJobRunning}
            onStartDateChange={filters.handleStartDateChange}
            onEndDateChange={filters.handleEndDateChange}
            onSearch={handleSearch}
          />
        }
      >
        <>
          {filters.needsSearch && showTable && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleSearch}
                  disabled={isJobRunning || !filters.startDate || !filters.endDate}
                >
                  Refresh results
                </Button>
              }
            >
              Filters changed — results below are out of date.
            </Alert>
          )}
          {showTable && hasResults ? (
            <StockTable
              sortedResults={sort.sortedResults}
              exchange=""
              isPageLoading={job.isPageLoading}
              isStale={filters.needsSearch}
              orderBy={sort.orderBy}
              order={sort.order}
              currentPage={sort.currentPage}
              pageSize={sort.pageSize}
              totalItems={job.status?.totalItems}
              totalPages={job.status?.totalPages}
              onSort={sort.handleSort}
              onPageChange={sort.handlePageChange}
              onDetailClick={actions.handleDetailClick}
              onActionsClick={actions.handleActionsClick}
            />
          ) : showTable && !hasResults ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 6,
                gap: 1,
                color: "text.secondary",
              }}
            >
              <BookmarkBorderIcon sx={{ fontSize: 48 }} />
              <Typography variant="h6">Your watchlist is empty</Typography>
              <Typography variant="body2">
                Add symbols from the Momentum Scanner to see them here.
              </Typography>
            </Box>
          ) : (
            <StockLoadingOverlay message={job.status?.processingMessage} />
          )}
        </>
      </DashboardCard>

      <ErrorDialog error={job.error} onClose={job.clearError} />

      <WatchlistActionsMenu
        anchorEl={actions.actionsMenuAnchor}
        onClose={actions.closeActionsMenu}
        onRemove={actions.handleRemove}
      />

      <StockDetailDialog
        open={actions.dialogOpen}
        symbol={actions.selectedStock?.symbol}
        chartDataset={actions.chartDataset}
        onClose={() => actions.setDialogOpen(false)}
      />

      <Snackbar
        open={Boolean(actions.feedback)}
        autoHideDuration={4000}
        onClose={() => actions.setFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={actions.feedback?.severity ?? "success"}
          variant="filled"
          onClose={() => actions.setFeedback(null)}
        >
          {actions.feedback?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyWatchlist;
