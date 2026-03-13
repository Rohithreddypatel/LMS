const User       = require("../models/User");
const Enrollment = require("../models/Enrollment");

exports.stats = async (req, res, next) => {
  try {
    const [totalUsers, totalStudents, totalAdmins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "admin" }),
    ]);
    res.json({ success: true, data: { totalUsers, totalStudents, totalAdmins } });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().sort("-createdAt");
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { name, email, role, isActive }, { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await Enrollment.deleteMany({ user: req.params.id });
    res.json({ success: true, message: "User deleted" });
  } catch (err) { next(err); }
};
