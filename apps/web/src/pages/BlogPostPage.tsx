import { Link, useParams } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { OptimizedImage } from "../components/ui/OptimizedImage";
import { useApiData } from "../hooks/useApiData";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import type { BlogPost } from "../types";

export function BlogPostPage() {
  const { slug = "" } = useParams();
  const { data: post, loading, error } = useApiData<BlogPost | null>(`/api/blog/${slug}`, null);

  useDocumentMeta(
    post ? `${post.title} | Movers Rwanda` : "Movers Rwanda | Professional Moving & Relocation Services",
    post?.excerpt ?? undefined,
  );

  if (loading) {
    return (
      <section className="section">
        <div className="container blog-post" />
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="section">
        <div className="container blog-post">
          <h1>Article not found</h1>
          <p style={{ marginTop: 16, color: "var(--muted)" }}>
            This article may have been moved or unpublished.
          </p>
          <Link to="/blog" className="btn btn-outline on-light" style={{ marginTop: 24 }}>
            Back to Moving Tips
          </Link>
        </div>
      </section>
    );
  }

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-RW", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <section className="section">
      <div className="container blog-post">
        <Reveal>
          {post.coverImageUrl && (
            <div className="blog-post-cover">
              <OptimizedImage src={post.coverImageUrl} width={1200} loading="eager" alt="" />
            </div>
          )}
          <div className="blog-post-meta">
            {post.category && <span>{post.category}</span>}
            {publishedLabel && <span>{publishedLabel}</span>}
          </div>
          <h1>{post.title}</h1>
          <div className="blog-post-body">{post.body}</div>
        </Reveal>
      </div>
    </section>
  );
}
