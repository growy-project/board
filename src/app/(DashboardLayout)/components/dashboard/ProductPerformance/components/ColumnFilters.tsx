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
import { useTranslations } from "next-intl";
import type { MomentumFilter, UseColumnFiltersResult } from "../hooks/useColumnFilters";

interface ColumnFiltersProps {
  filters: UseColumnFiltersResult;
}

const accentSx = {
  minWidth: "140px",
  width: { xs: "100%", sm: "auto" },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": { borderColor: "#278ab0" },
    "&.Mui-focused fieldset": { borderColor: "#1c4670" },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": { color: "#1c4670" },
  },
};

const menuProps = {
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
};

export default function ColumnFilters({ filters }: ColumnFiltersProps) {
  const {
    symbol,
    momentum,
    bouncing,
    sector,
    minMarketCap,
    sectorOptions,
    hasActiveFilters,
    setSymbol: onSymbolChange,
    setMomentum: onMomentumChange,
    setBouncing: onBouncingChange,
    setSector: onSectorChange,
    setMinMarketCap: onMinMarketCapChange,
    resetFilters: onClear,
  } = filters;
  const tf = useTranslations("table.filters");
  const tc = useTranslations("table.columns");
  const tv = useTranslations("table.values");

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "center" }}
      sx={{ mb: 2, flexWrap: "wrap" }}
    >
      {/* Symbol */}
      <TextField
        label={tc("symbol")}
        value={symbol}
        onChange={(e) => onSymbolChange(e.target.value)}
        size="small"
        sx={{ ...accentSx, width: { xs: "100%", sm: "150px" } }}
      />

      {/* Is Momentum */}
      <FormControl size="small" sx={accentSx}>
        <InputLabel id="momentum-filter-label">{tf("momentum")}</InputLabel>
        <Select
          labelId="momentum-filter-label"
          id="momentum-filter"
          value={momentum}
          label={tf("momentum")}
          onChange={(e: SelectChangeEvent) => onMomentumChange(e.target.value as MomentumFilter)}
          MenuProps={menuProps}
        >
          <MenuItem value="all">{tf("all")}</MenuItem>
          <MenuItem value="yes">{tv("yes")}</MenuItem>
          <MenuItem value="no">{tv("no")}</MenuItem>
        </Select>
      </FormControl>

      {/* Is Bouncing */}
      <FormControl size="small" sx={accentSx}>
        <InputLabel id="bouncing-filter-label">{tf("bouncing")}</InputLabel>
        <Select
          labelId="bouncing-filter-label"
          id="bouncing-filter"
          value={bouncing}
          label={tf("bouncing")}
          onChange={(e: SelectChangeEvent) => onBouncingChange(e.target.value as MomentumFilter)}
          MenuProps={menuProps}
        >
          <MenuItem value="all">{tf("all")}</MenuItem>
          <MenuItem value="yes">{tv("yes")}</MenuItem>
          <MenuItem value="no">{tv("no")}</MenuItem>
        </Select>
      </FormControl>

      {/* Sector */}
      <FormControl size="small" sx={accentSx} disabled={sectorOptions.length === 0}>
        <InputLabel id="sector-filter-label">{tc("sector")}</InputLabel>
        <Select
          labelId="sector-filter-label"
          id="sector-filter"
          value={sector}
          label={tc("sector")}
          onChange={(e: SelectChangeEvent) => onSectorChange(e.target.value)}
          MenuProps={menuProps}
        >
          <MenuItem value="">{tf("all")}</MenuItem>
          {sectorOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Min Market Cap (in millions) */}
      <TextField
        label={tf("minMarketCap")}
        type="number"
        value={minMarketCap}
        onChange={(e) => onMinMarketCapChange(e.target.value)}
        size="small"
        inputProps={{ min: 0 }}
        sx={{ ...accentSx, width: { xs: "100%", sm: "160px" } }}
      />

      {/* Clear filters */}
      <Button
        variant="outlined"
        onClick={onClear}
        disabled={!hasActiveFilters}
        sx={{
          color: "#1c4670",
          borderColor: "#278ab0",
          "&:hover": { borderColor: "#1c4670", backgroundColor: "#eaeae0" },
          height: "40px",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {tf("clear")}
      </Button>
    </Stack>
  );
}
