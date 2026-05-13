"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";

import { dateRangeQueryOptions } from "@/app/(DashboardLayout)/queries/dateRangeQuery";
import ExchangeStep, { ExchangeId } from "./ExchangeStep";
import ThresholdStep from "./ThresholdStep";
import DateRangeStep from "./DateRangeStep";
import { saveDashboardFilters } from "./wizardStorage";
import { WIZARD_COLORS, WIZARD_MONO_FONT } from "./wizardTheme";

type Step = 1 | 2 | 3;

interface Props {
  open: boolean;
  onClose: () => void;
}

const STEP_LABELS = ["01 · Exchange", "02 · Threshold", "03 · Date range"] as const;

export default function ScanSetupWizard({ open, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [exchange, setExchange] = useState<ExchangeId>("NASDAQ");
  const [minPct, setMinPct] = useState<number>(30);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [lastSeededExchange, setLastSeededExchange] = useState<string | null>(null);

  const { data: range } = useQuery({
    ...dateRangeQueryOptions(exchange),
    enabled: open,
  });

  useEffect(() => {
    if (!range || lastSeededExchange === exchange) return;
    const end = dayjs(range.lastDate);
    setEndDate(end);
    setStartDate(end.subtract(3, "month"));
    setLastSeededExchange(exchange);
  }, [range, exchange, lastSeededExchange]);

  useEffect(() => {
    if (open) {
      setStep(1);
      router.prefetch("/");
    }
  }, [open, router]);

  const stepValid = useMemo(() => {
    if (step === 1) return Boolean(exchange);
    if (step === 2) return Number.isFinite(minPct) && minPct >= 0;
    if (step === 3) {
      if (!startDate || !endDate || !range) return false;
      const first = dayjs(range.firstDate);
      const last = dayjs(range.lastDate);
      return (
        !startDate.isAfter(endDate) &&
        !startDate.isBefore(first) &&
        !endDate.isAfter(last)
      );
    }
    return false;
  }, [step, exchange, minPct, startDate, endDate, range]);

  const handleContinue = useCallback(() => {
    if (!stepValid) return;
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
      return;
    }
    if (!startDate || !endDate) return;
    saveDashboardFilters({ exchange, minPct, startDate, endDate });
    router.replace("/");
  }, [step, stepValid, exchange, minPct, startDate, endDate, router]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }, [step]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && stepValid) {
        e.preventDefault();
        handleContinue();
      }
    },
    [stepValid, handleContinue]
  );

  const summary = useMemo(() => {
    const ex = exchange ?? "—";
    const pct = step >= 2 ? `≥ ${minPct}%` : "—";
    const dates =
      step >= 3 && startDate && endDate
        ? `${startDate.format("MMM DD")} / ${endDate.format("MMM DD")}`
        : "— / —";
    return { ex, pct, dates };
  }, [step, exchange, minPct, startDate, endDate]);

  const stepHeading =
    step === 1
      ? "Which market do you want to scan?"
      : step === 2
      ? "What's your minimum % change?"
      : "Over what window?";

  const stepHelp =
    step === 1
      ? "Pick one. You can change it later from the toolbar — your other filters will carry over."
      : step === 2
      ? "Tickers below this threshold won't appear in your results. Most users start at 5% for daily-mover scans, or 20% for weekly breakouts."
      : "The scan ranks performance from start to end. Most users start with a quick preset and refine after.";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      maxWidth={false}
      slotProps={{
        backdrop: { sx: { background: WIZARD_COLORS.scrim, backdropFilter: "saturate(0.8)" } },
      }}
      PaperProps={{
        sx: {
          width: 560,
          maxWidth: "calc(100% - 64px)",
          background: "white",
          borderRadius: "14px",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -20px rgba(20, 35, 55, 0.45), 0 0 0 1px " +
            WIZARD_COLORS.border,
          overflow: "hidden",
          m: 0,
        },
      }}
    >
      <Box sx={{ padding: "22px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <Typography
          sx={{
            fontFamily: WIZARD_MONO_FONT,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: WIZARD_COLORS.ink500,
          }}
        >
          <Box component="span" sx={{ color: WIZARD_COLORS.blue700 }}>{`Step ${step}`}</Box>
          {" · of 3 · Set up your scan"}
        </Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            color: WIZARD_COLORS.ink500,
            "&:hover": { background: WIZARD_COLORS.sand200, color: WIZARD_COLORS.blue900 },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", padding: "12px 28px 0" }}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              height: 3,
              borderRadius: 999,
              background: i <= step ? WIZARD_COLORS.blue700 : WIZARD_COLORS.ink200,
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "4px",
          padding: "10px 28px 0",
          fontSize: 11,
          fontFamily: WIZARD_MONO_FONT,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {STEP_LABELS.map((label, idx) => {
          const i = idx + 1;
          const color =
            i === step
              ? WIZARD_COLORS.ink900
              : i < step
              ? WIZARD_COLORS.blue700
              : WIZARD_COLORS.ink500;
          return (
            <Box key={label} sx={{ color }}>
              {label}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ padding: "24px 28px 8px", minHeight: 280 }}>
        <Typography
          component="h2"
          sx={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: WIZARD_COLORS.ink900,
            lineHeight: 1.25,
            margin: "0 0 8px",
          }}
        >
          {stepHeading}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: WIZARD_COLORS.ink500,
            margin: "0 0 22px",
            lineHeight: 1.5,
            maxWidth: 440,
          }}
        >
          {stepHelp}
        </Typography>

        {step === 1 && (
          <ExchangeStep
            value={exchange}
            onChange={(id) => {
              setExchange(id);
              setLastSeededExchange(null);
            }}
          />
        )}
        {step === 2 && <ThresholdStep value={minPct} onChange={setMinPct} />}
        {step === 3 && (
          <DateRangeStep
            startDate={startDate}
            endDate={endDate}
            range={range}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 28px 22px",
          borderTop: `1px solid ${WIZARD_COLORS.border}`,
          mt: "16px",
          background: WIZARD_COLORS.sand100,
        }}
      >
        <Typography
          sx={{ fontSize: 12, color: WIZARD_COLORS.ink500, fontFamily: WIZARD_MONO_FONT }}
        >
          <Box component="b" sx={{ color: WIZARD_COLORS.ink900, fontWeight: 600 }}>
            {summary.ex}
          </Box>
          {" · "}
          <Box component="b" sx={{ color: WIZARD_COLORS.ink900, fontWeight: 600 }}>
            {summary.pct}
          </Box>
          {" · "}
          <Box component="b" sx={{ color: WIZARD_COLORS.ink900, fontWeight: 600 }}>
            {summary.dates}
          </Box>
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            onClick={handleBack}
            disabled={step === 1}
            startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
            sx={{
              height: 40,
              px: "18px",
              borderRadius: "7px",
              fontWeight: 600,
              fontSize: 14,
              textTransform: "none",
              color: WIZARD_COLORS.ink700,
              "&:hover": { background: WIZARD_COLORS.sand200, color: WIZARD_COLORS.blue900 },
              "&.Mui-disabled": { opacity: 0.4 },
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!stepValid}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              height: 40,
              px: "18px",
              borderRadius: "7px",
              fontWeight: 600,
              fontSize: 14,
              textTransform: "none",
              background: WIZARD_COLORS.blue700,
              color: "white",
              "&:hover": { background: WIZARD_COLORS.blue900 },
              "&.Mui-disabled": { opacity: 0.4, background: WIZARD_COLORS.blue700, color: "white" },
            }}
          >
            {step === 3 ? "Run scan" : "Continue"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
