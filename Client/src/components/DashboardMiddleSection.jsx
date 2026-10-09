import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Clock,
  Play,
  Target,
  Flame,
  X,
  Plus,
  Square,
  Check,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  startStudy,
  stopStudy,
  getRunningStudy,
  getStudySummary,
} from "../redux/slicer/studySlice";

import {
  getTargets,
  createTarget,
  toggleTarget,
} from "../redux/slicer/dailyTargetSlice";

import {
  getHabits,
  toggleHabit,
} from "../redux/slicer/habitSlice";

const DashboardMiddleSection = ({
  onStudySessionComplete,
  onLiveStudySecondsChange,
  onPunctualityResult,
}) => {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX - STUDY
  // =====================================================

  const {
    currentSession,
    isStudying,
    startLoading,
    stopLoading,
    summary,
  } = useSelector((state) => state.study);

  // =====================================================
  // REDUX - TARGETS
  // =====================================================

  const {
    targets,
    loading: targetsLoading,
    createLoading: targetCreateLoading,
    toggleLoading: targetToggleLoading,
  } = useSelector((state) => state.dailyTarget);

  // =====================================================
  // REDUX - HABITS
  // =====================================================

  const {
    habits,
    totalHabits,
    completedHabits,
    loading: habitsLoading,
    toggleLoading: habitToggleLoading,
  } = useSelector((state) => state.habit);

  // =====================================================
  // DATE
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

  const todayKey = getTodayKey();

  // =====================================================
  // FETCH TODAY'S DATA
  // =====================================================

  useEffect(() => {
    dispatch(getTargets(todayKey));
    dispatch(getHabits(todayKey));

    // Get completed sessions.
    // This gives Dashboard the already completed
    // study time such as 30:27.
    dispatch(getStudySummary(todayKey));

    // Restore currently running backend session.
    dispatch(getRunningStudy());
  }, [dispatch, todayKey]);

  // =====================================================
  // STUDY TIMER
  // =====================================================

  const [selectedSubject, setSelectedSubject] =
    useState("Biology");

  /*
   * This is ONLY the current running session time.
   *
   * Example:
   * Previous completed = 30:27
   * Current session = 00:15
   *
   * elapsedSeconds = 15
   *
   * Dashboard total =
   * completedStudySeconds + elapsedSeconds
   */
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [startTime, setStartTime] =
    useState(null);

  const [isTimerRunning, setIsTimerRunning] =
    useState(false);

  // =====================================================
  // NEXT START TIME
  // =====================================================

  const [nextStartTime, setNextStartTime] =
    useState(null);

  // =====================================================
  // STOP STUDY MODAL
  // =====================================================

  const [showStopModal, setShowStopModal] =
    useState(false);

  const [stopReason, setStopReason] =
    useState("");

  const [nextStartInput, setNextStartInput] =
    useState("");

  // =====================================================
  // LOAD MORE
  // =====================================================

  const [visibleTargetCount, setVisibleTargetCount] =
    useState(5);

  const [visibleHabitCount, setVisibleHabitCount] =
    useState(5);

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
  // COMPLETED STUDY TIME
  // =====================================================

  /*
   * IMPORTANT:
   *
   * Do NOT use summary.totalMinutes here.
   *
   * Backend response contains exact durationSeconds
   * for every completed session.
   *
   * Example from your API:
   *
   * 587 + 234 + 98 + 137 + 15 + 16 + 705 + 16 + 19
   * = 1827 seconds
   * = 30m 27s
   */

  const completedStudySeconds = useMemo(() => {
    if (!Array.isArray(summary?.sessions)) {
      return 0;
    }

    return summary.sessions.reduce(
      (total, session) => {
        return (
          total +
          Number(
            session.durationSeconds || 0
          )
        );
      },
      0
    );
  }, [summary]);

  // =====================================================
  // DASHBOARD TOTAL STUDY TIME
  // =====================================================

  /*
   * STOPPED:
   *
   * completed = 30:27
   * live = 0
   *
   * Dashboard = 30:27
   *
   * RUNNING:
   *
   * completed = 30:27
   * live = 00:10
   *
   * Dashboard = 30:37
   */

  const totalStudySeconds =
    completedStudySeconds +
    (isTimerRunning
      ? elapsedSeconds
      : 0);

  // =====================================================
  // SYNC REDUX RUNNING STUDY
  // =====================================================

  useEffect(() => {
    /*
     * Backend Redux session is the source of truth.
     *
     * If StudyTimer page is running:
     *
     * currentSession.startTime
     *          ↓
     * Dashboard calculates live time
     */

    if (
      isStudying &&
      currentSession?.startTime
    ) {
      const sessionStartTime =
        new Date(
          currentSession.startTime
        ).getTime();

      if (
        !Number.isNaN(
          sessionStartTime
        )
      ) {
        setStartTime(
          sessionStartTime
        );

        setIsTimerRunning(
          true
        );

        const currentElapsedSeconds =
          Math.max(
            0,
            Math.floor(
              (Date.now() -
                sessionStartTime) /
                1000
            )
          );

        setElapsedSeconds(
          currentElapsedSeconds
        );

        if (
          onLiveStudySecondsChange
        ) {
          onLiveStudySecondsChange(
            currentElapsedSeconds
          );
        }
      }

      // Sync subject

      if (
        currentSession?.subject
      ) {
        setSelectedSubject(
          currentSession.subject
        );
      }

      // Sync next start time

      if (
        currentSession?.nextStartTime
      ) {
        const backendNextStart =
          new Date(
            currentSession.nextStartTime
          );

        if (
          !Number.isNaN(
            backendNextStart.getTime()
          )
        ) {
          const hours =
            String(
              backendNextStart.getHours()
            ).padStart(
              2,
              "0"
            );

          const minutes =
            String(
              backendNextStart.getMinutes()
            ).padStart(
              2,
              "0"
            );

          setNextStartTime(
            `${hours}:${minutes}`
          );
        }
      }

      return;
    }

    /*
     * No currently running backend session.
     *
     * IMPORTANT:
     *
     * We DO NOT touch completedStudySeconds.
     *
     * completedStudySeconds comes from summary.
     *
     * Therefore after stopping:
     *
     * elapsedSeconds = 0
     * completedStudySeconds = 30:27
     *
     * Dashboard still shows 30:27.
     */

    if (!isStudying) {
      setIsTimerRunning(false);
      setStartTime(null);
      setElapsedSeconds(0);

      if (
        onLiveStudySecondsChange
      ) {
        onLiveStudySecondsChange(0);
      }
    }
  }, [
    isStudying,
    currentSession,
    onLiveStudySecondsChange,
  ]);

  // =====================================================
  // LIVE TIMER
  // =====================================================

  useEffect(() => {
    if (
      !isTimerRunning ||
      !startTime
    ) {
      return;
    }

    const updateTimer = () => {
      const now =
        Date.now();

      /*
       * Always calculate from backend startTime.
       *
       * This means:
       *
       * Refresh
       * Navigation
       * Dashboard remount
       *
       * will NOT reset the running timer.
       */

      const seconds =
        Math.max(
          0,
          Math.floor(
            (now -
              startTime) /
              1000
          )
        );

      setElapsedSeconds(
        seconds
      );

      if (
        onLiveStudySecondsChange
      ) {
        onLiveStudySecondsChange(
          seconds
        );
      }
    };

    // Immediately calculate.

    updateTimer();

    const timer =
      setInterval(
        updateTimer,
        1000
      );

    return () => {
      clearInterval(
        timer
      );
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
    const safeSeconds =
      Math.max(
        0,
        Number(seconds) || 0
      );

    const hours =
      Math.floor(
        safeSeconds /
          3600
      );

    const minutes =
      Math.floor(
        (safeSeconds %
          3600) /
          60
      );

    const secs =
      safeSeconds % 60;

    return `${String(
      hours
    ).padStart(
      2,
      "0"
    )}:${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      secs
    ).padStart(
      2,
      "0"
    )}`;
  };

  // =====================================================
  // CONVERT TIME TO ISO
  // =====================================================

  const convertTimeToISO = (time) => {
    if (!time) {
      return null;
    }

    const [
      hours,
      minutes,
    ] = time
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return null;
    }

    const date =
      new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date.toISOString();
  };

  // =====================================================
  // GET TIME IN MINUTES
  // =====================================================

  const getTimeInMinutes = (
    date
  ) => {
    return (
      date.getHours() *
        60 +
      date.getMinutes()
    );
  };

  // =====================================================
  // CHECK START PUNCTUALITY
  // =====================================================

  const checkStartPunctuality =
    () => {
      if (
        !nextStartTime
      ) {
        return;
      }

      const now =
        new Date();

      const actualMinutes =
        getTimeInMinutes(
          now
        );

      const [
        hours,
        minutes,
      ] =
        nextStartTime
          .split(":")
          .map(Number);

      const expectedDate =
        new Date();

      expectedDate.setHours(
        hours,
        minutes,
        0,
        0
      );

      const expectedMinutes =
        getTimeInMinutes(
          expectedDate
        );

      if (
        actualMinutes <
        expectedMinutes
      ) {
        if (
          onPunctualityResult
        ) {
          onPunctualityResult(
            "early"
          );
        }

        return;
      }

      if (
        actualMinutes >
        expectedMinutes
      ) {
        if (
          onPunctualityResult
        ) {
          onPunctualityResult(
            "late"
          );
        }

        return;
      }

      if (
        onPunctualityResult
      ) {
        onPunctualityResult(
          "on-time"
        );
      }
    };

  // =====================================================
  // START STUDY
  // =====================================================

  const handleStartTimer =
    async () => {
      if (
        isTimerRunning ||
        startLoading
      ) {
        return;
      }

      checkStartPunctuality();

      try {
        const result =
          await dispatch(
            startStudy({
              subject:
                selectedSubject,
            })
          ).unwrap();

        const backendStartTime =
          result?.studySession
            ?.startTime ||
          result?.session
            ?.startTime ||
          result?.startTime ||
          null;

        let sessionStartTime =
          backendStartTime
            ? new Date(
                backendStartTime
              ).getTime()
            : Date.now();

        if (
          Number.isNaN(
            sessionStartTime
          )
        ) {
          sessionStartTime =
            Date.now();
        }

        setStartTime(
          sessionStartTime
        );

        const initialSeconds =
          Math.max(
            0,
            Math.floor(
              (Date.now() -
                sessionStartTime) /
                1000
            )
          );

        setElapsedSeconds(
          initialSeconds
        );

        if (
          onLiveStudySecondsChange
        ) {
          onLiveStudySecondsChange(
            initialSeconds
          );
        }

        setIsTimerRunning(
          true
        );

        // Sync subject

        const backendSubject =
          result?.studySession
            ?.subject ||
          result?.session
            ?.subject ||
          result?.subject ||
          null;

        if (
          backendSubject
        ) {
          setSelectedSubject(
            backendSubject
          );
        }

        // Sync next start time

        const backendNextStart =
          result?.studySession
            ?.nextStartTime ||
          result?.session
            ?.nextStartTime ||
          result?.nextStartTime ||
          null;

        if (
          backendNextStart
        ) {
          const nextDate =
            new Date(
              backendNextStart
            );

          if (
            !Number.isNaN(
              nextDate.getTime()
            )
          ) {
            const hours =
              String(
                nextDate.getHours()
              ).padStart(
                2,
                "0"
              );

            const minutes =
              String(
                nextDate.getMinutes()
              ).padStart(
                2,
                "0"
              );

            setNextStartTime(
              `${hours}:${minutes}`
            );
          }
        }

        /*
         * Refresh running study.
         *
         * This keeps Redux synchronized with backend.
         */

        await dispatch(
          getRunningStudy()
        );
      } catch (error) {
        console.error(
          "Start study error:",
          error
        );

        dispatch(
          getRunningStudy()
        );
      }
    };

  // =====================================================
  // OPEN STOP MODAL
  // =====================================================

  const handleStopTimer =
    () => {
      if (
        !isTimerRunning ||
        !startTime ||
        stopLoading
      ) {
        return;
      }

      const finalSeconds =
        Math.max(
          0,
          Math.floor(
            (Date.now() -
              startTime) /
              1000
          )
        );

      setElapsedSeconds(
        finalSeconds
      );

      if (
        onLiveStudySecondsChange
      ) {
        onLiveStudySecondsChange(
          finalSeconds
        );
      }

      setShowStopModal(
        true
      );
    };

  // =====================================================
  // CONFIRM STOP
  // =====================================================

  const handleConfirmStop =
    async (e) => {
      e.preventDefault();

      if (
        !stopReason.trim()
      ) {
        return;
      }

      if (
        !nextStartInput
      ) {
        return;
      }

      if (!startTime) {
        return;
      }

      const plannedNextStartTime =
        convertTimeToISO(
          nextStartInput
        );

      if (
        !plannedNextStartTime
      ) {
        return;
      }

      const endTime =
        Date.now();

      const finalSeconds =
        Math.max(
          0,
          Math.floor(
            (endTime -
              startTime) /
              1000
          )
        );

      try {
        const sessionId =
          currentSession?._id ||
          currentSession?.id ||
          null;

        const stopPayload = {
          ...(sessionId
            ? {
                sessionId,
              }
            : {}),

          stopReason:
            stopReason.trim(),

          nextStartTime:
            plannedNextStartTime,
        };

        const result =
          await dispatch(
            stopStudy(
              stopPayload
            )
          ).unwrap();

        // =================================================
        // SEND COMPLETED SESSION TO PARENT
        // =================================================

        if (
          onStudySessionComplete
        ) {
          onStudySessionComplete({
            dateKey:
              todayKey,

            durationSeconds:
              finalSeconds,

            subject:
              selectedSubject,

            startTime,

            endTime,

            reason:
              stopReason.trim(),

            nextStartTime:
              nextStartInput,

            backendResponse:
              result,
          });
        }

        // =================================================
        // SAVE NEXT START TIME
        // =================================================

        setNextStartTime(
          nextStartInput
        );

        /*
         * IMPORTANT:
         *
         * First refresh summary.
         *
         * Backend now contains the stopped session.
         *
         * Example:
         *
         * Before stop:
         * completed = 00:00
         * current = 30:27
         *
         * After stop:
         * completed = 30:27
         * current = 00:00
         *
         * Dashboard therefore stays:
         * 30:27
         */

        await dispatch(
          getStudySummary(
            todayKey
          )
        ).unwrap();

        // Refresh running session

        await dispatch(
          getRunningStudy()
        ).unwrap();

        // Refresh targets

        dispatch(
          getTargets(
            todayKey
          )
        );

        // Refresh habits

        dispatch(
          getHabits(
            todayKey
          )
        );

        // =================================================
        // RESET LIVE SESSION ONLY
        // =================================================

        setIsTimerRunning(
          false
        );

        setStartTime(
          null
        );

        /*
         * This resets ONLY current session time.
         *
         * completedStudySeconds is now 30:27
         * from the refreshed summary.
         *
         * So Dashboard display remains 30:27.
         */

        setElapsedSeconds(
          0
        );

        if (
          onLiveStudySecondsChange
        ) {
          onLiveStudySecondsChange(
            0
          );
        }

        // =================================================
        // RESET MODAL
        // =================================================

        setStopReason("");

        setNextStartInput("");

        setShowStopModal(
          false
        );
      } catch (error) {
        console.error(
          "Stop study error:",
          error
        );
      }
    };

  // =====================================================
  // CANCEL STOP MODAL
  // =====================================================

  const handleCancelStop =
    () => {
      setShowStopModal(
        false
      );

      setStopReason("");

      setNextStartInput("");
    };

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================

  const handleSubjectChange =
    (subject) => {
      if (
        isTimerRunning
      ) {
        return;
      }

      setSelectedSubject(
        subject
      );

      /*
       * Do NOT change completedStudySeconds.
       *
       * Changing subject must not reset
       * today's overall study time.
       */

      setElapsedSeconds(0);
    };

  // =====================================================
  // TARGET TOGGLE
  // =====================================================

  const handleTargetToggle =
    async (id) => {
      if (
        targetToggleLoading
      ) {
        return;
      }

      try {
        await dispatch(
          toggleTarget(id)
        ).unwrap();

        dispatch(
          getTargets(
            todayKey
          )
        );
      } catch (error) {
        console.error(
          "Target toggle error:",
          error
        );
      }
    };

  // =====================================================
  // ADD TARGET MODAL
  // =====================================================

  const [
    showTargetModal,
    setShowTargetModal,
  ] = useState(false);

  const [
    targetTitle,
    setTargetTitle,
  ] = useState("");

  const [
    targetDuration,
    setTargetDuration,
  ] = useState("");

  // =====================================================
  // ADD TARGET
  // =====================================================

  const handleAddTarget =
    async (e) => {
      e.preventDefault();

      if (
        !targetTitle.trim() ||
        !targetDuration.trim()
      ) {
        return;
      }

      const parseDurationMinutes =
        (value) => {
          const text =
            value
              .trim()
              .toLowerCase();

          const hourMatch =
            text.match(
              /(\d+(?:\.\d+)?)\s*(hour|hours|hr|hrs|h)/
            );

          if (
            hourMatch
          ) {
            return Math.round(
              Number(
                hourMatch[1]
              ) * 60
            );
          }

          const minuteMatch =
            text.match(
              /(\d+(?:\.\d+)?)\s*(minute|minutes|min|mins|m)/
            );

          if (
            minuteMatch
          ) {
            return Math.round(
              Number(
                minuteMatch[1]
              )
            );
          }

          const number =
            Number(text);

          if (
            Number.isFinite(
              number
            ) &&
            number > 0
          ) {
            return Math.round(
              number
            );
          }

          return 0;
        };

      const durationMinutes =
        parseDurationMinutes(
          targetDuration
        );

      if (
        durationMinutes <=
        0
      ) {
        return;
      }

      try {
        await dispatch(
          createTarget({
            title:
              targetTitle.trim(),

            durationMinutes,

            date: todayKey,
          })
        ).unwrap();

        dispatch(
          getTargets(
            todayKey
          )
        );

        setTargetTitle("");

        setTargetDuration("");

        setShowTargetModal(
          false
        );
      } catch (error) {
        console.error(
          "Create target error:",
          error
        );
      }
    };

  // =====================================================
  // HABIT TOGGLE
  // =====================================================

  const handleHabitToggle =
    async (id) => {
      if (
        habitToggleLoading
      ) {
        return;
      }

      try {
        await dispatch(
          toggleHabit({
            id,
            date: todayKey,
          })
        ).unwrap();

        dispatch(
          getHabits(
            todayKey
          )
        );
      } catch (error) {
        console.error(
          "Habit toggle error:",
          error
        );
      }
    };

  // =====================================================
  // SAFE DATA
  // =====================================================

  const safeTargets =
    Array.isArray(targets)
      ? targets
      : [];

  const safeHabits =
    Array.isArray(habits)
      ? habits
      : [];

  const safeCompletedHabits =
    Number(
      completedHabits
    ) || 0;

  const safeTotalHabits =
    Number(
      totalHabits
    ) ||
    safeHabits.length;

  // =====================================================
  // VISIBLE TARGETS / HABITS
  // =====================================================

  const visibleTargets =
    safeTargets.slice(
      0,
      visibleTargetCount
    );

  const visibleHabits =
    safeHabits.slice(
      0,
      visibleHabitCount
    );

  // =====================================================
  // RESET LOAD MORE WHEN DATE CHANGES
  // =====================================================

  useEffect(() => {
    setVisibleTargetCount(5);
    setVisibleHabitCount(5);
  }, [todayKey]);

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

          {/* SUBJECT */}

          <div className="mb-5">

            <p className="text-xs font-semibold text-slate-500 mb-2">
              Select Subject
            </p>

            <div className="flex flex-wrap gap-2">

              {subjects.map(
                (subject) => {
                  const isSelected =
                    selectedSubject ===
                    subject;

                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() =>
                        handleSubjectChange(
                          subject
                        )
                      }
                      disabled={
                        isTimerRunning ||
                        startLoading
                      }
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
                }
              )}

            </div>

          </div>

          {/* TIMER DISPLAY */}

          <div className="bg-slate-50 rounded-2xl py-7 px-4 text-center border border-slate-100">

            <p className="text-xs font-medium text-slate-400 mb-2">
              {isTimerRunning
                ? `${selectedSubject} Study Time`
                : "Today's Study Time"}
            </p>

            <div className="text-4xl sm:text-5xl font-bold tracking-wider text-slate-800 font-mono">
              {formatTime(
                totalStudySeconds
              )}
            </div>

            {isTimerRunning && (
              <p className="text-xs text-emerald-500 font-medium mt-3">
                Timer will continue until you stop it
              </p>
            )}

          </div>

          {/* START / STOP */}

          <div className="mt-4">

            {!isTimerRunning ? (
              <button
                type="button"
                onClick={
                  handleStartTimer
                }
                disabled={
                  startLoading
                }
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                <Play
                  size={17}
                  fill="currentColor"
                />

                {startLoading
                  ? "Starting..."
                  : "Start Study"}
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleStopTimer
                }
                disabled={
                  stopLoading
                }
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                <Square
                  size={16}
                  fill="currentColor"
                />

                Stop Study
              </button>
            )}

          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            You can study for any duration. Stop the timer
            whenever you finish.
          </p>

        </div>

        {/* =====================================================
            TODAY'S TARGETS
        ===================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

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
                setShowTargetModal(
                  true
                )
              }
              className="flex items-center bg-purple-400 py-2 px-2 rounded-md text-white gap-1 text-xs font-semibold hover:text-purple-600 transition-colors"
            >
              <Plus size={15} />
              Add Target
            </button>

          </div>

          {/* TARGET LIST */}

          <div className="space-y-3">

            {targetsLoading ? (
              <div className="py-8 text-center">

                <p className="text-sm text-slate-400">
                  Loading targets...
                </p>

              </div>
            ) : safeTargets.length === 0 ? (
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
              visibleTargets.map(
                (target) => {
                  const targetId =
                    target.id ||
                    target._id;

                  const completed =
                    Boolean(
                      target.completed ??
                        target.isCompleted
                    );

                  const durationMinutes =
                    Number(
                      target.durationMinutes
                    ) || 0;

                  return (
                    <div
                      key={targetId}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <button
                          type="button"
                          onClick={() =>
                            handleTargetToggle(
                              targetId
                            )
                          }
                          disabled={
                            targetToggleLoading
                          }
                          className="shrink-0"
                          aria-label={`Mark ${target.title}`}
                        >
                          {completed ? (
                            <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
                              <Check
                                size={14}
                                strokeWidth={3}
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
                              completed
                                ? "text-slate-400 line-through"
                                : "text-slate-700"
                            }`}
                          >
                            {target.title}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {durationMinutes > 0
                              ? `${Math.floor(
                                  durationMinutes /
                                    60
                                )}h ${
                                  durationMinutes %
                                    60
                                    ? `${
                                        durationMinutes %
                                        60
                                      }m`
                                    : ""
                                }`
                              : "--"}
                          </p>

                        </div>

                      </div>

                      <div className="shrink-0">

                        {completed ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-500 text-[10px] font-bold">
                            Pending
                          </span>
                        )}

                      </div>

                    </div>
                  );
                }
              )
            )}

            {/* LOAD MORE TARGETS */}

            {visibleTargetCount <
              safeTargets.length && (
              <button
                type="button"
                onClick={() =>
                  setVisibleTargetCount(
                    (prev) =>
                      Math.min(
                        prev + 5,
                        safeTargets.length
                      )
                  )
                }
                className="w-full mt-3 py-2 rounded-xl border border-purple-100 bg-purple-50 text-purple-500 text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                Load More
              </button>
            )}

          </div>

        </div>

        {/* =====================================================
            TODAY'S GOOD HABITS
        ===================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

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
              {safeCompletedHabits}/
              {safeTotalHabits}
            </div>

          </div>

          {/* HABITS */}

          <div className="space-y-3">

            {habitsLoading ? (
              <div className="py-8 text-center">

                <p className="text-sm text-slate-400">
                  Loading habits...
                </p>

              </div>
            ) : safeHabits.length === 0 ? (
              <div className="py-8 text-center">

                <Flame
                  size={30}
                  className="mx-auto text-slate-300 mb-2"
                />

                <p className="text-sm text-slate-400">
                  No habits added yet
                </p>

              </div>
            ) : (
              visibleHabits.map(
                (habit) => {
                  const habitId =
                    habit.id ||
                    habit._id;

                  const completed =
                    Boolean(
                      habit.completed ??
                        habit.isCompleted
                    );

                  const title =
                    habit.title ||
                    habit.name ||
                    "Habit";

                  const subtitle =
                    habit.subtitle ||
                    habit.reminder ||
                    habit.frequency ||
                    "Daily";

                  return (
                    <div
                      key={habitId}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <button
                          type="button"
                          onClick={() =>
                            handleHabitToggle(
                              habitId
                            )
                          }
                          disabled={
                            habitToggleLoading
                          }
                          className="shrink-0"
                          aria-label={`Toggle ${title}`}
                        >
                          {completed ? (
                            <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
                              <Check
                                size={14}
                                strokeWidth={3}
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
                              completed
                                ? "text-slate-400 line-through"
                                : "text-slate-700"
                            }`}
                          >
                            {title}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {subtitle}
                          </p>

                        </div>

                      </div>

                      {completed ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold shrink-0">
                          +5
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-500 text-[10px] font-bold shrink-0">
                          Pending
                        </span>
                      )}

                    </div>
                  );
                }
              )
            )}

            {/* LOAD MORE HABITS */}

            {visibleHabitCount <
              safeHabits.length && (
              <button
                type="button"
                onClick={() =>
                  setVisibleHabitCount(
                    (prev) =>
                      Math.min(
                        prev + 5,
                        safeHabits.length
                      )
                  )
                }
                className="w-full mt-3 py-2 rounded-xl border border-orange-100 bg-orange-50 text-orange-500 text-xs font-semibold hover:bg-orange-100 transition-colors"
              >
                Load More
              </button>
            )}

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
            if (
              e.target ===
              e.currentTarget
            ) {
              handleCancelStop();
            }
          }}
        >

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

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
                onClick={
                  handleCancelStop
                }
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>

            </div>

            {/* SESSION TIME */}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-center">

              <p className="text-xs font-semibold text-blue-500 mb-1">
                {selectedSubject} Study Time
              </p>

              <p className="text-3xl font-bold font-mono text-slate-800">
                {formatTime(
                  elapsedSeconds
                )}
              </p>

            </div>

            <form
              onSubmit={
                handleConfirmStop
              }
            >

              {/* REASON */}

              <div className="mb-4">

                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Why are you stopping?
                </label>

                <textarea
                  value={
                    stopReason
                  }
                  onChange={(e) =>
                    setStopReason(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Taking dinner break, feeling tired..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />

              </div>

              {/* NEXT START */}

              <div className="mb-5">

                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  When will you start again?
                </label>

                <input
                  type="time"
                  value={
                    nextStartInput
                  }
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
                    {
                      nextStartTime
                    }
                  </p>
                )}

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={
                    handleCancelStop
                  }
                  disabled={
                    stopLoading
                  }
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Continue Studying
                </button>

                <button
                  type="submit"
                  disabled={
                    stopLoading
                  }
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {stopLoading
                    ? "Saving..."
                    : "Save & Stop"}
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
            if (
              e.target ===
              e.currentTarget
            ) {
              setShowTargetModal(
                false
              );
            }
          }}
        >

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

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
                  setShowTargetModal(
                    false
                  )
                }
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleAddTarget
              }
            >

              <div className="mb-4">

                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Target
                </label>

                <input
                  type="text"
                  value={
                    targetTitle
                  }
                  onChange={(e) =>
                    setTargetTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Biology - Genetics"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />

              </div>

              <div className="mb-5">

                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Duration
                </label>

                <input
                  type="text"
                  value={
                    targetDuration
                  }
                  onChange={(e) =>
                    setTargetDuration(
                      e.target.value
                    )
                  }
                  placeholder="e.g. 2 hours"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />

              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowTargetModal(
                      false
                    )
                  }
                  disabled={
                    targetCreateLoading
                  }
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    targetCreateLoading
                  }
                  className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {targetCreateLoading
                    ? "Adding..."
                    : "Add Target"}
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