const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    reminder: {
      type: String,
      default: "08:00",
    },

    category: {
      type: String,
      default: "Productivity",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    frequency: {
      type: String,
      enum: ["Daily"],
      default: "Daily",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    points: {
      type: Number,
      default: 5,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;
