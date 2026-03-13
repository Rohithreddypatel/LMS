import { useState, useEffect } from "react";
import api from "../../services/api";
import { Spinner, Toast } from "../../components/Spinner";

export default function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [editUser, setEditUser] = useState(null);
  const [delId, setDelId]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = () => {
    setLoading(true);
    api.get("/users").then(r => { setUsers(r.data.data); setFiltered(r.data.data); })
      .catch(() => showToast("Failed to load users","danger")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  }, [search, users]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/users/${editUser._id}`,
        { name: editUser.name, email: editUser.email, role: editUser.role, isActive: editUser.isActive });
      showToast("User updated");
      setUsers(p => p.map(u => u._id === editUser._id ? data.data : u));
      setEditUser(null);
    } catch (err) { showToast(err.response?.data?.message || "Update failed","danger"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/users/${delId}`);
      showToast("User deleted");
      setUsers(p => p.filter(u => u._id !== delId));
    } catch (err) { showToast(err.response?.data?.message || "Delete failed","danger"); }
    finally { setDeleting(false); setDelId(null); }
  };

  return (
    <div>
      <Toast msg={toast?.msg} type={toast?.type} />

      <p className="mb-4" style={{ fontSize: 14, color: "var(--gray-500)" }}>{users.length} registered users</p>

      <div className="input-group mb-4" style={{ maxWidth: 380 }}>
        <span className="input-group-text bg-white" style={{ borderRadius:"10px 0 0 10px", borderColor:"var(--gray-200)" }}>
          <i className="bi bi-search" style={{ color:"var(--gray-400)" }}></i>
        </span>
        <input type="text" className="form-control" placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: search?"0":"0 10px 10px 0", borderColor:"var(--gray-200)" }} />
        {search && <button className="btn btn-outline-secondary" onClick={()=>setSearch("")} style={{ borderRadius:"0 10px 10px 0" }}><i className="bi bi-x"></i></button>}
      </div>

      {loading ? <Spinner /> : (
        <div className="card border-0" style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table className="table data-table mb-0">
              <thead>
                <tr>
                  <th>#</th><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th style={{width:90}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-5" style={{color:"var(--gray-400)"}}>No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <tr key={u._id}>
                    <td style={{ color:"var(--gray-400)", fontSize:12 }}>{i+1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-700 flex-shrink-0"
                          style={{ width:34, height:34, background:"var(--blue-light)", color:"var(--blue)", fontSize:13 }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="fw-600" style={{ fontSize:13 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:13, color:"var(--gray-500)" }}>{u.email}</td>
                    <td>
                      <span className={`lbadge ${u.role==="admin"?"lbadge-yellow":"lbadge-blue"}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`lbadge ${u.isActive?"lbadge-green":"lbadge-red"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ fontSize:12, color:"var(--gray-400)" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm" title="Edit" onClick={() => setEditUser({...u})}
                          style={{ border:"1px solid var(--gray-200)", borderRadius:7, padding:"4px 8px" }}>
                          <i className="bi bi-pencil" style={{ fontSize:13 }}></i>
                        </button>
                        <button className="btn btn-sm" title="Delete" onClick={() => setDelId(u._id)}
                          style={{ border:"1px solid #fecaca", borderRadius:7, padding:"4px 8px", color:"var(--danger)" }}>
                          <i className="bi bi-trash" style={{ fontSize:13 }}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-bg">
          <div className="modal-panel">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h6 className="fw-700 mb-0">Edit User</h6>
              <button className="btn-close" onClick={() => setEditUser(null)}></button>
            </div>
            <div className="p-4">
              {[
                { label:"Full Name", type:"text",  key:"name" },
                { label:"Email",     type:"email", key:"email" },
              ].map(f => (
                <div key={f.key} className="mb-3">
                  <label className="form-label">{f.label}</label>
                  <input type={f.type} className="form-control" value={editUser[f.key]}
                    onChange={e => setEditUser(u => ({...u, [f.key]: e.target.value}))}
                    style={{ borderRadius:10 }} />
                </div>
              ))}
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={editUser.role}
                  onChange={e => setEditUser(u => ({...u, role: e.target.value}))} style={{ borderRadius:10 }}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-check form-switch mb-4">
                <input type="checkbox" className="form-check-input" id="uactive"
                  checked={editUser.isActive}
                  onChange={e => setEditUser(u => ({...u, isActive: e.target.checked}))} />
                <label className="form-check-label" htmlFor="uactive" style={{ fontSize:14 }}>Account Active</label>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-grow-1 py-2" onClick={handleUpdate} disabled={saving}
                  style={{ borderRadius:10, fontWeight:600 }}>
                  {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Save Changes
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setEditUser(null)}
                  style={{ borderRadius:10 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {delId && (
        <div className="modal-bg">
          <div className="modal-panel">
            <div className="p-5 text-center">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width:64, height:64, background:"#fef2f2" }}>
                <i className="bi bi-person-x" style={{ fontSize:28, color:"var(--danger)" }}></i>
              </div>
              <h5 className="fw-700 mb-2">Delete User?</h5>
              <p style={{ fontSize:14, color:"var(--gray-500)", margin:"0 0 1.5rem" }}>
                This will permanently remove the user and all their enrollments.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-outline-secondary" style={{ borderRadius:9, minWidth:90 }}
                  onClick={() => setDelId(null)}>Cancel</button>
                <button className="btn btn-danger" style={{ borderRadius:9, minWidth:90 }}
                  onClick={handleDelete} disabled={deleting}>
                  {deleting ? <span className="spinner-border spinner-border-sm me-1"></span> : null}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
