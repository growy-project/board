"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthLogin from "../auth/AuthLogin";
import { isSafeReturnTo } from "@/i18n/config";

const BLUE_900 = "#1c4670";
const BLUE_700 = "#278ab0";
const BLUE_300 = "#8ab8e0";
const INK_900 = "#0e1a26";
const INK_500 = "#5A6A85";
const FONT_SANS =
  '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const Login = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams?.get("returnTo");
  const continueHref = isSafeReturnTo(rawReturnTo) ? rawReturnTo : "/";

  return (
    <PageContainer title={t("auth.pageTitle")} description={t("auth.pageDescription")}>
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
              {t("brand.name")}
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
              {t("brand.tagline")}
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
              {t("brand.description")}
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
            {t("brand.quote")}
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
            {t("auth.signIn")}
          </Typography>
          <Typography sx={{ fontSize: 14, color: INK_500, marginBottom: "32px" }}>
            {t("auth.useGoogle")}
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
            <Box component="span">{t("auth.or")}</Box>
          </Stack>

          <Button
            component={Link}
            href={continueHref}
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
            {t("auth.continueWithout")}
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
            {t.rich("auth.terms", {
              terms: (chunks) => <a href="#">{chunks}</a>,
              privacy: (chunks) => <a href="#">{chunks}</a>,
            })}
          </Typography>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Login;
