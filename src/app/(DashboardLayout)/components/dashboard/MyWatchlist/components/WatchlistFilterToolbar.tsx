import React from "react";
import { Stack, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { pulseAnimation } from "../../ProductPerformance/constants";

interface WatchlistFilterToolbarProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
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
  needsSearch,
  isJobRunning,
  disabled = false,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: WatchlistFilterToolbarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={2} alignItems="center">
        <DatePicker
          label="Start Date"
          value={startDate}
          disabled={disabled}
          onChange={onStartDateChange}
          maxDate={endDate ?? undefined}
          slotProps={{
            textField: { size: "small", sx: { width: "160px" }, disabled },
          }}
        />

        <DatePicker
          label="End Date"
          value={endDate}
          disabled={disabled}
          onChange={onEndDateChange}
          minDate={startDate ?? undefined}
          slotProps={{
            textField: { size: "small", sx: { width: "160px" }, disabled },
          }}
        />

        <Button
          variant="contained"
          onClick={onSearch}
          disabled={disabled || startDate === null || endDate === null || isJobRunning}
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
    </LocalizationProvider>
  );
}
