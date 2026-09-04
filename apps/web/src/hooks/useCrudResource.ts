import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";

interface WithId {
  id: string;
}

// Shared list/create/update/delete flow for the admin CRUD pages (services,
// gallery, testimonials, service areas, blog posts) — they all talk to a
// REST resource the same way, only the shape of T and the path differ.
export function useCrudResource<T extends WithId>(basePath: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<T[]>(`${basePath}?all=1`);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [basePath]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: unknown) => {
      const created = await api.post<T>(basePath, input);
      setItems((prev) => [...prev, created]);
      return created;
    },
    [basePath],
  );

  const update = useCallback(
    async (id: string, input: unknown) => {
      const updated = await api.patch<T>(`${basePath}/${id}`, input);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    },
    [basePath],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.delete(`${basePath}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [basePath],
  );

  return { items, setItems, loading, error, refresh, create, update, remove };
}
