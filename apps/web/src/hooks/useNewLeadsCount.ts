import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import type { Lead } from "../types";

const POLL_MS = 60_000;

// Polls the leads list while any admin page is open and counts how many are
// still status "new" — used for the sidebar badge, and to pop a native
// browser notification when that count goes up (a fresh submission arrived)
// rather than just on first load.
export function useNewLeadsCount() {
  const [count, setCount] = useState(0);
  const previousCount = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const leads = await api.get<Lead[]>("/api/leads");
        if (cancelled) return;
        const newCount = leads.filter((l) => l.status === "new").length;

        if (previousCount.current !== null && newCount > previousCount.current) {
          notifyNewLead(newCount - previousCount.current);
        }
        previousCount.current = newCount;
        setCount(newCount);
      } catch {
        // Leave the last known count showing rather than flashing to 0 on a
        // transient network blip.
      }
    };

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return count;
}

function notifyNewLead(newCount: number) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
    return; // this arrival doesn't get a popup, but the next one will
  }
  if (Notification.permission !== "granted") return;

  new Notification(newCount === 1 ? "New quote request" : `${newCount} new quote requests`, {
    body: "Open the Leads page to view it.",
    icon: "/favicon-32.png",
  });
}
