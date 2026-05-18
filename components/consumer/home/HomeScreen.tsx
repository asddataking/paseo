import type { FeedCard } from "@/lib/feed/types";
import type { HomeCollection } from "@/lib/consumer/getHomeData";
import type { MembershipTier } from "@/lib/tiers";
import { HomeHeader } from "./HomeHeader";
import { HomeGreeting } from "./HomeGreeting";
import { HomeFeed } from "./HomeFeed";
import { CollectionsRow } from "./CollectionsRow";

type Props = {
  greeting: string;
  displayName: string;
  membershipTier: MembershipTier;
  memberSince: string | null;
  feed: FeedCard[];
  collections: HomeCollection[];
};

export function HomeScreen({
  greeting,
  displayName,
  membershipTier,
  memberSince,
  feed,
  collections,
}: Props) {
  return (
    <div className="-mx-4">
      <HomeHeader displayName={displayName} />
      <HomeGreeting
        greeting={greeting}
        displayName={displayName}
        membershipTier={membershipTier}
        memberSince={memberSince}
      />
      <HomeFeed feed={feed} />
      <CollectionsRow collections={collections} />
    </div>
  );
}
