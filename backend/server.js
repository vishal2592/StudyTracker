require("dotenv").config();
const express = require("express");
const path = require("path");



const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const studyRoutes = require("./routes/study.route");
const dailyTargetRoutes = require("./routes/dailyTarget.route");
const habitRoutes = require("./routes/habit.route");
const loginHistoryRoutes = require("./routes/loginHistory.route");
const subjectTrackerRoutes = require("./routes/subjectTracker.route");
const targetRoutes = require("./routes/target.route");

const app = express();
//middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://studytracker.codivox.in",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/targets", dailyTargetRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/login-history", loginHistoryRoutes);
app.use("/api/subject-tracker", subjectTrackerRoutes);
app.use("/api/target", targetRoutes);


app.use(express.static(path.join(__dirname, "../Client/dist")));

// React SPA fallback

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../Client/dist/index.html")
  );
});


//server
const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
