import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadSchema, MOVE_TYPES, ROOM_OPTIONS, type CreateLeadInput } from "@movers-rwanda/shared";
import { api, ApiError } from "../../lib/api";
import { useCrudResource } from "../../hooks/useCrudResource";
import type { Lead, LeadStatus } from "../../types";

const STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

// Same fields/rules as the public quote form (packages/shared) — editing a
// lead's core details should stay held to the same "don't leave pickup
// blank" bar as submitting one, whether it's a customer or an admin doing
// the typing.
const leadFormSchema = createLeadSchema.omit({ company: true });
type LeadFormInput = Omit<CreateLeadInput, "company">;

const emptyLeadForm: LeadFormInput = {
  name: "",
  phone: "",
  email: "",
  pickup: "",
  dropoff: "",
  moveType: undefined as unknown as LeadFormInput["moveType"],
  rooms: undefined as unknown as LeadFormInput["rooms"],
  moveDate: "",
  details: "",
};

// Locks page scroll and adds an Escape-to-close handler — shared by both
// the drawer and the modal below (mirrors the Gallery lightbox's pattern).
function useOverlayEscape(onClose: () => void) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
}

export function LeadsPage() {
  const { items: leads, setItems, loading, error, create, update, remove, refresh } = useCrudResource<Lead>("/api/leads");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Lead | null>(null);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  // Optimistic: flip the status locally right away so the dropdown feels
  // instant, fire the PATCH in the background, and roll back + surface an
  // error if it fails. Bypasses useCrudResource's `update` (which only
  // updates local state after the server responds) specifically for this
  // high-frequency interaction.
  const changeStatus = async (lead: Lead, status: LeadStatus) => {
    if (status === lead.status) return;
    const previousStatus = lead.status;
    setActionError(null);
    setItems((all) => all.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    setSavingStatusId(lead.id);
    try {
      await api.patch(`/api/leads/${lead.id}`, { status });
    } catch (err) {
      setItems((all) => all.map((l) => (l.id === lead.id ? { ...l, status: previousStatus } : l)));
      setActionError(err instanceof ApiError ? err.message : "Failed to update status. Please try again.");
    } finally {
      setSavingStatusId(null);
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Delete the lead from ${lead.name}? This can't be undone.`)) return;
    setActionError(null);
    try {
      await remove(lead.id);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to delete lead.");
    }
  };

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setShowForm(true);
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Leads</h1>
          <p>{leads.length} total quote requests.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          + Add Lead
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="filters">
          <button className={`admin-chip${filter === "all" ? " is-active" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`admin-chip${filter === status ? " is-active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {(actionError || error) && (
        <p className="field-error" style={{ marginBottom: 16 }}>
          {actionError ?? error}
        </p>
      )}

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Route</th>
                <th>Move Date</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr key={lead.id} className="is-clickable" onClick={() => setViewing(lead)}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>
                    {lead.pickup} → {lead.dropoff}
                  </td>
                  <td>{lead.moveDate}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`admin-status-select status-${lead.status}`}
                      value={lead.status}
                      disabled={savingStatusId === lead.id}
                      onChange={(e) => changeStatus(lead, e.target.value as LeadStatus)}
                      aria-label={`Status for ${lead.name}`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td onClick={(e) => e.stopPropagation()} style={{ whiteSpace: "nowrap" }}>
                    <button className="admin-link-btn" onClick={() => setViewing(lead)}>
                      View
                    </button>{" "}
                    <button className="admin-link-btn" onClick={() => openEdit(lead)}>
                      Edit
                    </button>{" "}
                    <button className="admin-link-btn admin-danger" onClick={() => handleDelete(lead)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && visible.length === 0 && <div className="admin-empty">Loading leads…</div>}
          {!loading && visible.length === 0 && <div className="admin-empty">No leads match this filter.</div>}
        </div>
      </div>

      {viewing && (
        <LeadDrawer
          lead={viewing}
          onClose={() => setViewing(null)}
          onOpenFull={() => navigate(`/admin/leads/${viewing.id}`)}
        />
      )}

      {showForm && (
        <LeadFormModal
          lead={editing}
          onClose={() => setShowForm(false)}
          onSubmit={async (data) => {
            if (editing) {
              await update(editing.id, data);
            } else {
              await create(data);
              // Re-fetch so the new lead lands in the server's createdAt-desc
              // order (at the top) instead of wherever a plain local append
              // would leave it.
              await refresh();
            }
            setShowForm(false);
          }}
        />
      )}
    </>
  );
}

function LeadDrawer({ lead, onClose, onOpenFull }: { lead: Lead; onClose: () => void; onOpenFull: () => void }) {
  useOverlayEscape(onClose);

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <div
        className="admin-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${lead.name} details`}
      >
        <div className="admin-drawer-head">
          <div>
            <h3>{lead.name}</h3>
            <span className={`admin-badge status-${lead.status}`} style={{ marginTop: 8 }}>
              {lead.status}
            </span>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="admin-drawer-field">
          <strong>Contact</strong>
          <p>
            <a href={`tel:${lead.phone}`}>{lead.phone}</a>
          </p>
          {lead.email && (
            <p>
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
            </p>
          )}
        </div>
        <div className="admin-drawer-field">
          <strong>Route</strong>
          <p>
            {lead.pickup} → {lead.dropoff}
          </p>
        </div>
        <div className="admin-drawer-field">
          <strong>Move Type</strong>
          <p>{lead.moveType}</p>
        </div>
        <div className="admin-drawer-field">
          <strong>Rooms</strong>
          <p>{lead.rooms}</p>
        </div>
        <div className="admin-drawer-field">
          <strong>Preferred Move Date</strong>
          <p>{lead.moveDate}</p>
        </div>
        {lead.details && (
          <div className="admin-drawer-field">
            <strong>Additional Details (from customer)</strong>
            <p>{lead.details}</p>
          </div>
        )}
        <div className="admin-drawer-field">
          <strong>Received</strong>
          <p>{new Date(lead.createdAt).toLocaleString()}</p>
        </div>

        <div className="admin-form-actions">
          <button className="admin-link-btn" onClick={onOpenFull}>
            Open full detail (notes, status history) →
          </button>
        </div>
      </div>
    </div>
  );
}

