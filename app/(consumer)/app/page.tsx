import { HomeScreen } from "@/components/consumer/home/HomeScreen";
import { getHomeData, getTimeGreeting } from "@/lib/consumer/getHomeData";

export default async function HomePage() {
  const { feed, displayName, membershipTier, memberSince, collections } =
    await getHomeData();

  const greeting = getTimeGreeting(new Date().getHours());

  return (
    <HomeScreen
      greeting={greeting}
      displayName={displayName}
      membershipTier={membershipTier}
      memberSince={memberSince}
      feed={feed}
      collections={collections}
    />
  );
}
