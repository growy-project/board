import React from "react";
import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { WIZARD_COLORS, WIZARD_MONO_FONT } from "../wizard/wizardTheme";

interface DateFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (d: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export default function DateField({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}: DateFieldProps) {
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
