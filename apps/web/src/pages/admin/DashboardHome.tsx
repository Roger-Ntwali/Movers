import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Lead, LeadStatus } from "../../types";

const STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

export function DashboardHome() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Lead[]>("/api/leads")
      .then(setLeads)
      .finally(() => setLoading(false));
  }, []);

  const counts = STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of incoming leads.</p>
        </div>
      </div>

      <div className="admin-stats">
        {counts.map(({ status, count }) => (
          <div className="admin-stat" key={status}>
            <strong>{loading ? "–" : count}</strong>
            <span>{status}</span>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <h3>Recent Leads</h3>
          <Link to="/admin/leads" className="admin-link-btn">
            View all →
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Route</th>
                <th>Move Type</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 8).map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>
                    {lead.pickup} → {lead.dropoff}
                  </td>
                  <td>{lead.moveType}</td>
                  <td>
                    <span className={`admin-badge status-${lead.status}`}>{lead.status}</span>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && leads.length === 0 && <div className="admin-empty">No leads yet.</div>}
        </div>
      </div>
    </>
  );
}
