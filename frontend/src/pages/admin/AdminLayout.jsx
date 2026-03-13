import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const NAV = [
  { to: "/admin",             icon: "bi-speedometer2",     label: "Dashboard",   end: true },
  { to: "/admin/courses",     icon: "bi-collection-play",  label: "Courses" },
  { to: "/admin/users",       icon: "bi-people",           label: "Users" },
  { to: "/admin/enrollments", icon: "bi-journal-check",    label: "Enrollments" },
];

const PAGE_TITLE = {
  "/admin":             "Dashboard",
  "/admin/courses":     "Courses",
  "/admin/users":       "Users",
  "/admin/enrollments": "Enrollments",
};

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate         = useNavigate();
  const location         = useLocation();
  const title = PAGE_TITLE[location.pathname] ||
    (location.pathname.includes("/edit") ? "Edit Course" : "New Course");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32, background: "var(--blue)", fontSize: 16 }}>
              <i className="bi bi-mortarboard-fill text-white"></i>
            </div>
            <span className="sidebar-brand-name">Learnify</span>
          </div>
          <div className="mt-2 lbadge lbadge-yellow" style={{ fontSize: 11 }}>
            Admin Panel
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>
        <nav>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}>
              <i className={n.icon}></i>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-section-label">Student View</div>
        <nav>
          <NavLink to="/" className="sidebar-nav-item" target="_blank">
            <i className="bi bi-box-arrow-up-right"></i>
            View Site
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="rounded-circle d-flex align-items-center justify-content-center fw-700"
              style={{ width: 34, height: 34, background: "var(--blue)", color: "#fff", fontSize: 14, flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div className="text-truncate fw-600" style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{user?.name}</div>
              <div className="text-truncate" style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{user?.email}</div>
            </div>
          </div>
          <button className="sidebar-nav-item" onClick={() => { logout(); navigate("/login"); }}
            style={{ color: "#f87171" }}>
            <i className="bi bi-box-arrow-right"></i>Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="admin-content" style={{ background: "var(--gray-50)" }}>
        <div className="admin-topbar">
          <h5 className="fw-700 mb-0" style={{ letterSpacing: "-0.02em" }}>{title}</h5>
          <div className="d-flex align-items-center gap-2">
            <span className="lbadge lbadge-blue" style={{ fontSize: 12 }}>
              <i className="bi bi-circle-fill me-1" style={{ fontSize: 7, color: "#22c55e" }}></i>
              API Connected
            </span>
          </div>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
