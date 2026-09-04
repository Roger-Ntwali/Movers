import { Link } from "react-router-dom";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export function MobileCtaBar() {
  const settings = useSiteSettings();
  return (
    <div className="mobile-cta-bar">
      <a href={`tel:${settings.phone}`} className="btn btn-outline on-light btn-sm">
        Call Now
      </a>
      <Link to="/#quote" className="btn btn-primary btn-sm">
        Get A Quote
      </Link>
    </div>
  );
}
