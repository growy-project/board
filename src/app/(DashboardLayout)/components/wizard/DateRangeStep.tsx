import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import dayjs, { Dayjs } from "dayjs";
import type { SymbolDateRangeResult } from "../../services/symbolService";
import { WIZARD_COLORS, WIZARD_MONO_FONT } from "./wizardTheme";
import {
  PRESETS,
  DatePresetId,
  computePresetStart,
  detectActivePreset,
} from "../dateRange/presets";
import DateField from "../dateRange/DateField";
import AppLocalizationProvider from "../dateRange/AppLocalizationProvider";

interface Props {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  range: SymbolDateRangeResult | undefined;
  onStartChange: (d: Dayjs | null) => void;
  onEndChange: (d: Dayjs | null) => void;
}

export default function DateRangeStep({
  startDate,
  endDate,
  range,
  onStartChange,
  onEndChange,
}: Props) {
  const t = useTranslations("dateRange");
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
    <AppLocalizationProvider>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          mb: "16px",
        }}
      >
        <DateField
          label={t("start")}
          value={startDate}
          onChange={onStartChange}
          minDate={minDate}
          maxDate={endDate ?? maxDate}
        />
        <DateField
          label={t("end")}
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
    </AppLocalizationProvider>
  );
}
