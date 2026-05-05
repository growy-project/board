"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthLogin from "../auth/AuthLogin";

const BLUE_900 = "#1c4670";
const BLUE_700 = "#278ab0";
const BLUE_300 = "#8ab8e0";
const INK_900 = "#0e1a26";
const INK_500 = "#5A6A85";
const FONT_SANS =
  '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const Login = () => {
  return (
    <PageContainer title="Login" description="Sign in to Momentum Scanner">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          fontFamily: FONT_SANS,
        }}
      >
        {/* LEFT — brand pitch */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${BLUE_900} 0%, ${BLUE_700} 100%)`,
            color: "#fff",
            padding: { xs: "40px 32px", md: "56px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: { xs: 4, md: 0 },
            minHeight: { xs: 360, md: "auto" },
            "&::before": {
              content: '""',
              position: "absolute",
              right: "-100px",
              bottom: "-100px",
              width: "480px",
              height: "480px",
              opacity: 0.08,
              background:
                "radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
              pointerEvents: "none",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: "relative" }}>
            <Box
              component="svg"
              viewBox="0 0 32 32"
              sx={{ width: 32, height: 32 }}
              aria-hidden
            >
              <path
                d="M4 22 L12 14 L18 19 L28 8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="28" cy="8" r="2.5" fill="#fff" />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
              Momentum <Box component="span" sx={{ color: BLUE_300 }}>Scanner</Box>
            </Typography>
          </Stack>

          <Box sx={{ position: "relative" }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 32, md: 44 },
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: "0 0 16px",
                maxWidth: 480,
              }}
            >
              Find stocks already on the move.
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.85)",
                maxWidth: 460,
                margin: 0,
              }}
            >
              Scan thousands of tickers for momentum, then drill into volatility, RSI, and sector
              data — so you can analyze trends with the right context.
            </Typography>
          </Box>

          <Typography
            sx={{
              position: "relative",
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              borderLeft: "2px solid rgba(255,255,255,0.3)",
              paddingLeft: 2,
              maxWidth: 440,
              lineHeight: 1.6,
            }}
          >
            &ldquo;Stocks that are already going up often keep rising for a period of time.
            Momentum Scanner helps you spot strong trends and analyze them more clearly.&rdquo;
          </Typography>
        </Box>

        {/* RIGHT — sign in form */}
        <Box
          sx={{
            width: { xs: "100%", md: 480 },
            background: "#fff",
            padding: { xs: "40px 32px", md: "56px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: INK_900,
              margin: "0 0 8px",
              letterSpacing: "-0.01em",
            }}
          >
            Sign in
          </Typography>
          <Typography sx={{ fontSize: 14, color: INK_500, marginBottom: "32px" }}>
            Use your Google account to continue.
          </Typography>

          <AuthLogin />

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              margin: "24px 0",
              color: INK_500,
              fontSize: 12,
              letterSpacing: "0.08em",
              "&::before, &::after": {
                content: '""',
                flex: 1,
                height: "1px",
                background: "#E5EAEF",
              },
            }}
          >
            <Box component="span">OR</Box>
          </Stack>

          <Button
            component={Link}
            href="/"
            fullWidth
            variant="outlined"
            sx={{
              height: 48,
              borderRadius: "8px",
              borderColor: "#B0BAC9",
              color: INK_900,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: BLUE_700,
                background: "#f5f5ef",
              },
            }}
          >
            Continue to dashboard without signing in
          </Button>

          <Typography
            sx={{
              fontSize: 12,
              color: INK_500,
              marginTop: "8px",
              lineHeight: 1.6,
              "& a": { color: BLUE_700, textDecoration: "none" },
            }}
          >
            By continuing you agree to Momentum Scanner&rsquo;s <a href="#">Terms</a> and{" "}
            <a href="#">Privacy Policy</a>. We never trade on your behalf and never share account
            data with third parties.
          </Typography>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Login;
