import { Link } from "react-router-dom";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "../ui/icons";

export function Footer() {
  const settings = useSiteSettings();

  return (
    <footer className="site-footer" id="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <span className="footer-logo-badge">
            <img src="/logo.png" alt="Movers Rwanda" />
          </span>
          <p className="tag">From Door To Destination, We&rsquo;ve Got You Covered.</p>
          <div className="footer-social">
            {settings.facebook_url && (
              <a href={settings.facebook_url} aria-label="Facebook" target="_blank" rel="noopener">
                <FacebookIcon />
              </a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} aria-label="Instagram" target="_blank" rel="noopener">
                <InstagramIcon />
              </a>
            )}
            {settings.tiktok_url && (
              <a href={settings.tiktok_url} aria-label="TikTok" target="_blank" rel="noopener">
                <TikTokIcon />
              </a>
            )}
            {settings.linkedin_url && (
              <a href={settings.linkedin_url} aria-label="LinkedIn" target="_blank" rel="noopener">
                <LinkedInIcon />
              </a>
            )}
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={16} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li>
              <Link to="/#services">Home Moving</Link>
            </li>
            <li>
              <Link to="/#services">Office Moving</Link>
            </li>
            <li>
              <Link to="/#services">Packing &amp; Unpacking</Link>
            </li>
            <li>
              <Link to="/#services">Furniture Assembly</Link>
            </li>
            <li>
              <Link to="/#services">Specialty Moving</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/#about">About Us</Link>
            </li>
            <li>
              <Link to="/#services">Why Choose Us</Link>
            </li>
            <li>
              <Link to="/#footer">Contact</Link>
            </li>
            <li>
              <Link to="/#footer">Careers</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <ul className="footer-contact" style={{ marginBottom: 18 }}>
            <li>
              <Link to="/blog">Moving Tips</Link>
            </li>
            <li>
              <Link to="/#tips">Moving Checklist</Link>
            </li>
            <li>
              <Link to="/#faq">FAQ</Link>
            </li>
            <li>
              <Link to="/#quote">Get a Quote</Link>
            </li>
          </ul>
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <PinIcon size={15} />
              {settings.address}
            </li>
            <li>
              <PhoneIcon size={15} />
              <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            </li>
            <li>
              <MailIcon />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>&copy; {new Date().getFullYear()} Movers Rwanda. All rights reserved.</span>
        <div className="links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
