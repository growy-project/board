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
import { useTranslations } from "next-intl";
import type { SymbolDateRangeResult } from "../../../../services/symbolService";
import PresetChipGroup from "../../../dateRange/PresetChipGroup";
import { pulseAnimation } from "../constants";
import { trackEvent } from "@/telemetry/appInsights";

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
  onCustomRangeApply: (start: Dayjs, end: Dayjs) => void;
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
  onCustomRangeApply,
  onSearch,
}: StockFilterToolbarProps) {
  const t = useTranslations("dashboard");

  const handleExchangeChange = (e: SelectChangeEvent) => {
    trackEvent("ExchangeChanged", { exchange: e.target.value });
    onExchangeChange(e);
  };

  const handleSearch = () => {
    trackEvent("SearchClicked", {
      exchange,
      minPercentageChange: String(minPercentageChange),
      startDate: startDate?.format("YYYY-MM-DD") ?? "",
      endDate: endDate?.format("YYYY-MM-DD") ?? "",
    });
    onSearch();
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "center" }}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      {/* Exchange */}
      <FormControl
        size="small"
        sx={{
          minWidth: "120px",
          width: { xs: "100%", sm: "auto" },
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": { borderColor: "#278ab0" },
            "&.Mui-focused fieldset": { borderColor: "#1c4670" },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": { color: "#1c4670" },
          },
        }}
      >
        <InputLabel id="exchange-select-label">{t("filters.exchange")}</InputLabel>
        <Select
          labelId="exchange-select-label"
          id="exchange-select"
          value={exchange}
          label={t("filters.exchange")}
          disabled={dateRangeLoading}
          onChange={handleExchangeChange}
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

      {/* Min % Change */}
      <TextField
        label={t("filters.minChange")}
        color="secondary"
        focused
        type="number"
        value={minPercentageChange}
        onChange={onMinPercentageChange}
        size="small"
        sx={{ width: { xs: "100%", sm: "130px" } }}
        disabled={dateRangeLoading}
      />

      {/* Preset Chips */}
      <PresetChipGroup
        startDate={startDate}
        endDate={endDate}
        range={dateRange}
        disabled={dateRangeLoading}
        onStartChange={onStartDateChange}
        onEndChange={onEndDateChange}
        onCustomRangeApply={onCustomRangeApply}
      />

      {/* Search Button */}
      <Button
        variant="contained"
        onClick={handleSearch}
        disabled={dateRangeLoading || startDate === null || endDate === null || isJobRunning}
        sx={{
          backgroundColor: "#278ab0",
          color: "white",
          "&:hover": { backgroundColor: "#1c4670" },
          "&:disabled": { backgroundColor: "#eaeae0", color: "#999" },
          height: "40px",
          minWidth: { xs: "auto", sm: "100px" },
          width: { xs: "100%", sm: "auto" },
          ...(needsSearch && { animation: `${pulseAnimation} 1.2s ease-in-out infinite` }),
        }}
      >
        {t("search")}
      </Button>
    </Stack>
  );
}
