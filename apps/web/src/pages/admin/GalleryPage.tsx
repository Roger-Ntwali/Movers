import { useState } from "react";
import { galleryImageSchema } from "@movers-rwanda/shared";
import { useCrudResource } from "../../hooks/useCrudResource";
import { uploadImage } from "../../lib/uploadImage";
import type { GalleryImage } from "../../types";

export function GalleryPage() {
  const { items, loading, create, update, remove } = useCrudResource<GalleryImage>("/api/gallery");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file, "gallery");
      const parsed = galleryImageSchema.parse({
        imageUrl: url,
        caption: "",
        altText: "",
        displayOrder: items.length,
        isActive: true,
      });
      await create(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const updateCaption = (id: string, caption: string) => update(id, { caption });
  const toggleActive = (image: GalleryImage) => update(image.id, { isActive: !image.isActive });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Gallery</h1>
          <p>Photos shown in "See Movers Rwanda In Action".</p>
        </div>
      </div>

      <div className="admin-card">
        <label className="admin-upload-drop">
          {uploading ? "Uploading..." : "Click to upload a photo"}
          <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
        </label>
        {error && <p className="field-error" style={{ marginTop: 10 }}>{error}</p>}
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Caption</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((img) => (
                <tr key={img.id}>
                  <td>
                    <img src={img.imageUrl} alt={img.altText ?? ""} className="admin-thumb" />
                  </td>
                  <td>
                    <input
                      defaultValue={img.caption ?? ""}
                      onBlur={(e) => updateCaption(img.id, e.target.value)}
                      placeholder="Caption"
                    />
                  </td>
                  <td>
                    <span className={`admin-badge status-${img.isActive ? "published" : "draft"}`}>
                      {img.isActive ? "visible" : "hidden"}
                    </span>
                  </td>
                  <td>
                    <button className="admin-link-btn" onClick={() => toggleActive(img)}>
                      {img.isActive ? "Hide" : "Show"}
                    </button>{" "}
                    <button className="admin-link-btn admin-danger" onClick={() => remove(img.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && items.length === 0 && <div className="admin-empty">No photos uploaded yet.</div>}
        </div>
      </div>
    </>
  );
}
