import { useSiteSettings, whatsappHref } from "../../context/SiteSettingsContext";
import { WhatsAppIcon } from "../ui/icons";

export function WhatsAppButton() {
  const settings = useSiteSettings();
  return (
    <a
      className="wa-float"
      href={whatsappHref(settings.whatsapp_number, "Hello Movers Rwanda, I'd like to get a free moving quote.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="ic">
        <WhatsAppIcon />
      </span>
      <span className="txt">Chat with us</span>
    </a>
  );
}
