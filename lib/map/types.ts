export type MapMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string | null;
  waitStatus?: string | null;
  availabilityStatus?: string | null;
  activeNote?: string | null;
  lastUpdated?: string | null;
};
