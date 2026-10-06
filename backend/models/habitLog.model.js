const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const HabitLog = mongoose.model("HabitLog", habitLogSchema);

module.exports = HabitLog;
