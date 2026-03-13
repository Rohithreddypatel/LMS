import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

// Real YouTube videos matched to each course category & lesson topic
const COURSE_VIDEOS = {
  "Web Development": [
    "https://www.youtube.com/embed/w7ejDZ8SWv8",  // React crash course
    "https://www.youtube.com/embed/Ke90Tje7VS0",  // React & JS
    "https://www.youtube.com/embed/jS4aFq5-91M",  // JS full course
    "https://www.youtube.com/embed/PkZNo7MFNFg",  // JS for beginners
    "https://www.youtube.com/embed/DHvZLI7Db8E",  // React hooks
    "https://www.youtube.com/embed/1wZoGFF_oi4",  // React router
  ],
  "Data Science": [
    "https://www.youtube.com/embed/LHBE6Q9XlzI",  // Python for data science
    "https://www.youtube.com/embed/vmEHCJofslg",  // NumPy tutorial
    "https://www.youtube.com/embed/e9h-ZZ_ahRg",  // Pandas tutorial
    "https://www.youtube.com/embed/a9UrKTVEeZA",  // Matplotlib
    "https://www.youtube.com/embed/r-uOLxNrNk8",  // Data analysis
    "https://www.youtube.com/embed/GPVsHOlRBBI",  // Python data
  ],
  "Design": [
    "https://www.youtube.com/embed/FTFaQWZBqQ8",  // Figma full course
    "https://www.youtube.com/embed/eZJOSK4gXl4",  // UI/UX design
    "https://www.youtube.com/embed/c9Wg6Cb_YlU",  // Figma tutorial
    "https://www.youtube.com/embed/Obe-ZAEb9XY",  // Design systems
    "https://www.youtube.com/embed/II-6dDzc-80",  // Color theory
    "https://www.youtube.com/embed/dORmRoIL66U",  // Typography
  ],
  "DevOps": [
    "https://www.youtube.com/embed/fqMOX6JJhGo",  // Docker full course
    "https://www.youtube.com/embed/Wf2eSG3owoA",  // Docker compose
    "https://www.youtube.com/embed/X48VuDVv0do",  // Kubernetes full course
    "https://www.youtube.com/embed/s_o8dwzRlu4",  // K8s deployments
    "https://www.youtube.com/embed/eyvLwK5C2dw",  // Helm charts
    "https://www.youtube.com/embed/1eVy_iWrc20",  // CI/CD pipeline
  ],
  "AI/ML": [
    "https://www.youtube.com/embed/tPYj3fFJGjk",  // TensorFlow tutorial
    "https://www.youtube.com/embed/aircAruvnKk",  // Neural networks 3B1B
    "https://www.youtube.com/embed/CS4cs9xVecg",  // CNN explained
    "https://www.youtube.com/embed/SEnXr6v2ifU",  // RNN/LSTM
    "https://www.youtube.com/embed/qFJeN9V1ZsI",  // ML deployment
    "https://www.youtube.com/embed/i_LwzRVP7bg",  // Keras tutorial
  ],
  "Mobile": [
    "https://www.youtube.com/embed/1ukSR1GRtMU",  // Flutter full course
    "https://www.youtube.com/embed/x0uinJvhNxI",  // Flutter widgets
    "https://www.youtube.com/embed/CDwjeBRYQkc",  // Flutter state
    "https://www.youtube.com/embed/sfA3NWDBPZ4",  // Firebase Flutter
    "https://www.youtube.com/embed/dHvl-bYBqZc",  // Flutter animations
    "https://www.youtube.com/embed/c1xLMaTUWCY",  // Flutter publish
  ],
};

const DEFAULT_VIDEOS = [
  "https://www.youtube.com/embed/w7ejDZ8SWv8",
  "https://www.youtube.com/embed/tPYj3fFJGjk",
  "https://www.youtube.com/embed/fqMOX6JJhGo",
  "https://www.youtube.com/embed/1ukSR1GRtMU",
  "https://www.youtube.com/embed/FTFaQWZBqQ8",
  "https://www.youtube.com/embed/LHBE6Q9XlzI",
];

