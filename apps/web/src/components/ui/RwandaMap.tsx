import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface RwandaMapProps {
  points: MapPoint[];
  onSelect?: (name: string) => void;
}

const RWANDA_CENTER: [number, number] = [-1.9403, 29.8739];

// Branded green dot marker instead of Leaflet's default pin — matches the
// site's `.pin .dot` styling, and avoids bundling/importing the default
// marker-icon.png assets.
function dotIcon(isMain: boolean) {
  const size = isMain ? 18 : 14;
  return L.divIcon({
    className: "rwanda-map-dot",
    html: `<span style="
      display:block; width:${size}px; height:${size}px; border-radius:50%;
      background:#00D05E; border:2px solid #0B0F0E;
      box-shadow:0 0 0 5px rgba(0,208,94,0.22);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function RwandaMap({ points, onSelect }: RwandaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: RWANDA_CENTER,
      zoom: 9,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = points.map((point, i) => {
      const marker = L.marker([point.latitude, point.longitude], { icon: dotIcon(i === 0) })
        .addTo(map)
        .bindTooltip(point.name, { permanent: true, direction: "top", offset: [0, -8], className: "rwanda-map-label" });
      if (onSelect) {
        marker.on("click", () => onSelect(point.name));
      }
      return marker;
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds.pad(0.35), { maxZoom: 11 });
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [points, onSelect]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
