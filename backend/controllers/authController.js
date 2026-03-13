const User          = require("../models/User");
const generateToken = require("../utils/generateToken");

const fmt = (user, token) => ({
  success: true, token,
  user: { _id: user._id, name: user.name, email: user.email, role: user.role },
});

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name, email, password });
    res.status(201).json(fmt(user, generateToken(user._id)));
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account deactivated. Contact admin." });
    res.json(fmt(user, generateToken(user._id)));
  } catch (err) { next(err); }
};

exports.getMe = (req, res) => {
  const u = req.user;
  res.json({ success: true, user: { _id: u._id, name: u.name, email: u.email, role: u.role } });
};
