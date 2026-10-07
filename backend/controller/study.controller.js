const StudySession = require("../models/studySession.model");

// START STUDY

const startStudy = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { subject, lateReason } = req.body;

    // Allowed Subjects

    const allowedSubjects = [
      "Biology",
      "Physics",
      "Chemistry",
      "Mock Test",
      "Other",
    ];

    // Subject Required

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    // Validate Subject

    if (!allowedSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject",
      });
    }

    // Check Running Session

    const runningSession = await StudySession.findOne({
      user: userId,
      status: "running",
    });

    if (runningSession) {
      return res.status(400).json({
        success: false,
        message: "A study session is already running",
        session: runningSession,
      });
    }

    // Actual Start Time

    const actualStartTime = new Date();

    // Find Previous Completed Session

    const previousSession = await StudySession.findOne({
      user: userId,
      status: "completed",
      nextStartTime: { $ne: null },
    }).sort({
      createdAt: -1,
    });

    // Default Values

    let startType = null;
    let scheduleScore = 0;
    let finalLateReason = null;

    // Compare With Planned Start Time

    if (previousSession && previousSession.nextStartTime) {
      const plannedStartTime = new Date(previousSession.nextStartTime);

      // EARLY

      if (actualStartTime < plannedStartTime) {
        startType = "early";
        scheduleScore = 5;
      }

      // ON-TIME
      else if (actualStartTime.getTime() === plannedStartTime.getTime()) {
        startType = "on-time";
        scheduleScore = 0;
      }

      // LATE
      else {
        // Late reason required

        if (!lateReason || !lateReason.trim()) {
          return res.status(400).json({
            success: false,
            message: "You are late. Please provide a reason.",
            plannedStartTime,
            actualStartTime,
            requiresLateReason: true,
          });
        }

        startType = "late";
        scheduleScore = -5;
        finalLateReason = lateReason.trim();
      }
    }

    // Create New Study Session

    const studySession = await StudySession.create({
      user: userId,
      subject,
      startTime: actualStartTime,
      status: "running",

      startType,

      lateReason: finalLateReason,

      scheduleScore,
    });

    // Success Response

    return res.status(201).json({
      success: true,
      message: "Study session started successfully",
      session: studySession,
    });
  } catch (error) {
    console.error("Start Study Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start study session",
      error: error.message,
    });
  }
};

// STOP STUDY

const stopStudy = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { stopReason, nextStartTime } = req.body;

    // Stop Reason Required

    if (!stopReason || !stopReason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Stop reason is required",
      });
    }

    // Next Start Time Required

    if (!nextStartTime) {
      return res.status(400).json({
        success: false,
        message: "Next start time is required",
      });
    }

    // Find Running Session

    const runningSession = await StudySession.findOne({
      user: userId,
      status: "running",
    });

    if (!runningSession) {
      return res.status(404).json({
        success: false,
        message: "No running study session found",
      });
    }

    // Stop Time

    const stopTime = new Date();

    // Calculate Duration

    const durationMilliseconds =
      stopTime.getTime() - runningSession.startTime.getTime();

    const durationMinutes = Math.floor(durationMilliseconds / (1000 * 60));

    // Validate Duration

    if (durationMinutes < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid study duration",
      });
    }

    // Validate Next Start Time

    const plannedNextStartTime = new Date(nextStartTime);

    if (isNaN(plannedNextStartTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid next start time",
      });
    }

    // Update Session

    runningSession.stopTime = stopTime;

    runningSession.durationMinutes = durationMinutes;

    runningSession.stopReason = stopReason.trim();

    runningSession.nextStartTime = plannedNextStartTime;

    runningSession.status = "completed";

    await runningSession.save();

    // Success Response

    return res.status(200).json({
      success: true,
      message: "Study session stopped successfully",
      session: runningSession,
    });
  } catch (error) {
    console.error("Stop Study Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to stop study session",
      error: error.message,
    });
  }
};

// GET STUDY SUMMARY

