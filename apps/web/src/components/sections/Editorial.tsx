import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { CheckIcon } from "../ui/icons";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export function Editorial() {
  const settings = useSiteSettings();
  const videoUrl = settings.editorial_video_url;

  return (
    <section className="section section--light">
      <div className="container editorial">
        <Reveal className="editorial-media">
          {videoUrl ? (
            <video src={videoUrl} autoPlay muted loop playsInline />
          ) : (
            <svg className="route-svg" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M40,460 C120,380 80,260 200,240 S 300,120 360,40"
                fill="none"
                stroke="#00D05E"
                strokeWidth={2}
                strokeDasharray="1 12"
                strokeLinecap="round"
              />
              <circle cx="40" cy="460" r="6" fill="#00D05E" />
              <circle cx="360" cy="40" r="6" fill="#00D05E" />
            </svg>
          )}
        </Reveal>
        <Reveal className="editorial-copy">
          <span className="eyebrow">The Movers Rwanda Standard</span>
          <h2>Your Belongings Are More Than Boxes.</h2>
          <p>
            We know that every box has a story. That&rsquo;s why we treat your furniture,
            electronics, documents and personal belongings with the attention we&rsquo;d give our
            own.
          </p>
          <ul className="highlight-list">
            <li>
              <CheckIcon size={18} />
              Careful loading
            </li>
            <li>
              <CheckIcon size={18} />
              Secure transport
            </li>
            <li>
              <CheckIcon size={18} />
              Professional unloading
            </li>
          </ul>
          <Link to="/#quote" className="btn btn-primary">
            Book Your Move
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
