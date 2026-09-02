import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { blogPostSchema, BLOG_STATUSES, type BlogPostInput } from "@movers-rwanda/shared";
import { api } from "../../lib/api";
import { uploadImage } from "../../lib/uploadImage";
import type { BlogPost } from "../../types";

const emptyForm: BlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImageUrl: null,
  category: "",
  status: "draft",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogEditorPage() {
  const { id = "" } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostInput>({ resolver: zodResolver(blogPostSchema), defaultValues: emptyForm });

  const coverImageUrl = watch("coverImageUrl");
  const title = watch("title");

  useEffect(() => {
    if (isNew) return;
    api
      .get<BlogPost[]>("/api/blog?all=1")
      .then((posts) => {
        const post = posts.find((p) => p.id === id);
        if (!post) return;
        setSlugTouched(true);
        reset({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          body: post.body,
          coverImageUrl: post.coverImageUrl,
          category: post.category ?? "",
          status: post.status,
        });
      })
      .finally(() => setLoading(false));
  }, [id, isNew, reset]);

  useEffect(() => {
    if (isNew && !slugTouched) setValue("slug", slugify(title || ""));
  }, [title, isNew, slugTouched, setValue]);

  const onSubmit = async (data: BlogPostInput) => {
    setFormError(null);
    try {
      if (isNew) {
        const created = await api.post<BlogPost>("/api/blog", data);
        navigate(`/admin/blog/${created.id}`);
      } else {
        await api.patch<BlogPost>(`/api/blog/${id}`, data);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "blog");
      setValue("coverImageUrl", url);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <div className="admin-header">
        <div>
          <button className="admin-link-btn" onClick={() => navigate("/admin/blog")}>
            ← Back to blog
          </button>
          <h1 style={{ marginTop: 10 }}>{isNew ? "New Post" : "Edit Post"}</h1>
        </div>
      </div>

      <div className="admin-card">
        <form className="admin-form" style={{ maxWidth: 780 }} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label>Title</label>
            <input {...register("title")} />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </div>
          <div className="row">
            <div className="field">
              <label>Slug</label>
              <input {...register("slug")} onChange={() => setSlugTouched(true)} />
              {errors.slug && <span className="field-error">{errors.slug.message}</span>}
            </div>
            <div className="field">
              <label>Category</label>
              <input {...register("category")} placeholder="Checklist, Packing, Pricing..." />
            </div>
          </div>
          <div className="field">
            <label>Excerpt</label>
            <textarea rows={2} {...register("excerpt")} />
          </div>
          <div className="field">
            <label>Body</label>
            <textarea rows={12} {...register("body")} />
            {errors.body && <span className="field-error">{errors.body.message}</span>}
          </div>
          <div className="field">
            <label>Cover Image</label>
            {coverImageUrl && (
              <img src={coverImageUrl} alt="" className="admin-thumb" style={{ marginBottom: 10 }} />
            )}
            <label className="admin-upload-drop">
              {uploading ? "Uploading..." : "Click to upload a cover image"}
              <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
            </label>
          </div>
          <div className="field">
            <label>Status</label>
            <select {...register("status")}>
              {BLOG_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          {formError && <span className="field-error">{formError}</span>}
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
