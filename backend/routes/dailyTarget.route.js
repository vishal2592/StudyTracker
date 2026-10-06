const express = require("express");

const {
  createTarget,
  getTargets,
  toggleTarget,
  deleteTarget,
  editTarget,
} = require("../controller/dailyTarget.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createTarget);

router.get("/", authMiddleware, getTargets);
router.patch("/:id", authMiddleware, editTarget);
router.patch("/:id/toggle", authMiddleware, toggleTarget);

router.delete("/:id", authMiddleware, deleteTarget);

module.exports = router;
