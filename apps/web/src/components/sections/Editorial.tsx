import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { CheckIcon } from "../ui/icons";
import { useInView } from "../../hooks/useInView";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { optimizeCloudinaryUrl } from "../../lib/cloudinaryUrl";

export function Editorial() {
  const settings = useSiteSettings();
  const videoUrl = settings.editorial_video_url;
  const [videoReady, setVideoReady] = useState(false);
  // The video sits mid-page — starting its (looping) download the moment the
  // route mounts keeps the network busy long after the page is actually
  // usable. Deferring the <video> element itself until this section nears
  // the viewport means the request doesn't fire at all until it's needed.
  const { ref: mediaRef, isVisible: mediaInView } = useInView<HTMLDivElement>();

  return (
    <section className="section section--light">
      <div className="container editorial">
        <Reveal className="editorial-media">
          <div ref={mediaRef} style={{ position: "absolute", inset: 0 }} />
          {videoUrl && mediaInView ? (
            <>
              <video
                src={optimizeCloudinaryUrl(videoUrl)}
                autoPlay
                muted
                loop
                playsInline
                onCanPlay={() => setVideoReady(true)}
              />
              <div className={`media-loading-veil${videoReady ? " is-hidden" : ""}`}>
                <span className="spinner" aria-hidden="true"></span>
                Loading video…
              </div>
            </>
          ) : videoUrl ? (
            <div className="media-loading-veil">
              <span className="spinner" aria-hidden="true"></span>
              Loading video…
            </div>
          ) : (
            <svg className="route-svg" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M40,460 C120,380 80,260 200,240 S 300,120 360,40"
                fill="none"
                stroke="#5B6B4F"
                strokeWidth={2}
                strokeDasharray="1 12"
                strokeLinecap="round"
              />
              <circle cx="40" cy="460" r="6" fill="#5B6B4F" />
              <circle cx="360" cy="40" r="6" fill="#5B6B4F" />
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
