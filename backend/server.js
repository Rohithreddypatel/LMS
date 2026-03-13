require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");
const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://lms-frontend-ggkw.onrender.com",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/courses",     require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/users",       require("./routes/userRoutes"));

app.get("/api/health", (_, res) => res.json({ success: true, message: "Learnify API running" }));
app.use((_, res)      => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Server  → http://localhost:${PORT}`);
  console.log(`  Health  → http://localhost:${PORT}/api/health\n`);
});
