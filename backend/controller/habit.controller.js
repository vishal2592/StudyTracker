const Habit = require("../models/habit.model");

// CREATE HABIT

const createHabit = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name } = req.body;

    // Name Required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Habit name is required",
      });
    }

    // Check Duplicate Habit
    const existingHabit = await Habit.findOne({
      user: userId,
      name: name.trim(),
      isActive: true,
    });

    if (existingHabit) {
      return res.status(400).json({
        success: false,
        message: "This habit already exists",
      });
    }

    // Create Habit
    const habit = await Habit.create({
      user: userId,
      name: name.trim(),
      points: 5,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    console.error("Create Habit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create habit",
      error: error.message,
    });
  }
};

// GET HABITS

const getHabits = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { date } = req.query;

    // Date Required
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Validate Date Format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // IST Day Boundaries
    const startOfDayUTC = new Date(`${date}T00:00:00+05:30`);
    const endOfDayUTC = new Date(`${date}T23:59:59.999+05:30`);

    // Get Active Habits
    const habits = await Habit.find({
      user: userId,
      isActive: true,
    }).sort({
      createdAt: 1,
    });

    // Get Habit Logs For Selected Date
    const HabitLog = require("../models/habitLog.model");

    const habitLogs = await HabitLog.find({
      user: userId,
      date: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    });

    // Add Daily Completion Status
    const habitsWithStatus = habits.map((habit) => {
      const log = habitLogs.find(
        (habitLog) => habitLog.habit.toString() === habit._id.toString(),
      );

      return {
        _id: habit._id,
        name: habit.name,
        points: habit.points,
        isActive: habit.isActive,
        isCompleted: log ? log.isCompleted : false,
        completedAt: log ? log.completedAt : null,
        logId: log ? log._id : null,
      };
    });

    // Calculate Score
    const totalHabits = habitsWithStatus.length;

    const completedHabits = habitsWithStatus.filter(
      (habit) => habit.isCompleted,
    ).length;

    const pendingHabits = totalHabits - completedHabits;

    const positiveScore = completedHabits * 5;
    const negativeScore = pendingHabits * -5;

    return res.status(200).json({
      success: true,
      date,
      totalHabits,
      completedHabits,
      pendingHabits,
      positiveScore,
      negativeScore,
      habits: habitsWithStatus,
    });
  } catch (error) {
    console.error("Get Habits Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get habits",
      error: error.message,
    });
  }
};

// TOGGLE HABIT

const toggleHabit = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { habitId } = req.params;
    const { date } = req.body;

    // Date Required
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Validate Date Format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // IST Day Boundaries
    const startOfDayUTC = new Date(`${date}T00:00:00+05:30`);
    const endOfDayUTC = new Date(`${date}T23:59:59.999+05:30`);

    // Find Habit
    const habit = await Habit.findOne({
      _id: habitId,
      user: userId,
      isActive: true,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // HabitLog Model
    const HabitLog = require("../models/habitLog.model");

    // Find Existing Log For Selected Date
    let habitLog = await HabitLog.findOne({
      user: userId,
      habit: habitId,
      date: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    });

    // If Log Does Not Exist → Create Completed Log
    if (!habitLog) {
      habitLog = await HabitLog.create({
        user: userId,
        habit: habitId,
        date: startOfDayUTC,
        isCompleted: true,
        completedAt: new Date(),
      });
    }

    // If Log Already Exists → Toggle
    else {
      habitLog.isCompleted = !habitLog.isCompleted;

      if (habitLog.isCompleted) {
        habitLog.completedAt = new Date();
      } else {
        habitLog.completedAt = null;
      }

      await habitLog.save();
    }

    // Score
    const score = habitLog.isCompleted ? habit.points : -habit.points;

    return res.status(200).json({
      success: true,
      message: habitLog.isCompleted
        ? "Habit completed successfully"
        : "Habit marked as incomplete",

      date,

      score,

      habitLog,
    });
  } catch (error) {
    console.error("Toggle Habit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update habit",
      error: error.message,
    });
  }
};

// EDIT HABIT

const editHabit = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { habitId } = req.params;
    const { name } = req.body;

    // Name Required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Habit name is required",
      });
    }

    // Find Habit
    const habit = await Habit.findOne({
      _id: habitId,
      user: userId,
      isActive: true,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // Check Duplicate Habit
    const existingHabit = await Habit.findOne({
      _id: { $ne: habitId },
      user: userId,
      name: name.trim(),
      isActive: true,
    });

    if (existingHabit) {
      return res.status(400).json({
        success: false,
        message: "This habit already exists",
      });
    }

    // Update Name
    habit.name = name.trim();

    // Keep Points Fixed
    habit.points = 5;

    await habit.save();

    return res.status(200).json({
      success: true,
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    console.error("Edit Habit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update habit",
      error: error.message,
    });
  }
};

// DELETE HABIT

const deleteHabit = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { habitId } = req.params;

    // Find Habit
    const habit = await Habit.findOne({
      _id: habitId,
      user: userId,
      isActive: true,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // Soft Delete
    habit.isActive = false;

    await habit.save();

    return res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
      habit,
    });
  } catch (error) {
    console.error("Delete Habit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete habit",
      error: error.message,
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  toggleHabit,
  editHabit,
  deleteHabit,
};
