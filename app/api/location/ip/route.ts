import { NextResponse } from "next/server";

/** Fallback location from Vercel / proxy headers when browser geolocation is unavailable. */
export async function GET(req: Request) {
  const h = req.headers;
  const city = h.get("x-vercel-ip-city");
  const region = h.get("x-vercel-ip-country-region");
  const lat = h.get("x-vercel-ip-latitude");
  const lon = h.get("x-vercel-ip-longitude");

  if (city && lat && lon) {
    const label = region ? `${city}, ${region}` : city;
    return NextResponse.json({
      label,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      source: "ip",
    });
  }

  return NextResponse.json({ error: "Location unavailable" }, { status: 404 });
}
