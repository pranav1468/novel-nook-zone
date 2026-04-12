import ImmersiveHero from "@/components/home/ImmersiveHero";
import StoryWorlds from "@/components/home/StoryWorlds";
import GenreExperience from "@/components/home/GenreExperience";
import FeaturedShowcase from "@/components/home/FeaturedShowcase";
import TrendingImmersive from "@/components/home/TrendingImmersive";
import MoodDiscovery from "@/components/home/MoodDiscovery";
import ContinueReading from "@/components/home/ContinueReading";
import AIRecommendations from "@/components/engagement/AIRecommendations";
import StatsCounter from "@/components/home/StatsCounter";
import RecentUpdates from "@/components/home/RecentUpdates";

export default function Index() {
  return (
    <main>
      <ImmersiveHero />
      <ContinueReading />
      <StoryWorlds />
      <MoodDiscovery />
      <GenreExperience />
      <FeaturedShowcase />
      <AIRecommendations />
      <TrendingImmersive />
      <StatsCounter />
      <RecentUpdates />
    </main>
  );
}
