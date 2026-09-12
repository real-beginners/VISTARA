"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface GeoResult {
  lat: number;
  lon: number;
  displayName: string;
}

/**
 * Quick lookup table for popular Indian travel destinations.
 * Covers states/regions that Open-Meteo may not resolve precisely.
 */
const INDIA_GEO_LOOKUP: Record<string, GeoResult> = {
  "goa":        { lat: 15.2993, lon: 74.1240, displayName: "Goa, India" },
  "mumbai":     { lat: 19.0760, lon: 72.8777, displayName: "Mumbai, Maharashtra, India" },
  "delhi":      { lat: 28.6139, lon: 77.2090, displayName: "New Delhi, India" },
  "new delhi":  { lat: 28.6139, lon: 77.2090, displayName: "New Delhi, India" },
  "bangalore":  { lat: 12.9716, lon: 77.5946, displayName: "Bengaluru, Karnataka, India" },
  "bengaluru":  { lat: 12.9716, lon: 77.5946, displayName: "Bengaluru, Karnataka, India" },
  "jaipur":     { lat: 26.9124, lon: 75.7873, displayName: "Jaipur, Rajasthan, India" },
  "udaipur":    { lat: 24.5854, lon: 73.7125, displayName: "Udaipur, Rajasthan, India" },
  "agra":       { lat: 27.1767, lon: 78.0081, displayName: "Agra, Uttar Pradesh, India" },
  "varanasi":   { lat: 25.3176, lon: 82.9739, displayName: "Varanasi, Uttar Pradesh, India" },
  "hyderabad":  { lat: 17.3850, lon: 78.4867, displayName: "Hyderabad, Telangana, India" },
  "chennai":    { lat: 13.0827, lon: 80.2707, displayName: "Chennai, Tamil Nadu, India" },
  "kolkata":    { lat: 22.5726, lon: 88.3639, displayName: "Kolkata, West Bengal, India" },
  "pune":       { lat: 18.5204, lon: 73.8567, displayName: "Pune, Maharashtra, India" },
  "manali":     { lat: 32.2396, lon: 77.1887, displayName: "Manali, Himachal Pradesh, India" },
  "shimla":     { lat: 31.1048, lon: 77.1734, displayName: "Shimla, Himachal Pradesh, India" },
  "darjeeling": { lat: 27.0360, lon: 88.2627, displayName: "Darjeeling, West Bengal, India" },
  "leh":        { lat: 34.1526, lon: 77.5771, displayName: "Leh, Ladakh, India" },
  "ladakh":     { lat: 34.1526, lon: 77.5771, displayName: "Leh, Ladakh, India" },
  "rishikesh":  { lat: 30.0869, lon: 78.2676, displayName: "Rishikesh, Uttarakhand, India" },
  "haridwar":   { lat: 29.9457, lon: 78.1642, displayName: "Haridwar, Uttarakhand, India" },
  "kerala":     { lat: 10.8505, lon: 76.2711, displayName: "Kerala, India" },
  "kochi":      { lat: 9.9312,  lon: 76.2673, displayName: "Kochi, Kerala, India" },
  "mysuru":     { lat: 12.2958, lon: 76.6394, displayName: "Mysuru, Karnataka, India" },
  "mysore":     { lat: 12.2958, lon: 76.6394, displayName: "Mysuru, Karnataka, India" },
  "ooty":       { lat: 11.4102, lon: 76.6950, displayName: "Ooty, Tamil Nadu, India" },
  "coorg":      { lat: 12.3375, lon: 75.8069, displayName: "Coorg, Karnataka, India" },
  "andaman":    { lat: 11.7401, lon: 92.6586, displayName: "Andaman Islands, India" },
};

/**
 * Geocode a destination string. First tries a hardcoded India lookup table
 * (covers popular travel states/cities reliably), then falls back to the
 * Open-Meteo geocoding API (no API key required), preferring Indian results.
 */
