const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      enum: ["Biology", "Physics", "Chemistry", "Mock Test", "Other"],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },

    stopTime: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["running", "completed"],
      default: "running",
    },

    stopReason: {
      type: String,
      default: null,
      trim: true,
    },

    nextStartTime: {
      type: Date,
      default: null,
    },

    startType: {
      type: String,
      enum: ["early", "on-time", "late", null],
      default: null,
    },

    lateReason: {
      type: String,
      default: null,
      trim: true,
    },

    scheduleScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const StudySession = mongoose.model("StudySession", studySessionSchema);

module.exports = StudySession;
