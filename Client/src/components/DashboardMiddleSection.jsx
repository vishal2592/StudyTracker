import React, { useEffect, useState } from "react";
import {
  Clock,
  Play,
  Target,
  CheckCircle2,
  Flame,
  X,
  Plus,
  Square,
} from "lucide-react";

const DashboardMiddleSection = ({
  targets,
  setTargets,
  habits,
  setHabits,
  onStudySessionComplete,
  onLiveStudySecondsChange,
  onPunctualityResult,
}) => {
  // =====================================================
  // STUDY TIMER
  // =====================================================

  const [selectedSubject, setSelectedSubject] = useState("Biology");

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [startTime, setStartTime] = useState(null);

  // =====================================================
  // NEXT START TIME
  // =====================================================
  //
  // Previous session ke Stop popup mein user jo
  // next start time dega, woh yahan save rahega.
  //
  // Example:
  // User says next start = 09:10 PM
  // Next time Start click karega:
  // 09:00 PM -> Early
  // 09:10 PM -> On time
  // 09:30 PM -> Late
  // =====================================================

  const [nextStartTime, setNextStartTime] = useState(null);

  // =====================================================
  // STOP STUDY MODAL
  // =====================================================

  const [showStopModal, setShowStopModal] = useState(false);

  const [stopReason, setStopReason] = useState("");

  const [nextStartInput, setNextStartInput] = useState("");

  // =====================================================
  // SUBJECTS
  // =====================================================

  const subjects = [
    "Biology",
    "Physics",
    "Chemistry",
    "Mock Test",
    "Other",
  ];

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (!isTimerRunning || !startTime) {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();

      const seconds = Math.floor(
        (now - startTime) / 1000
      );

      setElapsedSeconds(seconds);

      // Send current running session time to Dashboard
      if (onLiveStudySecondsChange) {
        onLiveStudySecondsChange(seconds);
      }
    };

    // Immediately update
    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    isTimerRunning,
    startTime,
    onLiveStudySecondsChange,
  ]);

  // =====================================================
  // FORMAT TIMER
  // =====================================================

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // =====================================================
  // GET TODAY DATE KEY
  // =====================================================

  const getTodayKey = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // GET CURRENT TIME IN MINUTES
  // =====================================================
  //
  // Used for comparing:
  //
  // Expected Start Time
  // vs
  // Actual Start Time
  //
  // Example:
  // 09:10 PM -> 21 * 60 + 10
  // =====================================================

  const getTimeInMinutes = (date) => {
    return (
      date.getHours() * 60 +
      date.getMinutes()
    );
  };

  // =====================================================
  // CHECK START PUNCTUALITY
  // =====================================================

  const checkStartPunctuality = () => {
    // First study session has no previous
    // next start time.
    if (!nextStartTime) {
      return;
    }

    const now = new Date();

    const actualMinutes =
      getTimeInMinutes(now);

    const [hours, minutes] =
      nextStartTime.split(":").map(Number);

    const expectedDate = new Date();

    expectedDate.setHours(
      hours,
      minutes,
      0,
      0
    );

    const expectedMinutes =
      getTimeInMinutes(expectedDate);

    // =============================================
    // EARLY
    // =============================================

    if (actualMinutes < expectedMinutes) {
      if (onPunctualityResult) {
        onPunctualityResult("early");
      }

      return;
    }

    // =============================================
    // LATE
    // =============================================

    if (actualMinutes > expectedMinutes) {
      if (onPunctualityResult) {
        onPunctualityResult("late");
      }

      return;
    }

    // =============================================
    // EXACT
    // =============================================

    if (onPunctualityResult) {
      onPunctualityResult("on-time");
    }
  };

  // =====================================================
  // START STUDY
  // =====================================================

  const handleStartTimer = () => {
    if (isTimerRunning) {
      return;
    }

    // Check whether user is early,
    // on-time or late compared to
    // previous session's next start time.
    checkStartPunctuality();

    const now = Date.now();

    setStartTime(now);

    setElapsedSeconds(0);

    if (onLiveStudySecondsChange) {
      onLiveStudySecondsChange(0);
    }

    setIsTimerRunning(true);
  };

  // =====================================================
  // OPEN STOP MODAL
  // =====================================================

  const handleStopTimer = () => {
    if (!isTimerRunning || !startTime) {
      return;
    }

    const finalSeconds = Math.floor(
      (Date.now() - startTime) / 1000
    );

    setElapsedSeconds(finalSeconds);

    // Keep final live time until session is saved.
    if (onLiveStudySecondsChange) {
      onLiveStudySecondsChange(finalSeconds);
    }

    // Open popup.
    setShowStopModal(true);
  };

  // =====================================================
  // CONFIRM STOP / SAVE SESSION
  // =====================================================

  const handleConfirmStop = (e) => {
    e.preventDefault();

    if (!stopReason.trim()) {
      return;
    }

    if (!nextStartInput) {
      return;
    }

    if (!startTime) {
      return;
    }

    const endTime = Date.now();

    const finalSeconds = Math.floor(
      (endTime - startTime) / 1000
    );

    const dateKey = getTodayKey();

    // =================================================
    // SEND COMPLETED SESSION TO DASHBOARD
    // =================================================

    if (onStudySessionComplete) {
      onStudySessionComplete({
        dateKey,
        durationSeconds: finalSeconds,
        subject: selectedSubject,
        startTime,
        endTime,
        reason: stopReason.trim(),
        nextStartTime: nextStartInput,
      });
    }

    // =================================================
    // SAVE NEXT START TIME
    // =================================================

    setNextStartTime(nextStartInput);

    // =================================================
    // RESET CURRENT SESSION
    // =================================================

    setIsTimerRunning(false);

    setStartTime(null);

    setElapsedSeconds(0);

    if (onLiveStudySecondsChange) {
      onLiveStudySecondsChange(0);
    }

    // =================================================
    // RESET MODAL
    // =================================================

    setStopReason("");

    setNextStartInput("");

    setShowStopModal(false);
  };

  // =====================================================
  // CANCEL STOP MODAL
  // =====================================================
  //
  // Important:
  // Agar user popup close/cancel karta hai,
  // timer STOP nahi hoga.
  //
  // Study session abhi bhi running rahega.
  // =====================================================

  const handleCancelStop = () => {
    setShowStopModal(false);

    setStopReason("");

    setNextStartInput("");
  };

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================

  const handleSubjectChange = (subject) => {
    if (isTimerRunning) {
      return;
    }

    setSelectedSubject(subject);

    setElapsedSeconds(0);
  };

  // =====================================================
  // TOGGLE TARGET
  // =====================================================

  const handleTargetToggle = (id) => {
    setTargets((prevTargets) =>
      prevTargets.map((target) =>
        target.id === id
          ? {
              ...target,
              completed: !target.completed,
            }
          : target
      )
    );
  };

  // =====================================================
  // ADD TARGET MODAL
  // =====================================================

  const [showTargetModal, setShowTargetModal] =
    useState(false);

  const [targetTitle, setTargetTitle] =
    useState("");

  const [targetDuration, setTargetDuration] =
    useState("");

  // =====================================================
  // ADD TARGET
  // =====================================================

  const handleAddTarget = (e) => {
    e.preventDefault();

    if (
      !targetTitle.trim() ||
      !targetDuration.trim()
    ) {
      return;
    }

    const newTarget = {
      id: Date.now(),
      title: targetTitle.trim(),
      duration: targetDuration.trim(),
      completed: false,
    };

    setTargets((prevTargets) => [
      ...prevTargets,
      newTarget,
    ]);

    setTargetTitle("");

    setTargetDuration("");

    setShowTargetModal(false);
  };

  // =====================================================
  // TOGGLE HABIT
  // =====================================================

  const handleHabitToggle = (id) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
            }
          : habit
      )
    );
  };

  const completedHabits = habits.filter(
    (habit) => habit.completed
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* =====================================================
            STUDY TIMER
        ===================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          {/* Header */}

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Clock
                  size={21}
                  className="text-blue-500"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Study Timer
                </h3>

                <p className="text-xs text-slate-400">
                  {isTimerRunning
                    ? `Studying ${selectedSubject}`
                    : "Track your study time"}
                </p>
              </div>
            </div>

            {isTimerRunning && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                <span className="text-xs font-semibold text-emerald-600">
                  Running
                </span>
              </div>
            )}
          </div>

          {/* Subject Selection */}

          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Select Subject
            </p>

            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => {
                const isSelected =
                  selectedSubject === subject;

                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() =>
                      handleSubjectChange(subject)
                    }
                    disabled={isTimerRunning}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-semibold
                      border transition-all
                      ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-500"
                      }
                      ${
                        isTimerRunning
                          ? "cursor-not-allowed opacity-70"
                          : ""
                      }
                    `}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timer Display */}

          <div className="bg-slate-50 rounded-2xl py-7 px-4 text-center border border-slate-100">
            <p className="text-xs font-medium text-slate-400 mb-2">
              {isTimerRunning
                ? `${selectedSubject} Study Time`
                : "Ready to Study"}
            </p>

            <div className="text-4xl sm:text-5xl font-bold tracking-wider text-slate-800 font-mono">
              {formatTime(elapsedSeconds)}
            </div>

            {isTimerRunning && (
              <p className="text-xs text-emerald-500 font-medium mt-3">
                Timer will continue until you stop it
              </p>
            )}
          </div>

          {/* Start / Stop Button */}

          <div className="mt-4">
            {!isTimerRunning ? (
              <button
                type="button"
                onClick={handleStartTimer}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                <Play
                  size={17}
                  fill="currentColor"
                />

                Start Study
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopTimer}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                <Square
                  size={16}
                  fill="currentColor"
                />

                Stop Study
              </button>
            )}
          </div>

          {/* Info */}

          <p className="text-[11px] text-slate-400 text-center mt-3">
            You can study for any duration. Stop the timer
            whenever you finish.
          </p>
        </div>

        {/* =====================================================
            TODAY'S TARGETS
        ===================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          {/* Header */}

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Target
                  size={21}
                  className="text-purple-500"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Today's Targets
                </h3>

                <p className="text-xs text-slate-400">
                  Complete your study goals
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowTargetModal(true)
              }
              className="flex items-center gap-1 text-xs font-semibold text-purple-500 hover:text-purple-600 transition-colors"
            >
              <Plus size={15} />

              Add Target
            </button>
          </div>

          {/* Target List */}

          <div className="space-y-3">
            {targets.length === 0 ? (
              <div className="py-8 text-center">
                <Target
                  size={30}
                  className="mx-auto text-slate-300 mb-2"
                />

                <p className="text-sm text-slate-400">
                  No targets added yet
                </p>
              </div>
            ) : (
              targets.map((target) => (
                <div
                  key={target.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  {/* Left */}

                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleTargetToggle(
                          target.id
                        )
                      }
                      className="shrink-0"
                      aria-label={`Mark ${target.title}`}
                    >
                      {target.completed ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
                          <CheckCircle2
                            size={15}
                            className="text-white"
                          />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-purple-400 transition-colors" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          target.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {target.title}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {target.duration}
                      </p>
                    </div>
                  </div>

                  {/* Status */}

                  <div className="shrink-0">
                    {target.completed ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =====================================================
            TODAY'S GOOD HABITS
        ===================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          {/* Header */}

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Flame
                  size={21}
                  className="text-orange-500"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Today's Good Habits
                </h3>

                <p className="text-xs text-slate-400">
                  Build consistency every day
                </p>
              </div>
            </div>

            <div className="text-xs font-bold text-orange-500">
              {completedHabits}/{habits.length}
            </div>
          </div>

          {/* Habits */}

          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                {/* Left */}

                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleHabitToggle(
                        habit.id
                      )
                    }
                    className="shrink-0"
                    aria-label={`Toggle ${habit.title}`}
                  >
                    {habit.completed ? (
                      <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2
                          size={15}
                          className="text-white"
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-orange-400 transition-colors" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        habit.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                      }`}
                    >
                      {habit.title}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {habit.subtitle}
                    </p>
                  </div>
                </div>

                {/* Status */}

                {habit.completed ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold shrink-0">
                    Done
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold shrink-0">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          STOP STUDY MODAL
      ===================================================== */}

      {showStopModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelStop();
            }
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            {/* Modal Header */}

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Stop Study Session
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Save this session before you stop.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelStop}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Session Time */}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-center">
              <p className="text-xs font-semibold text-blue-500 mb-1">
                {selectedSubject} Study Time
              </p>

              <p className="text-3xl font-bold font-mono text-slate-800">
                {formatTime(elapsedSeconds)}
              </p>
            </div>

            <form onSubmit={handleConfirmStop}>
              {/* Reason */}

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Why are you stopping?
                </label>

                <textarea
                  value={stopReason}
                  onChange={(e) =>
                    setStopReason(e.target.value)
                  }
                  placeholder="e.g. Taking dinner break, feeling tired..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              {/* Next Start Time */}

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  When will you start again?
                </label>

                <input
                  type="time"
                  value={nextStartInput}
                  onChange={(e) =>
                    setNextStartInput(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />

                {nextStartTime && (
                  <p className="text-[11px] text-slate-400 mt-2">
                    Previous planned start:{" "}
                    {nextStartTime}
                  </p>
                )}
              </div>

              {/* Buttons */}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelStop}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Continue Studying
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
                >
                  Save & Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD TARGET MODAL
      ===================================================== */}

      {showTargetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowTargetModal(false);
            }
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            {/* Modal Header */}

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Add New Target
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Add a study goal for today
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowTargetModal(false)
                }
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleAddTarget}>
              {/* Target */}

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Target
                </label>

                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) =>
                    setTargetTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Biology - Genetics"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              {/* Duration */}

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Duration
                </label>

                <input
                  type="text"
                  value={targetDuration}
                  onChange={(e) =>
                    setTargetDuration(
                      e.target.value
                    )
                  }
                  placeholder="e.g. 2 hours"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              {/* Buttons */}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowTargetModal(false)
                  }
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors"
                >
                  Add Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardMiddleSection;