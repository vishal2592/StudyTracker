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

    // IST = UTC + 5 hours 30 minutes
    //
    // Example:
    // 2026-10-06 00:00 IST
    //        =
    // 2026-10-05 18:30 UTC
    //
    // 2026-10-06 23:59:59 IST
    //        =
    // 2026-10-06 18:29:59 UTC

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
    }).sort({
      startTime: 1,
    });

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

      sessions,
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

// EXPORT

module.exports = {
  startStudy,
  stopStudy,
  getStudySummary,
};