const getStudySummary = async (req, res) => {
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

    // Validate YYYY-MM-DD Format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Create IST Day Boundaries
    const startOfDayUTC = new Date(`${date}T00:00:00+05:30`);

    const endOfDayUTC = new Date(`${date}T23:59:59.999+05:30`);

    // Find Completed Sessions
    const sessions = await StudySession.find({
      user: userId,
      status: "completed",

      startTime: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    })
      .sort({
        startTime: 1,
      })
      .lean();

    // Calculate Total Minutes
    const totalMinutes = sessions.reduce((total, session) => {
      return total + session.durationMinutes;
    }, 0);

    // Convert Minutes to Hours
    const totalHours = Math.floor(totalMinutes / 60);

    const remainingMinutes = totalMinutes % 60;

    // Subject-wise Study
    const subjectWise = {
      Biology: 0,
      Physics: 0,
      Chemistry: 0,
      "Mock Test": 0,
      Other: 0,
    };

    sessions.forEach((session) => {
      subjectWise[session.subject] += session.durationMinutes;
    });

    // Punctuality Summary
    const earlyStarts = sessions.filter(
      (session) => session.startType === "early",
    ).length;

    const onTimeStarts = sessions.filter(
      (session) => session.startType === "on-time",
    ).length;

    const lateStarts = sessions.filter(
      (session) => session.startType === "late",
    ).length;

    const punctualityPositiveScore = sessions
      .filter((session) => session.startType === "early")
      .reduce((total, session) => {
        return total + session.scheduleScore;
      }, 0);

    const punctualityNegativeScore = sessions
      .filter((session) => session.startType === "late")
      .reduce((total, session) => {
        return total + Math.abs(session.scheduleScore);
      }, 0);

    // Frontend-friendly Session Data
    const formattedSessions = sessions.map((session) => {
      return {
        _id: session._id,
        subject: session.subject,

        startTime: session.startTime,
        stopTime: session.stopTime,

        durationMinutes: session.durationMinutes,

        nextStartTime: session.nextStartTime,

        startType: session.startType,

        lateReason: session.lateReason,

        scheduleScore: session.scheduleScore,
      };
    });

    // Response
    return res.status(200).json({
      success: true,

      date,

      timezone: "Asia/Kolkata",

      totalMinutes,

      totalHours,

      remainingMinutes,

      formattedDuration: `${totalHours}h ${remainingMinutes}m`,

      totalSessions: sessions.length,

      subjectWise,

      punctuality: {
        earlyStarts,
        onTimeStarts,
        lateStarts,
        positiveScore: punctualityPositiveScore,
        negativeScore: punctualityNegativeScore,
      },

      sessions: formattedSessions,
    });
  } catch (error) {
    console.error("Get Study Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get study summary",
      error: error.message,
    });
  }
};

