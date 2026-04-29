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
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
          >
            <AuthProvider>
              <AppThemeProvider>
                <ActiveThemeProvider>
                  {children}
                </ActiveThemeProvider>
              </AppThemeProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </QueryClientProvider>
      </body>
    </html>
  );
}
