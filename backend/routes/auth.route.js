const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controller/auth.controller");

const protect = require("../middleware/auth.middleware");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
module.exports = router;
