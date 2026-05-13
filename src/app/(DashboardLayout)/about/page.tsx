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
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const accent = (text: string) => (
  <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
    {text}
  </Box>
);

const bullets = [
  {
    title: "Trend following",
    body: "Stocks already going up tend to keep going up for a stretch — institutional flows, earnings momentum, and FOMO all pull in the same direction.",
  },
  {
    title: "Quality matters",
    body: "Smooth, low-drawdown climbs are more reliable than choppy, gap-driven moves of the same size.",
  },
  {
    title: "We surface, you decide",
    body: "Momentum Scanner ranks and explains. The investment call stays with you.",
  },
];

const columnReference: { label: string; body: React.ReactNode }[] = [
  {
    label: "Percentage Change",
    body: "Total return across the selected date range: (newest − oldest) / oldest × 100. The raw growth signal — every other column is a quality lens on top of it.",
  },
  {
    label: "Volatility %",
    body: 'A CPVI-style volatility score over the window. Lower values mean steadier, "boring" momentum; higher values mean "lottery" behavior (gappy, news-driven). Smooth low-vol momentum has historically outperformed.',
  },
  {
    label: "% Positive Days",
    body: "Share of trading days where the close was higher than the prior close, as a %. Our smoothness proxy — values ≥ 50% indicate a steady climb, and ≥ 50% is required for Is Momentum.",
  },
  {
    label: "Return StdDev",
    body: "Sample standard deviation of daily returns over the window, in %. A second view on choppiness — high stddev means the path was bumpy even if the endpoint was good.",
  },
  {
    label: "Max Drawdown",
    body: "The largest peak-to-trough drop during the window, in %. Capped at ≤ 25% for Is Momentum — a stock that took a deep dip mid-window doesn't qualify.",
  },
  {
    label: "Is Momentum",
    body: "A boolean classification. For the full scan: top quintile of Percentage Change AND % Positive Days ≥ 50 AND Max Drawdown ≤ 25. For watchlists, the top-quintile rank is replaced by an absolute ≥ 20% growth threshold, because relative ranking is degenerate on small lists.",
  },
  {
    label: "RSI",
    body: "Standard 14-period Relative Strength Index on the closing prices. Above 70 is generally read as overbought, below 30 as oversold. Independent of the Is Momentum classification — provided as a complementary signal.",
  },
];

const AboutPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [devExpanded, setDevExpanded] = useState(false);

  return (
    <PageContainer title="MS" description="About">
      <DashboardCard title="Momentum Scanner">
        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 500, lineHeight: 1.5 }}
          >
            Momentum Scanner is built around one of the most widely used
            investing strategies in the market: {accent("trend following")},
            also known as{" "}
            <Link
              href="https://www.investopedia.com/terms/m/momentum_investing.asp"
              target="_blank"
              rel="noopener noreferrer"
            >
              momentum investing
            </Link>
            . The idea is simple — stocks that are already going up often keep
            rising for a period of time.
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
                  {accent(b.title)} — {b.body}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography variant="body1" sx={{ fontSize: "1.05rem" }}>
            The platform currently scans all Nasdaq and NYSE tickers, highlights
            those with notable growth, and shows the indicators that matter:
            volatility, sector data, technical signals, and analyst targets.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => setExpanded((v) => !v)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ pl: 0, fontSize: ".99rem" }}
            >
              {expanded ? "View less" : "View more"}
            </Button>
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              How Momentum Scanner works
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              The momentum premium is one of the most empirically robust effects
              in finance. It has been documented across more than 200 years of
              US equity data, in over 40 countries, and in many asset classes
              beyond stocks — bonds, currencies, and commodities.
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Raw growth, though, isn&apos;t enough. A core idea behind Momentum
              Scanner is the quality dimension: Gray &amp; Vogel&apos;s{" "}
              <Link
                href="https://novelinvestor.com/notes/quantitative-momentum-by-wesley-gray-jack-vogel/"
                target="_blank"
                rel="noopener noreferrer"
              >
                smooth-vs-choppy distinction
              </Link>
              . A steady climb reflects sustained buying pressure and slow
              information diffusion; gap-driven moves are noisier and more
              likely to mean-revert. That&apos;s why the scanner shows{" "}
              {accent("% Positive Days")}, {accent("Return StdDev")} and{" "}
              {accent("Max Drawdown")} alongside the raw return.
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Institutional implementations (AQR, BlackRock/iShares) also
              risk-adjust momentum, scaling scores by the underlying
              asset&apos;s volatility so that &quot;high momentum&quot; is not
              just a reflection of higher overall risk. The{" "}
              {accent("Volatility %")} column captures that, and {accent("RSI")}{" "}
              is provided as a complementary technical signal.
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              One last note: the literature is consistent that{" "}
              <Link
                href="https://www.trustnet.com/news/13439499/the-lessons-of-mark-carharts-on-persistence-in-mutual-fund-performance"
                target="_blank"
                rel="noopener noreferrer"
              >
                no single factor is reliable enough to bet everything on
              </Link>{" "}
              (Carhart, 1997). Momentum Scanner doesn&apos;t tell you what to
              buy — it surfaces signals you combine with your own judgment,
              community input, and the rest of your strategy.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Column reference — momentum quality metrics
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
            About the developer
          </Button>

          <Collapse in={devExpanded} timeout="auto" unmountOnExit>
            <Typography variant="body1" sx={{ fontSize: "1.05rem", mt: 2 }}>
              As a <Link
                href="https://www.linkedin.com/in/dario-olinuck/"
                target="_blank"
                rel="noopener noreferrer"
              >
                software developer
              </Link>
              , I wanted to figure out what to do with my
              savings — how to make them grow — so I bought some stocks: a
              handful of blue chips and a few green-energy names. Six months
              later I was down 1%. It wasn&apos;t scary — a 30% drop would have
              sent me running — but losing 1% on half a year of patience felt
              ridiculous. So I started researching, and eventually built the
              tool I wished I&apos;d had from day one.
            </Typography>
          </Collapse>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default AboutPage;
