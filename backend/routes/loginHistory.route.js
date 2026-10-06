const express = require("express");

const { getLoginHistory } = require("../controller/loginHistory.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// GET LOGIN HISTORY
router.get("/", authMiddleware, getLoginHistory);

module.exports = router;
