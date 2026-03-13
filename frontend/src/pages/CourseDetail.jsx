import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Spinner } from "../components/Spinner";
import { useAuthStore } from "../store/authStore";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [enrolled, setEnrolled]   = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [tab, setTab]             = useState("overview");

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      isAuthenticated ? api.get(`/enrollments/check/${id}`) : Promise.resolve(null),
    ]).then(([cr, er]) => {
      setCourse(cr.data.data);
      if (er) setEnrolled(er.data.isEnrolled);
    }).catch(() => navigate("/")).finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setEnrolling(true);
    try {
      await api.post("/enrollments", { courseId: id });
      setEnrolled(true);
    } catch (err) {
      if (err.response?.data?.message === "Already enrolled") setEnrolled(true);
    } finally { setEnrolling(false); }
  };

  if (loading) return <div className="container py-5"><Spinner /></div>;
  if (!course) return null;

  const levelCls = { Beginner: "lbadge-green", Intermediate: "lbadge-blue", Advanced: "lbadge-red" };

  return (
    <div style={{ background: "var(--gray-50)", minHeight: "100vh" }}>
      {/* Course header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", color: "#fff" }}>
        <div className="container py-5">
          <nav className="mb-3">
            <Link to="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>
              <i className="bi bi-arrow-left me-1"></i>All Courses
            </Link>
          </nav>
          <div className="row g-5 align-items-start">
            <div className="col-lg-7">
              <div className="d-flex gap-2 mb-3 flex-wrap">
                <span className={`lbadge ${levelCls[course.level] || "lbadge-gray"}`}>{course.level}</span>
                <span className="lbadge lbadge-sky">{course.category}</span>
              </div>
              <h1 className="fw-700 mb-3" style={{ fontSize: "clamp(1.5rem,4vw,2rem)", letterSpacing: "-0.02em" }}>
                {course.title}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{course.description}</p>
              <div className="d-flex flex-wrap gap-4 mt-4" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                <span><i className="bi bi-person me-1"></i>{course.instructor}</span>
                <span><i className="bi bi-star-fill text-warning me-1"></i>{course.rating} rating</span>
                <span><i className="bi bi-people me-1"></i>{(course.students||0).toLocaleString()} students</span>
                <span><i className="bi bi-clock me-1"></i>{course.duration}</span>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card border-0" style={{ borderRadius: 16 }}>
                <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"}
                  alt={course.title}
                  style={{ height: 200, objectFit: "cover", borderRadius: "16px 16px 0 0" }}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"; }} />
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="fw-700" style={{ fontSize: "1.5rem", color: "var(--blue)" }}>Free</div>
                    <span className="lbadge lbadge-green"><i className="bi bi-infinity me-1"></i>Lifetime Access</span>
                  </div>
                  {enrolled ? (
                    <div>
                      <div className="rounded-3 d-flex align-items-center gap-2 p-3 mb-3"
                        style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <i className="bi bi-check-circle-fill" style={{ color: "var(--success)" }}></i>
                        <span className="fw-600" style={{ color: "var(--success)", fontSize: 14 }}>You're enrolled!</span>
                      </div>
                      <Link to={`/player/${course._id}`} className="btn btn-primary w-100 py-2"
                        style={{ borderRadius: 10, fontWeight: 600 }}>
                        <i className="bi bi-play-circle me-2"></i>Go to Course
                      </Link>
                    </div>
                  ) : (
                    <button onClick={handleEnroll} disabled={enrolling}
                      className="btn btn-primary w-100 py-2" style={{ borderRadius: 10, fontWeight: 600 }}>
                      {enrolling
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Enrolling…</>
                        : <><i className="bi bi-mortarboard me-2"></i>Enroll Now — It's Free</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-5">
        <div className="d-flex gap-1 mb-4 border-bottom pb-3">
          {["overview","lessons"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ borderRadius: 8, textTransform: "capitalize", fontWeight: 500 }}>
              {t} {t === "lessons" && `(${course.lessons?.length || 0})`}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="row g-4">
            <div className="col-md-8">
              <h5 className="fw-700 mb-3">What You'll Learn</h5>
              <div className="row g-2">
                {["Build complete real-world projects","Master modern tools & frameworks","Follow professional coding standards",
                  "Understand core concepts deeply","Write clean, maintainable code","Deploy confidently to production"].map((item, i) => (
                  <div key={i} className="col-md-6 d-flex align-items-start gap-2" style={{ fontSize: 14 }}>
                    <i className="bi bi-check2-circle mt-1 flex-shrink-0" style={{ color: "var(--success)" }}></i>
                    <span style={{ color: "var(--gray-700)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0">
                <div className="card-body p-4">
                  <h6 className="fw-700 mb-3">Course Details</h6>
                  {[
                    { icon: "bi-collection-play", label: "Lessons",    val: course.lessons?.length || 0 },
                    { icon: "bi-clock",           label: "Duration",   val: course.duration },
                    { icon: "bi-bar-chart-line",  label: "Level",      val: course.level },
                    { icon: "bi-globe2",          label: "Language",   val: "English" },
                    { icon: "bi-award",           label: "Certificate",val: "Included" },
                  ].map((r, i, arr) => (
                    <div key={i} className={`d-flex justify-content-between align-items-center py-2 ${i < arr.length - 1 ? "border-bottom" : ""}`}>
                      <span style={{ fontSize: 13, color: "var(--gray-500)" }}>
                        <i className={`${r.icon} me-2`}></i>{r.label}
                      </span>
                      <span className="fw-600" style={{ fontSize: 13 }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "lessons" && (
          <div className="card border-0" style={{ overflow: "hidden" }}>
            {(course.lessons || []).map((ls, i) => (
              <div key={i} className="d-flex align-items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < course.lessons.length - 1 ? "1px solid var(--gray-100)" : "none" }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle fw-700 flex-shrink-0"
                  style={{ width: 36, height: 36, background: "var(--blue-light)", color: "var(--blue)", fontSize: 13 }}>
                  {i + 1}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-600" style={{ fontSize: 14 }}>{ls.title}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>
                    <i className="bi bi-clock me-1"></i>{ls.duration}
                  </div>
                </div>
                {enrolled
                  ? <Link to={`/player/${course._id}?lesson=${i}`} className="btn btn-sm btn-outline-primary"
                      style={{ borderRadius: 7, fontSize: 12 }}>
                      <i className="bi bi-play-circle me-1"></i>Play
                    </Link>
                  : <i className="bi bi-lock" style={{ color: "var(--gray-300)" }}></i>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
