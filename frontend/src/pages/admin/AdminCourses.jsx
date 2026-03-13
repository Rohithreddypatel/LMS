import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Spinner, Toast } from "../../components/Spinner";

export default function AdminCourses() {
  const [courses, setCourses]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [delId, setDelId]       = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    api.get("/courses/admin/all")
      .then(r => { setCourses(r.data.data); setFiltered(r.data.data); })
      .catch(() => showToast("Failed to load courses", "danger"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(courses); return; }
    const q = search.toLowerCase();
    setFiltered(courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    ));
  }, [search, courses]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/courses/${delId}`);
      showToast("Course deleted successfully");
      setCourses(p => p.filter(c => c._id !== delId));
    } catch { showToast("Delete failed", "danger"); }
    finally { setDeleting(false); setDelId(null); }
  };

  return (
    <div>
      <Toast msg={toast?.msg} type={toast?.type} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="mb-0" style={{ fontSize: 14, color: "var(--gray-500)" }}>
            {courses.length} total courses
          </p>
        </div>
        <Link to="/admin/courses/new" className="btn btn-primary" style={{ borderRadius: 9, fontWeight: 500 }}>
          <i className="bi bi-plus-lg me-1"></i>New Course
        </Link>
      </div>

      {/* Search */}
      <div className="input-group mb-4" style={{ maxWidth: 380 }}>
        <span className="input-group-text bg-white" style={{ borderRadius: "10px 0 0 10px", borderColor: "var(--gray-200)" }}>
          <i className="bi bi-search" style={{ color: "var(--gray-400)" }}></i>
        </span>
        <input type="text" className="form-control" placeholder="Search courses…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: search ? "0" : "0 10px 10px 0", borderColor: "var(--gray-200)" }} />
        {search && (
          <button className="btn btn-outline-secondary" onClick={() => setSearch("")}
            style={{ borderRadius: "0 10px 10px 0" }}>
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>

      {loading ? <Spinner /> : (
        <div className="card border-0" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="table data-table mb-0">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Instructor</th>
                  <th>Lessons</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-5" style={{ color: "var(--gray-400)" }}>No courses found</td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={c._id}>
                    <td style={{ color: "var(--gray-400)", fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format"}
                          alt="" className="rounded-2 flex-shrink-0"
                          style={{ width: 52, height: 38, objectFit: "cover" }}
                          onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format"; }} />
                        <div>
                          <div className="fw-600" style={{ fontSize: 13 }}>{c.title}</div>
                          <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{c.duration}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="lbadge lbadge-sky">{c.category}</span></td>
                    <td>
                      <span className={`lbadge ${c.level==="Beginner"?"lbadge-green":c.level==="Intermediate"?"lbadge-blue":"lbadge-red"}`}>
                        {c.level}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{c.instructor}</td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{c.lessons?.length || 0}</td>
                    <td><span className="fw-600" style={{ fontSize: 13, color: "var(--blue)" }}>{c.students || 0}</span></td>
                    <td>
                      <span className={`lbadge ${c.isPublished ? "lbadge-green" : "lbadge-gray"}`}>
                        {c.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/admin/courses/${c._id}/edit`}
                          className="btn btn-sm" title="Edit"
                          style={{ border: "1px solid var(--gray-200)", borderRadius: 7, padding: "4px 8px" }}>
                          <i className="bi bi-pencil" style={{ fontSize: 13 }}></i>
                        </Link>
                        <button className="btn btn-sm" title="Delete" onClick={() => setDelId(c._id)}
                          style={{ border: "1px solid #fecaca", borderRadius: 7, padding: "4px 8px", color: "var(--danger)" }}>
                          <i className="bi bi-trash" style={{ fontSize: 13 }}></i>
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

      {/* Delete Modal */}
      {delId && (
        <div className="modal-bg">
          <div className="modal-panel">
            <div className="p-5 text-center">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: 64, height: 64, background: "#fef2f2" }}>
                <i className="bi bi-trash" style={{ fontSize: 28, color: "var(--danger)" }}></i>
              </div>
              <h5 className="fw-700 mb-2">Delete Course?</h5>
              <p style={{ fontSize: 14, color: "var(--gray-500)", margin: "0 0 1.5rem" }}>
                This will permanently remove the course and all student enrollments. This cannot be undone.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-outline-secondary" style={{ borderRadius: 9, minWidth: 90 }}
                  onClick={() => setDelId(null)}>Cancel</button>
                <button className="btn btn-danger" style={{ borderRadius: 9, minWidth: 90 }}
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
