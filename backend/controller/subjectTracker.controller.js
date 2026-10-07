const StudySession = require("../models/studySession.model");

const getSubjectTracker = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date } = req.query;

    // Date required
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // YYYY-MM-DD validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Selected date ko IST day-end tak lena hai
    const startOfMonthUTC = new Date(`${date.slice(0, 7)}-01T00:00:00+05:30`);

    const endOfSelectedDateUTC = new Date(`${date}T23:59:59.999+05:30`);

    // Completed study sessions
    const sessions = await StudySession.find({
      user: userId,
      status: "completed",
      startTime: {
        $gte: startOfMonthUTC,
        $lte: endOfSelectedDateUTC,
      },
    })
      .sort({ startTime: 1 })
      .lean();

    // Subject-wise duration
    const subjectWise = {
      Biology: 0,
      Physics: 0,
      Chemistry: 0,
      "Mock Test": 0,
      Other: 0,
    };

    // Total study duration
    let totalStudyMinutes = 0;

    sessions.forEach((session) => {
      const duration = session.durationMinutes || 0;

      totalStudyMinutes += duration;

      if (subjectWise[session.subject] !== undefined) {
        subjectWise[session.subject] += duration;
      }
    });

    // Convert minutes to hours
    const subjectWiseHours = {};

    Object.keys(subjectWise).forEach((subject) => {
      subjectWiseHours[subject] = Number(
        (subjectWise[subject] / 60).toFixed(2),
      );
    });

    const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

    return res.status(200).json({
      success: true,

      selectedDate: date,

      period: {
        startDate: `${date.slice(0, 7)}-01`,
        endDate: date,
      },

      timezone: "Asia/Kolkata",

      totalStudyMinutes,
      totalStudyHours,

      subjectWise,
      subjectWiseHours,
    });
  } catch (error) {
    console.error("Get Subject Tracker Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get subject tracker",
      error: error.message,
    });
  }
};

module.exports = {
  getSubjectTracker,
};
