import { createTheme } from "@mui/material/styles";
import { Plus_Jakarta_Sans } from "next/font/google";
import { enUS, esES } from "@mui/x-date-pickers/locales";
import { locale } from "@/i18n/config";

const datePickerLocale = locale === "es" ? esES : enUS;

export const plus = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#5D87FF",
      light: "#ECF2FF",
      dark: "#4570EA",
    },
    secondary: {
      main: "#49BEFF",
      light: "#E8F7FF",
      dark: "#23afdb",
    },
    success: {
      main: "#13DEB9",
      light: "#E6FFFA",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#539BFF",
      light: "#EBF3FE",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#FA896B",
      light: "#FDEDE8",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFAE1F",
      light: "#FEF5E5",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#F2F6FA",
      200: "#EAEFF4",
      300: "#DFE5EF",
      400: "#7C8FAC",
      500: "#5A6A85",
      600: "#2A3547",
    },
    text: {
      primary: "#2A3547",
      secondary: "#5A6A85",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
  },
  typography: {
    fontFamily: plus.style.fontFamily,
    h1: {
      fontWeight: 600,
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
      fontFamily: plus.style.fontFamily,
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
      fontFamily: plus.style.fontFamily,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: "1.75rem",
      fontFamily: plus.style.fontFamily,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.3125rem",
      lineHeight: "1.6rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: "1.6rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.2rem",
    },
    button: {
      textTransform: "capitalize",
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334rem",
    },
    body2: {
      fontSize: "0.75rem",
      letterSpacing: "0rem",
      fontWeight: 400,
      lineHeight: "1rem",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px !important",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
        },
      },
    },
  },
}, datePickerLocale);

const basedarkTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary: {
      main: "#5D87FF",
      light: "#253662",
      dark: "#4570EA",
    },
    secondary: {
      main: "#49BEFF",
      light: "#1a3a4a",
      dark: "#23afdb",
    },
    success: {
      main: "#13DEB9",
      light: "#1a3a35",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#539BFF",
      light: "#1a2d4a",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#FA896B",
      light: "#3a1f1a",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFAE1F",
      light: "#3a2e10",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#1e2a3a",
      200: "#253040",
      300: "#2d3a4a",
      400: "#7C8FAC",
      500: "#a0aec0",
      600: "#cbd5e0",
    },
    text: {
      primary: "#e6edf3",
      secondary: "#8b949e",
    },
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.08,
      hover: "#1f2937",
    },
    divider: "#30363d",
  },
  typography: {
    fontFamily: plus.style.fontFamily,
    h1: { fontWeight: 600, fontSize: "2.25rem", lineHeight: "2.75rem", fontFamily: plus.style.fontFamily },
    h2: { fontWeight: 600, fontSize: "1.875rem", lineHeight: "2.25rem", fontFamily: plus.style.fontFamily },
    h3: { fontWeight: 600, fontSize: "1.5rem", lineHeight: "1.75rem", fontFamily: plus.style.fontFamily },
    h4: { fontWeight: 600, fontSize: "1.3125rem", lineHeight: "1.6rem" },
    h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: "1.6rem" },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: "1.2rem" },
    button: { textTransform: "capitalize", fontWeight: 400 },
    body1: { fontSize: "0.875rem", fontWeight: 400, lineHeight: "1.334rem" },
    body2: { fontSize: "0.75rem", letterSpacing: "0rem", fontWeight: 400, lineHeight: "1rem" },
    subtitle1: { fontSize: "0.875rem", fontWeight: 400 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 400 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow: "rgb(0 0 0 / 40%) 0px 0px 2px 0px, rgb(0 0 0 / 20%) 0px 12px 24px -4px !important",
        },
      },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: "7px" } } },
  },
}, datePickerLocale);

const basenavyTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary: {
      main: "#5D87FF",
      light: "#1a2a4a",
      dark: "#4570EA",
    },
    secondary: {
      main: "#49BEFF",
      light: "#0f2233",
      dark: "#23afdb",
    },
    success: {
      main: "#13DEB9",
      light: "#0f2a28",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#539BFF",
      light: "#0f1e38",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#FA896B",
      light: "#2a1018",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFAE1F",
      light: "#2a1e08",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#0f1e38",
      200: "#142040",
      300: "#1a2a50",
      400: "#5a7aac",
      500: "#8eaad4",
      600: "#c0d4f0",
    },
    text: {
      primary: "#e8f0fe",
      secondary: "#8eaad4",
    },
    background: {
      default: "#0a1628",
      paper: "#0f2040",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.08,
      hover: "#142050",
    },
    divider: "#1e3060",
  },
  typography: {
    fontFamily: plus.style.fontFamily,
    h1: { fontWeight: 600, fontSize: "2.25rem", lineHeight: "2.75rem", fontFamily: plus.style.fontFamily },
    h2: { fontWeight: 600, fontSize: "1.875rem", lineHeight: "2.25rem", fontFamily: plus.style.fontFamily },
    h3: { fontWeight: 600, fontSize: "1.5rem", lineHeight: "1.75rem", fontFamily: plus.style.fontFamily },
    h4: { fontWeight: 600, fontSize: "1.3125rem", lineHeight: "1.6rem" },
    h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: "1.6rem" },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: "1.2rem" },
    button: { textTransform: "capitalize", fontWeight: 400 },
    body1: { fontSize: "0.875rem", fontWeight: 400, lineHeight: "1.334rem" },
    body2: { fontSize: "0.75rem", letterSpacing: "0rem", fontWeight: 400, lineHeight: "1rem" },
    subtitle1: { fontSize: "0.875rem", fontWeight: 400 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 400 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow: "rgb(0 0 0 / 50%) 0px 0px 2px 0px, rgb(0 0 0 / 25%) 0px 12px 24px -4px !important",
        },
      },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: "7px" } } },
  },
}, datePickerLocale);

export { baselightTheme, basedarkTheme, basenavyTheme };
