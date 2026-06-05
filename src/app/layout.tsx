"use client";
import { baselightTheme, basedarkTheme, basenavyTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/app/context/AuthContext";
import { AppThemeProvider, useAppTheme } from "@/app/context/ThemeContext";
import { queryClient } from "@/app/(DashboardLayout)/queryClient";
import I18nProvider from "@/i18n/Provider";
import { locale, ALTERNATE_DOMAINS } from "@/i18n/config";
import TelemetryInit from "@/telemetry/TelemetryInit";

function ActiveThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useAppTheme();
  const theme =
    mode === "dark" ? basedarkTheme : mode === "navy" ? basenavyTheme : baselightTheme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={locale}>
      <head>
        <link rel="alternate" hrefLang="en" href={ALTERNATE_DOMAINS.en + "/"} />
        <link rel="alternate" hrefLang="es" href={ALTERNATE_DOMAINS.es + "/"} />
        <link rel="alternate" hrefLang="x-default" href={ALTERNATE_DOMAINS.en + "/"} />
      </head>
      <body>
        <TelemetryInit />
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
          >
            <AuthProvider>
              <I18nProvider>
                <AppThemeProvider>
                  <ActiveThemeProvider>
                    {children}
                  </ActiveThemeProvider>
                </AppThemeProvider>
              </I18nProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </QueryClientProvider>
      </body>
    </html>
  );
}
