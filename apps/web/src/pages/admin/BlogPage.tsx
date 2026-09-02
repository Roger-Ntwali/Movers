import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { BlogPost } from "../../types";

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<BlogPost[]>("/api/blog?all=1")
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Blog</h1>
          <p>Articles shown under "Moving Tips".</p>
        </div>
        <Link to="/admin/blog/new" className="btn btn-primary btn-sm">
          + New Post
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/admin/blog/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.category ?? "—"}</td>
                  <td>
                    <span className={`admin-badge status-${post.status}`}>{post.status}</span>
                  </td>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && posts.length === 0 && <div className="admin-empty">No articles yet.</div>}
        </div>
      </div>
    </>
  );
}
