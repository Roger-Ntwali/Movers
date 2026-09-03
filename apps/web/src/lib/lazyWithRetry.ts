import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "mr_chunk_reload_attempted";

// Every deploy gives JS chunks new content-hashed filenames. A browser tab
// left open (or serving a stale cached index.html) across a deploy will
// still try to dynamically import the *old* filename, which 404s — the
// user sees a blank page and a "Failed to fetch dynamically imported
// module" error, with no way to recover short of a manual hard refresh.
// Reloading once fetches the current index.html (and therefore the correct
// chunk hashes); the reload flag prevents looping if the failure is a real
// network/server error rather than a stale deploy.
//
// The generic here mirrors React's own `lazy<T extends ComponentType<any>>`
// exactly (T is the component type itself, not wrapped in another
// ComponentType<P> layer) — wrapping it introduces a TS inference quirk
// where T gets contaminated with ComponentType<never> at every call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches React's own `lazy<T extends ComponentType<any>>` constraint exactly
export function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  const load = async (): Promise<{ default: T }> => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(RELOAD_KEY);
      return mod;
    } catch (err) {
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
        // Suspend forever — the reload is about to tear this page down, so
        // nothing after this line ever actually runs.
        await new Promise<void>(() => {});
      }
      throw err;
    }
  };
  return lazy(load);
}
