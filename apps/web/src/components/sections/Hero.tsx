import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { CheckIcon } from "../ui/icons";
import { WhatsAppIcon } from "../ui/icons";
import { QUOTE_WHATSAPP_MESSAGE, useSiteSettings, whatsappHref } from "../../context/SiteSettingsContext";

export function Hero() {
  const settings = useSiteSettings();

  return (
    <section className="hero">
      <div className="hero-media"></div>
      <svg
        className="hero-route"
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-50,560 C 260,520 380,300 640,340 S 1060,560 1490,220"
          fill="none"
          stroke="#00D05E"
          strokeWidth={2}
          strokeDasharray="1 14"
          strokeLinecap="round"
        />
        <circle cx="-50" cy="560" r="6" fill="#00D05E" />
        <circle cx="1490" cy="220" r="6" fill="#00D05E" />
      </svg>

      <div className="container hero-inner">
        <Reveal as="span" className="hero-badge">
          <span className="dot"></span>Trusted Moving Services In Rwanda
        </Reveal>
        <Reveal as="h1">
          From Door To Destination,
          <br />
          <em>We&rsquo;ve Got You Covered.</em>
        </Reveal>
        <Reveal as="p" className="hero-sub">
          Professional, affordable and careful moving services for homes, offices and businesses
          across Rwanda.
        </Reveal>

        <Reveal className="hero-ctas">
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
        </Reveal>

        <Reveal className="hero-checks">
          <span>
            <CheckIcon />
            Transparent pricing
          </span>
          <span>
            <CheckIcon />
            Careful handling
          </span>
          <span>
            <CheckIcon />
            Reliable scheduling
          </span>
        </Reveal>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <span className="line"></span>
      </div>
    </section>
  );
}
