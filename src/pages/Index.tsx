import HeroSection from "@/components/home/HeroSection";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import TrendingNovels from "@/components/home/TrendingNovels";
import GenreCategories from "@/components/home/GenreCategories";
import RankingsSidebar from "@/components/home/RankingsSidebar";
import RecentUpdates from "@/components/home/RecentUpdates";

export default function Index() {
  return (
    <main>
      <HeroSection />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8 lg:gap-10">
          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-10">
            <RecentlyAdded />
            <GenreCategories />
            <TrendingNovels />
            <RecentUpdates />
          </div>

          {/* Sidebar */}
          <aside className="hidden w-[320px] shrink-0 lg:block">
            <div className="sticky top-20">
              <RankingsSidebar />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
