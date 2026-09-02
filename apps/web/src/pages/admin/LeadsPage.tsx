import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import type { Lead, LeadStatus } from "../../types";

const STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Lead[]>("/api/leads")
      .then(setLeads)
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Leads</h1>
          <p>{leads.length} total quote requests.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="filters">
          <button
            className={`admin-chip${filter === "all" ? " is-active" : ""}`}
            onClick={() => setFilter("all")}
          >
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
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr key={lead.id} className="is-clickable" onClick={() => navigate(`/admin/leads/${lead.id}`)}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>
                    {lead.pickup} → {lead.dropoff}
                  </td>
                  <td>{lead.moveDate}</td>
                  <td>
                    <span className={`admin-badge status-${lead.status}`}>{lead.status}</span>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && visible.length === 0 && <div className="admin-empty">No leads match this filter.</div>}
        </div>
      </div>
    </>
  );
}
