import { getBusinesses } from "@/lib/admin/queries";

export type PlaceResult = {
  placeId: string;
  name: string;
  address: string | null;
  category: string | null;
  photoUrl: string | null;
};

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const businesses = await getBusinesses();
  const q = query.trim().toLowerCase();

  const filtered = q
    ? businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          (b.address?.toLowerCase().includes(q) ?? false)
      )
    : businesses;

  return filtered.map((b) => ({
    placeId: b.google_place_id ?? b.id,
    name: b.name,
    address: b.address,
    category: b.category,
    photoUrl: b.photo_url,
  }));
}

export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const businesses = await getBusinesses();
  const match =
    businesses.find((b) => b.google_place_id === placeId) ??
    businesses.find((b) => b.id === placeId);

  if (!match) return null;

  return {
    placeId: match.google_place_id ?? match.id,
    name: match.name,
    address: match.address,
    category: match.category,
    photoUrl: match.photo_url,
  };
}
