import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => { logout(); navigate("/login"); };
  const isStudent = !user || user.role === "student";

  return (
    <>
      {/* ── Main Navbar ─────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "#fff",
        borderBottom: "1px solid var(--gray-200)",
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 12,
      }}>
        {/* Brand */}
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: 8,
          fontWeight: 700, fontSize: "1.2rem",
          color: "var(--blue)", textDecoration: "none",
          letterSpacing: "-0.03em", whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          <i className="bi bi-mortarboard-fill" style={{ fontSize: 22 }}></i>
          Learn<span style={{ color: "var(--accent)" }}>ify</span>
        </Link>

        {/* Desktop links — center */}
        {isStudent && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 16 }}
               className="d-none d-lg-flex">
            <NavLink to="/" end style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 8,
              fontSize: 14, fontWeight: 500, textDecoration: "none",
              color: isActive ? "var(--blue)" : "var(--gray-600)",
              background: isActive ? "var(--blue-light)" : "transparent",
            })}>
              <i className="bi bi-collection-play"></i> Courses
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-courses" style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 8,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                color: isActive ? "var(--blue)" : "var(--gray-600)",
                background: isActive ? "var(--blue-light)" : "transparent",
              })}>
                <i className="bi bi-journal-check"></i> My Learning
              </NavLink>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop right */}
        <div className="d-none d-lg-flex" style={{ alignItems: "center", gap: 8 }}>
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                data-bs-toggle="dropdown"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 12px 5px 6px",
                  border: "1px solid var(--gray-200)", borderRadius: 9,
                  background: "#fff", cursor: "pointer",
                  fontWeight: 500, fontSize: 14,
                }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--blue)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span>{user?.name?.split(" ")[0]}</span>
                {user?.role === "admin" && (
                  <span style={{
                    background: "#fef9c3", color: "#a16207",
                    fontSize: 11, fontWeight: 600, padding: "2px 7px",
                    borderRadius: 5,
                  }}>Admin</span>
                )}
                <i className="bi bi-chevron-down" style={{ fontSize: 11, color: "var(--gray-400)" }}></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{
                borderRadius: 12, border: "1px solid var(--gray-200)", minWidth: 210,
              }}>
                <li style={{ padding: "10px 16px" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{user?.email}</div>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                {user?.role === "admin" && (
                  <li>
                    <Link className="dropdown-item" to="/admin" style={{ fontSize: 14 }}>
                      <i className="bi bi-speedometer2 me-2"></i>Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout} style={{ fontSize: 14 }}>
                    <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                border: "1px solid var(--blue)", color: "var(--blue)",
                textDecoration: "none",
              }}>Sign In</Link>
              <Link to="/signup" style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: "var(--blue)", color: "#fff", textDecoration: "none",
              }}>Get Started</Link>
            </>
          )}
        </div>

        {/* ── Hamburger button (mobile only) ─────── */}
        <button
          onClick={() => setOpen(o => !o)}
          className="d-lg-none"
          aria-label="Menu"
          style={{
            width: 40, height: 40, borderRadius: 9,
            border: "1px solid var(--gray-200)",
            background: open ? "var(--blue-light)" : "#fff",
            cursor: "pointer", flexShrink: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 5,
            padding: 0,
          }}>
          <span style={{
            width: 18, height: 2, borderRadius: 2,
            background: open ? "var(--blue)" : "var(--gray-700)",
            transform: open ? "translateY(7px) rotate(45deg)" : "none",
            transition: "all 0.22s ease",
            display: "block",
          }} />
          <span style={{
            width: 18, height: 2, borderRadius: 2,
            background: open ? "var(--blue)" : "var(--gray-700)",
            opacity: open ? 0 : 1,
            transition: "all 0.22s ease",
            display: "block",
          }} />
          <span style={{
            width: 18, height: 2, borderRadius: 2,
            background: open ? "var(--blue)" : "var(--gray-700)",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            transition: "all 0.22s ease",
            display: "block",
          }} />
        </button>
      </nav>

      {/* ── Backdrop ────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(15,23,42,0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 198,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s ease",
        }}
      />

      {/* ── Mobile Drawer ───────────────────────────── */}
      <div style={{
        position: "fixed",
        top: 60, left: 0, right: 0,
        background: "#fff",
        zIndex: 199,
        borderBottom: "1px solid var(--gray-200)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
        transform: open ? "translateY(0)" : "translateY(-110%)",
        transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* User info */}
        {isAuthenticated && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 20px",
            background: "var(--gray-50)",
            borderBottom: "1px solid var(--gray-100)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--blue)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 18, flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: "var(--gray-400)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user?.email}
              </div>
            </div>
            {user?.role === "admin" && (
              <span style={{ background: "#fef9c3", color: "#a16207", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                Admin
              </span>
            )}
          </div>
        )}

        {/* Nav links */}
        <div style={{ padding: "10px 12px" }}>
          {isStudent && (
            <>
              <NavLink to="/" end onClick={() => setOpen(false)} style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 10, marginBottom: 3,
                fontSize: 15, fontWeight: 500, textDecoration: "none",
                color: isActive ? "var(--blue)" : "var(--gray-700)",
                background: isActive ? "var(--blue-light)" : "transparent",
              })}>
                <i className="bi bi-collection-play" style={{ fontSize: 18, width: 22, textAlign: "center" }}></i>
                Courses
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/my-courses" onClick={() => setOpen(false)} style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 10, marginBottom: 3,
                  fontSize: 15, fontWeight: 500, textDecoration: "none",
                  color: isActive ? "var(--blue)" : "var(--gray-700)",
                  background: isActive ? "var(--blue-light)" : "transparent",
                })}>
                  <i className="bi bi-journal-check" style={{ fontSize: 18, width: 22, textAlign: "center" }}></i>
                  My Learning
                </NavLink>
              )}
            </>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 10, marginBottom: 3,
              fontSize: 15, fontWeight: 500, textDecoration: "none",
              color: "var(--gray-700)",
            }}>
              <i className="bi bi-speedometer2" style={{ fontSize: 18, width: 22, textAlign: "center" }}></i>
              Admin Panel
            </Link>
          )}
        </div>

        {/* Auth section */}
        <div style={{ padding: "8px 16px 16px", borderTop: "1px solid var(--gray-100)" }}>
          {isAuthenticated ? (
            <button onClick={handleLogout} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "12px 14px",
              border: "1px solid #fecaca", borderRadius: 10,
              background: "#fff8f8", cursor: "pointer",
              color: "var(--danger)", fontWeight: 500, fontSize: 15,
            }}>
              <i className="bi bi-box-arrow-right" style={{ fontSize: 18 }}></i>
              Sign Out
            </button>
          ) : (
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <Link to="/login" onClick={() => setOpen(false)} style={{
                flex: 1, padding: "11px", textAlign: "center", borderRadius: 10,
                border: "1px solid var(--blue)", color: "var(--blue)",
                fontWeight: 600, fontSize: 15, textDecoration: "none",
              }}>
                Sign In
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)} style={{
                flex: 1, padding: "11px", textAlign: "center", borderRadius: 10,
                background: "var(--blue)", color: "#fff",
                fontWeight: 600, fontSize: 15, textDecoration: "none",
              }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}