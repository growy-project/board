"use client";
import React from "react";
import { useLocale } from "next-intl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { enUS, esES } from "@mui/x-date-pickers/locales";

const localeTextByLocale = {
  en: enUS.components.MuiLocalizationProvider.defaultProps.localeText,
  es: esES.components.MuiLocalizationProvider.defaultProps.localeText,
};

/**
 * Wraps MUI's LocalizationProvider with the runtime locale (from next-intl),
 * so the date pickers' adapter (month/weekday names) and UI strings
 * (toolbar/action labels) localize when the user toggles language.
 */
export default function AppLocalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const localeText = locale === "es" ? localeTextByLocale.es : localeTextByLocale.en;

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={locale}
      localeText={localeText}
    >
      {children}
    </LocalizationProvider>
  );
}
