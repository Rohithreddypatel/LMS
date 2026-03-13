const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  duration: { type: String, required: true },
  videoUrl: { type: String, default: "#" },
  order:    { type: Number, required: true },
});

const CourseSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor:  { type: String, required: true, trim: true },
  thumbnail:   { type: String, default: "" },
  duration:    { type: String, required: true },
  category: {
    type: String, required: true,
    enum: ["Web Development","Data Science","Design","DevOps","Mobile","AI/ML"],
  },
  level: {
    type: String, required: true,
    enum: ["Beginner","Intermediate","Advanced"],
  },
  price:       { type: Number, default: 0 },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  students:    { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  lessons:     [LessonSchema],
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);
