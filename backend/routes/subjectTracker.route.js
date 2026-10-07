const express = require("express");

const {
  getSubjectTracker,
} = require("../controller/subjectTracker.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getSubjectTracker);

module.exports = router;
