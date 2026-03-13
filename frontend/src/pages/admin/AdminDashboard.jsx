import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Spinner } from "../../components/Spinner";

const STAT_CARDS = [
  { key: "totalUsers",    label: "Total Users",    icon: "bi-people-fill",         cls: "c-blue" },
  { key: "totalStudents", label: "Students",       icon: "bi-person-fill",         cls: "c-teal" },
  { key: "totalAdmins",   label: "Admins",         icon: "bi-shield-fill",         cls: "c-amber" },
  { key: "totalCourses",  label: "Courses",        icon: "bi-collection-play-fill",cls: "c-sky" },
  { key: "totalEnrolls",  label: "Enrollments",    icon: "bi-journal-check",       cls: "c-rose" },
  { key: "completion",    label: "Completion Rate",icon: "bi-graph-up-arrow",      cls: "c-violet" },
];

export default function AdminDashboard() {
  const [stats, setStats]           = useState({});
  const [recentCourses, setRC]      = useState([]);
  const [recentEnrolls, setRE]      = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/users/stats"),
      api.get("/courses/admin/all"),
      api.get("/enrollments/admin/all"),
    ]).then(([sRes, cRes, eRes]) => {
      const s = sRes.data.data;
      const courses = cRes.data.data;
      const enrolls = eRes.data.data;
      const compRate = enrolls.length
        ? Math.round(enrolls.filter(e => e.progressPercent === 100).length / enrolls.length * 100)
        : 0;
      setStats({ ...s, totalCourses: courses.length, totalEnrolls: enrolls.length, completion: `${compRate}%` });
      setRC(courses.slice(0, 6));
      setRE(enrolls.slice(0, 6));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Stats */}
      <div className="row g-3 mb-5">
        {STAT_CARDS.map(s => (
          <div key={s.key} className="col-6 col-md-4 col-xl-2">
            <div className={`card border-0 stat-card ${s.cls}`}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-2 d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40, background: "var(--blue-light)", fontSize: 18, flexShrink: 0 }}>
                  <i className={`${s.icon} text-primary`}></i>
                </div>
                <div>
                  <div className="fw-700" style={{ fontSize: "1.3rem", lineHeight: 1 }}>
                    {stats[s.key] ?? "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Courses */}
        <div className="col-lg-7">
          <div className="card border-0">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h6 className="fw-700 mb-0">Recent Courses</h6>
              <Link to="/admin/courses" className="btn btn-sm btn-outline-primary"
                style={{ borderRadius: 8, fontSize: 13 }}>View All</Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="table data-table mb-0">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Students</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.map(c => (
                    <tr key={c._id}>
                      <td>
                        <div className="fw-600" style={{ fontSize: 13 }}>{c.title}</div>
                        <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{c.instructor}</div>
                      </td>
                      <td><span className="lbadge lbadge-sky">{c.category}</span></td>
                      <td>
                        <span className={`lbadge ${c.level==="Beginner"?"lbadge-green":c.level==="Intermediate"?"lbadge-blue":"lbadge-red"}`}>
                          {c.level}
                        </span>
                      </td>
                      <td><span className="fw-600" style={{ fontSize: 13 }}>{c.students}</span></td>
                      <td>
                        <span className={`lbadge ${c.isPublished ? "lbadge-green" : "lbadge-gray"}`}>
                          {c.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="col-lg-5">
          <div className="card border-0">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h6 className="fw-700 mb-0">Recent Enrollments</h6>
              <Link to="/admin/enrollments" className="btn btn-sm btn-outline-primary"
                style={{ borderRadius: 8, fontSize: 13 }}>View All</Link>
            </div>
            <div>
              {recentEnrolls.map((e, i) => (
                <div key={e._id} className="d-flex align-items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < recentEnrolls.length - 1 ? "1px solid var(--gray-100)" : "none" }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-700 flex-shrink-0"
                    style={{ width: 34, height: 34, background: "var(--blue-light)", color: "var(--blue)", fontSize: 13 }}>
                    {e.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-600 text-truncate" style={{ fontSize: 13 }}>{e.user?.name}</div>
                    <div className="text-truncate" style={{ fontSize: 12, color: "var(--gray-400)" }}>{e.course?.title}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="fw-700" style={{ fontSize: 13, color: "var(--blue)" }}>{e.progressPercent}%</div>
                    <div className="progress" style={{ height: 4, width: 52, marginTop: 3 }}>
                      <div className="progress-bar prog-blue" style={{ width: `${e.progressPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
