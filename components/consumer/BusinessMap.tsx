"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { MapMarker } from "@/lib/map/types";
import { DEFAULT_MAP_CENTER } from "@/lib/map/coordinates";
import { formatRelativeTime } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }, [markers, map]);

  return null;
}

type Props = {
  markers: MapMarker[];
  className?: string;
};

export function BusinessMap({ markers, className }: Props) {
  const center = markers[0]
    ? ([markers[0].lat, markers[0].lng] as [number, number])
    : ([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng] as [number, number]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--sand)] shadow-sm ${className ?? "h-[min(52vh,420px)] w-full"}`}
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
        style={{ minHeight: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div className="min-w-[160px] space-y-1 text-sm">
                <p className="font-semibold text-stone-900">{m.name}</p>
                {m.address && (
                  <p className="text-xs text-stone-500">{m.address}</p>
                )}
                {m.waitStatus && (
                  <p className="text-xs font-medium text-emerald-700">
                    {m.waitStatus}
                  </p>
                )}
                {m.availabilityStatus && (
                  <p className="text-xs text-stone-600">{m.availabilityStatus}</p>
                )}
                {m.activeNote && (
                  <p className="text-xs text-stone-600">{m.activeNote}</p>
                )}
                {m.lastUpdated && (
                  <p className="text-[10px] text-stone-400">
                    Updated {formatRelativeTime(m.lastUpdated)}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
