import type { MapMarker } from "./types";
import { coordinatesForBusiness } from "./coordinates";

type FeedItem = {
  business: {
    id: string;
    name: string;
    address: string | null;
    business_config: unknown;
  };
  status: {
    wait_status: string | null;
    availability_status: string | null;
    active_note: string | null;
    last_updated_at: string | null;
  } | null;
};

export function toMapMarkers(feed: FeedItem[]): MapMarker[] {
  return feed.map(({ business, status }) => {
    const { lat, lng } = coordinatesForBusiness(
      business.id,
      business.business_config,
    );
    return {
      id: business.id,
      name: business.name,
      lat,
      lng,
      address: business.address,
      waitStatus: status?.wait_status,
      availabilityStatus: status?.availability_status,
      activeNote: status?.active_note,
      lastUpdated: status?.last_updated_at,
    };
  });
}
