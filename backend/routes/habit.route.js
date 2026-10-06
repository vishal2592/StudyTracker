const express = require("express");

const {
  createHabit,
  getHabits,
  toggleHabit,
  editHabit,
  deleteHabit,
} = require("../controller/habit.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();
// create habits
router.post("/", authMiddleware, createHabit);
// get habits
router.get("/", authMiddleware, getHabits);
//toogle habits
router.patch("/:habitId/toggle", authMiddleware, toggleHabit);

// EDIT HABIT
router.patch("/:habitId", authMiddleware, editHabit);

// DELETE HABIT
router.delete("/:habitId", authMiddleware, deleteHabit);

module.exports = router;
