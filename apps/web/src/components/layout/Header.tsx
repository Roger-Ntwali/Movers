import { useState } from "react";
import { Link } from "react-router-dom";
import { useHeaderScroll } from "../../hooks/useHeaderScroll";
import { useMagneticHover } from "../../hooks/useMagneticHover";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { ChevronDownIcon } from "../ui/icons";

const SERVICE_LINKS = [
  ["Home Moving", "/#services"],
  ["Office Moving", "/#services"],
  ["Packing & Unpacking", "/#services"],
  ["Furniture Assembly", "/#services"],
  ["Specialty Moving", "/#services"],
] as const;

const LOCATION_LINKS = [
  ["Kigali", "/#areas"],
  ["Gasabo", "/#areas"],
  ["Kicukiro", "/#areas"],
  ["Nyarugenge", "/#areas"],
  ["Other Districts", "/#areas"],
] as const;

const RESOURCE_LINKS = [
  ["Moving Checklist", "/#tips"],
  ["Moving Tips", "/#tips"],
  ["FAQ", "/#faq"],
] as const;

export function Header() {
  const { isScrolled, isHidden } = useHeaderScroll();
  const settings = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const ctaRef = useMagneticHover<HTMLAnchorElement>(0.25);
  // Never hide the header while the mobile panel it anchors is open.
  const hidden = isHidden && !mobileOpen;

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenSubmenu(null);
  };

  const toggleMobile = () => setMobileOpen((v) => !v);
  const toggleSubmenu = (key: string) => setOpenSubmenu((v) => (v === key ? null : key));

  return (
    // .mobile-nav is rendered as a sibling of <header>, not nested inside it:
    // .site-header uses backdrop-filter, which makes it a new containing
    // block for position:fixed descendants — nesting the fixed-position nav
    // panel inside it would size/position the panel against the header's own
    // (short) box instead of the viewport.
    <>
      <header
        className={`site-header${isScrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}
        id="siteHeader"
      >
      <div className="container nav-wrap">
        <Link to="/#top" className="brand" onClick={closeMobile}>
          <img src="/logo.png" alt="Movers Rwanda" className="brand-logo" />
        </Link>

        <nav className="main-nav" aria-label="Main">
          <ul>
            <li className="nav-item">
              <Link className="nav-link" to="/#top">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#services">
                Services <ChevronDownIcon />
              </Link>
              <ul className="dropdown">
                {SERVICE_LINKS.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#faq">
                Rates
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#areas">
                Locations <ChevronDownIcon />
              </Link>
              <ul className="dropdown">
                {LOCATION_LINKS.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#tips">
                Resources <ChevronDownIcon />
              </Link>
              <ul className="dropdown">
                {RESOURCE_LINKS.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#footer">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/#quote" className="btn btn-primary btn-sm magnetic desktop-only" ref={ctaRef}>
            Get A Quote
          </Link>
          <button
            className={`hamburger${mobileOpen ? " is-open" : ""}`}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobileNav"
            onClick={toggleMobile}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      </header>

      <div
        className={`mobile-nav${mobileOpen ? " is-open" : ""}`}
        id="mobileNav"
        style={{ top: isScrolled ? "var(--header-h-scrolled)" : "var(--header-h)" }}
      >
        <ul>
          <li>
            <Link to="/#top" onClick={closeMobile}>
              Home
            </Link>
          </li>
          <MobileSubmenu
            label="Services"
            id="m-services"
            links={SERVICE_LINKS}
            isOpen={openSubmenu === "m-services"}
            onToggle={() => toggleSubmenu("m-services")}
            onLinkClick={closeMobile}
          />
          <li>
            <Link to="/#faq" onClick={closeMobile}>
              Rates
            </Link>
          </li>
          <MobileSubmenu
            label="Locations"
            id="m-locations"
            links={LOCATION_LINKS}
            isOpen={openSubmenu === "m-locations"}
            onToggle={() => toggleSubmenu("m-locations")}
            onLinkClick={closeMobile}
          />
          <MobileSubmenu
            label="Resources"
            id="m-resources"
            links={RESOURCE_LINKS}
            isOpen={openSubmenu === "m-resources"}
            onToggle={() => toggleSubmenu("m-resources")}
            onLinkClick={closeMobile}
          />
          <li>
            <Link to="/#about" onClick={closeMobile}>
              About
            </Link>
          </li>
          <li>
            <Link to="/#footer" onClick={closeMobile}>
              Contact
            </Link>
          </li>
        </ul>
        <div className="mobile-cta">
          <Link to="/#quote" className="btn btn-primary btn-block" onClick={closeMobile}>
            Get A Quote
          </Link>
          <a className="btn btn-outline on-light btn-block" href={`tel:${settings.phone}`} onClick={closeMobile}>
            Call {settings.phone}
          </a>
        </div>
      </div>
    </>
  );
}

function MobileSubmenu({
  label,
  id,
  links,
  isOpen,
  onToggle,
  onLinkClick,
}: {
  label: string;
  id: string;
  links: readonly (readonly [string, string])[];
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
}) {
  return (
    <li>
      <a href="#" className="mobile-toggle" onClick={(e) => (e.preventDefault(), onToggle())}>
        {label}
        <ChevronDownIcon size={16} className={`mobile-toggle-caret${isOpen ? " is-open" : ""}`} />
      </a>
      <ul className={`dropdown-mobile${isOpen ? " is-open" : ""}`} id={id}>
        {links.map(([linkLabel, href]) => (
          <li key={linkLabel}>
            <Link to={href} onClick={onLinkClick}>
              {linkLabel}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