async function geocodeDestination(destination: string): Promise<GeoResult | null> {
  const key = destination.toLowerCase().trim();

  // 1. Try hardcoded India lookup
  if (INDIA_GEO_LOOKUP[key]) {
    return INDIA_GEO_LOOKUP[key];
  }

  // 2. Partial match (e.g. "North Goa" → "goa")
  const partialMatch = Object.keys(INDIA_GEO_LOOKUP).find((k) => key.includes(k) || k.includes(key));
  if (partialMatch) {
    return INDIA_GEO_LOOKUP[partialMatch];
  }

  // 3. Open-Meteo API fallback
  try {
    const encoded = encodeURIComponent(destination);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=10&language=en&format=json`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    // Prefer India, fall back to highest population
    const indiaResult = data.results.find(
      (r: { country_code?: string }) => r.country_code === "IN"
    );
    const best = indiaResult || data.results.reduce(
      (a: { population?: number }, b: { population?: number }) =>
        (b.population || 0) > (a.population || 0) ? b : a,
      data.results[0]
    );

    return {
      lat: best.latitude,
      lon: best.longitude,
      displayName: [best.name, best.admin1, best.country].filter(Boolean).join(", "),
    };
  } catch {
    return null;
  }
}

interface TripMapSectionProps {
  destination: string;
}

/**
 * Renders an interactive Leaflet + OpenStreetMap centered on the trip destination.
 * Loaded dynamically (no SSR) to avoid Leaflet's window dependency.
 */
export function TripMapSection({ destination }: TripMapSectionProps) {
  const [geo, setGeo] = useState<GeoResult | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  // Step 1 — Geocode the destination
  useEffect(() => {
    setGeoLoading(true);
    setGeoError(null);
    setGeo(null);

    geocodeDestination(destination)
      .then((result) => {
        if (!result) {
          setGeoError(`Could not find coordinates for "${destination}". Try a more specific city name.`);
        } else {
          setGeo(result);
        }
      })
      .catch(() => {
        setGeoError("Geocoding request failed. Check your internet connection.");
      })
      .finally(() => setGeoLoading(false));
  }, [destination]);

  // Step 2 — Initialize Leaflet map once we have coordinates
  useEffect(() => {
    if (!geo || !mapContainerRef.current) return;

    // Destroy any existing map instance (React strict-mode double-effect guard)
    if (mapInstanceRef.current) {
      (mapInstanceRef.current as { remove: () => void }).remove();
      mapInstanceRef.current = null;
    }

    // Dynamically import Leaflet to avoid SSR issues
    let destroyed = false;
    import("leaflet").then((L) => {
      if (destroyed || !mapContainerRef.current) return;

      // Fix default marker icon paths that Webpack breaks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current!, {
        center: [geo.lat, geo.lon],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      L.marker([geo.lat, geo.lon])
        .addTo(map)
        .bindPopup(`<strong>${destination}</strong><br/><span style="font-size:11px;color:#666">${geo.displayName}</span>`)
        .openPopup();

      mapInstanceRef.current = map;
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geo, destination]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
        <div>
          <p className="eyebrow text-[10px] font-bold text-pine">OpenStreetMap</p>
          <h2 className="mt-0.5 font-display text-xl tracking-[-0.02em] text-ink">
            Destination Map
          </h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-moss px-3 py-1 text-xs font-bold text-pine">
          <Icon name="map-pin" size={13} />
          {destination}
        </span>
      </div>

      {/* Loading geocode */}
      {geoLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="flex h-11 w-11 animate-pulse items-center justify-center rounded-2xl bg-moss text-pine">
            <Icon name="map" size={20} />
          </span>
          <p className="text-sm font-medium text-ink">Locating {destination}…</p>
          <p className="text-xs text-muted">Using OpenStreetMap geocoding</p>
        </div>
      )}

      {/* Geocode error */}
      {!geoLoading && geoError && (
        <div className="flex items-start gap-3 px-5 py-6 sm:px-6">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-coral" />
          <div>
            <p className="text-sm font-semibold text-coral">Could not locate destination</p>
            <p className="mt-0.5 text-xs text-muted">{geoError}</p>
          </div>
        </div>
      )}

      {/* Map container — always rendered once geo is ready so the ref exists */}
      {!geoLoading && geo && (
        <>
          {/* Leaflet CSS — injected inline via a style tag to avoid next/head issues */}
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <div
            ref={mapContainerRef}
            style={{ height: 400, width: "100%" }}
            aria-label={`Interactive map of ${destination}`}
          />
          <div className="flex items-center gap-1.5 border-t border-line px-5 py-2.5 text-[10px] text-muted/60 sm:px-6">
            <Icon name="map" size={11} />
            Map data © OpenStreetMap contributors · Tiles © OpenStreetMap · No API key required
          </div>
        </>
      )}
    </div>
  );
}
