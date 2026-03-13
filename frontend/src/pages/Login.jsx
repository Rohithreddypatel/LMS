import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const from     = useLocation().state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault(); clearError();
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch {}
  };

  return (
    <div className="auth-page">
      <div className="card auth-card border-0">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3"
            style={{ width: 56, height: 56, fontSize: 24 }}>
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h4 className="fw-700 mb-1" style={{ letterSpacing: "-0.03em" }}>Welcome back</h4>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Sign in to your Learnify account</p>
        </div>

        {/* Demo hint */}
        <div className="rounded-3 mb-4 p-3" style={{ background: "var(--blue-light)", fontSize: 13 }}>
          <strong style={{ color: "var(--blue)" }}>Demo admin:</strong>
          <span style={{ color: "var(--gray-600)" }}> admin@learnify.com / admin123</span>
        </div>

        {error && (
          <div className="alert d-flex align-items-center gap-2 py-2 mb-3"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "var(--danger)", fontSize: 14 }}>
            <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>{error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              value={email} onChange={e => { setEmail(e.target.value); clearError(); }} required
              style={{ borderRadius: 10, padding: "10px 14px" }} />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input type={showPw ? "text" : "password"} className="form-control" placeholder="••••••••"
                value={password} onChange={e => { setPassword(e.target.value); clearError(); }} required
                style={{ borderRadius: "10px 0 0 10px", padding: "10px 14px" }} />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPw(!showPw)}
                style={{ borderRadius: "0 10px 10px 0" }}>
                <i className={`bi bi-eye${showPw ? "-slash" : ""}`}></i>
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}
            style={{ borderRadius: 10, fontWeight: 600 }}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</> : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: 14 }}>
          Don't have an account?{" "}
          <Link to="/signup" className="fw-600" style={{ color: "var(--blue)", textDecoration: "none" }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}
