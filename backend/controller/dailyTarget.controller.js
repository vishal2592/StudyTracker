const DailyTarget = require("../models/dailyTarget.model");

// CREATE DAILY TARGET
// CREATE DAILY TARGET

const createTarget = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { title, durationMinutes, date } = req.body;

    // Title Required
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target title is required",
      });
    }

    // Duration Required
    if (
      durationMinutes === undefined ||
      durationMinutes === null ||
      durationMinutes === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Target duration is required",
      });
    }

    // Validate Duration
    const duration = Number(durationMinutes);

    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target duration must be greater than 0 minutes",
      });
    }

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

    // Convert Date to IST Day
    const targetDate = new Date(`${date}T00:00:00+05:30`);

    // Create Target
    const target = await DailyTarget.create({
      user: userId,
      title: title.trim(),
      durationMinutes: duration,
      date: targetDate,
      isCompleted: false,
      completedAt: null,
    });

    return res.status(201).json({
      success: true,
      message: "Daily target created successfully",
      target,
    });
  } catch (error) {
    console.error("Create Target Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create daily target",
      error: error.message,
    });
  }
};
// GET DAILY TARGETS

const getTargets = async (req, res) => {
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

    // Validate Date

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

    // Find Targets

    const targets = await DailyTarget.find({
      user: userId,
      date: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    }).sort({
      createdAt: 1,
    });

    // Calculate Counts

    const totalTargets = targets.length;

    const completedTargets = targets.filter(
      (target) => target.isCompleted,
    ).length;

    const pendingTargets = totalTargets - completedTargets;

    // Score

    const positiveScore = completedTargets;

    const negativeScore = pendingTargets * -1;

    // Response

    return res.status(200).json({
      success: true,
      date,
      totalTargets,
      completedTargets,
      pendingTargets,
      targetCount: `${completedTargets}/${totalTargets}`,
      positiveScore,
      negativeScore,
      targets,
    });
  } catch (error) {
    console.error("Get Targets Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get daily targets",
      error: error.message,
    });
  }
};

// TOGGLE TARGET

const toggleTarget = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { id } = req.params;

    // Find Target

    const target = await DailyTarget.findOne({
      _id: id,
      user: userId,
    });

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Target not found",
      });
    }

    // Toggle Completion

    target.isCompleted = !target.isCompleted;

    if (target.isCompleted) {
      target.completedAt = new Date();
    } else {
      target.completedAt = null;
    }

    await target.save();

    return res.status(200).json({
      success: true,
      message: target.isCompleted
        ? "Target completed successfully"
        : "Target marked as incomplete",
      target,
    });
  } catch (error) {
    console.error("Toggle Target Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update target",
      error: error.message,
    });
  }
};

// DELETE TARGET

const deleteTarget = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { id } = req.params;

    // Find and Delete

    const target = await DailyTarget.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Target not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Target deleted successfully",
    });
  } catch (error) {
    console.error("Delete Target Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete target",
      error: error.message,
    });
  }
};

// EDIT DAILY TARGET

const editTarget = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { id } = req.params;
    const { title, date } = req.body;

    // Title Required
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target title is required",
      });
    }

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

    // Convert Date to IST Day
    const targetDate = new Date(`${date}T00:00:00+05:30`);

    // Find Target
    const target = await DailyTarget.findOne({
      _id: id,
      user: userId,
    });

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Target not found",
      });
    }

    // Update Target
    target.title = title.trim();
    target.date = targetDate;

    await target.save();

    return res.status(200).json({
      success: true,
      message: "Daily target updated successfully",
      target,
    });
  } catch (error) {
    console.error("Edit Target Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update daily target",
      error: error.message,
    });
  }
};
// EXPORT

module.exports = {
  createTarget,
  getTargets,
  toggleTarget,
  deleteTarget,
  editTarget,
};
