import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [localErr, setLocalErr] = useState("");
  const { signup, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const upd = (k) => (e) => { setF(p => ({ ...p, [k]: e.target.value })); clearError(); setLocalErr(""); };

  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) { setLocalErr("Passwords do not match"); return; }
    if (f.password.length < 6)   { setLocalErr("Password must be at least 6 characters"); return; }
    try { await signup(f.name.trim(), f.email, f.password); navigate("/"); }
    catch {}
  };

  const displayErr = error || localErr;

  return (
    <div className="auth-page">
      <div className="card auth-card border-0">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3"
            style={{ width: 56, height: 56, fontSize: 24 }}>
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h4 className="fw-700 mb-1" style={{ letterSpacing: "-0.03em" }}>Create your account</h4>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Join Learnify — completely free</p>
        </div>

        {displayErr && (
          <div className="alert d-flex align-items-center gap-2 py-2 mb-3"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "var(--danger)", fontSize: 14 }}>
            <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>{displayErr}
          </div>
        )}

        <form onSubmit={submit}>
          {[
            { label: "Full Name",        key: "name",     type: "text",     ph: "Jane Doe" },
            { label: "Email address",    key: "email",    type: "email",    ph: "you@example.com" },
            { label: "Password",         key: "password", type: "password", ph: "Min 6 characters" },
            { label: "Confirm Password", key: "confirm",  type: "password", ph: "Re-enter password" },
          ].map(({ label, key, type, ph }) => (
            <div key={key} className="mb-3">
              <label className="form-label">{label}</label>
              <input type={type} className="form-control" placeholder={ph}
                value={f[key]} onChange={upd(key)} required
                style={{ borderRadius: 10, padding: "10px 14px" }} />
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-100 py-2 mt-1" disabled={loading}
            style={{ borderRadius: 10, fontWeight: 600 }}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account…</> : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/login" className="fw-600" style={{ color: "var(--blue)", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
