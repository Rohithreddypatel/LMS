require("dotenv").config();
const mongoose  = require("mongoose");
const bcrypt    = require("bcryptjs");
const connectDB = require("../config/db");
const User      = require("../models/User");
const Course    = require("../models/Course");

const courses = [
  {
    title: "React & Modern JavaScript",
    description: "Master React 18 with hooks, context, React Router, and real-world project patterns using ES2023+.",
    instructor: "Sarah Chen", duration: "12 hrs", category: "Web Development", level: "Intermediate",
    rating: 4.8, students: 1240,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop",
    lessons: [
      { title: "Introduction & Setup",    duration: "18 min", order: 1 },
      { title: "Components & JSX",        duration: "22 min", order: 2 },
      { title: "useState & useEffect",    duration: "28 min", order: 3 },
      { title: "React Router v6",         duration: "30 min", order: 4 },
      { title: "Context API & Zustand",   duration: "25 min", order: 5 },
      { title: "Building & Deploying",    duration: "20 min", order: 6 },
    ],
  },
  {
    title: "Python for Data Science",
    description: "Learn Python, NumPy, Pandas, and Matplotlib through hands-on data analysis projects.",
    instructor: "Marcus Johnson", duration: "18 hrs", category: "Data Science", level: "Beginner",
    rating: 4.9, students: 2310,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop",
    lessons: [
      { title: "Python Fundamentals",     duration: "40 min", order: 1 },
      { title: "NumPy Arrays",            duration: "35 min", order: 2 },
      { title: "Pandas DataFrames",       duration: "45 min", order: 3 },
      { title: "Data Visualization",      duration: "38 min", order: 4 },
      { title: "Real Dataset Analysis",   duration: "50 min", order: 5 },
    ],
  },
  {
    title: "UI/UX Design with Figma",
    description: "Design thinking, wireframing, prototyping, and creating professional design systems in Figma.",
    instructor: "Priya Sharma", duration: "9 hrs", category: "Design", level: "Beginner",
    rating: 4.7, students: 890,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop",
    lessons: [
      { title: "Design Thinking Process", duration: "20 min", order: 1 },
      { title: "Figma Interface",         duration: "25 min", order: 2 },
      { title: "Color Theory",            duration: "18 min", order: 3 },
      { title: "Typography Systems",      duration: "22 min", order: 4 },
      { title: "Prototypes & Handoff",    duration: "35 min", order: 5 },
    ],
  },
  {
    title: "Docker & Kubernetes",
    description: "Containerize and orchestrate applications. Learn CI/CD, Helm charts, and cloud-native deployments.",
    instructor: "Alex Rivera", duration: "15 hrs", category: "DevOps", level: "Advanced",
    rating: 4.6, students: 620,
    thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&auto=format&fit=crop",
    lessons: [
      { title: "Docker Fundamentals",     duration: "30 min", order: 1 },
      { title: "Docker Compose",          duration: "35 min", order: 2 },
      { title: "Kubernetes Overview",     duration: "40 min", order: 3 },
      { title: "Deployments & Services",  duration: "38 min", order: 4 },
      { title: "Helm Charts",             duration: "32 min", order: 5 },
    ],
  },
  {
    title: "Machine Learning with TensorFlow",
    description: "Neural networks, CNNs, RNNs and full model deployment using TensorFlow 2.x and Keras.",
    instructor: "Dr. Aisha Patel", duration: "25 hrs", category: "AI/ML", level: "Advanced",
    rating: 4.9, students: 1530,
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&auto=format&fit=crop",
    lessons: [
      { title: "ML Fundamentals",         duration: "45 min", order: 1 },
      { title: "Neural Networks",         duration: "55 min", order: 2 },
      { title: "CNNs for Vision",         duration: "60 min", order: 3 },
      { title: "Sequence Models",         duration: "50 min", order: 4 },
      { title: "Model Deployment",        duration: "40 min", order: 5 },
    ],
  },
  {
    title: "Flutter Mobile Development",
    description: "Build cross-platform iOS and Android apps from a single Dart codebase with Firebase integration.",
    instructor: "Kai Nakamura", duration: "20 hrs", category: "Mobile", level: "Intermediate",
    rating: 4.8, students: 980,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop",
    lessons: [
      { title: "Dart Language Basics",    duration: "35 min", order: 1 },
      { title: "Flutter Widgets",         duration: "40 min", order: 2 },
      { title: "State Management",        duration: "45 min", order: 3 },
      { title: "Firebase Integration",    duration: "50 min", order: 4 },
      { title: "Publishing the App",      duration: "28 min", order: 5 },
    ],
  },
];

async function seed() {
  await connectDB();
  try {
    await Course.deleteMany({});
    await User.deleteOne({ email: "admin@learnify.com" });

    const inserted = await Course.insertMany(courses);
    console.log(`  ${inserted.length} courses seeded`);

    await User.create({
      name: "Admin",
      email: "admin@learnify.com",
      password: "admin123",
      role: "admin",
    });
    console.log("  Admin user → admin@learnify.com / admin123");
    console.log("\n  Seed complete! Run: npm run dev\n");
  } catch (err) {
    console.error("  Seed error:", err.message);
  } finally {
    await mongoose.connection.close();
  }
}

seed();