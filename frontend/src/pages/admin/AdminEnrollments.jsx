import { useState, useEffect } from "react";
import api from "../../services/api";
import { Spinner } from "../../components/Spinner";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");

  useEffect(() => {
    api.get("/enrollments/admin/all")
      .then(r => { setEnrollments(r.data.data); setFiltered(r.data.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(enrollments); return; }
    const q = search.toLowerCase();
    setFiltered(enrollments.filter(e =>
      e.user?.name?.toLowerCase().includes(q) ||
      e.user?.email?.toLowerCase().includes(q) ||
      e.course?.title?.toLowerCase().includes(q)
    ));
  }, [search, enrollments]);

  const total    = enrollments.length;
  const done     = enrollments.filter(e => e.progressPercent === 100).length;
  const active   = enrollments.filter(e => e.progressPercent > 0 && e.progressPercent < 100).length;
  const avgProg  = total ? Math.round(enrollments.reduce((s,e) => s + e.progressPercent, 0) / total) : 0;

  return (
    <div>
      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label:"Total Enrollments", value:total,    icon:"bi-journal-check",  cls:"c-blue"  },
          { label:"Completed",          value:done,    icon:"bi-check-circle",   cls:"c-teal"  },
          { label:"In Progress",        value:active,  icon:"bi-play-circle",    cls:"c-amber" },
          { label:"Avg Progress",       value:`${avgProg}%`, icon:"bi-graph-up", cls:"c-sky"   },
        ].map((s,i) => (
          <div key={i} className="col-6 col-md-3">
            <div className={`card border-0 stat-card ${s.cls}`}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-2 d-flex align-items-center justify-content-center"
                  style={{ width:40, height:40, background:"var(--blue-light)", fontSize:18, flexShrink:0 }}>
                  <i className={`${s.icon} text-primary`}></i>
                </div>
                <div>
                  <div className="fw-700" style={{ fontSize:"1.3rem", lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:12, color:"var(--gray-400)", marginTop:2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="input-group mb-4" style={{ maxWidth:400 }}>
        <span className="input-group-text bg-white" style={{ borderRadius:"10px 0 0 10px", borderColor:"var(--gray-200)" }}>
          <i className="bi bi-search" style={{ color:"var(--gray-400)" }}></i>
        </span>
        <input type="text" className="form-control" placeholder="Search student or course…"
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
                  <th>#</th><th>Student</th><th>Course</th><th>Category</th><th>Progress</th><th>Status</th><th>Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-5" style={{color:"var(--gray-400)"}}>No enrollments found</td></tr>
                ) : filtered.map((e, i) => (
                  <tr key={e._id}>
                    <td style={{ color:"var(--gray-400)", fontSize:12 }}>{i+1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-700 flex-shrink-0"
                          style={{ width:32, height:32, background:"var(--blue-light)", color:"var(--blue)", fontSize:12 }}>
                          {e.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-600" style={{ fontSize:13 }}>{e.user?.name||"—"}</div>
                          <div style={{ fontSize:11, color:"var(--gray-400)" }}>{e.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth:180 }}>
                      <div className="fw-600 text-truncate" style={{ fontSize:13 }}>{e.course?.title||"—"}</div>
                    </td>
                    <td>
                      {e.course?.category && <span className="lbadge lbadge-sky">{e.course.category}</span>}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress" style={{ height:6, width:72, flexShrink:0 }}>
                          <div className={`progress-bar ${e.progressPercent===100?"prog-green":"prog-blue"}`}
                            style={{ width:`${e.progressPercent}%` }}></div>
                        </div>
                        <span className="fw-600" style={{ fontSize:12, color:"var(--blue)", minWidth:30 }}>
                          {e.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`lbadge ${e.progressPercent===100?"lbadge-green":e.progressPercent>0?"lbadge-orange":"lbadge-gray"}`}>
                        {e.progressPercent===100?"Completed":e.progressPercent>0?"In Progress":"Not Started"}
                      </span>
                    </td>
                    <td style={{ fontSize:12, color:"var(--gray-400)" }}>
                      {new Date(e.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
