"use client";
import React, { useEffect } from "react";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTranslations } from "next-intl";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useAuth } from "@/app/context/AuthContext";

import { useWatchlistJob } from "./MyWatchlist/hooks/useWatchlistJob";
import { useWatchlistFilters } from "./MyWatchlist/hooks/useWatchlistFilters";
import { useWatchlistActions } from "./MyWatchlist/hooks/useWatchlistActions";
import { useStockSort } from "./ProductPerformance/hooks/useStockSort";
import { useColumnFilters } from "./ProductPerformance/hooks/useColumnFilters";

import StockTable from "./ProductPerformance/components/StockTable";
import StockLoadingOverlay from "./ProductPerformance/components/StockLoadingOverlay";
import StockDetailDialog from "./ProductPerformance/components/StockDetailDialog";
import ErrorDialog from "./ProductPerformance/components/ErrorDialog";
import WatchlistFilterToolbar from "./MyWatchlist/components/WatchlistFilterToolbar";
import WatchlistActionsMenu from "./MyWatchlist/components/WatchlistActionsMenu";

const MyWatchlist = () => {
  const t = useTranslations("watchlist");
  const tf = useTranslations("table.filters");
  const { token } = useAuth();
  const filters = useWatchlistFilters();
  const job = useWatchlistJob();
  const sort = useStockSort(job.status);
  const columnFilters = useColumnFilters(sort.sortedResults, job.status?.result);
  const actions = useWatchlistActions({
    startUnixDate: filters.startDate?.unix(),
    endUnixDate: filters.endDate?.unix(),
    removeSymbolLocally: job.removeSymbolLocally,
  });

  useEffect(() => {
    if (!token || !filters.triggerInitialSearch || !filters.startDate || !filters.endDate) return;
    filters.clearTriggerInitialSearch();
    filters.clearNeedsSearch();
    job.handleSearch(
      { startUnixDate: filters.startDate.unix(), endUnixDate: filters.endDate.unix() },
      token,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filters.triggerInitialSearch, filters.startDate, filters.endDate]);

  const handleSearch = () => {
    if (!token || !filters.startDate || !filters.endDate) return;
    filters.clearNeedsSearch();
    job.handleSearch(
      { startUnixDate: filters.startDate.unix(), endUnixDate: filters.endDate.unix() },
      token,
    );
  };

  if (!token) {
    return (
      <DashboardCard title={t("title")}>
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
          <Typography variant="h6">{t("loggedOutTitle")}</Typography>
          <Typography variant="body2">
            {t("loggedOutHint")}
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
        title={t("title")}
        action={
          <WatchlistFilterToolbar
            startDate={filters.startDate}
            endDate={filters.endDate}
            dateRange={filters.dateRange}
            dateRangeLoading={filters.dateRangeLoading}
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
                  {t("refresh")}
                </Button>
              }
            >
              {t("filtersStale")}
            </Alert>
          )}
          {showTable && hasResults ? (
            <>
              <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "flex-end", mb: 1 }}>
                <Button
                  variant="outlined"
                  onClick={columnFilters.resetFilters}
                  disabled={!columnFilters.hasActiveFilters}
                  sx={{
                    color: "#1c4670",
                    borderColor: "#278ab0",
                    "&:hover": { borderColor: "#1c4670", backgroundColor: "#eaeae0" },
                  }}
                >
                  {tf("clear")}
                </Button>
              </Box>
              <StockTable
                sortedResults={columnFilters.filteredResults}
                exchange=""
                isPageLoading={job.isPageLoading}
                isStale={filters.needsSearch}
                orderBy={sort.orderBy}
                order={sort.order}
                totalItems={columnFilters.filteredResults.length}
                filters={columnFilters}
                onSort={sort.handleSort}
                onDetailClick={actions.handleDetailClick}
                onActionsClick={actions.handleActionsClick}
              />
            </>
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
              <Typography variant="h6">{t("emptyTitle")}</Typography>
              <Typography variant="body2">
                {t("emptyHint")}
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
