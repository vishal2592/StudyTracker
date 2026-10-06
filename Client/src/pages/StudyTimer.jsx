import React, { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flame,
  Pause,
  Play,
  Square,
  Target,
  TimerReset,
  TrendingUp,
  X,
} from "lucide-react";

const StudyTimer = () => {
  // =====================================================
  // DUMMY SUBJECTS
  // Later these will come from Daily Targets / Redux
  // =====================================================

  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      targetHours: 2,
      color: "purple",
    },
    {
      id: 2,
      name: "Physics",
      targetHours: 2,
      color: "indigo",
    },
    {
      id: 3,
      name: "Chemistry",
      targetHours: 1.5,
      color: "blue",
    },
    {
      id: 4,
      name: "Biology",
      targetHours: 2,
      color: "emerald",
    },
  ];

  // =====================================================
  // TODAY KEY
  // =====================================================

  const getTodayKey = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayKey = getTodayKey();

  // =====================================================
  // STATES
  // =====================================================

  const [selectedSubjectId, setSelectedSubjectId] =
    useState(subjects[0].id);

  const [isTimerRunning, setIsTimerRunning] =
    useState(false);

  const [startTime, setStartTime] = useState(null);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [liveSeconds, setLiveSeconds] = useState(0);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      subjectId: 1,
      subjectName: "Mathematics",
      startTime: new Date(
        new Date().setHours(10, 0, 0, 0)
      ).getTime(),
      endTime: new Date(
        new Date().setHours(12, 1, 0, 0)
      ).getTime(),
      durationSeconds: 7260,
      reason: "Target completed",
      punctuality: "on-time",
      nextStartTime: null,
    },
    {
      id: 2,
      subjectId: 2,
      subjectName: "Physics",
      startTime: new Date(
        new Date().setHours(17, 20, 0, 0)
      ).getTime(),
      endTime: new Date(
        new Date().setHours(18, 30, 0, 0)
      ).getTime(),
      durationSeconds: 4200,
      reason: "Break",
      punctuality: "early",
      nextStartTime: null,
    },
  ]);

  // Stop modal
  const [showStopModal, setShowStopModal] =
    useState(false);

  const [stopReason, setStopReason] =
    useState("");

  const [nextStartInput, setNextStartInput] =
    useState("");

  // =====================================================
  // SELECTED SUBJECT
  // =====================================================

  const selectedSubject = useMemo(() => {
    return (
      subjects.find(
        (subject) => subject.id === selectedSubjectId
      ) || subjects[0]
    );
  }, [selectedSubjectId]);

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
      setLiveSeconds(seconds);
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [isTimerRunning, startTime]);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h`;
    }

    return `${minutes}m`;
  };

  const formatHours = (hours) => {
    const wholeHours = Math.floor(hours);

    const minutes = Math.round(
      (hours - wholeHours) * 60
    );

    if (minutes === 0) {
      return `${wholeHours}h`;
    }

    return `${wholeHours}h ${minutes}m`;
  };

  // =====================================================
  // FORMAT CLOCK TIME
  // =====================================================

  const formatClockTime = (timestamp) => {
    if (!timestamp) return "--";

    return new Date(timestamp).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // START PUNCTUALITY
  // =====================================================

  const getTimeInMinutes = (date) => {
    return (
      date.getHours() * 60 +
      date.getMinutes()
    );
  };

  const getPunctuality = () => {
    if (!nextStartInput) {
      return null;
    }

    const now = new Date();

    const actualMinutes =
      getTimeInMinutes(now);

    const [hours, minutes] =
      nextStartInput
        .split(":")
        .map(Number);

    const expectedDate = new Date();

    expectedDate.setHours(
      hours,
      minutes,
      0,
      0
    );

    const expectedMinutes =
      getTimeInMinutes(expectedDate);

    if (actualMinutes < expectedMinutes) {
      return "early";
    }

    if (actualMinutes > expectedMinutes) {
      return "late";
    }

    return "on-time";
  };

  // =====================================================
  // START TIMER
  // =====================================================

  const handleStartTimer = () => {
    if (isTimerRunning) {
      return;
    }

    const now = Date.now();

    setStartTime(now);
    setElapsedSeconds(0);
    setLiveSeconds(0);
    setIsTimerRunning(true);
  };

  // =====================================================
  // STOP TIMER
  // =====================================================

  const handleStopTimer = () => {
    if (!isTimerRunning || !startTime) {
      return;
    }

    const finalSeconds = Math.floor(
      (Date.now() - startTime) / 1000
    );

    setElapsedSeconds(finalSeconds);
    setLiveSeconds(finalSeconds);

    setShowStopModal(true);
  };

  // =====================================================
  // CANCEL STOP
  // =====================================================

  const handleCancelStop = () => {
    setShowStopModal(false);
    setStopReason("");
    setNextStartInput("");
  };

  // =====================================================
  // CONFIRM STOP
  // =====================================================

  const handleConfirmStop = (event) => {
    event.preventDefault();

    if (
      !stopReason.trim() ||
      !startTime
    ) {
      return;
    }

    const endTime = Date.now();

    const finalSeconds = Math.floor(
      (endTime - startTime) / 1000
    );

    const punctuality =
      getPunctuality();

    const newSession = {
      id: Date.now(),
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      startTime,
      endTime,
      durationSeconds: finalSeconds,
      reason: stopReason.trim(),
      punctuality,
      nextStartTime:
        nextStartInput || null,
    };

    setSessions((prev) => [
      ...prev,
      newSession,
    ]);

    setIsTimerRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setLiveSeconds(0);

    setShowStopModal(false);
    setStopReason("");

    // Keep next start time for next punctuality check
    // through separate state below.
    setNextStartTimeState(
      nextStartInput || null
    );

    setNextStartInput("");
  };

  // =====================================================
  // NEXT START TIME
  // =====================================================

  const [
    nextStartTimeState,
    setNextStartTimeState,
  ] = useState(null);

  // =====================================================
  // UPDATED START WITH PUNCTUALITY CHECK
  // =====================================================

  const handleStartWithPunctuality = () => {
    if (isTimerRunning) {
      return;
    }

    let punctuality = null;

    if (nextStartTimeState) {
      const now = new Date();

      const actualMinutes =
        getTimeInMinutes(now);

      const [
        expectedHours,
        expectedMinutesValue,
      ] = nextStartTimeState
        .split(":")
        .map(Number);

      const expectedMinutes =
        expectedHours * 60 +
        expectedMinutesValue;

      if (actualMinutes < expectedMinutes) {
        punctuality = "early";
      } else if (
        actualMinutes > expectedMinutes
      ) {
        punctuality = "late";
      } else {
        punctuality = "on-time";
      }
    }

    if (punctuality) {
      console.log(
        "Next session punctuality:",
        punctuality
      );
    }

    const now = Date.now();

    setStartTime(now);
    setElapsedSeconds(0);
    setLiveSeconds(0);
    setIsTimerRunning(true);

    setNextStartTimeState(null);
  };

  // =====================================================
  // TODAY'S SESSIONS
  // =====================================================

  const todaySessions = useMemo(() => {
    return sessions.filter((session) => {
      const date = new Date(
        session.startTime
      );

      const year = date.getFullYear();
      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");
      const day = String(
        date.getDate()
      ).padStart(2, "0");

      return (
        `${year}-${month}-${day}` ===
        todayKey
      );
    });
  }, [sessions, todayKey]);

  // =====================================================
  // TOTAL STUDY SECONDS
  // =====================================================

  const completedStudySeconds = useMemo(() => {
    return todaySessions.reduce(
      (total, session) =>
        total + session.durationSeconds,
      0
    );
  }, [todaySessions]);

  const todayStudySeconds =
    completedStudySeconds + liveSeconds;

  // =====================================================
  // TODAY'S TARGET
  // =====================================================

  const todayTargetSeconds =
    selectedSubject.targetHours *
    60 *
    60;

  const subjectStudySeconds = useMemo(() => {
    return todaySessions
      .filter(
        (session) =>
          session.subjectId ===
          selectedSubject.id
      )
      .reduce(
        (total, session) =>
          total +
          session.durationSeconds,
        0
      );
  }, [
    todaySessions,
    selectedSubject.id,
  ]);

  const subjectCurrentSeconds =
    subjectStudySeconds +
    (isTimerRunning
      ? liveSeconds
      : 0);

  const targetProgress = Math.min(
    100,
    Math.round(
      (subjectCurrentSeconds /
        todayTargetSeconds) *
        100
    )
  );

  const remainingSeconds = Math.max(
    0,
    todayTargetSeconds -
      subjectCurrentSeconds
  );

  // =====================================================
  // TODAY TOTAL TARGET
  // =====================================================

  const totalDailyTargetHours =
    subjects.reduce(
      (total, subject) =>
        total + subject.targetHours,
      0
    );

  const totalDailyTargetSeconds =
    totalDailyTargetHours *
    60 *
    60;

  const totalDailyProgress = Math.min(
    100,
    Math.round(
      (todayStudySeconds /
        totalDailyTargetSeconds) *
        100
    )
  );

  // =====================================================
  // CURRENT DATE
  // =====================================================

  const formattedToday =
    new Date().toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  // =====================================================
  // SUBJECT STYLE
  // =====================================================

  const getSubjectStyle = (name) => {
    const styles = {
      Mathematics: {
        icon: "bg-purple-100 text-purple-600",
        gradient:
          "from-purple-500 to-indigo-500",
      },

      Physics: {
        icon: "bg-indigo-100 text-indigo-600",
        gradient:
          "from-indigo-500 to-blue-500",
      },

      Chemistry: {
        icon: "bg-blue-100 text-blue-600",
        gradient:
          "from-blue-500 to-cyan-500",
      },

      Biology: {
        icon: "bg-emerald-100 text-emerald-600",
        gradient:
          "from-emerald-500 to-teal-500",
      },
    };

    return (
      styles[name] || {
        icon:
          "bg-purple-100 text-purple-600",
        gradient:
          "from-purple-500 to-indigo-500",
      }
    );
  };

  // =====================================================
  // PUNCTUALITY LABEL
  // =====================================================

  const getPunctualityLabel = (
    punctuality
  ) => {
    if (punctuality === "early") {
      return {
        text: "Started Early",
        className:
          "bg-emerald-50 text-emerald-700",
      };
    }

    if (punctuality === "late") {
      return {
        text: "Started Late",
        className:
          "bg-orange-50 text-orange-700",
      };
    }

    if (punctuality === "on-time") {
      return {
        text: "On Time",
        className:
          "bg-purple-50 text-purple-700",
      };
    }

    return null;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                <Clock3 className="h-5 w-5 text-purple-600" />
              </div>

              <span className="text-sm font-semibold text-purple-600">
                Focus Session
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Study Timer
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Focus on your study and let us track
              your time automatically.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <CalendarDays className="h-4 w-4 text-purple-600" />

            <span className="text-sm font-medium text-slate-700">
              {formattedToday}
            </span>
          </div>
        </div>

        {/* =================================================
            TIMER + SIDE INFO
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              MAIN TIMER
          ================================================= */}

          <div className="lg:col-span-2">
            <div
              className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm sm:p-8 ${
                isTimerRunning
                  ? "border-purple-200"
                  : "border-slate-200"
              }`}
            >
              {/* Decorative background */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-100/60 blur-3xl" />

              <div className="relative">

                {/* Status */}

                <div className="flex justify-center">
                  {isTimerRunning ? (
                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      STUDYING NOW
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                      <TimerReset className="h-3.5 w-3.5" />
                      READY TO STUDY
                    </div>
                  )}
                </div>

                {/* Subject */}

                <div className="mx-auto mt-6 max-w-md">
                  <label className="mb-2 block text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Study Subject
                  </label>

                  <div className="relative">
                    <select
                      value={selectedSubjectId}
                      disabled={isTimerRunning}
                      onChange={(e) =>
                        setSelectedSubjectId(
                          Number(e.target.value)
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-center text-sm font-semibold text-slate-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {subjects.map(
                        (subject) => (
                          <option
                            key={subject.id}
                            value={subject.id}
                          >
                            {subject.name}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Timer */}

                <div className="mt-8 text-center">
                  <div className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
                    {formatTimer(
                      elapsedSeconds
                    )}
                  </div>

                  {isTimerRunning &&
                    startTime && (
                      <p className="mt-3 text-sm text-slate-500">
                        Started at{" "}
                        <span className="font-semibold text-slate-700">
                          {formatClockTime(
                            startTime
                          )}
                        </span>
                      </p>
                    )}
                </div>

                {/* Buttons */}

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {!isTimerRunning ? (
                    <button
                      type="button"
                      onClick={
                        handleStartWithPunctuality
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 sm:w-auto"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Start Studying
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          // Pause is intentionally disabled
                          // in this version because the session
                          // should remain continuous.
                        }}
                        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-7 py-3.5 text-sm font-semibold text-slate-400 sm:w-auto"
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleStopTimer
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:w-auto"
                      >
                        <Square className="h-4 w-4 fill-current" />
                        Stop Session
                      </button>
                    </>
                  )}
                </div>

                {/* Next Start Notice */}

                {!isTimerRunning &&
                  nextStartTimeState && (
                    <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-3 text-xs font-medium text-purple-700">
                      <AlarmClock className="h-4 w-4" />

                      <span>
                        Next session planned for{" "}
                        <strong>
                          {nextStartTimeState}
                        </strong>
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* =================================================
              SIDE TARGET CARD
          ================================================= */}

          <div className="space-y-6">

            {/* Current Target */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Today's Target
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {selectedSubject.name}
                  </h3>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    getSubjectStyle(
                      selectedSubject.name
                    ).icon
                  }`}
                >
                  <Target className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Study Progress
                  </span>

                  <span className="text-sm font-bold text-purple-600">
                    {targetProgress}%
                  </span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${
                      getSubjectStyle(
                        selectedSubject.name
                      ).gradient
                    } transition-all duration-500`}
                    style={{
                      width: `${targetProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {formatDuration(
                      subjectCurrentSeconds
                    )}{" "}
                    studied
                  </span>

                  <span className="font-medium text-slate-700">
                    Target{" "}
                    {formatHours(
                      selectedSubject.targetHours
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-purple-600" />

                  <span className="text-xs text-slate-600">
                    {remainingSeconds > 0
                      ? `${formatDuration(
                          remainingSeconds
                        )} remaining`
                      : "Target completed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Focus Streak */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Study Streak
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    5 Days
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Keep your study sessions consistent to
                build a longer streak.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            TODAY SUMMARY
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Study Time */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Today's Study
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatDuration(
                    todayStudySeconds
                  )}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Across all subjects
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <Clock3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Sessions */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Sessions
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {todaySessions.length +
                    (isTimerRunning
                      ? 1
                      : 0)}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Study sessions today
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Daily Target */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Daily Target
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatHours(
                    totalDailyTargetHours
                  )}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Planned study time
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Remaining */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Daily Progress
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {totalDailyProgress}%
                </h3>

                <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    style={{
                      width: `${totalDailyProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            TODAY'S SESSIONS
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Today's Sessions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your completed study sessions for today.
              </p>
            </div>

            <div className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
              {todaySessions.length} completed
            </div>
          </div>

          <div className="mt-5 space-y-3">

            {todaySessions.length === 0 && (
              <div className="rounded-xl bg-slate-50 py-10 text-center">
                <Clock3 className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No completed sessions yet.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Start your first study session today.
                </p>
              </div>
            )}

            {todaySessions
              .slice()
              .reverse()
              .map((session) => {
                const punctuality =
                  getPunctualityLabel(
                    session.punctuality
                  );

                return (
                  <div
                    key={session.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          getSubjectStyle(
                            session.subjectName
                          ).icon
                        }`}
                      >
                        <Check className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {session.subjectName}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatClockTime(
                            session.startTime
                          )}{" "}
                          →{" "}
                          {formatClockTime(
                            session.endTime
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {formatDuration(
                          session.durationSeconds
                        )}
                      </span>

                      {punctuality && (
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${punctuality.className}`}
                        >
                          {punctuality.text}
                        </span>
                      )}

                      <span className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-500">
                        {session.reason}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Active Session */}

            {isTimerRunning &&
              startTime && (
                <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-purple-600" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-purple-900">
                          {selectedSubject.name}
                        </h3>

                        <p className="mt-1 text-xs text-purple-700">
                          Started at{" "}
                          {formatClockTime(
                            startTime
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-purple-700">
                      {formatTimer(
                        liveSeconds
                      )}
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* =================================================
            TODAY SUBJECT OVERVIEW
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Today's Subject Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              See how much time you have spent on each subject.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjects.map((subject) => {
              const subjectSeconds =
                todaySessions
                  .filter(
                    (session) =>
                      session.subjectId ===
                      subject.id
                  )
                  .reduce(
                    (total, session) =>
                      total +
                      session.durationSeconds,
                    0
                  ) +
                (isTimerRunning &&
                selectedSubject.id ===
                  subject.id
                  ? liveSeconds
                  : 0);

              const subjectTargetSeconds =
                subject.targetHours *
                3600;

              const progress = Math.min(
                100,
                Math.round(
                  (subjectSeconds /
                    subjectTargetSeconds) *
                    100
                )
              );

              return (
                <div
                  key={subject.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          getSubjectStyle(
                            subject.name
                          ).icon
                        }`}
                      >
                        <span className="text-sm font-bold">
                          {subject.name.charAt(
                            0
                          )}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {subject.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          Target{" "}
                          {formatHours(
                            subject.targetHours
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-purple-600">
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        getSubjectStyle(
                          subject.name
                        ).gradient
                      }`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {formatDuration(
                        subjectSeconds
                      )}{" "}
                      studied
                    </span>

                    <span className="text-xs font-medium text-slate-600">
                      {progress >= 100
                        ? "Target completed"
                        : `${formatDuration(
                            Math.max(
                              0,
                              subjectTargetSeconds -
                                subjectSeconds
                            )
                          )} remaining`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            INFORMATION NOTE
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <Target className="h-4 w-4 text-purple-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-purple-900">
                How Study Timer works
              </h3>

              <p className="mt-1 text-xs leading-5 text-purple-700">
                Your subjects and daily study targets come
                from Daily Targets. This page records the
                actual time you spend studying. Those sessions
                can later be used by Subject Tracker and
                Study Analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          STOP SESSION MODAL
      =================================================== */}

      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  End Study Session
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Save your session before stopping.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelStop}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}

            <form
              onSubmit={
                handleConfirmStop
              }
              className="p-5"
            >
              {/* Duration */}

              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-xs font-medium text-purple-600">
                  You studied for
                </p>

                <p className="mt-1 text-2xl font-bold text-purple-900">
                  {formatTimer(
                    elapsedSeconds
                  )}
                </p>

                <p className="mt-1 text-xs text-purple-600">
                  {selectedSubject.name}
                </p>
              </div>

              {/* Reason */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Why are you stopping?
                </label>

                <div className="relative">
                  <select
                    value={stopReason}
                    onChange={(e) =>
                      setStopReason(
                        e.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                  >
                    <option value="">
                      Select a reason
                    </option>

                    <option value="Target completed">
                      Target completed
                    </option>

                    <option value="Break">
                      Taking a break
                    </option>

                    <option value="Food">
                      Food
                    </option>

                    <option value="Personal work">
                      Personal work
                    </option>

                    <option value="Tired">
                      Feeling tired
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Next Start */}

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  When will you start again?
                </label>

                <div className="relative">
                  <AlarmClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="time"
                    value={nextStartInput}
                    onChange={(e) =>
                      setNextStartInput(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  This will be used to calculate whether
                  your next session starts early, on time,
                  or late.
                </p>
              </div>

              {/* Buttons */}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    handleCancelStop
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Continue Studying
                </button>

                <button
                  type="submit"
                  disabled={!stopReason}
                  className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save & Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;