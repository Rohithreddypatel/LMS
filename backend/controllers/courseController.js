const Course     = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// GET /api/courses  – public, supports ?search= &category= &level=
exports.getAll = async (req, res, next) => {
  try {
    const { search, category, level } = req.query;
    const q = { isPublished: true };
    if (category && category !== "All") q.category = category;
    if (level    && level    !== "All") q.level    = level;
    if (search)  q.title = { $regex: search, $options: "i" };
    const courses = await Course.find(q).select("-lessons").sort("-createdAt");
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) { next(err); }
};

// GET /api/courses/admin/all – admin: all including unpublished
exports.adminGetAll = async (req, res, next) => {
  try {
    const courses = await Course.find().sort("-createdAt");
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) { next(err); }
};

// GET /api/courses/meta/categories
exports.categories = async (req, res, next) => {
  try {
    const cats = await Course.distinct("category");
    res.json({ success: true, data: ["All", ...cats.sort()] });
  } catch (err) { next(err); }
};

// GET /api/courses/:id
exports.getOne = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};

// POST /api/courses
exports.create = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) { next(err); }
};

// PUT /api/courses/:id
exports.update = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};

// DELETE /api/courses/:id
exports.remove = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    await Enrollment.deleteMany({ course: req.params.id });
    res.json({ success: true, message: "Course deleted" });
  } catch (err) { next(err); }
};
