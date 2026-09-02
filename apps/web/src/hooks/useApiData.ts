import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface UseApiDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

// Small fetch-on-mount hook for public, read-only content. Scoped to what
// this site needs — no caching/refetch machinery, just loading/error state
// and a safe fallback value while the request is in flight.
export function useApiData<T>(path: string, fallback: T): UseApiDataResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<T>(path)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, loading, error };
}
