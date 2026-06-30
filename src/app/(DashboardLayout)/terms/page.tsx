"use client";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const TermsPage = () => {
  const t = useTranslations("terms");

  const sections = t.raw("sections") as { title: string; body: string }[];

  return (
    <PageContainer title={t("pageTitle")} description={t("pageDescription")}>
      <DashboardCard title={t("title")}>
        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 500, lineHeight: 1.5, textAlign: "justify" }}
          >
            {t("intro")}
          </Typography>

          <Stack spacing={2.5}>
            {sections.map((s) => (
              <Box key={s.title}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "primary.main", fontWeight: 600, mb: 0.5 }}
                >
                  {s.title}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.05rem", textAlign: "justify" }}>
                  {s.body}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography
            variant="body1"
            sx={{ mt: 3, fontWeight: 600, textAlign: "justify" }}
          >
            {t("closing")}
          </Typography>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default TermsPage;
