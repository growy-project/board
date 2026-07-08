import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslations } from "next-intl";
import { WIZARD_COLORS, WIZARD_MONO_FONT } from "./wizardTheme";

export type ExchangeId = "NASDAQ" | "NYSE" | "CEDEAR";

interface ExchangeOption {
  id: ExchangeId;
  name: string;
  full?: boolean;
  hasPill?: boolean;
}

const OPTIONS: ExchangeOption[] = [
  { id: "NASDAQ", name: "NASDAQ" },
  { id: "NYSE", name: "NYSE" },
  {
    id: "CEDEAR",
    name: "CEDEAR",
    full: true,
    hasPill: true,
  },
];

interface Props {
  value: ExchangeId;
  onChange: (id: ExchangeId) => void;
}

export default function ExchangeStep({ value, onChange }: Props) {
  const t = useTranslations("wizard");
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {OPTIONS.map((opt) => {
        const active = opt.id === value;
        return (
          <ButtonBase
            key={opt.id}
            onClick={() => onChange(opt.id)}
            sx={{
              gridColumn: opt.full ? "span 2" : undefined,
              border: `1px solid ${active ? WIZARD_COLORS.blue700 : WIZARD_COLORS.border}`,
              borderStyle: opt.full ? "dashed" : "solid",
              background: active ? WIZARD_COLORS.blue100 : "white",
              boxShadow: active ? `0 0 0 1px ${WIZARD_COLORS.blue700} inset` : "none",
              borderRadius: "10px",
              padding: "16px 18px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              position: "relative",
              transition: "0.15s",
              "&:hover": {
                borderColor: WIZARD_COLORS.blue500,
                background: active ? WIZARD_COLORS.blue100 : WIZARD_COLORS.sand100,
              },
            }}
          >
            {active && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: WIZARD_COLORS.blue700,
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckIcon sx={{ fontSize: 12 }} />
              </Box>
            )}
            <Typography
              sx={{ fontWeight: 700, fontSize: 15, color: WIZARD_COLORS.ink900 }}
            >
              {opt.name}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: WIZARD_COLORS.ink500,
                fontFamily: WIZARD_MONO_FONT,
              }}
            >
              {t(`exchange.${opt.id}.meta`)}
            </Typography>
            {opt.hasPill && (
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: WIZARD_COLORS.ink500,
                  alignSelf: "flex-start",
                  mt: "6px",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: WIZARD_COLORS.sand200,
                }}
              >
                {t("exchange.CEDEAR.pill")}
              </Box>
            )}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
