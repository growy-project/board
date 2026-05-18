export type Locale = "en" | "es";

export const SUPPORTED_LOCALES: Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

const rawLocale = process.env.NEXT_PUBLIC_LOCALE;
export const locale: Locale =
  rawLocale === "es" ? "es" : rawLocale === "en" ? "en" : DEFAULT_LOCALE;

export const ALTERNATE_DOMAINS: Record<Locale, string> = {
  en: "https://momentum-scanner.com",
  es: "https://cedear-scanner.com",
};

export const formats = {
  dateTime: {
    short: { year: "numeric", month: "short", day: "numeric" },
    compact: { month: "short", day: "numeric" },
    monthYear: { month: "short", year: "numeric" },
  },
  number: {
    currency: { style: "currency", currency: "USD" },
    percent1: { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 },
    percent2: { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 },
    decimal1: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    decimal2: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
} as const;

export function isSafeReturnTo(value: string | null | undefined): value is string {
  if (!value) return false;
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  if (value.startsWith("/\\")) return false;
  return true;
}
