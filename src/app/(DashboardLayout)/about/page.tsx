"use client";
import { Box, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const AboutPage = () => {
  return (
    <PageContainer title="MS" description="About">
      <DashboardCard title="Momentum Scanner">
        <Box>
          <Typography variant="body1" sx={{ mb: 2, fontSize: "1.1rem" }}>
            Momentum Scanner is built around one of the most widely used investing
            strategies in the market: <strong>trend following</strong>, also
            known as{" "}
            <a
              href="https://www.investopedia.com/terms/m/momentum_investing.asp"
              target="_blank"
              rel="noopener noreferrer"
            >
              momentum investing
            </a>
            . The idea is simple — stocks that are already going up often keep
            rising for a period of time. This happens for several reasons:
            institutional investors gradually building positions, companies
            reporting strong earnings growth, and market psychology like the
            fear of missing out. This alignment of institutional flow and retail
            sentiment creates &apos;persistent momentum,&apos; allowing trends to develop
            deep roots and sustain themselves over time.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
            Momentum Scanner doesn&apos;t try to tell you what to buy. Instead, it brings
            together the information that helps investors spot strong trends and
            analyze them more clearly. The platform scans thousands of stocks,
            highlighting those with notable growth and showing key indicators
            like volatility, sector data, and technical signals. With these
            tools, plus insights and rankings from other users, Momentum Scanner helps you
            explore opportunities, track ideas, and build your own investment
            strategy with better context.
          </Typography>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default AboutPage;
