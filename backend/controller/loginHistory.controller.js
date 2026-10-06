const LoginHistory = require("../models/loginHistory.model");

// GET LOGIN HISTORY

const getLoginHistory = async (req, res) => {
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

    // Find Login History
    const loginHistory = await LoginHistory.find({
      user: userId,
      loginTime: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    }).sort({
      loginTime: 1,
    });

    return res.status(200).json({
      success: true,
      date,
      timezone: "Asia/Kolkata",
      totalLogins: loginHistory.length,
      loginHistory,
    });
  } catch (error) {
    console.error("Get Login History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get login history",
      error: error.message,
    });
  }
};

module.exports = {
  getLoginHistory,
};
