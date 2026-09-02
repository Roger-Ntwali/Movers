import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/service-areas", label: "Service Areas" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/settings", label: "Settings" },
];

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar-brand">
          MOVERS <span>RWANDA</span>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "is-active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <div className="who">{admin?.name}</div>
          <button className="admin-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <button
          className="admin-hamburger"
          aria-label="Toggle menu"
          onClick={() => setSidebarOpen((v) => !v)}
          style={{ marginBottom: 16 }}
        >
          ☰
        </button>
        <Outlet />
      </main>
    </div>
  );
}
