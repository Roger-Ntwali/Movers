import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Lead, LeadStatus } from "../../types";

const STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

export function LeadDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get<Lead>(`/api/leads/${id}`)
      .then((data) => {
        setLead(data);
        setNotes(data.notes ?? "");
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const updateStatus = async (status: LeadStatus) => {
    if (!lead) return;
    const updated = await api.patch<Lead>(`/api/leads/${lead.id}`, { status });
    setLead(updated);
  };

  const saveNotes = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      const updated = await api.patch<Lead>(`/api/leads/${lead.id}`, { notes });
      setLead(updated);
    } finally {
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <div className="admin-card">
        <p>Lead not found.</p>
        <Link to="/admin/leads" className="admin-link-btn">
          Back to leads
        </Link>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <>
      <div className="admin-header">
        <div>
          <button className="admin-link-btn" onClick={() => navigate("/admin/leads")}>
            ← Back to leads
          </button>
          <h1 style={{ marginTop: 10 }}>{lead.name}</h1>
          <p>Submitted {new Date(lead.createdAt).toLocaleString()}</p>
        </div>
        <span className={`admin-badge status-${lead.status}`}>{lead.status}</span>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16 }}>Move Details</h3>
        <div className="admin-form">
          <div className="row">
            <div>
              <strong>Pick-up</strong>
              <p>{lead.pickup}</p>
            </div>
            <div>
              <strong>Drop-off</strong>
              <p>{lead.dropoff}</p>
            </div>
          </div>
          <div className="row">
            <div>
              <strong>Move Type</strong>
              <p>{lead.moveType}</p>
            </div>
            <div>
              <strong>Rooms</strong>
              <p>{lead.rooms}</p>
            </div>
          </div>
          <div className="row">
            <div>
              <strong>Preferred Date</strong>
              <p>{lead.moveDate}</p>
            </div>
            <div>
              <strong>Phone</strong>
              <p>
                <a href={`tel:${lead.phone}`}>{lead.phone}</a>
              </p>
            </div>
          </div>
          {lead.email && (
            <div>
              <strong>Email</strong>
              <p>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16 }}>Status</h3>
        <div className="filters" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`admin-chip${lead.status === status ? " is-active" : ""}`}
              onClick={() => updateStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16 }}>Internal Notes</h3>
        <div className="admin-form">
          <textarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes visible only to the Movers Rwanda team..."
          />
          <div className="admin-form-actions">
            <button className="btn btn-primary btn-sm" onClick={saveNotes} disabled={saving}>
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
