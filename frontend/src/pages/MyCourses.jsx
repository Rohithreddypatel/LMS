import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
import { Spinner } from "../components/Spinner";
import { useAuthStore } from "../store/authStore";

export default function MyCourses() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.get("/enrollments/my").then(r => setEnrollments(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const completed   = enrollments.filter(e => e.progressPercent === 100).length;
  const inProgress  = enrollments.filter(e => e.progressPercent > 0 && e.progressPercent < 100).length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progressPercent, 0) / enrollments.length) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--gray-50)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--blue) 0%, #1e3a8a 100%)", color: "#fff" }}>
        <div className="container py-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center fw-700"
              style={{ width: 52, height: 52, background: "rgba(255,255,255,0.15)", fontSize: 22 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h4 className="fw-700 mb-0" style={{ letterSpacing: "-0.02em" }}>My Learning</h4>
              <p className="mb-0" style={{ opacity: 0.7, fontSize: 14 }}>Welcome back, {user?.name?.split(" ")[0]}!</p>
            </div>
          </div>
          <div className="row g-3">
            {[
              { label: "Enrolled",     value: enrollments.length, icon: "bi-collection-play" },
              { label: "In Progress",  value: inProgress,         icon: "bi-play-circle"     },
              { label: "Completed",    value: completed,          icon: "bi-check-circle"    },
              { label: "Avg Progress", value: `${avgProgress}%`,  icon: "bi-graph-up"        },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="rounded-3 p-3 text-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <i className={`${s.icon} d-block mb-1`} style={{ fontSize: 20 }}></i>
                  <div className="fw-700 fs-5">{s.value}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        {loading ? <Spinner /> : enrollments.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-journal-x" style={{ fontSize: 64, color: "var(--gray-300)" }}></i>
            <h5 className="fw-700 mt-3" style={{ color: "var(--gray-700)" }}>No courses yet</h5>
            <p style={{ color: "var(--gray-400)", fontSize: 14 }}>Browse our catalog and enroll in your first course.</p>
            <Link to="/" className="btn btn-primary mt-2" style={{ borderRadius: 9 }}>Browse Courses</Link>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-700 mb-0">Your Courses ({enrollments.length})</h5>
              <Link to="/" className="btn btn-sm btn-outline-primary" style={{ borderRadius: 8 }}>
                <i className="bi bi-plus me-1"></i>Explore More
              </Link>
            </div>
            <div className="row g-4">
              {enrollments.map(e => e.course && (
                <div key={e._id} className="col-sm-6 col-lg-4 col-xl-3">
                  <CourseCard course={e.course} progress={e.progressPercent} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