export default function Player() {
  const { id }   = useParams();
  const [sp]     = useSearchParams();
  const navigate = useNavigate();

  const [course, setCourse]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeIdx, setActiveIdx] = useState(parseInt(sp.get("lesson") || "0"));
  const [done, setDone]           = useState(new Set());
  const [progress, setProgress]   = useState(0);
  const [marking, setMarking]     = useState(false);
  const [showSide, setShowSide]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/enrollments/check/${id}`),
    ]).then(([cr, er]) => {
      if (!er.data.isEnrolled) { navigate(`/course/${id}`); return; }
      setCourse(cr.data.data);
      const e = er.data.data;
      setDone(new Set(e?.completedLessons || []));
      setProgress(e?.progressPercent || 0);
    }).catch(() => navigate("/")).finally(() => setLoading(false));
  }, [id]);

  const markComplete = async () => {
    if (done.has(activeIdx) || marking) return;
    setMarking(true);
    try {
      const { data } = await api.put(`/enrollments/${id}/progress`, { lessonIndex: activeIdx });
      const nd = new Set(done); nd.add(activeIdx);
      setDone(nd);
      setProgress(data.data.progressPercent);
    } catch {}
    finally { setMarking(false); }
  };

  const goTo = (idx) => {
    setActiveIdx(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="text-center text-white">
        <div className="spinner-border text-primary mb-3"></div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Loading course…</p>
      </div>
    </div>
  );
  if (!course) return null;

  const lesson   = course.lessons?.[activeIdx];
  const total    = course.lessons?.length || 1;
  const isLast   = activeIdx === total - 1;
  const isFirst  = activeIdx === 0;

  // Pick video based on category, fallback to default
  const videoPool = COURSE_VIDEOS[course.category] || DEFAULT_VIDEOS;
  const videoUrl  = (videoPool[activeIdx] || videoPool[activeIdx % videoPool.length]) +
    "?autoplay=1&rel=0&modestbranding=1";

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ──────────────────────────────── */}
      <div style={{
        background: "#0f172a",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 16px", height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/my-courses" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.65)", textDecoration: "none",
            fontSize: 13, fontWeight: 500,
          }}>
            <i className="bi bi-arrow-left"></i> Back
          </Link>
          <span style={{
            color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 14,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320,
          }} className="d-none d-md-block">
            {course.title}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="d-none d-sm-flex">
            <div style={{ width: 120, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99, width: `${progress}%`,
                background: progress === 100 ? "#34d399" : "#3b82f6",
                transition: "width 0.5s ease",
              }} />
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", minWidth: 34 }}>{progress}%</span>
          </div>
          <button onClick={() => setShowSide(s => !s)}
            className="d-none d-lg-flex"
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent", cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>
            <i className="bi bi-layout-sidebar-reverse"></i>
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* ── Main ─────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>

          {/* YouTube embed */}
          <div style={{ background: "#000", width: "100%", position: "relative" }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                key={`${id}-${activeIdx}`}
                src={videoUrl}
                title={lesson?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "100%", height: "100%", border: "none",
                }}
              />
            </div>
          </div>

          {/* Lesson info */}
          <div style={{ background: "#1e293b", padding: "20px 24px", flexShrink: 0 }}>
            <div style={{ maxWidth: 900 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 5px" }}>
                Lesson {activeIdx + 1} of {total} · {course.category}
              </p>
              <h4 style={{
                color: "#fff", fontWeight: 700, margin: "0 0 16px",
                fontSize: "clamp(1rem,3vw,1.3rem)", letterSpacing: "-0.02em",
              }}>
                {lesson?.title}
              </h4>

              {/* Control buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {!isFirst && (
                  <button onClick={() => goTo(activeIdx - 1)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent", color: "rgba(255,255,255,0.65)",
                    cursor: "pointer", fontSize: 14, fontWeight: 500,
                  }}>
                    <i className="bi bi-arrow-left"></i> Previous
                  </button>
                )}

                <button onClick={markComplete} disabled={done.has(activeIdx) || marking} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 20px", borderRadius: 9,
                  border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  background: done.has(activeIdx) ? "#059669" : "#1d4ed8",
                  color: "#fff", opacity: marking ? 0.7 : 1,
                }}>
                  {marking
                    ? <><span className="spinner-border spinner-border-sm"></span> Saving…</>
                    : done.has(activeIdx)
                      ? <><i className="bi bi-check-circle-fill"></i> Completed</>
                      : <><i className="bi bi-check-circle"></i> Mark Complete</>}
                </button>

                {!isLast && (
                  <button onClick={() => goTo(activeIdx + 1)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent", color: "rgba(255,255,255,0.65)",
                    cursor: "pointer", fontSize: 14, fontWeight: 500,
                  }}>
                    Next <i className="bi bi-arrow-right"></i>
                  </button>
                )}

                {isLast && done.has(activeIdx) && (
                  <Link to="/my-courses" style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "8px 20px", borderRadius: 9,
                    background: "#059669", color: "#fff",
                    textDecoration: "none", fontWeight: 600, fontSize: 14,
                  }}>
                    <i className="bi bi-trophy-fill"></i> Course Complete!
                  </Link>
                )}

                <span style={{ marginLeft: "auto", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                  <i className="bi bi-clock me-1"></i>{lesson?.duration}
                </span>
              </div>

              {/* About box */}
              <div style={{
                marginTop: 18, padding: "14px 18px",
                borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.03)",
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  About This Lesson
                </p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.7 }}>
                  This lesson covers <strong style={{ color: "rgba(255,255,255,0.6)" }}>{lesson?.title}</strong> as part of the{" "}
                  <strong style={{ color: "rgba(255,255,255,0.6)" }}>{course.title}</strong> course.
                  Watch the full video, then click <em>Mark Complete</em> to track your progress.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile lesson list */}
          <div className="d-lg-none" style={{ background: "#0f172a", padding: "16px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              All Lessons
            </p>
            {course.lessons?.map((ls, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "10px 12px", marginBottom: 4,
                borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                background: i === activeIdx ? "rgba(29,78,216,0.25)" : "rgba(255,255,255,0.03)",
                borderLeft: `3px solid ${i === activeIdx ? "#3b82f6" : "transparent"}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "#fff",
                  background: done.has(i) ? "#059669" : i === activeIdx ? "#1d4ed8" : "rgba(255,255,255,0.08)",
                }}>
                  {done.has(i) ? <i className="bi bi-check-lg" style={{ fontSize: 11 }}></i> : i + 1}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    color: i === activeIdx ? "#fff" : "rgba(255,255,255,0.55)",
                  }}>{ls.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
                    <i className="bi bi-clock me-1"></i>{ls.duration}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Sidebar (desktop) ────────────────── */}
        {showSide && (
          <div className="d-none d-lg-flex" style={{
            width: 300, flexShrink: 0,
            background: "#1e293b",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: "0 0 8px" }}>Course Content</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99, width: `${progress}%`,
                    background: progress === 100 ? "#34d399" : "#3b82f6",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", minWidth: 36 }}>
                  {done.size}/{total}
                </span>
              </div>
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {course.lessons?.map((ls, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  width: "100%", padding: "13px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  border: "none", cursor: "pointer", textAlign: "left",
                  background: i === activeIdx ? "rgba(29,78,216,0.2)" : "transparent",
                  borderLeft: `3px solid ${i === activeIdx ? "#3b82f6" : "transparent"}`,
                  transition: "background 0.12s",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 12, color: "#fff",
                    background: done.has(i) ? "#059669"
                      : i === activeIdx ? "#1d4ed8"
                      : "rgba(255,255,255,0.07)",
                  }}>
                    {done.has(i)
                      ? <i className="bi bi-check-lg" style={{ fontSize: 11 }}></i>
                      : i + 1}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{
                      fontSize: 13, fontWeight: 500, lineHeight: 1.4, marginBottom: 3,
                      color: i === activeIdx ? "#fff" : "rgba(255,255,255,0.6)",
                    }}>
                      {ls.title}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
                      <i className="bi bi-clock me-1"></i>{ls.duration}
                    </div>
                  </div>
                  {i === activeIdx && (
                    <i className="bi bi-play-fill" style={{ fontSize: 10, color: "#3b82f6", marginTop: 5, flexShrink: 0 }}></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}