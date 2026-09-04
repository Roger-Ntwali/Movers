import { QUOTE_WHATSAPP_MESSAGE, useSiteSettings, whatsappHref } from "../../context/SiteSettingsContext";
import { WhatsAppIcon } from "../ui/icons";

export function WhatsAppButton() {
  const settings = useSiteSettings();
  return (
    <a
      className="wa-float"
      href={whatsappHref(settings.whatsapp_number, QUOTE_WHATSAPP_MESSAGE)}
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
