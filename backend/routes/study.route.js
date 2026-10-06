const express = require("express");

const {
  startStudy,
  stopStudy,
  getStudySummary,
} = require("../controller/study.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/start", authMiddleware, startStudy);
router.post("/stop", authMiddleware, stopStudy);
router.get("/summary", authMiddleware, getStudySummary);

module.exports = router;
