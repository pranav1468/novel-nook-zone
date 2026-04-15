import ImmersiveHero from "@/components/home/ImmersiveHero";
import StoryJourney from "@/components/home/StoryJourney";
import CinematicStats from "@/components/home/CinematicStats";
import GenrePortals from "@/components/home/GenrePortals";
import ImmersiveTrending from "@/components/home/ImmersiveTrending";
import ImmersiveFeatured from "@/components/home/ImmersiveFeatured";
import ImmersiveNewArrivals from "@/components/home/ImmersiveNewArrivals";
import ContinueReading from "@/components/home/ContinueReading";
import AIRecommendations from "@/components/engagement/AIRecommendations";
import RankingsSidebar from "@/components/home/RankingsSidebar";
import RecentUpdates from "@/components/home/RecentUpdates";
import FinalCTA from "@/components/home/FinalCTA";
import ChapterReveal from "@/components/home/ChapterReveal";

export default function Index() {
  return (
    <main className="overflow-hidden">
      {/* Act I — The Hook */}
      <ImmersiveHero />

      {/* Cinematic stats divider */}
      <CinematicStats />

      {/* Act II — The Journey */}
      <ChapterReveal chapter="Chapter I">
        <StoryJourney />
      </ChapterReveal>

      {/* Continue Reading (logged-in users) */}
      <ContinueReading />

      {/* Act III — Discovery */}
      <ChapterReveal chapter="Chapter II">
        <GenrePortals />
      </ChapterReveal>

      <ChapterReveal chapter="Chapter III">
        <ImmersiveFeatured />
      </ChapterReveal>

      <ChapterReveal>
        <ImmersiveTrending />
      </ChapterReveal>

      <ChapterReveal>
        <ImmersiveNewArrivals />
      </ChapterReveal>

      <ChapterReveal>
        <AIRecommendations />
      </ChapterReveal>

      {/* Act IV — Rankings & Updates */}
      <ChapterReveal chapter="Chapter IV">
        <RankingsSidebar />
      </ChapterReveal>

      <ChapterReveal>
        <RecentUpdates />
      </ChapterReveal>

      {/* Finale — Call to Action */}
      <FinalCTA />
    </main>
  );
}
