import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, type TestimonialInput } from "@movers-rwanda/shared";
import { useCrudResource } from "../../hooks/useCrudResource";
import type { Testimonial } from "../../types";

const emptyForm: TestimonialInput = {
  authorName: "",
  authorRoleOrLocation: "",
  quote: "",
  rating: 5,
  isFeatured: false,
  displayOrder: 0,
};

export function TestimonialsPage() {
  const { items, loading, create, update, remove } = useCrudResource<Testimonial>("/api/testimonials");
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({ resolver: zodResolver(testimonialSchema), defaultValues: emptyForm });

  const openNew = () => {
    setEditing(null);
    reset(emptyForm);
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset({
      authorName: t.authorName,
      authorRoleOrLocation: t.authorRoleOrLocation ?? "",
      quote: t.quote,
      rating: t.rating ?? undefined,
      isFeatured: t.isFeatured,
      displayOrder: t.displayOrder,
    });
    setShowForm(true);
  };

  const onSubmit = async (data: TestimonialInput) => {
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
          <h1>Testimonials</h1>
          <p>Real customer reviews shown on the homepage.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          + Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>{editing ? "Edit Testimonial" : "New Testimonial"}</h3>
          <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row">
              <div className="field">
                <label>Author Name</label>
                <input {...register("authorName")} />
                {errors.authorName && <span className="field-error">{errors.authorName.message}</span>}
              </div>
              <div className="field">
                <label>Role / Location</label>
                <input {...register("authorRoleOrLocation")} placeholder="Kigali · Home Relocation" />
              </div>
            </div>
            <div className="field">
              <label>Quote</label>
              <textarea rows={4} {...register("quote")} />
              {errors.quote && <span className="field-error">{errors.quote.message}</span>}
            </div>
            <div className="row">
              <div className="field">
                <label>Rating (1-5)</label>
                <input type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} />
              </div>
              <div className="field">
                <label>Display Order</label>
                <input type="number" {...register("displayOrder", { valueAsNumber: true })} />
              </div>
            </div>
            <label className="admin-checkbox">
              <input type="checkbox" {...register("isFeatured")} />
              Feature this review
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
                <th>Author</th>
                <th>Quote</th>
                <th>Rating</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.authorName}</td>
                  <td style={{ maxWidth: 360 }}>{t.quote}</td>
                  <td>{t.rating ? "★".repeat(t.rating) : "—"}</td>
                  <td>
                    <button className="admin-link-btn" onClick={() => openEdit(t)}>
                      Edit
                    </button>{" "}
                    <button className="admin-link-btn admin-danger" onClick={() => remove(t.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && items.length === 0 && <div className="admin-empty">No testimonials yet.</div>}
        </div>
      </div>
    </>
  );
}
