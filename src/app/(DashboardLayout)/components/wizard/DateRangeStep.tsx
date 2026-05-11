import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { SymbolDateRangeResult } from "../../services/symbolService";
import { WIZARD_COLORS, WIZARD_MONO_FONT } from "./wizardTheme";

export type DatePresetId = "5d" | "1m" | "3m" | "6m" | "YTD" | "1y" | "Max";

const PRESETS: DatePresetId[] = ["5d", "1m", "3m", "6m", "YTD", "1y", "Max"];

interface Props {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  range: SymbolDateRangeResult | undefined;
  onStartChange: (d: Dayjs | null) => void;
  onEndChange: (d: Dayjs | null) => void;
}

export function computePresetStart(
  preset: DatePresetId,
  rangeEnd: Dayjs,
  rangeStart: Dayjs
): Dayjs {
  switch (preset) {
    case "5d":
      return maxDate(rangeEnd.subtract(5, "day"), rangeStart);
    case "1m":
      return maxDate(rangeEnd.subtract(1, "month"), rangeStart);
    case "3m":
      return maxDate(rangeEnd.subtract(3, "month"), rangeStart);
    case "6m":
      return maxDate(rangeEnd.subtract(6, "month"), rangeStart);
    case "YTD":
      return maxDate(rangeEnd.startOf("year"), rangeStart);
    case "1y":
      return maxDate(rangeEnd.subtract(1, "year"), rangeStart);
    case "Max":
      return rangeStart;
  }
}

function maxDate(a: Dayjs, b: Dayjs): Dayjs {
  return a.isBefore(b) ? b : a;
}

export function detectActivePreset(
  start: Dayjs | null,
  end: Dayjs | null,
  range: SymbolDateRangeResult | undefined
): DatePresetId | null {
  if (!start || !end || !range) return null;
  const rangeEnd = dayjs(range.lastDate);
  const rangeStart = dayjs(range.firstDate);
  if (!end.isSame(rangeEnd, "day")) return null;
  for (const p of PRESETS) {
    const expected = computePresetStart(p, rangeEnd, rangeStart);
    if (expected.isSame(start, "day")) return p;
  }
  return null;
}

export default function DateRangeStep({
  startDate,
  endDate,
  range,
  onStartChange,
  onEndChange,
}: Props) {
  const minDate = range ? dayjs(range.firstDate) : undefined;
  const maxDate = range ? dayjs(range.lastDate) : undefined;
  const activePreset = detectActivePreset(startDate, endDate, range);

  const applyPreset = (p: DatePresetId) => {
    if (!range) return;
    const rangeEnd = dayjs(range.lastDate);
    const rangeStart = dayjs(range.firstDate);
    onStartChange(computePresetStart(p, rangeEnd, rangeStart));
    onEndChange(rangeEnd);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          mb: "16px",
        }}
      >
        <DateField
          label="Start"
          value={startDate}
          onChange={onStartChange}
          minDate={minDate}
          maxDate={endDate ?? maxDate}
        />
        <DateField
          label="End"
          value={endDate}
          onChange={onEndChange}
          minDate={startDate ?? minDate}
          maxDate={maxDate}
        />
      </Box>

      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {PRESETS.map((p) => {
          const active = p === activePreset;
          return (
            <ButtonBase
              key={p}
              onClick={() => applyPreset(p)}
              disabled={!range}
              sx={{
                border: `1px solid ${active ? WIZARD_COLORS.blue700 : WIZARD_COLORS.border}`,
                background: active ? WIZARD_COLORS.blue700 : "white",
                color: active ? "white" : WIZARD_COLORS.ink700,
                borderRadius: 999,
                padding: "6px 12px",
                fontFamily: WIZARD_MONO_FONT,
                fontSize: 12,
                fontWeight: 600,
                transition: "0.15s",
                "&:hover": {
                  borderColor: active ? WIZARD_COLORS.blue700 : WIZARD_COLORS.blue500,
                  color: active ? "white" : WIZARD_COLORS.blue900,
                },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              <Typography component="span" sx={{ font: "inherit" }}>
                {p}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </LocalizationProvider>
  );
}

interface DateFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (d: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

function DateField({ label, value, onChange, minDate, maxDate }: DateFieldProps) {
  return (
    <Box
      sx={{
        border: `1px solid ${WIZARD_COLORS.ink500}`,
        borderRadius: "10px",
        padding: "10px 14px",
        background: WIZARD_COLORS.sand100,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        transition: "0.15s",
        "&:hover, &:focus-within": {
          borderColor: WIZARD_COLORS.blue700,
          background: "white",
          boxShadow: `0 0 0 3px rgba(39, 138, 176, 0.15)`,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: WIZARD_COLORS.ink700,
        }}
      >
        {label}
      </Typography>
      <DatePicker
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            variant: "standard",
            InputProps: { disableUnderline: true },
            sx: {
              fontFamily: WIZARD_MONO_FONT,
              fontSize: 16,
              fontWeight: 700,
              color: WIZARD_COLORS.ink900,
              "& .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root": {
                fontFamily: WIZARD_MONO_FONT,
                fontSize: 16,
                fontWeight: 700,
                color: WIZARD_COLORS.ink900,
              },
              "& .MuiPickersSectionList-root": {
                padding: 0,
                color: WIZARD_COLORS.ink900,
              },
              "& .MuiPickersSectionList-section, & .MuiPickersInputBase-sectionContent":
                {
                  color: WIZARD_COLORS.ink900,
                  fontWeight: 700,
                },
              "& input": {
                fontFamily: WIZARD_MONO_FONT,
                fontSize: 16,
                fontWeight: 700,
                color: WIZARD_COLORS.ink900,
                padding: 0,
                WebkitTextFillColor: WIZARD_COLORS.ink900,
              },
              "& .MuiInputAdornment-root .MuiIconButton-root": {
                color: WIZARD_COLORS.ink700,
              },
            },
          },
        }}
      />
    </Box>
  );
}
