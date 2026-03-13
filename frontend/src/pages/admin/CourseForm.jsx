import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { Spinner, Toast } from "../../components/Spinner";

const CATS   = ["Web Development","Data Science","Design","DevOps","Mobile","AI/ML"];
const LEVELS = ["Beginner","Intermediate","Advanced"];
const emptyLesson = (i) => ({ title: "", duration: "", videoUrl: "#", order: i + 1 });
const blank = {
  title:"", description:"", instructor:"", thumbnail:"",
  duration:"", category:"Web Development", level:"Beginner",
  price:0, rating:0, isPublished:true,
};

export default function CourseForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [form, setForm]       = useState(blank);
  const [lessons, setLessons] = useState([emptyLesson(0)]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [errs, setErrs]       = useState({});
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "danger") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/courses/${id}`)
      .then(r => {
        const c = r.data.data;
        setForm({ title:c.title, description:c.description, instructor:c.instructor,
          thumbnail:c.thumbnail||"", duration:c.duration, category:c.category,
          level:c.level, price:c.price||0, rating:c.rating||0, isPublished:c.isPublished??true });
        setLessons(c.lessons?.length ? c.lessons.map((l,i)=>({...l,order:l.order||i+1})) : [emptyLesson(0)]);
      })
      .catch(() => navigate("/admin/courses"))
      .finally(() => setFetching(false));
  }, [id]);

  const upd = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrs(e => ({ ...e, [k]: "" })); };
  const updLesson = (i, k, v) => setLessons(p => p.map((l,j) => j===i ? {...l,[k]:v} : l));
  const addLesson    = () => setLessons(p => [...p, emptyLesson(p.length)]);
  const removeLesson = (i) => setLessons(p => p.filter((_,j) => j!==i).map((l,j) => ({...l,order:j+1})));

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.instructor.trim())  e.instructor  = "Required";
    if (!form.duration.trim())    e.duration    = "Required";
    lessons.forEach((l,i) => {
      if (!l.title.trim())    e[`lt${i}`] = "Required";
      if (!l.duration.trim()) e[`ld${i}`] = "Required";
    });
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrs(v); showToast("Please fill in all required fields"); return; }
    setLoading(true);
    try {
      if (isEdit) await api.put(`/courses/${id}`, { ...form, lessons });
      else        await api.post("/courses",      { ...form, lessons });
      navigate("/admin/courses");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save course");
    } finally { setLoading(false); }
  };

  if (fetching) return <Spinner text="Loading course…" />;

  const Field = ({ label, name, req, children }) => (
    <div className="mb-3">
      <label className="form-label">{label} {req && <span style={{ color: "var(--danger)" }}>*</span>}</label>
      {children}
      {errs[name] && <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 3 }}>{errs[name]}</div>}
    </div>
  );

  return (
    <div>
      <Toast msg={toast?.msg} type={toast?.type} />

      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/courses" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8 }}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </Link>
        <div>
          <p className="mb-0 text-sm" style={{ color: "var(--gray-500)" }}>
            {isEdit ? "Edit existing course" : "Create a new course"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Main */}
          <div className="col-xl-8">
            {/* Basic info */}
            <div className="card border-0 mb-4">
              <div className="p-4 border-bottom d-flex align-items-center gap-2">
                <div className="rounded-2 d-flex align-items-center justify-content-center"
                  style={{ width: 28, height: 28, background: "var(--blue-light)" }}>
                  <i className="bi bi-info-circle text-primary" style={{ fontSize: 13 }}></i>
                </div>
                <h6 className="fw-700 mb-0">Course Information</h6>
              </div>
              <div className="p-4">
                <Field label="Title" name="title" req>
                  <input type="text" className={`form-control ${errs.title?"is-invalid":""}`}
                    placeholder="e.g. React & Modern JavaScript"
                    value={form.title} onChange={e => upd("title", e.target.value)}
                    style={{ borderRadius: 10 }} />
                </Field>
                <Field label="Description" name="description" req>
                  <textarea rows={3} className={`form-control ${errs.description?"is-invalid":""}`}
                    placeholder="Describe what students will learn…"
                    value={form.description} onChange={e => upd("description", e.target.value)}
                    style={{ borderRadius: 10 }} />
                </Field>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Field label="Instructor" name="instructor" req>
                      <input type="text" className={`form-control ${errs.instructor?"is-invalid":""}`}
                        placeholder="Instructor name"
                        value={form.instructor} onChange={e => upd("instructor", e.target.value)}
                        style={{ borderRadius: 10 }} />
                    </Field>
                  </div>
                  <div className="col-md-6">
                    <Field label="Duration" name="duration" req>
                      <input type="text" className={`form-control ${errs.duration?"is-invalid":""}`}
                        placeholder="e.g. 12 hrs"
                        value={form.duration} onChange={e => upd("duration", e.target.value)}
                        style={{ borderRadius: 10 }} />
                    </Field>
                  </div>
                  <div className="col-md-4">
                    <Field label="Category" name="category">
                      <select className="form-select" value={form.category}
                        onChange={e => upd("category", e.target.value)} style={{ borderRadius: 10 }}>
                        {CATS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="col-md-4">
                    <Field label="Level" name="level">
                      <select className="form-select" value={form.level}
                        onChange={e => upd("level", e.target.value)} style={{ borderRadius: 10 }}>
                        {LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="col-md-4">
                    <Field label="Price ($)" name="price">
                      <input type="number" min="0" className="form-control" value={form.price}
                        onChange={e => upd("price", Number(e.target.value))} style={{ borderRadius: 10 }} />
                    </Field>
                  </div>
                  <div className="col-12">
                    <Field label="Thumbnail URL" name="thumbnail">
                      <input type="url" className="form-control" placeholder="https://images.unsplash.com/…"
                        value={form.thumbnail} onChange={e => upd("thumbnail", e.target.value)}
                        style={{ borderRadius: 10 }} />
                    </Field>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input type="checkbox" className="form-check-input" id="pub"
                        checked={form.isPublished} onChange={e => upd("isPublished", e.target.checked)} />
                      <label className="form-check-label" htmlFor="pub" style={{ fontSize: 14 }}>
                        Published (visible to students)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="card border-0">
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-2 d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, background: "var(--blue-light)" }}>
                    <i className="bi bi-collection-play text-primary" style={{ fontSize: 13 }}></i>
                  </div>
                  <h6 className="fw-700 mb-0">Lessons <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>({lessons.length})</span></h6>
                </div>
                <button type="button" className="btn btn-sm btn-outline-primary"
                  style={{ borderRadius: 8, fontSize: 13 }} onClick={addLesson}>
                  <i className="bi bi-plus-lg me-1"></i>Add Lesson
                </button>
              </div>
              <div className="p-4">
                {lessons.map((ls, i) => (
                  <div key={i} className="rounded-3 p-3 mb-3"
                    style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="lbadge lbadge-blue">Lesson {i + 1}</span>
                      {lessons.length > 1 && (
                        <button type="button" className="btn btn-sm"
                          style={{ border: "1px solid #fecaca", borderRadius: 7, color: "var(--danger)", padding: "3px 8px" }}
                          onClick={() => removeLesson(i)}>
                          <i className="bi bi-x" style={{ fontSize: 14 }}></i>
                        </button>
                      )}
                    </div>
                    <div className="row g-2">
                      <div className="col-8">
                        <label className="form-label" style={{ fontSize: 12 }}>Title *</label>
                        <input type="text" className={`form-control form-control-sm ${errs[`lt${i}`]?"is-invalid":""}`}
                          placeholder="Lesson title" value={ls.title}
                          onChange={e => updLesson(i, "title", e.target.value)}
                          style={{ borderRadius: 8 }} />
                      </div>
                      <div className="col-4">
                        <label className="form-label" style={{ fontSize: 12 }}>Duration *</label>
                        <input type="text" className={`form-control form-control-sm ${errs[`ld${i}`]?"is-invalid":""}`}
                          placeholder="e.g. 20 min" value={ls.duration}
                          onChange={e => updLesson(i, "duration", e.target.value)}
                          style={{ borderRadius: 8 }} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-outline-secondary btn-sm w-100"
                  style={{ borderRadius: 9, borderStyle: "dashed", fontSize: 13 }} onClick={addLesson}>
                  <i className="bi bi-plus me-1"></i>Add another lesson
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="col-xl-4">
            {/* Preview */}
            {form.thumbnail && (
              <div className="card border-0 mb-4" style={{ overflow: "hidden" }}>
                <div className="p-3 border-bottom"><h6 className="fw-700 mb-0" style={{ fontSize: 14 }}>Thumbnail Preview</h6></div>
                <img src={form.thumbnail} alt="preview"
                  style={{ height: 155, objectFit: "cover", width: "100%" }}
                  onError={e => e.target.style.display = "none"} />
              </div>
            )}

            {/* Summary */}
            <div className="card border-0 mb-4">
              <div className="p-3 border-bottom"><h6 className="fw-700 mb-0" style={{ fontSize: 14 }}>Summary</h6></div>
              <div className="p-3">
                {[
                  { l: "Category", v: form.category },
                  { l: "Level",    v: form.level },
                  { l: "Price",    v: form.price === 0 ? "Free" : `$${form.price}` },
                  { l: "Lessons",  v: lessons.length },
                  { l: "Status",   v: form.isPublished ? "Published" : "Draft" },
                ].map((r, i, a) => (
                  <div key={i} className={`d-flex justify-content-between align-items-center py-2 ${i < a.length-1?"border-bottom":""}`}>
                    <span style={{ fontSize: 13, color: "var(--gray-500)" }}>{r.l}</span>
                    <span className="fw-600" style={{ fontSize: 13 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary py-2" disabled={loading}
                style={{ borderRadius: 10, fontWeight: 600 }}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                  : <><i className={`bi bi-${isEdit?"check-lg":"plus-lg"} me-2`}></i>{isEdit?"Update Course":"Create Course"}</>}
              </button>
              <Link to="/admin/courses" className="btn btn-outline-secondary"
                style={{ borderRadius: 10 }}>Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
