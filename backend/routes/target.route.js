const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { getTargetCountdown } = require("../controller/target.controller");

// Get NEET target countdown
router.get("/countdown", protect, getTargetCountdown);

module.exports = router;