const getMonthlyOverview = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { month } = req.query;

    // Month Required
    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }

    // Validate YYYY-MM Format
    const monthRegex = /^\d{4}-\d{2}$/;

    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must be in YYYY-MM format",
      });
    }

    // MONTH START

    const startOfMonthUTC = new Date(`${month}-01T00:00:00+05:30`);

    // NEXT MONTH

    const [year, monthNumber] = month.split("-").map(Number);

    let nextMonth;
    let nextYear;

    if (monthNumber === 12) {
      nextMonth = 1;
      nextYear = year + 1;
    } else {
      nextMonth = monthNumber + 1;
      nextYear = year;
    }

    const nextMonthString = String(nextMonth).padStart(2, "0");

    const endOfMonthUTC = new Date(
      `${nextYear}-${nextMonthString}-01T00:00:00+05:30`,
    );

    // GET COMPLETED STUDY SESSIONS

    const sessions = await StudySession.find({
      user: userId,
      status: "completed",
      startTime: {
        $gte: startOfMonthUTC,
        $lt: endOfMonthUTC,
      },
    })
      .sort({
        startTime: 1,
      })
      .lean();

    // TOTAL STUDY MINUTES

    const totalStudyMinutes = sessions.reduce((total, session) => {
      return total + session.durationMinutes;
    }, 0);

    // TOTAL STUDY HOURS

    const totalStudyHours = Math.floor(totalStudyMinutes / 60);

    const remainingStudyMinutes = totalStudyMinutes % 60;

    // DAILY STUDY

    const dailyStudy = {};

    sessions.forEach((session) => {
      const dateKey = new Date(session.startTime).toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      if (!dailyStudy[dateKey]) {
        dailyStudy[dateKey] = 0;
      }

      dailyStudy[dateKey] += session.durationMinutes;
    });

    // 12 HOUR DAYS

    const twelveHourDays = Object.values(dailyStudy).filter(
      (minutes) => minutes >= 12 * 60,
    ).length;

    // DAILY TARGETS

    const DailyTarget = require("../models/dailyTarget.model");

    const targets = await DailyTarget.find({
      user: userId,
      date: {
        $gte: startOfMonthUTC,
        $lt: endOfMonthUTC,
      },
    }).lean();

    const completedTargets = targets.filter(
      (target) => target.isCompleted,
    ).length;

    const pendingTargets = targets.length - completedTargets;

    // Target scoring
    const targetPositiveScore = completedTargets;

    const targetNegativeScore = pendingTargets;

    // GOOD HABITS

    const HabitLog = require("../models/habitLog.model");

    const habitLogs = await HabitLog.find({
      user: userId,
      date: {
        $gte: startOfMonthUTC,
        $lt: endOfMonthUTC,
      },
    }).lean();

    const completedHabits = habitLogs.filter((log) => log.isCompleted).length;

    const incompleteHabits = habitLogs.length - completedHabits;

    // Habit scoring
    const habitPositiveScore = completedHabits * 5;

    const habitNegativeScore = incompleteHabits * 5;

    // START PERFORMANCE

    const earlyStarts = sessions.filter(
      (session) => session.startType === "early",
    ).length;

    const onTimeStarts = sessions.filter(
      (session) => session.startType === "on-time",
    ).length;

    const lateStarts = sessions.filter(
      (session) => session.startType === "late",
    ).length;

    // PUNCTUALITY SCORE

    const punctualityPositiveScore = sessions
      .filter((session) => session.startType === "early")
      .reduce((total, session) => {
        return total + session.scheduleScore;
      }, 0);

    const punctualityNegativeScore = sessions
      .filter((session) => session.startType === "late")
      .reduce((total, session) => {
        return total + Math.abs(session.scheduleScore);
      }, 0);

    // 12 HOUR BONUS

    const twelveHourBonus = twelveHourDays * 5;

    // TOTAL POSITIVE SCORE

    const positiveScore =
      twelveHourBonus +
      targetPositiveScore +
      habitPositiveScore +
      punctualityPositiveScore;

    // TOTAL NEGATIVE SCORE

    const negativeScore =
      targetNegativeScore + habitNegativeScore + punctualityNegativeScore;

    // RESPONSE

    return res.status(200).json({
      success: true,

      month,

      timezone: "Asia/Kolkata",

      totalStudyMinutes,

      totalStudyHours,

      remainingStudyMinutes,

      twelveHourDays,

      targetsCompleted: completedTargets,

      positiveScore,

      negativeScore,

      breakdown: {
        twelveHourBonus,

        completedTargets: targetPositiveScore,

        pendingTargets: targetNegativeScore,

        completedHabits: habitPositiveScore,

        incompleteHabits: habitNegativeScore,

        earlyStarts: punctualityPositiveScore,

        lateStarts: punctualityNegativeScore,
      },

      punctuality: {
        earlyStarts,
        onTimeStarts,
        lateStarts,
      },

      dailyStudy,
    });
  } catch (error) {
    console.error("Get Monthly Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get monthly overview",
      error: error.message,
    });
  }
};

