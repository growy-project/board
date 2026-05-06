import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

import { useFilters } from "./ProductPerformance/hooks/useFilters";
import { useStockJob } from "./ProductPerformance/hooks/useStockJob";
import { useStockSort } from "./ProductPerformance/hooks/useStockSort";
import { useSymbolActions } from "./ProductPerformance/hooks/useSymbolActions";

import StockFilterToolbar from "./ProductPerformance/components/StockFilterToolbar";
import StockTable from "./ProductPerformance/components/StockTable";
import StockLoadingOverlay from "./ProductPerformance/components/StockLoadingOverlay";
import ErrorDialog from "./ProductPerformance/components/ErrorDialog";
import NotAdminDialog from "./ProductPerformance/components/NotAdminDialog";
import StockActionsMenu from "./ProductPerformance/components/StockActionsMenu";
import StockDetailDialog from "./ProductPerformance/components/StockDetailDialog";

export type { StockPerformance, JobStatus } from "./ProductPerformance/types";

const ProductPerformance = () => {
  const filters = useFilters();
  const job = useStockJob();
  const sort = useStockSort(job.status);
  const actions = useSymbolActions(filters.exchange, filters.startDate?.unix(), filters.endDate?.unix());

  // Run the initial search once the date range has been seeded
  useEffect(() => {
    if (filters.triggerInitialSearch && filters.startDate && filters.endDate) {
      filters.clearNeedsSearch();
      sort.resetPage();
      job.handleSearch({
        startUnixDate: filters.startDate.unix(),
        endUnixDate: filters.endDate.unix(),
        minimumExpectedGrowth: filters.minPercentageChange,
        exchange: filters.exchange,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.triggerInitialSearch]);

  const handleSearch = () => {
    if (!filters.startDate || !filters.endDate) return;
    filters.clearNeedsSearch();
    sort.resetPage();
    job.handleSearch({
      startUnixDate: filters.startDate.unix(),
      endUnixDate: filters.endDate.unix(),
      minimumExpectedGrowth: filters.minPercentageChange,
      exchange: filters.exchange,
    });
  };

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  useEffect(() => {
    if (!filters.dateRangeLoading) return;
    const id = setInterval(() => setLoadingMessageIndex((i) => (i + 1) % 2), 2500);
    return () => clearInterval(id);
  }, [filters.dateRangeLoading]);

  const dateRangeLoadingMessages = [
    `Loading ${filters.exchange} symbols and ranges…`,
    "This will be amazing",
  ];

  const isJobRunning = Boolean(job.status && !job.status.isFinished);
  const showTable = !job.error && job.status?.isFinished;
  const hasResults = (job.status?.result?.length ?? 0) > 0;

  return (
    <>
      <DashboardCard
        title="Momentum Scanner"
        action={
          <StockFilterToolbar
            exchange={filters.exchange}
            minPercentageChange={filters.minPercentageChange}
            startDate={filters.startDate}
            endDate={filters.endDate}
            dateRange={filters.dateRange}
            dateRangeLoading={filters.dateRangeLoading}
            needsSearch={filters.needsSearch}
            isJobRunning={isJobRunning}
            onExchangeChange={filters.handleExchangeChange}
            onMinPercentageChange={filters.handleMinPercentageChange}
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
            exchange={filters.exchange}
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 1, color: "text.secondary" }}>
            <SearchOffIcon sx={{ fontSize: 48 }} />
            <Typography variant="h6">No stocks matched your search</Typography>
            <Typography variant="body2">
              Try adjusting the exchange, minimum % change, or date range.
            </Typography>
          </Box>
        ) : (
          <StockLoadingOverlay
            message={
              filters.dateRangeLoading
                ? dateRangeLoadingMessages[loadingMessageIndex]
                : job.status?.processingMessage
            }
          />
        )}
        </>
      </DashboardCard>

      <ErrorDialog error={job.error} onClose={job.clearError} />

      <NotAdminDialog
        open={actions.notAdminDialogOpen}
        action={actions.notAdminAction}
        message={actions.notAdminMessage}
        submitting={actions.isSubmittingTag}
        onMessageChange={actions.handleNotAdminMessageChange}
        onCancel={() => actions.setNotAdminDialogOpen(false)}
        onSubmit={actions.handleSubmitTag}
      />

      <StockActionsMenu
        anchorEl={actions.actionsMenuAnchor}
        onClose={actions.closeActionsMenu}
        onAddToWatchlist={actions.handleAddToWatchlist}
        onTagToxic={actions.handleTagToxic}
        onTagTopGrowth={actions.handleTagTopGrowth}
      />

      <StockDetailDialog
        open={actions.dialogOpen}
        symbol={actions.selectedStock?.symbol}
        chartDataset={actions.chartDataset}
        onClose={() => actions.setDialogOpen(false)}
      />

      <Snackbar
        open={actions.loginPromptOpen}
        autoHideDuration={4000}
        onClose={() => actions.setLoginPromptOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => actions.setLoginPromptOpen(false)}
        >
          Please log in to tag a symbol.
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(actions.tagRequestSuccess)}
        autoHideDuration={4000}
        onClose={() => actions.setTagRequestSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => actions.setTagRequestSuccess(null)}
        >
          {actions.tagRequestSuccess}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(actions.watchlistFeedback)}
        autoHideDuration={4000}
        onClose={() => actions.setWatchlistFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={actions.watchlistFeedback?.severity ?? "success"}
          variant="filled"
          onClose={() => actions.setWatchlistFeedback(null)}
        >
          {actions.watchlistFeedback?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductPerformance;
