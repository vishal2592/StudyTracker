const express = require("express");

const {
  startStudy,
  stopStudy,
  getStudySummary,
  getMonthlyOverview,
  getStudyCalendar,
  getWeeklyStudyHours,
} = require("../controller/study.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/start", authMiddleware, startStudy);
router.post("/stop", authMiddleware, stopStudy);
router.get("/summary", authMiddleware, getStudySummary);
router.get("/monthly", authMiddleware, getMonthlyOverview);
router.get("/calendar", authMiddleware, getStudyCalendar);
router.get("/weekly", authMiddleware, getWeeklyStudyHours);

module.exports = router;
