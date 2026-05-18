"use client";
import React from "react";
import { Button } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ALTERNATE_DOMAINS, locale, type Locale } from "@/i18n/config";

const OTHER_LOCALE: Record<Locale, Locale> = {
  en: "es",
  es: "en",
};

export default function LanguageToggle() {
  const t = useTranslations("languageToggle");
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  const targetUrl = React.useMemo(() => {
    const search = searchParams?.toString() ?? "";
    return `${ALTERNATE_DOMAINS[OTHER_LOCALE[locale]]}${pathname}${search ? `?${search}` : ""}`;
  }, [pathname, searchParams]);

  return (
    <Button
      component="a"
      href={targetUrl}
      color="inherit"
      size="small"
      aria-label={t("ariaLabel")}
      sx={{ minWidth: 0, textTransform: "none", fontWeight: 600 }}
    >
      {t("label")}
    </Button>
  );
}
