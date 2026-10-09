const User = require("../models/user.model");

const getTargetCountdown = async (req, res) => {
  try {
    // Logged-in user ID JWT middleware se milegi
    const userId = req.user.userId;

    // User find karo
    const user = await User.findById(userId).select("neetExamDate createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check NEET exam date
    if (!user.neetExamDate) {
      return res.status(400).json({
        success: false,
        message: "NEET exam date is not set",
      });
    }

    const currentTime = new Date();
    const examDate = new Date(user.neetExamDate);

    // Remaining milliseconds
    const remainingMilliseconds = examDate.getTime() - currentTime.getTime();

    // Exam date already passed
    if (remainingMilliseconds <= 0) {
      return res.status(200).json({
        success: true,
        message: "NEET exam date has passed",
        target: {
          examDate: user.neetExamDate,
          registrationDate: user.createdAt,
          remaining: {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
        },
      });
    }

    // Convert milliseconds
    const totalSeconds = Math.floor(remainingMilliseconds / 1000);

    const days = Math.floor(totalSeconds / (24 * 60 * 60));

    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));

    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

    const seconds = totalSeconds % 60;

    // Response
    return res.status(200).json({
      success: true,
      target: {
        examDate: user.neetExamDate,
        registrationDate: user.createdAt,
        remaining: {
          days,
          hours,
          minutes,
          seconds,
        },
      },
    });
  } catch (error) {
    console.error("Target Countdown Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getTargetCountdown,
};