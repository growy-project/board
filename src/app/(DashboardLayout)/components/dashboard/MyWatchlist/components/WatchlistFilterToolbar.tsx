import React from "react";
import { Stack, Button } from "@mui/material";
import { Dayjs } from "dayjs";
import type { SymbolDateRangeResult } from "../../../../services/symbolService";
import PresetChipGroup from "../../../dateRange/PresetChipGroup";
import { pulseAnimation } from "../../ProductPerformance/constants";

interface WatchlistFilterToolbarProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  dateRange: SymbolDateRangeResult | null;
  dateRangeLoading: boolean;
  needsSearch: boolean;
  isJobRunning: boolean;
  disabled?: boolean;
  onStartDateChange: (v: Dayjs | null) => void;
  onEndDateChange: (v: Dayjs | null) => void;
  onSearch: () => void;
}

export default function WatchlistFilterToolbar({
  startDate,
  endDate,
  dateRange,
  dateRangeLoading,
  needsSearch,
  isJobRunning,
  disabled = false,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: WatchlistFilterToolbarProps) {
  const controlsDisabled = disabled || dateRangeLoading;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <PresetChipGroup
        startDate={startDate}
        endDate={endDate}
        range={dateRange}
        disabled={controlsDisabled}
        onStartChange={onStartDateChange}
        onEndChange={onEndDateChange}
      />

      <Button
        variant="contained"
        onClick={onSearch}
        disabled={controlsDisabled || startDate === null || endDate === null || isJobRunning}
        sx={{
          backgroundColor: "#278ab0",
          color: "white",
          "&:hover": { backgroundColor: "#1c4670" },
          "&:disabled": { backgroundColor: "#eaeae0", color: "#999" },
          minWidth: "100px",
          height: "40px",
          ...(needsSearch && { animation: `${pulseAnimation} 1.2s ease-in-out infinite` }),
        }}
      >
        Search
      </Button>
    </Stack>
  );
}
