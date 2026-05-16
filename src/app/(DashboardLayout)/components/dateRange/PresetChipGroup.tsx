import React from "react";
import {
  Box,
  ButtonBase,
  Button,
  Popover,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { SymbolDateRangeResult } from "../../services/symbolService";
import { WIZARD_COLORS, WIZARD_MONO_FONT } from "../wizard/wizardTheme";
import {
  PRESETS,
  DatePresetId,
  computePresetStart,
  detectActivePreset,
} from "./presets";
import DateField from "./DateField";

interface PresetChipGroupProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  range: SymbolDateRangeResult | null;
  disabled?: boolean;
  onStartChange: (d: Dayjs | null) => void;
  onEndChange: (d: Dayjs | null) => void;
}

export default function PresetChipGroup({
  startDate,
  endDate,
  range,
  disabled = false,
  onStartChange,
  onEndChange,
}: PresetChipGroupProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const activePreset = detectActivePreset(startDate, endDate, range);
  const isCustom = !activePreset && Boolean(startDate && endDate);

  const applyPreset = (p: DatePresetId) => {
    if (!range) return;
    const rangeEnd = dayjs(range.lastDate);
    const rangeStart = dayjs(range.firstDate);
    onStartChange(computePresetStart(p, rangeEnd, rangeStart));
    onEndChange(rangeEnd);
  };

  const customLabel =
    isCustom && startDate && endDate
      ? `${startDate.format("MMM DD")} → ${endDate.format("MMM DD")}`
      : "Custom";

  const customTooltip =
    isCustom && startDate && endDate
      ? `${startDate.format("MMM DD, YYYY")} → ${endDate.format("MMM DD, YYYY")}`
      : "";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        role="radiogroup"
        aria-label="Date range"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          height: 40,
          padding: "4px",
          bgcolor: WIZARD_COLORS.sand100,
          border: `1px solid ${WIZARD_COLORS.border}`,
          borderRadius: "8px",
          opacity: disabled ? 0.55 : 1,
          pointerEvents: disabled ? "none" : "auto",
          boxSizing: "border-box",
        }}
      >
        {PRESETS.map((p) => (
          <PresetChip
            key={p}
            active={p === activePreset}
            onClick={() => applyPreset(p)}
            disabled={!range}
          >
            {p}
          </PresetChip>
        ))}

        <Box
          sx={{
            width: "1px",
            height: 22,
            bgcolor: WIZARD_COLORS.border,
            mx: "2px",
          }}
        />

        <Tooltip
          title={customTooltip}
          disableHoverListener={!isCustom}
          disableFocusListener={!isCustom}
          disableTouchListener={!isCustom}
        >
          <ButtonBase
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-haspopup="dialog"
            aria-expanded={Boolean(anchorEl)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: 30,
              padding: "0 12px 0 10px",
              borderRadius: "5px",
              fontFamily: WIZARD_MONO_FONT,
              fontSize: 12,
              fontWeight: 600,
              color: isCustom ? "white" : WIZARD_COLORS.ink700,
              bgcolor: isCustom ? WIZARD_COLORS.blue700 : "transparent",
              transition: "0.15s",
              "&:hover": isCustom
                ? { bgcolor: WIZARD_COLORS.blue900 }
                : {
                    bgcolor: "white",
                    color: WIZARD_COLORS.blue900,
                    boxShadow: `0 0 0 1px ${WIZARD_COLORS.border}`,
                  },
            }}
          >
            <CalendarIcon />
            <span>{customLabel}</span>
          </ButtonBase>
        </Tooltip>

        <CustomRangePopover
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          startDate={startDate}
          endDate={endDate}
          range={range}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
        />
      </Box>
    </LocalizationProvider>
  );
}

