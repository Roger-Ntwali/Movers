import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { ArrowRightIcon } from "../ui/icons";
import { OptimizedImage } from "../ui/OptimizedImage";
import { useApiData } from "../../hooks/useApiData";
import type { BlogPost } from "../../types";

export function BlogTeaser() {
  const { data: posts, loading } = useApiData<BlogPost[]>("/api/blog", []);
  const latest = posts.slice(0, 3);

  return (
    <section className="section" id="tips">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Moving Tips</span>
          <h2>Smarter Moving Starts Here</h2>
        </Reveal>

        {latest.length === 0 ? (
          !loading && <p className="review-empty">New articles are on the way.</p>
        ) : (
          <div className="blog-grid reveal-stagger">
            {latest.map((post, i) => (
              <Reveal as="article" className="blog-card" key={post.id} style={{ "--i": i } as React.CSSProperties}>
                <div className="blog-media">
                  {post.coverImageUrl && <OptimizedImage src={post.coverImageUrl} width={500} alt="" />}
                  {post.category && <span className="blog-cat">{post.category}</span>}
                </div>
                <h3>{post.title}</h3>
                {post.excerpt && <p>{post.excerpt}</p>}
                <Link to={`/blog/${post.slug}`} className="btn-ghost">
                  Read Article
                  <ArrowRightIcon />
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
