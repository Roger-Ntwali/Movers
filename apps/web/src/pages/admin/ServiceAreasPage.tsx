import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceAreaSchema, type ServiceAreaInput } from "@movers-rwanda/shared";
import { useCrudResource } from "../../hooks/useCrudResource";
import type { ServiceArea } from "../../types";

const emptyForm: ServiceAreaInput = {
  districtName: "",
  description: "",
  latitude: undefined,
  longitude: undefined,
  isActive: true,
  displayOrder: 0,
};

export function ServiceAreasPage() {
  const { items, loading, create, update, remove } = useCrudResource<ServiceArea>("/api/service-areas");
  const [editing, setEditing] = useState<ServiceArea | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceAreaInput>({ resolver: zodResolver(serviceAreaSchema), defaultValues: emptyForm });

  const openNew = () => {
    setEditing(null);
    reset(emptyForm);
    setShowForm(true);
  };

  const openEdit = (area: ServiceArea) => {
    setEditing(area);
    reset({
      districtName: area.districtName,
      description: area.description ?? "",
      latitude: area.latitude ?? undefined,
      longitude: area.longitude ?? undefined,
      isActive: area.isActive,
      displayOrder: area.displayOrder,
    });
    setShowForm(true);
  };

  const onSubmit = async (data: ServiceAreaInput) => {
    setFormError(null);
    try {
      if (editing) await update(editing.id, data);
      else await create(data);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Service Areas</h1>
          <p>Districts listed under "We Move Across Rwanda". Add coordinates to place a pin on the real map.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          + Add District
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>{editing ? "Edit District" : "New District"}</h3>
          <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="field">
              <label>District Name</label>
              <input {...register("districtName")} />
              {errors.districtName && <span className="field-error">{errors.districtName.message}</span>}
            </div>
            <div className="field">
              <label>Description (optional)</label>
              <textarea rows={2} {...register("description")} />
            </div>
            <div className="row">
              <div className="field">
                <label>Latitude (optional, e.g. -1.9441)</label>
                <input type="number" step="any" min={-90} max={90} {...register("latitude", { valueAsNumber: true })} />
              </div>
              <div className="field">
                <label>Longitude (optional, e.g. 30.0619)</label>
                <input type="number" step="any" min={-180} max={180} {...register("longitude", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="field">
              <label>Display Order</label>
              <input type="number" {...register("displayOrder", { valueAsNumber: true })} />
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
                <th>District</th>
                <th>Map Pin</th>
                <th>Order</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((area) => (
                <tr key={area.id}>
                  <td>{area.districtName}</td>
                  <td>{area.latitude != null ? `${area.latitude}, ${area.longitude}` : "—"}</td>
                  <td>{area.displayOrder}</td>
                  <td>
                    <span className={`admin-badge status-${area.isActive ? "published" : "draft"}`}>
                      {area.isActive ? "active" : "hidden"}
                    </span>
                  </td>
                  <td>
                    <button className="admin-link-btn" onClick={() => openEdit(area)}>
                      Edit
                    </button>{" "}
                    <button className="admin-link-btn admin-danger" onClick={() => remove(area.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && items.length === 0 && <div className="admin-empty">No districts yet.</div>}
        </div>
      </div>
    </>
  );
}
