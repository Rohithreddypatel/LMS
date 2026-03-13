import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
import { Spinner } from "../components/Spinner";
import { useAuthStore } from "../store/authStore";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [courses, setCourses]     = useState([]);
  const [cats, setCats]           = useState(["All"]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [cat, setCat]             = useState("All");
  const [level, setLevel]         = useState("All");

  useEffect(() => {
    api.get("/courses/meta/categories").then(r => setCats(r.data.data)).catch(() => {});
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (cat   !== "All") params.category = cat;
      if (level !== "All") params.level    = level;
      const { data } = await api.get("/courses", { params });
      setCourses(data.data);
    } catch {
      setError("Cannot connect to the server. Please try again in a moment.");
    } finally { setLoading(false); }
  }, [search, cat, level]);

  useEffect(() => {
    const t = setTimeout(fetchCourses, 300);
    return () => clearTimeout(t);
  }, [fetchCourses]);

  return (
    <>
      {/* Hero */}
      <section className="hero text-white py-5">
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className="lbadge lbadge-sky mb-3" style={{ fontSize: 12 }}>
                <i className="bi bi-stars me-1"></i>Trusted by 10,000+ learners
              </div>
              <h1 className="fw-700 mb-3" style={{ fontSize: "clamp(2rem,5vw,2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                Advance your career<br />with expert-led courses
              </h1>
              <p className="mb-4" style={{ opacity: 0.75, fontSize: "1.05rem", maxWidth: 500 }}>
                Learn in-demand skills from industry professionals. Self-paced, hands-on, and completely free.
              </p>
              {!isAuthenticated && (
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/signup" className="btn btn-light fw-600" style={{ borderRadius: 10, padding: "10px 24px" }}>
                    Start Learning Free
                  </Link>
                  <Link to="/login" className="btn fw-600" style={{ borderRadius: 10, padding: "10px 24px", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
                    Sign In
                  </Link>
                </div>
              )}
              {/* Stats row */}
              <div className="d-flex flex-wrap gap-4 mt-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { v: `${courses.length || 6}`, l: "Courses" },
                  { v: "4.8★",                   l: "Avg Rating" },
                  { v: "10K+",                    l: "Students" },
                  { v: "6",                       l: "Instructors" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="fw-700" style={{ fontSize: "1.25rem" }}>{s.v}</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-center">
              <div style={{ position: "relative" }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 260, height: 260, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <i className="bi bi-mortarboard" style={{ fontSize: 100, opacity: 0.35 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-700 mb-0" style={{ letterSpacing: "-0.02em" }}>Browse Courses</h2>
          <span style={{ fontSize: 14, color: "var(--gray-500)" }}>{courses.length} course{courses.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: "var(--gray-200)" }}>
                <i className="bi bi-search" style={{ color: "var(--gray-400)" }}></i>
              </span>
              <input type="text" className="form-control border-start-0 ps-0"
                placeholder="Search courses, instructors…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ borderRadius: "0 10px 10px 0", borderColor: "var(--gray-200)" }} />
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" value={cat} onChange={e => setCat(e.target.value)}
              style={{ borderRadius: 10, borderColor: "var(--gray-200)", fontSize: 14 }}>
              {cats.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select" value={level} onChange={e => setLevel(e.target.value)}
              style={{ borderRadius: 10, borderColor: "var(--gray-200)", fontSize: 14 }}>
              {LEVELS.map(l => <option key={l} value={l}>{l === "All" ? "All Levels" : l}</option>)}
            </select>
          </div>
          {(search || cat !== "All" || level !== "All") && (
            <div className="col-md-2 d-flex align-items-center">
              <button className="btn btn-sm btn-outline-secondary w-100"
                style={{ borderRadius: 9, fontSize: 13 }}
                onClick={() => { setSearch(""); setCat("All"); setLevel("All"); }}>
                <i className="bi bi-x me-1"></i>Clear
              </button>
            </div>
          )}
        </div>

        {/* Category pills */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`btn btn-sm ${cat === c ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ borderRadius: 20, fontSize: 12, fontWeight: 500, padding: "4px 14px" }}>
              {c}
            </button>
          ))}
        </div>

        {loading ? <Spinner text="Loading courses…" /> : error ? (
          <div className="alert" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "var(--danger)" }}>
            <i className="bi bi-wifi-off me-2"></i>{error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search" style={{ fontSize: 56, color: "var(--gray-300)" }}></i>
            <p className="mt-3 fw-600" style={{ color: "var(--gray-600)" }}>No courses found</p>
            <p style={{ color: "var(--gray-400)", fontSize: 14 }}>Try different search terms or filters</p>
            <button className="btn btn-outline-primary" style={{ borderRadius: 9 }}
              onClick={() => { setSearch(""); setCat("All"); setLevel("All"); }}>
              Show All Courses
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {courses.map(c => (
              <div key={c._id} className="col-sm-6 col-lg-4 col-xl-3">
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
