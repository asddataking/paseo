import { HomeHeaderClient } from "./HomeHeaderClient";

type Props = {
  displayName: string;
};

export function HomeHeader({ displayName }: Props) {
  return <HomeHeaderClient displayName={displayName} />;
}
