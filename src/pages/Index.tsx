import HeroSection from "@/components/home/HeroSection";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import TrendingNovels from "@/components/home/TrendingNovels";
import FeaturedNovels from "@/components/home/FeaturedNovels";
import GenreCategories from "@/components/home/GenreCategories";
import RankingsSidebar from "@/components/home/RankingsSidebar";
import RecentUpdates from "@/components/home/RecentUpdates";
import StatsCounter from "@/components/home/StatsCounter";
import NovelMarquee from "@/components/home/NovelMarquee";

export default function Index() {
  return (
    <main>
      <HeroSection />
      <NovelMarquee />
      <StatsCounter />
      <RecentlyAdded />
      <GenreCategories />
      <TrendingNovels />
      <FeaturedNovels />
      <RankingsSidebar />
      <RecentUpdates />
    </main>
  );
}
