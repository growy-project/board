"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import MyWatchlist from "@/app/(DashboardLayout)/components/dashboard/MyWatchlist";

const MyWatchlistPage = () => {
  return (
    <PageContainer title="My Watchlist" description="My Watchlist">
      <MyWatchlist />
    </PageContainer>
  );
};

export default MyWatchlistPage;
