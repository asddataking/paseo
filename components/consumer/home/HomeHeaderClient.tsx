"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Bell, ChevronDown, Loader2, MapPin } from "lucide-react";
import { weatherLabel } from "@/lib/weather/codes";

type LocState = { label: string; lat: number; lon: number };
type WeatherState = { tempF: number; summary: string };

const CACHE_KEY = "paseo_home_location_v1";

function readCache(): { loc: LocState; weather: WeatherState; at: number } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { loc: LocState; weather: WeatherState; at: number };
    if (Date.now() - parsed.at > 10 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(loc: LocState, weather: WeatherState) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ loc, weather, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherState> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("temperature_unit", "fahrenheit");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather unavailable");

  const data = (await res.json()) as {
    current?: { temperature_2m?: number; weather_code?: number };
  };

  return {
    tempF: Math.round(data.current?.temperature_2m ?? 0),
    summary: weatherLabel(data.current?.weather_code ?? 0),
  };
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `/api/location/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
  );
  if (!res.ok) return "Your area";
  const data = (await res.json()) as { label?: string };
  return data.label ?? "Your area";
}

async function fetchIpFallback(): Promise<LocState | null> {
  const res = await fetch("/api/location/ip");
  if (!res.ok) return null;
  const data = (await res.json()) as { label: string; lat: number; lon: number };
  return { label: data.label, lat: data.lat, lon: data.lon };
}

type Props = {
  displayName: string;
};

export function HomeHeaderClient({ displayName }: Props) {
  const initials = displayName.slice(0, 2).toUpperCase();
  const [loc, setLoc] = useState<LocState | null>(null);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyLocation = useCallback(async (latitude: number, longitude: number) => {
    const [label, wx] = await Promise.all([
      reverseGeocode(latitude, longitude),
      fetchWeather(latitude, longitude),
    ]);
    const nextLoc = { label, lat: latitude, lon: longitude };
    setLoc(nextLoc);
    setWeather(wx);
    writeCache(nextLoc, wx);
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      fetchIpFallback()
        .then(async (ip) => {
          if (!ip) {
            setError("Location unavailable");
            return;
          }
          await applyLocation(ip.lat, ip.lon);
        })
        .finally(() => setLoading(false));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyLocation(pos.coords.latitude, pos.coords.longitude).finally(() =>
          setLoading(false),
        );
      },
      async () => {
        const ip = await fetchIpFallback();
        if (ip) await applyLocation(ip.lat, ip.lon);
        else setError("Enable location for live weather");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  }, [applyLocation]);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setLoc(cached.loc);
      setWeather(cached.weather);
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh]);

  const weatherLine =
    weather != null ? `${weather.tempF}° · ${weather.summary}` : null;

  return (
    <header className="border-b border-[var(--sand)]/80 bg-[#fdfbf7]/95 px-4 pb-3 pt-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/app"
          className="shrink-0 font-serif text-lg tracking-[0.2em] text-[#b8860b]"
        >
          PASEO
        </Link>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex min-w-0 max-w-[44%] flex-1 items-center justify-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-stone-700 shadow-sm disabled:opacity-70"
          aria-label="Refresh location and weather"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[var(--accent-gold)]" />
          ) : (
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--accent-gold)]" />
          )}
          <span className="truncate">
            {loading ? "Locating…" : (loc?.label ?? "Set location")}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-stone-400" />
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-stone-600" />
          </button>
          <Link
            href="/app/account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sand)] ring-2 ring-white"
          >
            <span className="text-xs font-semibold text-stone-700">{initials}</span>
          </Link>
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-stone-500">
        {loading && !weatherLine ? (
          <span className="inline-flex items-center justify-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating weather…
          </span>
        ) : error ? (
          <button type="button" onClick={refresh} className="underline">
            {error} — tap to retry
          </button>
        ) : (
          weatherLine
        )}
      </p>
    </header>
  );
}