const getStudyCalendar = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month } = req.query;

    // Month required
    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }

    // YYYY-MM validation
    const monthRegex = /^\d{4}-\d{2}$/;

    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must be in YYYY-MM format",
      });
    }

    // Month start
    const startOfMonthUTC = new Date(`${month}-01T00:00:00+05:30`);

    // Next month calculation
    const [year, monthNumber] = month.split("-").map(Number);

    let nextMonth;
    let nextYear;

    if (monthNumber === 12) {
      nextMonth = 1;
      nextYear = year + 1;
    } else {
      nextMonth = monthNumber + 1;
      nextYear = year;
    }

    const nextMonthString = String(nextMonth).padStart(2, "0");

    const endOfMonthUTC = new Date(
      `${nextYear}-${nextMonthString}-01T00:00:00+05:30`,
    );

    // Get completed study sessions
    const sessions = await StudySession.find({
      user: userId,
      status: "completed",
      startTime: {
        $gte: startOfMonthUTC,
        $lt: endOfMonthUTC,
      },
    })
      .sort({ startTime: 1 })
      .lean();

    // Store study minutes date-wise
    const dailyStudy = {};

    sessions.forEach((session) => {
      const dateKey = new Date(session.startTime).toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      if (!dailyStudy[dateKey]) {
        dailyStudy[dateKey] = 0;
      }

      dailyStudy[dateKey] += session.durationMinutes;
    });

    // Number of days in selected month
    const daysInMonth = new Date(
      Date.UTC(nextYear, nextMonth - 1, 0),
    ).getUTCDate();

    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${month}-${String(day).padStart(2, "0")}`;

      const studyMinutes = dailyStudy[dateKey] || 0;

      const studyHours = Number((studyMinutes / 60).toFixed(2));

      let status = "none";

      if (studyMinutes >= 12 * 60) {
        status = "high";
      } else if (studyMinutes >= 6 * 60) {
        status = "medium";
      } else if (studyMinutes > 0) {
        status = "low";
      }

      calendar.push({
        date: dateKey,
        studyMinutes,
        studyHours,
        status,
      });
    }

    return res.status(200).json({
      success: true,
      month,
      timezone: "Asia/Kolkata",
      calendar,
    });
  } catch (error) {
    console.error("Get Study Calendar Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get study calendar",
      error: error.message,
    });
  }
};

const getWeeklyStudyHours = async (req, res) => {
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

    // Selected date in IST
    const selectedDate = new Date(`${date}T00:00:00+05:30`);

    // Check valid date
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    /*
      JavaScript:
      Sunday = 0
      Monday = 1
      Tuesday = 2
      ...
      Saturday = 6
    */

    const dayOfWeek = new Date(
      selectedDate.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    ).getDay();

    // Monday as start of week
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Monday date
    const weekStart = new Date(selectedDate);

    weekStart.setDate(weekStart.getDate() - daysFromMonday);

    weekStart.setHours(0, 0, 0, 0);

    // Sunday date
    const weekEnd = new Date(weekStart);

    weekEnd.setDate(weekEnd.getDate() + 6);

    weekEnd.setHours(23, 59, 59, 999);

    // Convert week boundaries to IST-aware UTC dates
    const weekStartDateString = `${weekStart.getFullYear()}-${String(
      weekStart.getMonth() + 1,
    ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

    const weekEndDateString = `${weekEnd.getFullYear()}-${String(
      weekEnd.getMonth() + 1,
    ).padStart(2, "0")}-${String(weekEnd.getDate()).padStart(2, "0")}`;

    const startOfWeekUTC = new Date(`${weekStartDateString}T00:00:00+05:30`);

    const endOfWeekUTC = new Date(`${weekEndDateString}T23:59:59.999+05:30`);

    // Get completed study sessions
    const sessions = await StudySession.find({
      user: userId,
      status: "completed",
      startTime: {
        $gte: startOfWeekUTC,
        $lte: endOfWeekUTC,
      },
    })
      .sort({ startTime: 1 })
      .lean();

    // Daily study calculation
    const dailyStudy = {};

    sessions.forEach((session) => {
      const dateKey = new Date(session.startTime).toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      if (!dailyStudy[dateKey]) {
        dailyStudy[dateKey] = 0;
      }

      dailyStudy[dateKey] += session.durationMinutes;
    });

    // Create Monday -> Sunday data
    const days = [];

    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);

      currentDate.setDate(currentDate.getDate() + i);

      const dateKey = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1,
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      const studyMinutes = dailyStudy[dateKey] || 0;

      const studyHours = Number((studyMinutes / 60).toFixed(2));

      days.push({
        date: dateKey,
        day: dayNames[i],
        studyMinutes,
        studyHours,
      });
    }

    // Total weekly study
    const totalStudyMinutes = sessions.reduce(
      (total, session) => total + session.durationMinutes,
      0,
    );

    const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

    // Average per day
    const dailyAverageMinutes = totalStudyMinutes / 7;

    const dailyAverageHours = Number((dailyAverageMinutes / 60).toFixed(2));

    return res.status(200).json({
      success: true,

      selectedDate: date,

      week: {
        startDate: weekStartDateString,
        endDate: weekEndDateString,
      },

      timezone: "Asia/Kolkata",

      totalStudyMinutes,
      totalStudyHours,

      dailyAverageMinutes: Number(dailyAverageMinutes.toFixed(2)),

      dailyAverageHours,

      days,
    });
  } catch (error) {
    console.error("Get Weekly Study Hours Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get weekly study hours",
      error: error.message,
    });
  }
};
// EXPORT

module.exports = {
  startStudy,
  stopStudy,
  getStudySummary,
  getMonthlyOverview,
  getStudyCalendar,
  getWeeklyStudyHours,
};