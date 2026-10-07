const Habit = require("../models/habit.model");
const HabitLog = require("../models/habitLog.model");
// CREATE HABIT

// CREATE HABIT

const createHabit = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, reminder, startDate } = req.body;

    // Name Required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Habit name is required",
      });
    }

    // Reminder Validation
    const habitReminder = reminder || "08:00";

    const reminderRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!reminderRegex.test(habitReminder)) {
      return res.status(400).json({
        success: false,
        message: "Reminder must be in HH:MM format",
      });
    }

    // Start Date
    let habitStartDate = new Date();

    if (startDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(startDate)) {
        return res.status(400).json({
          success: false,
          message: "Start date must be in YYYY-MM-DD format",
        });
      }

      habitStartDate = new Date(`${startDate}T00:00:00+05:30`);
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
      reminder: habitReminder,
      category: "Productivity",
      description: "",
      frequency: "Daily",
      startDate: habitStartDate,
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

    const habitLogs = await HabitLog.find({
      user: userId,
      date: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    });

    // Add Selected Date Completion Status
    const habitsWithStatus = habits.map((habit) => {
      const log = habitLogs.find(
        (habitLog) => habitLog.habit.toString() === habit._id.toString(),
      );

      return {
        _id: habit._id,
        name: habit.name,
        reminder: habit.reminder,
        category: habit.category,
        description: habit.description,
        frequency: habit.frequency,
        startDate: habit.startDate,
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
      timezone: "Asia/Kolkata",

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

    // Date required
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Date format validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Find active habit
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

    // IST day boundaries
    const startOfDayUTC = new Date(`${date}T00:00:00+05:30`);

    const endOfDayUTC = new Date(`${date}T23:59:59.999+05:30`);

    // Find existing log for this habit and selected date
    let habitLog = await HabitLog.findOne({
      user: userId,
      habit: habitId,
      date: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    });

    // If log does not exist
    if (!habitLog) {
      habitLog = await HabitLog.create({
        user: userId,
        habit: habitId,
        date: startOfDayUTC,
        isCompleted: true,
        completedAt: new Date(),
      });
    } else {
      // Toggle existing log
      habitLog.isCompleted = !habitLog.isCompleted;

      if (habitLog.isCompleted) {
        habitLog.completedAt = new Date();
      } else {
        habitLog.completedAt = null;
      }

      await habitLog.save();
    }

    // Calculate score
    const score = habitLog.isCompleted ? habit.points : -habit.points;

    return res.status(200).json({
      success: true,
      message: habitLog.isCompleted
        ? "Habit marked as completed"
        : "Habit marked as incomplete",

      date,
      timezone: "Asia/Kolkata",

      habit: {
        _id: habit._id,
        name: habit.name,
        reminder: habit.reminder,
        category: habit.category,
        description: habit.description,
        frequency: habit.frequency,
        points: habit.points,
      },

      habitLog: {
        _id: habitLog._id,
        date: habitLog.date,
        isCompleted: habitLog.isCompleted,
        completedAt: habitLog.completedAt,
      },

      score,
    });
  } catch (error) {
    console.error("Toggle Habit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to toggle habit",
      error: error.message,
    });
  }
};

// EDIT HABIT

const editHabit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { habitId } = req.params;

    const { name, reminder } = req.body;

    // At least one field required
    if ((name === undefined || !name.trim()) && reminder === undefined) {
      return res.status(400).json({
        success: false,
        message: "Habit name or reminder is required",
      });
    }

    // Find habit
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

    // Update name if provided
    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Habit name cannot be empty",
        });
      }

      // Check duplicate habit name
      const existingHabit = await Habit.findOne({
        user: userId,
        name: trimmedName,
        isActive: true,
        _id: { $ne: habitId },
      });

      if (existingHabit) {
        return res.status(400).json({
          success: false,
          message: "This habit already exists",
        });
      }

      habit.name = trimmedName;
    }

    // Update reminder if provided
    if (reminder !== undefined) {
      const reminderRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!reminderRegex.test(reminder)) {
        return res.status(400).json({
          success: false,
          message: "Reminder must be in HH:MM format",
        });
      }

      habit.reminder = reminder;
    }

    await habit.save();

    return res.status(200).json({
      success: true,
      message: "Habit updated successfully",

      habit: {
        _id: habit._id,
        name: habit.name,
        reminder: habit.reminder,
        category: habit.category,
        description: habit.description,
        frequency: habit.frequency,
        startDate: habit.startDate,
        points: habit.points,
        isActive: habit.isActive,
      },
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

    // Find active habit
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

    // Soft delete
    habit.isActive = false;

    await habit.save();

    return res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
      habit: {
        _id: habit._id,
        name: habit.name,
        isActive: habit.isActive,
      },
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
