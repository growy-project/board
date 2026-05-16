import React from "react";
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { Dayjs } from "dayjs";
import type { SymbolDateRangeResult } from "../../../../services/symbolService";
import PresetChipGroup from "../../../dateRange/PresetChipGroup";
import { pulseAnimation } from "../constants";

interface StockFilterToolbarProps {
  exchange: string;
  minPercentageChange: number;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  dateRange: SymbolDateRangeResult | null;
  dateRangeLoading: boolean;
  needsSearch: boolean;
  isJobRunning: boolean;
  onExchangeChange: (e: SelectChangeEvent) => void;
  onMinPercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateChange: (v: Dayjs | null) => void;
  onEndDateChange: (v: Dayjs | null) => void;
  onSearch: () => void;
}

export default function StockFilterToolbar({
  exchange,
  minPercentageChange,
  startDate,
  endDate,
  dateRange,
  dateRangeLoading,
  needsSearch,
  isJobRunning,
  onExchangeChange,
  onMinPercentageChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: StockFilterToolbarProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl
        size="small"
        sx={{
          minWidth: "120px",
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": { borderColor: "#278ab0" },
            "&.Mui-focused fieldset": { borderColor: "#1c4670" },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": { color: "#1c4670" },
          },
        }}
      >
        <InputLabel id="exchange-select-label">Exchange</InputLabel>
        <Select
          labelId="exchange-select-label"
          id="exchange-select"
          value={exchange}
          label="Exchange"
          disabled={dateRangeLoading}
          onChange={onExchangeChange}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root": {
                  "&:hover": { backgroundColor: "#eaeae0", color: "#1c4670" },
                  "&.Mui-selected": {
                    backgroundColor: "#278ab0",
                    color: "white",
                    "&:hover": { backgroundColor: "#1c4670" },
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
        label="Minimum % Change"
        color="secondary"
        focused
        type="number"
        value={minPercentageChange}
        onChange={onMinPercentageChange}
        size="small"
        sx={{ width: "130px" }}
        disabled={dateRangeLoading}
      />

      <PresetChipGroup
        startDate={startDate}
        endDate={endDate}
        range={dateRange}
        disabled={dateRangeLoading}
        onStartChange={onStartDateChange}
        onEndChange={onEndDateChange}
      />

      <Button
        variant="contained"
        onClick={onSearch}
        disabled={dateRangeLoading || startDate === null || endDate === null || isJobRunning}
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
