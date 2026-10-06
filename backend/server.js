require("dotenv").config();
const express = require("express");

const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const studyRoutes = require("./routes/study.route");
const dailyTargetRoutes = require("./routes/dailyTarget.route");
const habitRoutes = require("./routes/habit.route");
const loginHistoryRoutes = require("./routes/loginHistory.route");
const app = express();
//middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/targets", dailyTargetRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/login-history", loginHistoryRoutes);
app.get("/", (req, res) => {
  res.json({
    Message: "NEET Journey 2028 is running",
  });
});

//server
const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
