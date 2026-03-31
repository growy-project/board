import React, { useEffect } from "react";
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
  const actions = useSymbolActions(filters.exchange);

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

  const isJobRunning = Boolean(job.status && !job.status.isFinished);
  const showTable = !job.error && job.status?.isFinished;

  return (
    <>
      <DashboardCard
        title="Stock Performance"
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
        {showTable ? (
          <StockTable
            sortedResults={sort.sortedResults}
            exchange={filters.exchange}
            isPageLoading={job.isPageLoading}
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
        ) : (
          <StockLoadingOverlay message={job.status?.processingMessage} />
        )}
      </DashboardCard>

      <ErrorDialog error={job.error} onClose={job.clearError} />

      <NotAdminDialog
        open={actions.notAdminDialogOpen}
        action={actions.notAdminAction}
        message={actions.notAdminMessage}
        onMessageChange={actions.handleNotAdminMessageChange}
        onCancel={() => actions.setNotAdminDialogOpen(false)}
        onSubmit={actions.handleSubmitTag}
      />

      <StockActionsMenu
        anchorEl={actions.actionsMenuAnchor}
        onClose={actions.closeActionsMenu}
        onTagToxic={actions.handleTagToxic}
        onTagTopGrowth={actions.handleTagTopGrowth}
      />

      <StockDetailDialog
        open={actions.dialogOpen}
        symbol={actions.selectedStock?.symbol}
        chartDataset={actions.chartDataset}
        onClose={() => actions.setDialogOpen(false)}
      />
    </>
  );
};

export default ProductPerformance;
