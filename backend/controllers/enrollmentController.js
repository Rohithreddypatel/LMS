const Enrollment = require("../models/Enrollment");
const Course     = require("../models/Course");

exports.enroll = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (await Enrollment.findOne({ user: req.user._id, course: courseId }))
      return res.status(400).json({ success: false, message: "Already enrolled" });
    const enrollment = await Enrollment.create({ user: req.user._id, course: courseId });
    await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });
    res.status(201).json({ success: true, data: enrollment });
  } catch (err) { next(err); }
};

exports.getMy = async (req, res, next) => {
  try {
    const list = await Enrollment.find({ user: req.user._id }).populate("course").sort("-enrolledAt");
    res.json({ success: true, data: list });
  } catch (err) { next(err); }
};

exports.check = async (req, res, next) => {
  try {
    const e = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
    res.json({ success: true, isEnrolled: !!e, data: e || null });
  } catch (err) { next(err); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { lessonIndex } = req.body;
    const e = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
    if (!e) return res.status(404).json({ success: false, message: "Enrollment not found" });
    if (!e.completedLessons.includes(lessonIndex)) e.completedLessons.push(lessonIndex);
    const course = await Course.findById(req.params.courseId);
    const total  = course?.lessons?.length || 1;
    e.progressPercent = Math.round((e.completedLessons.length / total) * 100);
    e.completed       = e.progressPercent === 100;
    await e.save();
    res.json({ success: true, data: { progressPercent: e.progressPercent, completed: e.completed } });
  } catch (err) { next(err); }
};

exports.adminGetAll = async (req, res, next) => {
  try {
    const list = await Enrollment.find()
      .populate("user",   "name email")
      .populate("course", "title category")
      .sort("-enrolledAt");
    res.json({ success: true, count: list.length, data: list });
  } catch (err) { next(err); }
};