function PresetChip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      role="radio"
      aria-checked={active}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        minWidth: 38,
        padding: "0 10px",
        borderRadius: "5px",
        fontFamily: WIZARD_MONO_FONT,
        fontSize: 12,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        color: active ? "white" : WIZARD_COLORS.ink700,
        bgcolor: active ? WIZARD_COLORS.blue700 : "transparent",
        boxShadow: active ? "0 1px 0 rgba(0,0,0,.05)" : "none",
        transition: "0.15s",
        "&:hover": active
          ? { bgcolor: WIZARD_COLORS.blue900 }
          : {
              bgcolor: "white",
              color: WIZARD_COLORS.blue900,
              boxShadow: `0 0 0 1px ${WIZARD_COLORS.border}`,
            },
        "&.Mui-disabled": { opacity: 0.5 },
      }}
    >
      {children}
    </ButtonBase>
  );
}

interface PopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  range: SymbolDateRangeResult | null;
  onStartChange: (d: Dayjs | null) => void;
  onEndChange: (d: Dayjs | null) => void;
}

function CustomRangePopover({
  anchorEl,
  onClose,
  startDate,
  endDate,
  range,
  onStartChange,
  onEndChange,
}: PopoverProps) {
  const [draftStart, setDraftStart] = React.useState<Dayjs | null>(startDate);
  const [draftEnd, setDraftEnd] = React.useState<Dayjs | null>(endDate);

  React.useEffect(() => {
    if (anchorEl) {
      setDraftStart(startDate);
      setDraftEnd(endDate);
    }
  }, [anchorEl, startDate, endDate]);

  const minDate = range ? dayjs(range.firstDate) : undefined;
  const maxDate = range ? dayjs(range.lastDate) : undefined;

  const apply = () => {
    onStartChange(draftStart);
    onEndChange(draftEnd);
    onClose();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          width: 380,
          mt: 1,
          borderRadius: "12px",
          boxShadow: "0 24px 60px -20px rgba(20,35,55,0.35)",
          border: `1px solid ${WIZARD_COLORS.border}`,
          p: "18px",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: WIZARD_COLORS.ink900,
            letterSpacing: "0.02em",
          }}
        >
          Custom range
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          sx={{ width: 24, height: 24, color: WIZARD_COLORS.ink500 }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          mb: 1.5,
        }}
      >
        <DateField
          label="Start"
          value={draftStart}
          onChange={setDraftStart}
          minDate={minDate}
          maxDate={draftEnd ?? maxDate}
        />
        <DateField
          label="End"
          value={draftEnd}
          onChange={setDraftEnd}
          minDate={draftStart ?? minDate}
          maxDate={maxDate}
        />
      </Box>

      {range && (
        <Typography
          sx={{
            fontSize: 11,
            color: WIZARD_COLORS.ink500,
            fontFamily: WIZARD_MONO_FONT,
            pb: 1.5,
            mb: 1.75,
            borderBottom: `1px solid ${WIZARD_COLORS.border}`,
          }}
        >
          Available ·{" "}
          <Box
            component="b"
            sx={{ color: WIZARD_COLORS.ink700, fontWeight: 600 }}
          >
            {dayjs(range.firstDate).format("MMM D, YYYY")}
          </Box>{" "}
          →{" "}
          <Box
            component="b"
            sx={{ color: WIZARD_COLORS.ink700, fontWeight: 600 }}
          >
            {dayjs(range.lastDate).format("MMM D, YYYY")}
          </Box>
        </Typography>
      )}

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button
          onClick={onClose}
          sx={{
            color: WIZARD_COLORS.ink700,
            height: 32,
            "&:hover": {
              bgcolor: WIZARD_COLORS.sand200,
              color: WIZARD_COLORS.blue900,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={apply}
          disabled={!draftStart || !draftEnd}
          sx={{
            height: 32,
            bgcolor: WIZARD_COLORS.blue700,
            "&:hover": { bgcolor: WIZARD_COLORS.blue900 },
            "&:disabled": { bgcolor: WIZARD_COLORS.sand200, color: "#999" },
          }}
        >
          Apply
        </Button>
      </Stack>
    </Popover>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
