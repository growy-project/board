"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslations } from "next-intl";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const Accent = ({ children }: { children: React.ReactNode }) => (
  <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
    {children}
  </Box>
);

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </Link>
);

const MOMENTUM_INVESTING_URL =
  "https://www.investopedia.com/terms/m/momentum_investing.asp";
const QUALITY_URL =
  "https://novelinvestor.com/notes/quantitative-momentum-by-wesley-gray-jack-vogel/";
const CARHART_URL =
  "https://www.trustnet.com/news/13439499/the-lessons-of-mark-carharts-on-persistence-in-mutual-fund-performance";
const DEVELOPER_URL = "https://www.linkedin.com/in/dario-olinuck/";

const AboutPage = () => {
  const t = useTranslations("about");
  const [expanded, setExpanded] = useState(false);
  const [devExpanded, setDevExpanded] = useState(false);

  const bullets = t.raw("bullets") as { title: string; body: string }[];
  const columnReference = t.raw("columns") as { label: string; body: string }[];

  return (
    <PageContainer title={t("pageTitle")} description={t("pageDescription")}>
      <DashboardCard title={t("title")}>
        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 500, lineHeight: 1.5 }}
          >
            {t.rich("intro", {
              accent: (chunks) => <Accent>{chunks}</Accent>,
              momentumLink: (chunks) => (
                <ExternalLink href={MOMENTUM_INVESTING_URL}>{chunks}</ExternalLink>
              ),
            })}
          </Typography>

          <Stack spacing={1.25} sx={{ mb: 2 }}>
            {bullets.map((b) => (
              <Box
                key={b.title}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <Box
                  sx={{
                    mt: "10px",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body1" sx={{ fontSize: "1.05rem" }}>
                  <Accent>{b.title}</Accent> — {b.body}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography variant="body1" sx={{ fontSize: "1.05rem" }}>
            {t("closing")}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => setExpanded((v) => !v)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ pl: 0, fontSize: ".99rem" }}
            >
              {expanded ? t("viewLess") : t("viewMore")}
            </Button>
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("howItWorksTitle")}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("howItWorks1")}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {t.rich("howItWorks2", {
                accent: (chunks) => <Accent>{chunks}</Accent>,
                qualityLink: (chunks) => (
                  <ExternalLink href={QUALITY_URL}>{chunks}</ExternalLink>
                ),
              })}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {t.rich("howItWorks3", {
                accent: (chunks) => <Accent>{chunks}</Accent>,
              })}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {t.rich("howItWorks4", {
                carhartLink: (chunks) => (
                  <ExternalLink href={CARHART_URL}>{chunks}</ExternalLink>
                ),
              })}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("columnReferenceTitle")}
            </Typography>

            <Stack spacing={2.25}>
              {columnReference.map((c) => (
                <Box key={c.label}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "primary.main", fontWeight: 600, mb: 0.5 }}
                  >
                    {c.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                    {c.body}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Collapse>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="text"
            color="primary"
            onClick={() => setDevExpanded((v) => !v)}
            endIcon={devExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ pl: 0, fontSize: ".99rem" }}
          >
            {t("aboutDeveloper")}
          </Button>

          <Collapse in={devExpanded} timeout="auto" unmountOnExit>
            <Typography variant="body1" sx={{ fontSize: "1.05rem", mt: 2 }}>
              {t.rich("developerBody", {
                devLink: (chunks) => (
                  <ExternalLink href={DEVELOPER_URL}>{chunks}</ExternalLink>
                ),
              })}
            </Typography>
          </Collapse>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default AboutPage;
