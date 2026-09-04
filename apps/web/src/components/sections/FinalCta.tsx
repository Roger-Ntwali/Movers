import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "../ui/icons";
import { QUOTE_WHATSAPP_MESSAGE, useSiteSettings, whatsappHref } from "../../context/SiteSettingsContext";

export function FinalCta() {
  const settings = useSiteSettings();
  return (
    <section className="final-cta section--dark">
      <Reveal className="container final-cta-inner">
        <h2>Ready To Make Your Move?</h2>
        <p className="sub">Let&rsquo;s take the stress out of moving.</p>
        <div className="hero-ctas">
          <Link to="/#quote" className="btn btn-primary">
            Get A Quote
          </Link>
          <a
            href={whatsappHref(settings.whatsapp_number, QUOTE_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="btn btn-outline"
          >
            <WhatsAppIcon />
            WhatsApp Us
          </a>
        </div>
        <div className="final-cta-contact">
          <a href={`tel:${settings.phone}`}>
            <PhoneIcon />
            {settings.phone}
          </a>
          <a href={`mailto:${settings.email}`}>
            <MailIcon />
            {settings.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
