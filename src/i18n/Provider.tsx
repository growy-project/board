"use client";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import { locale, formats } from "./config";
import enMessages from "./messages/en.json";
import esMessages from "./messages/es.json";

const messages = locale === "es" ? esMessages : enMessages;
dayjs.locale(locale);

const TIME_ZONE_BY_LOCALE: Record<string, string> = {
  en: "America/New_York",
  es: "America/Argentina/Buenos_Aires",
};

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      formats={formats}
      timeZone={TIME_ZONE_BY_LOCALE[locale]}
    >
      {children}
    </NextIntlClientProvider>
  );
}
