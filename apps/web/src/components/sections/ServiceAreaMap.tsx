import { Suspense, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { CheckIcon } from "../ui/icons";
import { useApiData } from "../../hooks/useApiData";
import { lazyWithRetry } from "../../lib/lazyWithRetry";
import type { ServiceArea } from "../../types";

// Leaflet is a sizable standalone dependency needed only for this one
// section — split it into its own chunk instead of bloating the main
// bundle every visitor downloads.
const RwandaMap = lazyWithRetry(() => import("../ui/RwandaMap").then((m) => ({ default: m.RwandaMap })));

const FALLBACK_AREAS: ServiceArea[] = [
  { id: "kigali", districtName: "Kigali", description: null, latitude: -1.9441, longitude: 30.0619, isActive: true, displayOrder: 1 },
  { id: "gasabo", districtName: "Gasabo", description: null, latitude: -1.9346, longitude: 30.1044, isActive: true, displayOrder: 2 },
  { id: "kicukiro", districtName: "Kicukiro", description: null, latitude: -1.9878, longitude: 30.1044, isActive: true, displayOrder: 3 },
  { id: "nyarugenge", districtName: "Nyarugenge", description: null, latitude: -1.95, longitude: 30.0588, isActive: true, displayOrder: 4 },
  { id: "bugesera", districtName: "Bugesera", description: null, latitude: -2.15, longitude: 30.2833, isActive: true, displayOrder: 5 },
  { id: "musanze", districtName: "Musanze", description: null, latitude: -1.4995, longitude: 29.6335, isActive: true, displayOrder: 6 },
  { id: "huye", districtName: "Huye", description: null, latitude: -2.5975, longitude: 29.7392, isActive: true, displayOrder: 7 },
  { id: "rubavu", districtName: "Rubavu", description: null, latitude: -1.7025, longitude: 29.2564, isActive: true, displayOrder: 8 },
  { id: "muhanga", districtName: "Muhanga", description: null, latitude: -2.0847, longitude: 29.7568, isActive: true, displayOrder: 9 },
  { id: "other", districtName: "Other Districts", description: null, latitude: null, longitude: null, isActive: true, displayOrder: 10 },
];

export function ServiceAreaMap() {
  const { data: areas } = useApiData<ServiceArea[]>("/api/service-areas", FALLBACK_AREAS);
  const navigate = useNavigate();

  // Stable references: RwandaMap rebuilds its markers/re-fits bounds whenever
  // `points` or `onSelect` change identity, so without memoizing these an
  // unrelated re-render of this component (any parent update) would churn
  // the map for no reason.
  const points = useMemo(
    () =>
      areas
        .filter((a): a is ServiceArea & { latitude: number; longitude: number } => a.latitude != null && a.longitude != null)
        .map((a) => ({ id: a.id, name: a.districtName, latitude: a.latitude, longitude: a.longitude })),
    [areas],
  );

  const goToQuoteFor = useCallback(
    (districtName: string) => {
      navigate(`/?pickup=${encodeURIComponent(districtName)}#quote`);
    },
    [navigate],
  );

  return (
    <section className="section" id="areas">
      <div className="container area-grid">
        <Reveal className="area-map">
          <Suspense fallback={<div className="area-map-loading" />}>
            <RwandaMap points={points} onSelect={goToQuoteFor} />
          </Suspense>
        </Reveal>
        <Reveal className="area-copy">
          <span className="eyebrow">Coverage</span>
          <h2>We Move Across Rwanda</h2>
          <ul className="area-list">
            {areas.map((area) => (
              <li key={area.id}>
                <button type="button" className="area-list-link" onClick={() => goToQuoteFor(area.districtName)}>
                  <CheckIcon />
                  {area.districtName}
                </button>
              </li>
            ))}
          </ul>
          <div className="area-note">
            <strong>Moving somewhere not listed?</strong>
            Talk to us. We&rsquo;ll see how we can help.
          </div>
          <button type="button" className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => goToQuoteFor("")}>
            Check My Location
          </button>
        </Reveal>
      </div>
    </section>
  );
}
