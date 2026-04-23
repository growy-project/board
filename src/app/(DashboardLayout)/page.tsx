'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';

const Dashboard = () => {
  return (
    <PageContainer title="MS" description="Momentum Scanner Dashboard">
      <Box>
        <Grid
          size={{
            xs: 12,
            lg: 8
          }}>
          <ProductPerformance />
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
