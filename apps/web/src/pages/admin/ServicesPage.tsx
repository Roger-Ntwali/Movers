import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@movers-rwanda/shared";
import { useCrudResource } from "../../hooks/useCrudResource";
import { uploadImage } from "../../lib/uploadImage";
import type { Service } from "../../types";

const emptyForm: ServiceInput = {
  title: "",
  slug: "",
  tag: "",
  lead: "",
  description: "",
  includes: [],
  imageUrls: [],
  displayOrder: 0,
  isActive: true,
};

export function ServicesPage() {
  const { items, loading, create, update, remove } = useCrudResource<Service>("/api/services");
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({ resolver: zodResolver(serviceSchema), defaultValues: emptyForm });

  const imageUrls = watch("imageUrls") ?? [];
  const includesValue = watch("includes");

  const openNew = () => {
    setEditing(null);
    reset(emptyForm);
    setShowForm(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    reset({
      title: service.title,
      slug: service.slug,
      tag: service.tag ?? "",
      lead: service.lead ?? "",
      description: service.description ?? "",
      includes: service.includes,
      imageUrls: service.imageUrls,
      displayOrder: service.displayOrder,
      isActive: service.isActive,
    });
    setShowForm(true);
  };

  const onSubmit = async (data: ServiceInput) => {
    setFormError(null);
    try {
      if (editing) await update(editing.id, data);
      else await create(data);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setFormError(null);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage(file, "services")));
      setValue("imageUrls", [...(watch("imageUrls") ?? []), ...uploaded].slice(0, 8));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setValue(
      "imageUrls",
      (watch("imageUrls") ?? []).filter((u) => u !== url),
    );
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Services</h1>
          <p>What shows in the "What Can We Move For You?" section.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          + Add Service
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>{editing ? "Edit Service" : "New Service"}</h3>
          <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row">
              <div className="field">
                <label>Title</label>
                <input {...register("title")} />
                {errors.title && <span className="field-error">{errors.title.message}</span>}
              </div>
              <div className="field">
                <label>Slug</label>
                <input {...register("slug")} placeholder="home-moving" />
                {errors.slug && <span className="field-error">{errors.slug.message}</span>}
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label>Tag</label>
                <input {...register("tag")} placeholder="Service 01" />
              </div>
              <div className="field">
                <label>Display Order</label>
                <input type="number" {...register("displayOrder", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="field">
              <label>Lead line</label>
              <input {...register("lead")} placeholder="Move your home without the stress." />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={3} {...register("description")} />
            </div>
            <div className="field">
              <label>Includes (comma separated)</label>
              <input
                value={includesValue?.join(", ") ?? ""}
                onChange={(e) =>
                  setValue(
                    "includes",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  )
                }
                placeholder="Furniture moving, Household items, Loading & unloading"
              />
            </div>
            <div className="field">
              <label>Photos (up to 8 — multiple photos animate as a slideshow on the site)</label>
              {imageUrls.length > 0 && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  {imageUrls.map((url) => (
                    <div key={url} style={{ position: "relative" }}>
                      <img src={url} alt="" className="admin-thumb" />
                      <button
                        type="button"
                        className="admin-danger"
                        onClick={() => removeImage(url)}
                        aria-label="Remove photo"
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: "var(--white)",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          border: "1px solid var(--border)",
                          fontSize: "0.8rem",
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="admin-upload-drop">
                {uploading ? "Uploading..." : "Click to upload photo(s)"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <label className="admin-checkbox">
              <input type="checkbox" {...register("isActive")} />
              Visible on the public site
            </label>
            {formError && <span className="field-error">{formError}</span>}
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button type="button" className="admin-link-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Order</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((service) => (
                <tr key={service.id}>
                  <td>{service.title}</td>
                  <td>{service.displayOrder}</td>
                  <td>
                    <span className={`admin-badge status-${service.isActive ? "published" : "draft"}`}>
                      {service.isActive ? "active" : "hidden"}
                    </span>
                  </td>
                  <td>
                    <button className="admin-link-btn" onClick={() => openEdit(service)}>
                      Edit
                    </button>{" "}
                    <button className="admin-link-btn admin-danger" onClick={() => remove(service.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && items.length === 0 && <div className="admin-empty">No services yet.</div>}
        </div>
      </div>
    </>
  );
}
