import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { ArrowRightIcon } from "../components/ui/icons";
import { useApiData } from "../hooks/useApiData";
import type { BlogPost } from "../types";

export function BlogListPage() {
  const { data: posts, loading } = useApiData<BlogPost[]>("/api/blog", []);

  return (
    <section className="section">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Moving Tips</span>
          <h2>Smarter Moving Starts Here</h2>
        </Reveal>

        {posts.length === 0 ? (
          !loading && <p className="review-empty">No articles published yet — check back soon.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <Reveal as="article" className="blog-card" key={post.id}>
                <div className="blog-media">
                  {post.coverImageUrl && <img src={post.coverImageUrl} alt="" loading="lazy" />}
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
