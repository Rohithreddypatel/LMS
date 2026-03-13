export function Spinner({ text = "Loading…" }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="spinner-border text-primary"></div>
      <span style={{ color: "var(--gray-500)", fontSize: 14 }}>{text}</span>
    </div>
  );
}

export function Toast({ msg, type = "success" }) {
  if (!msg) return null;
  return (
    <div className={`app-toast ${type}`}>
      <i className={`bi bi-${type === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}></i>
      {msg}
    </div>
  );
}
