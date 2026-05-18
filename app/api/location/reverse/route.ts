import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("format", "json");
  url.searchParams.set("zoom", "10");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "PaseoApp/1.0 (contact: dansworkemail@proton.me)",
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
  }

  const data = (await res.json()) as {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      country_code?: string;
    };
  };

  const city =
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    "Nearby";
  const region = data.address?.state;
  const label = region ? `${city}, ${region}` : city;

  return NextResponse.json({ label, city, region });
}
