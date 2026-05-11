import React from "react";
import { Box, ButtonBase, IconButton, InputBase, Typography } from "@mui/material";
import { WIZARD_COLORS, WIZARD_MONO_FONT } from "./wizardTheme";

const PRESETS = [2, 5, 10, 20, 50];

interface Props {
  value: number;
  onChange: (next: number) => void;
}

export default function ThresholdStep({ value, onChange }: Props) {
  const clamp = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: "14px", mb: "16px" }}>
        <Box sx={{ position: "relative", flex: 1 }}>
          <InputBase
            type="number"
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            inputProps={{ inputMode: "decimal", min: 0 }}
            sx={{
              width: "100%",
              boxSizing: "border-box",
              fontFamily: WIZARD_MONO_FONT,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              background: WIZARD_COLORS.sand100,
              border: `1px solid ${WIZARD_COLORS.border}`,
              borderRadius: "10px",
              padding: "14px 56px 14px 18px",
              color: WIZARD_COLORS.ink900,
              transition: "0.15s",
              "&.Mui-focused": {
                borderColor: WIZARD_COLORS.blue700,
                background: "white",
                boxShadow: "0 0 0 3px rgba(39, 138, 176, 0.15)",
              },
              "& input": { padding: 0 },
              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                { WebkitAppearance: "none", margin: 0 },
              "& input[type=number]": { MozAppearance: "textfield" },
            }}
          />
          <Box
            component="span"
            sx={{
              position: "absolute",
              right: 18,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: WIZARD_MONO_FONT,
              fontSize: 22,
              color: WIZARD_COLORS.ink500,
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            %
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <StepperButton aria-label="Increase" onClick={() => onChange(clamp(value + 1))}>
            +
          </StepperButton>
          <StepperButton aria-label="Decrease" onClick={() => onChange(clamp(value - 1))}>
            −
          </StepperButton>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {PRESETS.map((p) => {
          const active = p === value;
          return (
            <ButtonBase
              key={p}
              onClick={() => onChange(p)}
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
              }}
            >
              <Typography component="span" sx={{ font: "inherit" }}>
                {p}%
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </>
  );
}

function StepperButton({
  children,
  onClick,
  ...rest
}: React.ComponentProps<typeof IconButton>) {
  return (
    <IconButton
      disableRipple
      onClick={onClick}
      {...rest}
      sx={{
        width: 36,
        height: 26,
        borderRadius: "6px",
        background: WIZARD_COLORS.sand100,
        border: `1px solid ${WIZARD_COLORS.border}`,
        color: WIZARD_COLORS.ink700,
        fontSize: 12,
        fontFamily: WIZARD_MONO_FONT,
        padding: 0,
        "&:hover": { background: WIZARD_COLORS.sand200, color: WIZARD_COLORS.blue900 },
      }}
    >
      {children}
    </IconButton>
  );
}
