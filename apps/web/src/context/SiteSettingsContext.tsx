import { createContext, useContext, type ReactNode } from "react";
import { useApiData } from "../hooks/useApiData";
import type { SiteSettings } from "../types";

const DEFAULT_SETTINGS: SiteSettings = {
  phone: "+250787225782",
  whatsapp_number: "250787225782",
  email: "excelmoversrw@gmail.com",
  address: "Kigali, Rwanda",
  hours: "Mon–Sat | 8:00 AM – 6:00 PM",
  facebook_url: "",
  instagram_url: "",
  tiktok_url: "",
  linkedin_url: "",
  about_image_url: "",
  editorial_video_url: "",
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useApiData<SiteSettings>("/api/settings", DEFAULT_SETTINGS);
  return <SiteSettingsContext.Provider value={data}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function whatsappHref(whatsappNumber: string, text: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
