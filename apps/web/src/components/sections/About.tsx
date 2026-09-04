import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { CheckIcon, PinIcon, TeamIcon } from "../ui/icons";
import { OptimizedImage } from "../ui/OptimizedImage";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export function About() {
  const settings = useSiteSettings();
  const aboutImage = settings.about_image_url;

  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <Reveal className="about-media">
          <div className="about-photo">
            {aboutImage ? (
              <OptimizedImage src={aboutImage} width={800} alt="Movers Rwanda team at work" />
            ) : (
              <div className="grain"></div>
            )}
          </div>
          <div className="stat-float f1">
            <span className="ic">
              <CheckIcon size={18} />
            </span>
            <div>
              <strong>100% Care</strong>
              <span>In every move</span>
            </div>
          </div>
          <div className="stat-float f2">
            <span className="ic">
              <TeamIcon size={18} />
            </span>
            <div>
              <strong>Professional</strong>
              <span>Service standard</span>
            </div>
          </div>
          <div className="stat-float f3">
            <span className="ic">
              <PinIcon size={18} />
            </span>
            <div>
              <strong>Rwanda Wide</strong>
              <span>Coverage</span>
            </div>
          </div>
        </Reveal>
        <Reveal className="about-copy">
          <span className="eyebrow">About Movers Rwanda</span>
          <h2>
            We Don&rsquo;t Just Move Your Things.
            <br />
            We Move Your Life.
          </h2>
          <p>
            At Movers Rwanda, we&rsquo;re more than just a moving company &mdash; we&rsquo;re your
            trusted relocation partner. Whether you&rsquo;re moving across Kigali or to another
            district, our goal is to make your move smooth, affordable and stress-free.
          </p>
          <p>
            As a proudly Rwandan company, we understand the local landscape and the importance of
            careful handling, punctuality and customer respect. With every move, we&rsquo;re
            building our reputation one successful move at a time.
          </p>
          <Link to="/#footer" className="btn btn-outline on-light">
            Meet Movers Rwanda
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
