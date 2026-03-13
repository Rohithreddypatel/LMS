import { Link } from "react-router-dom";

const levelCls = { Beginner: "lbadge-green", Intermediate: "lbadge-blue", Advanced: "lbadge-red" };

export default function CourseCard({ course, progress }) {
  const enrolled = progress !== undefined;
  return (
    <div className="card card-hover h-100 border-0">
      <img
        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"}
        alt={course.title}
        className="course-card-img"
        onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"; }}
      />
      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex gap-2 mb-2 flex-wrap">
          <span className={`lbadge ${levelCls[course.level] || "lbadge-gray"}`}>{course.level}</span>
          <span className="lbadge lbadge-sky">{course.category}</span>
        </div>
        <h6 className="fw-600 mb-1 lh-sm" style={{ fontSize: "0.9rem" }}>{course.title}</h6>
        <p className="mb-2" style={{
          fontSize: "0.8rem", color: "var(--gray-500)",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>{course.description}</p>
        <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: 12, color: "var(--gray-500)" }}>
          <span><i className="bi bi-person me-1"></i>{course.instructor}</span>
          <span className="ms-auto"><i className="bi bi-clock me-1"></i>{course.duration}</span>
        </div>
        <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 12, color: "var(--gray-500)" }}>
          <i className="bi bi-star-fill text-warning" style={{ fontSize: 11 }}></i>
          <span className="fw-600" style={{ color: "var(--gray-700)" }}>{course.rating}</span>
          <span>·</span>
          <span>{(course.students || 0).toLocaleString()} students</span>
        </div>
        {enrolled && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12 }}>
              <span style={{ color: "var(--gray-500)" }}>Progress</span>
              <span className="fw-600" style={{ color: "var(--blue)" }}>{progress}%</span>
            </div>
            <div className="progress" style={{ height: 5 }}>
              <div className={`progress-bar ${progress === 100 ? "prog-green" : "prog-blue"}`}
                style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
        <Link
          to={enrolled ? `/player/${course._id}` : `/course/${course._id}`}
          className={`btn btn-sm mt-auto ${enrolled ? "btn-primary" : "btn-outline-primary"}`}
          style={{ borderRadius: 8, fontWeight: 500 }}>
          {enrolled ? (progress === 100 ? "Review Course" : "Continue") : "View Details"}
        </Link>
      </div>
    </div>
  );
}