function LeadFormModal({
  lead,
  onClose,
  onSubmit,
}: {
  lead: Lead | null;
  onClose: () => void;
  onSubmit: (data: LeadFormInput) => Promise<void>;
}) {
  useOverlayEscape(onClose);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: lead
      ? {
          name: lead.name,
          phone: lead.phone,
          email: lead.email ?? "",
          pickup: lead.pickup,
          dropoff: lead.dropoff,
          moveType: lead.moveType as LeadFormInput["moveType"],
          rooms: lead.rooms as LeadFormInput["rooms"],
          moveDate: lead.moveDate,
          details: lead.details ?? "",
        }
      : emptyLeadForm,
  });

  const submit = async (data: LeadFormInput) => {
    setFormError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to save lead.");
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="admin-modal-head">
          <h3>{lead ? "Edit Lead" : "Add Lead"}</h3>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit(submit)} noValidate>
          <div className="row">
            <div className="field">
              <label>Name</label>
              <input {...register("name")} />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>
            <div className="field">
              <label>Phone</label>
              <input {...register("phone")} />
              {errors.phone && <span className="field-error">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" {...register("email")} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="row">
            <div className="field">
              <label>Pick-up Location</label>
              <input {...register("pickup")} />
              {errors.pickup && <span className="field-error">{errors.pickup.message}</span>}
            </div>
            <div className="field">
              <label>Drop-off Location</label>
              <input {...register("dropoff")} />
              {errors.dropoff && <span className="field-error">{errors.dropoff.message}</span>}
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Move Type</label>
              <select defaultValue={lead?.moveType ?? ""} {...register("moveType")}>
                <option value="" disabled>
                  Select type
                </option>
                {MOVE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.moveType && <span className="field-error">{errors.moveType.message}</span>}
            </div>
            <div className="field">
              <label>Number of Rooms</label>
              <select defaultValue={lead?.rooms ?? ""} {...register("rooms")}>
                <option value="" disabled>
                  Select rooms
                </option>
                {ROOM_OPTIONS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
              {errors.rooms && <span className="field-error">{errors.rooms.message}</span>}
            </div>
          </div>

          <div className="field">
            <label>Preferred Move Date</label>
            <input type="date" {...register("moveDate")} />
            {errors.moveDate && <span className="field-error">{errors.moveDate.message}</span>}
          </div>

          <div className="field">
            <label>Additional Details</label>
            <textarea rows={3} {...register("details")} />
          </div>

          {formError && <span className="field-error">{formError}</span>}

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : lead ? "Save Changes" : "Add Lead"}
            </button>
            <button type="button" className="admin-link-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
