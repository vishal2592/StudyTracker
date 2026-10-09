
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlarmClock,
  BarChart3,
  CalendarDays,
  Check,
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

import { useDispatch, useSelector } from "react-redux";

import {
  startStudy,
  stopStudy,
  getRunningStudy,
  getStudySummary,
  clearStudyError,
} from "../redux/slicer/studySlice";

import { getTargets } from "../redux/slicer/dailyTargetSlice";

const StudyTimer = () => {
  const dispatch = useDispatch();

  // =====================================================
  // STUDY REDUX STATE
  // =====================================================

  const {
    currentSession,
    isStudying,
    startLoading,
    stopLoading,
    runningLoading,
    summary,
    summaryLoading,
    error,
  } = useSelector((state) => state.study);

  // =====================================================
  // DAILY TARGET REDUX STATE
  // =====================================================

  const {
    targets,
    loading: targetLoading,
  } = useSelector(
    (state) => state.dailyTarget,
  );

  // =====================================================
  // TODAY KEY
  // =====================================================

  const getTodayKey = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      today.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayKey = getTodayKey();

  // =====================================================
  // NORMALIZE SUBJECT
  // =====================================================

  const normalizeSubject = (subject) => {
    if (!subject) {
      return "";
    }

    const value = String(subject)
      .trim()
      .toLowerCase();

    const subjectMap = {
      biology: "Biology",
      physics: "Physics",
      chemistry: "Chemistry",
      "mock test": "Mock Test",
      other: "Other",
    };

    return (
      subjectMap[value] ||
      String(subject).trim()
    );
  };

  // =====================================================
  // SUBJECTS FROM DAILY TARGETS
  // =====================================================

  const subjects = useMemo(() => {
    if (!Array.isArray(targets)) {
      return [];
    }

    return targets.map((target) => ({
      id: target._id,

      name: target.title,

      backendName: normalizeSubject(
        target.title,
      ),

      targetHours:
        Number(target.durationMinutes || 0) /
        60,

      durationMinutes:
        Number(target.durationMinutes || 0),

      color: "purple",
    }));
  }, [targets]);

  // =====================================================
  // STATES
  // =====================================================

  // IMPORTANT:
  // Last selected subject is restored from localStorage
  // after refresh.
  const [
    selectedSubjectId,
    setSelectedSubjectId,
  ] = useState(() => {
    try {
      return localStorage.getItem(
        "studyTimerLastSubjectId",
      );
    } catch (error) {
      return null;
    }
  });

  const [
    isTimerRunning,
    setIsTimerRunning,
  ] = useState(false);

  const [
    startTime,
    setStartTime,
  ] = useState(null);

  const [
    elapsedSeconds,
    setElapsedSeconds,
  ] = useState(0);

  const [
    liveSeconds,
    setLiveSeconds,
  ] = useState(0);

  // =====================================================
  // STOP MODAL
  // =====================================================

  const [
    showStopModal,
    setShowStopModal,
  ] = useState(false);

  const [
    stopReason,
    setStopReason,
  ] = useState("");

  const [
    nextStartInput,
    setNextStartInput,
  ] = useState("");

  // =====================================================
  // NEXT START TIME
  // =====================================================

  const [
    nextStartTimeState,
    setNextStartTimeState,
  ] = useState(null);

  // =====================================================
  // SELECTED SUBJECT
  // =====================================================

  const selectedSubject = useMemo(() => {
    if (!subjects.length) {
      return null;
    }

    return (
      subjects.find(
        (subject) =>
          subject.id === selectedSubjectId,
      ) || subjects[0]
    );
  }, [
    subjects,
    selectedSubjectId,
  ]);

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const errorMessage = useMemo(() => {
    if (!error) {
      return "";
    }

    if (typeof error === "string") {
      return error;
    }

    return (
      error?.message ||
      "Something went wrong"
    );
  }, [error]);

  // =====================================================
  // SAVE SELECTED SUBJECT
  // =====================================================

  const saveSelectedSubject = (
    subjectId,
  ) => {
    if (!subjectId) {
      return;
    }

    setSelectedSubjectId(
      subjectId,
    );

    try {
      localStorage.setItem(
        "studyTimerLastSubjectId",
        subjectId,
      );
    } catch (error) {
      console.error(
        "Unable to save selected subject:",
        error,
      );
    }
  };

  // =====================================================
  // FETCH TODAY'S DAILY TARGETS
  // =====================================================

  useEffect(() => {
    dispatch(
      getTargets(todayKey),
    );
  }, [dispatch, todayKey]);

  // =====================================================
  // FETCH TODAY'S STUDY SUMMARY
  // =====================================================

  useEffect(() => {
    dispatch(
      getStudySummary(todayKey),
    );
  }, [dispatch, todayKey]);

  // =====================================================
  // FETCH CURRENT RUNNING STUDY
  //
  // Backend remains the source of truth.
  // =====================================================

  useEffect(() => {
    dispatch(
      getRunningStudy(),
    );
  }, [dispatch]);

  // =====================================================
  // RESTORE LAST SELECTED SUBJECT
  //
  // IMPORTANT:
  // Do NOT blindly select subjects[0].
  //
  // If localStorage contains a valid subject ID,
  // keep that subject.
  //
  // Only use subjects[0] when there is no saved
  // subject at all.
  // =====================================================

  useEffect(() => {
    if (!subjects.length) {
      return;
    }

    const selectedStillExists =
      subjects.some(
        (subject) =>
          subject.id ===
          selectedSubjectId,
      );

    // Saved subject still exists.
    if (selectedStillExists) {
      return;
    }

    // If selectedSubjectId exists but that target
    // is no longer available today, use the first
    // available subject and save it.
    if (!selectedSubjectId) {
      saveSelectedSubject(
        subjects[0].id,
      );

      return;
    }

    // Saved subject no longer exists in today's targets.
    saveSelectedSubject(
      subjects[0].id,
    );
  }, [
    subjects,
    selectedSubjectId,
  ]);

  // =====================================================
  // GET NEXT START TIME FROM SUMMARY
  // =====================================================

  useEffect(() => {
    if (
      !summary?.sessions ||
      !summary.sessions.length
    ) {
      return;
    }

    const sessions = [
      ...summary.sessions,
    ].sort(
      (a, b) =>
        new Date(
          b.createdAt ||
            b.startTime,
        ) -
        new Date(
          a.createdAt ||
            a.startTime,
        ),
    );

    const latestSession =
      sessions[0];

    if (
      latestSession?.nextStartTime
    ) {
      const date = new Date(
        latestSession.nextStartTime,
      );

      if (
        !Number.isNaN(
          date.getTime(),
        )
      ) {
        setNextStartTimeState(
          date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        );
      }
    }
  }, [summary]);

  // =====================================================
  // SYNC RUNNING SESSION FROM REDUX
  // =====================================================

  useEffect(() => {
    if (
      isStudying &&
      currentSession
    ) {
      const sessionStartTime =
        new Date(
          currentSession.startTime,
        ).getTime();

      if (
        Number.isNaN(
          sessionStartTime,
        )
      ) {
        setIsTimerRunning(false);
        setStartTime(null);
        setLiveSeconds(0);
        return;
      }

      setIsTimerRunning(true);

      setStartTime(
        sessionStartTime,
      );

      const runningSubject =
        normalizeSubject(
          currentSession.subject,
        );

      const subject =
        subjects.find(
          (item) =>
            normalizeSubject(
              item.name,
            ) === runningSubject,
        );

      // IMPORTANT:
      // When a running session comes from backend,
      // remember that subject too.
      if (subject) {
        saveSelectedSubject(
          subject.id,
        );
      }

      return;
    }

    if (!isStudying) {
      setIsTimerRunning(false);
      setStartTime(null);
      setLiveSeconds(0);
    }
  }, [
    isStudying,
    currentSession,
    subjects,
  ]);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (
      !isTimerRunning ||
      !startTime
    ) {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();

      const seconds = Math.max(
        0,
        Math.floor(
          (now - startTime) /
            1000,
        ),
      );

      setElapsedSeconds(
        seconds,
      );

      setLiveSeconds(
        seconds,
      );
    };

    updateTimer();

    const interval =
      setInterval(
        updateTimer,
        1000,
      );

    return () => {
      clearInterval(
        interval,
      );
    };
  }, [
    isTimerRunning,
    startTime,
  ]);

  // =====================================================
  // FORMAT TIMER
  // =====================================================

  const formatTimer = (
    totalSeconds,
  ) => {
    const safeSeconds = Math.max(
      0,
      Number(totalSeconds) || 0,
    );

    const hours =
      Math.floor(
        safeSeconds / 3600,
      );

    const minutes =
      Math.floor(
        (safeSeconds % 3600) /
          60,
      );

    const seconds =
      safeSeconds % 60;

    return [
      String(hours).padStart(
        2,
        "0",
      ),
      String(minutes).padStart(
        2,
        "0",
      ),
      String(seconds).padStart(
        2,
        "0",
      ),
    ].join(":");
  };

  // =====================================================
  // FORMAT DURATION
  // =====================================================

  const formatDuration = (
    totalSeconds,
  ) => {
    const safeSeconds = Math.max(
      0,
      Number(totalSeconds) || 0,
    );

    const hours =
      Math.floor(
        safeSeconds / 3600,
      );

    const minutes =
      Math.floor(
        (safeSeconds % 3600) /
          60,
      );

    if (
      hours > 0 &&
      minutes > 0
    ) {
      return `${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h`;
    }

    return `${minutes}m`;
  };

  // =====================================================
  // FORMAT HOURS
  // =====================================================

  const formatHours = (
    hours,
  ) => {
    const safeHours = Math.max(
      0,
      Number(hours) || 0,
    );

    const wholeHours =
      Math.floor(safeHours);

    const minutes =
      Math.round(
        (safeHours -
          wholeHours) *
          60,
      );

    if (minutes === 0) {
      return `${wholeHours}h`;
    }

    if (wholeHours === 0) {
      return `${minutes}m`;
    }

    return `${wholeHours}h ${minutes}m`;
  };

  // =====================================================
  // FORMAT CLOCK TIME
  // =====================================================

  const formatClockTime = (
    timestamp,
  ) => {
    if (!timestamp) {
      return "--";
    }

    const date = new Date(
      timestamp,
    );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "--";
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  // =====================================================
  // CONVERT TIME INPUT TO ISO
  // =====================================================

  const convertTimeToISO = (
    time,
  ) => {
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
      0,
    );

    return date.toISOString();
  };

  // =====================================================
  // START TIMER
  // =====================================================

  const handleStartWithPunctuality =
    async () => {
      if (
        isTimerRunning ||
        startLoading ||
        runningLoading ||
        !selectedSubject
      ) {
        return;
      }

      try {
        dispatch(
          clearStudyError(),
        );

        // Remember selected subject before starting.
        saveSelectedSubject(
          selectedSubject.id,
        );

        const result =
          await dispatch(
            startStudy({
              subject:
                selectedSubject.backendName,
            }),
          ).unwrap();

        if (result?.session) {
          const session =
            result.session;

          const sessionStart =
            new Date(
              session.startTime,
            ).getTime();

          if (
            Number.isNaN(
              sessionStart,
            )
          ) {
            return;
          }

          // Save the actual backend subject too.
          if (session.subject) {
            const backendSubject =
              normalizeSubject(
                session.subject,
              );

            const matchedSubject =
              subjects.find(
                (subject) =>
                  normalizeSubject(
                    subject.name,
                  ) ===
                  backendSubject,
              );

            if (matchedSubject) {
              saveSelectedSubject(
                matchedSubject.id,
              );
            }
          }

          setStartTime(
            sessionStart,
          );

          setElapsedSeconds(0);

          setLiveSeconds(0);

          setIsTimerRunning(
            true,
          );

          setNextStartTimeState(
            null,
          );
        }
      } catch (error) {
        console.error(
          "Start Study Error:",
          error,
        );

        // =================================================
        // BACKEND MAY RETURN EXISTING RUNNING SESSION
        // =================================================

        if (
          error?.session &&
          error?.session?.status ===
            "running"
        ) {
          dispatch(
            clearStudyError(),
          );

          await dispatch(
            getRunningStudy(),
          );

          return;
        }

        // =============================================
        // BACKEND REQUIRES LATE REASON
        // =============================================

        if (
          error?.requiresLateReason
        ) {
          const reason =
            window.prompt(
              "You are starting late. Please enter the reason:",
            );

          if (
            reason &&
            reason.trim()
          ) {
            try {
              dispatch(
                clearStudyError(),
              );

              const result =
                await dispatch(
                  startStudy({
                    subject:
                      selectedSubject.backendName,

                    lateReason:
                      reason.trim(),
                  }),
                ).unwrap();

              if (
                result?.session
              ) {
                const session =
                  result.session;

                const sessionStart =
                  new Date(
                    session.startTime,
                  ).getTime();

                if (
                  Number.isNaN(
                    sessionStart,
                  )
                ) {
                  return;
                }

                // Save selected subject.
                saveSelectedSubject(
                  selectedSubject.id,
                );

                setStartTime(
                  sessionStart,
                );

                setElapsedSeconds(
                  0,
                );

                setLiveSeconds(
                  0,
                );

                setIsTimerRunning(
                  true,
                );

                setNextStartTimeState(
                  null,
                );
              }
            } catch (
              retryError
            ) {
              console.error(
                "Late Start Error:",
                retryError,
              );

              if (
                retryError?.session &&
                retryError?.session
                  ?.status ===
                  "running"
              ) {
                dispatch(
                  clearStudyError(),
                );

                await dispatch(
                  getRunningStudy(),
                );
              }
            }
          }
        }
      }
    };

  // =====================================================
  // STOP TIMER
  // =====================================================

  const handleStopTimer = () => {
    if (
      !isTimerRunning ||
      !startTime
    ) {
      return;
    }

    // IMPORTANT:
    // Save the subject BEFORE opening the stop modal.
    // This guarantees the last stopped subject remains
    // selected after refresh.
    if (selectedSubject?.id) {
      saveSelectedSubject(
        selectedSubject.id,
      );
    }

    const finalSeconds =
      Math.max(
        0,
        Math.floor(
          (Date.now() -
            startTime) /
            1000,
        ),
      );

    setElapsedSeconds(
      finalSeconds,
    );

    setLiveSeconds(
      finalSeconds,
    );

    setShowStopModal(
      true,
    );
  };

  // =====================================================
  // CANCEL STOP
  // =====================================================

  const handleCancelStop = () => {
    setShowStopModal(
      false,
    );

    setStopReason("");

    setNextStartInput("");
  };

  // =====================================================
  // CONFIRM STOP
  // =====================================================

  const handleConfirmStop =
    async (event) => {
      event.preventDefault();

      if (
        !stopReason.trim() ||
        !nextStartInput ||
        !startTime ||
        stopLoading
      ) {
        return;
      }

      try {
        dispatch(
          clearStudyError(),
        );

        // IMPORTANT:
        // Keep the subject that was used for this
        // session before changing any timer state.
        if (selectedSubject?.id) {
          saveSelectedSubject(
            selectedSubject.id,
          );
        }

        const plannedNextStartTime =
          convertTimeToISO(
            nextStartInput,
          );

        if (
          !plannedNextStartTime
        ) {
          return;
        }

        const result =
          await dispatch(
            stopStudy({
              stopReason:
                stopReason.trim(),

              nextStartTime:
                plannedNextStartTime,
            }),
          ).unwrap();

        // =============================================
        // STOP SUCCESS
        // =============================================

        setIsTimerRunning(
          false,
        );

        setStartTime(null);

        setElapsedSeconds(0);

        setLiveSeconds(0);

        setShowStopModal(
          false,
        );

        setStopReason("");

        setNextStartTimeState(
          nextStartInput,
        );

        setNextStartInput("");

        // =============================================
        // REFRESH RUNNING SESSION
        // =============================================

        await dispatch(
          getRunningStudy(),
        ).unwrap();

        // =============================================
        // REFRESH TARGETS
        // =============================================

        await dispatch(
          getTargets(
            todayKey,
          ),
        ).unwrap();

        // =============================================
        // REFRESH SUMMARY
        // =============================================

        await dispatch(
          getStudySummary(
            todayKey,
          ),
        ).unwrap();

        console.log(
          "Study session stopped:",
          result?.session,
        );
      } catch (error) {
        console.error(
          "Stop Study Error:",
          error,
        );
      }
    };

  // =====================================================
  // TODAY'S SESSIONS
  // =====================================================

  const todaySessions =
    useMemo(() => {
      if (
        !summary?.sessions
      ) {
        return [];
      }

      return summary.sessions.map(
        (session) => {
          const subject =
            subjects.find(
              (item) =>
                normalizeSubject(
                  item.name,
                ) ===
                normalizeSubject(
                  session.subject,
                ),
            );

          return {
            id: session._id,

            subjectId:
              subject?.id || null,

            subjectName:
              session.subject,

            startTime:
              session.startTime,

            endTime:
              session.stopTime,

            durationSeconds:
              Number(
                session.durationSeconds ??
                  Number(
                    session.durationMinutes ||
                      0,
                  ) * 60,
              ),

            reason:
              session.lateReason ||
              session.stopReason ||
              "Completed",

            punctuality:
              session.startType,

            nextStartTime:
              session.nextStartTime,

            scheduleScore:
              Number(
                session.scheduleScore ||
                  0,
              ),
          };
        },
      );
    }, [
      summary,
      subjects,
    ]);

  // =====================================================
  // COMPLETED STUDY SECONDS
  // =====================================================

  const completedStudySeconds =
    useMemo(() => {
      return todaySessions.reduce(
        (
          total,
          session,
        ) =>
          total +
          session.durationSeconds,
        0,
      );
    }, [
      todaySessions,
    ]);

  // =====================================================
  // TODAY STUDY SECONDS
  // =====================================================

  const todayStudySeconds =
    completedStudySeconds +
    (isTimerRunning
      ? liveSeconds
      : 0);

  // =====================================================
  // TODAY TARGET
  // =====================================================

  const todayTargetSeconds =
    selectedSubject
      ? selectedSubject.targetHours *
        60 *
        60
      : 0;

  // =====================================================
  // SUBJECT STUDY SECONDS
  // =====================================================

  const subjectStudySeconds =
    useMemo(() => {
      if (!selectedSubject) {
        return 0;
      }

      return todaySessions
        .filter(
          (session) =>
            normalizeSubject(
              session.subjectName,
            ) ===
            normalizeSubject(
              selectedSubject.name,
            ),
        )
        .reduce(
          (
            total,
            session,
          ) =>
            total +
            session.durationSeconds,
          0,
        );
    }, [
      todaySessions,
      selectedSubject,
    ]);

  // =====================================================
  // SUBJECT CURRENT SECONDS
  // =====================================================

  const subjectCurrentSeconds =
    subjectStudySeconds +
    (isTimerRunning
      ? liveSeconds
      : 0);

  // =====================================================
  // TARGET PROGRESS
  // =====================================================

  const targetProgress =
    todayTargetSeconds > 0
      ? Math.min(
          100,
          Math.round(
            (subjectCurrentSeconds /
              todayTargetSeconds) *
              100,
          ),
        )
      : 0;

  // =====================================================
  // REMAINING
  // =====================================================

  const remainingSeconds =
    Math.max(
      0,
      todayTargetSeconds -
        subjectCurrentSeconds,
    );

  // =====================================================
  // TOTAL DAILY TARGET
  // =====================================================

  const totalDailyTargetHours =
    subjects.reduce(
      (
        total,
        subject,
      ) =>
        total +
        subject.targetHours,
      0,
    );

  const totalDailyTargetSeconds =
    totalDailyTargetHours *
    60 *
    60;

  // =====================================================
  // TOTAL DAILY PROGRESS
  // =====================================================

  const totalDailyProgress =
    totalDailyTargetSeconds > 0
      ? Math.min(
          100,
          Math.round(
            (todayStudySeconds /
              totalDailyTargetSeconds) *
              100,
          ),
        )
      : 0;

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
      },
    );

  // =====================================================
  // SUBJECT STYLE
  // =====================================================

  const getSubjectStyle = (
    name,
  ) => {
    const normalized =
      normalizeSubject(name);

    const styles = {
      Physics: {
        icon:
          "bg-indigo-100 text-indigo-600",
        gradient:
          "from-indigo-500 to-blue-500",
      },

      Chemistry: {
        icon:
          "bg-blue-100 text-blue-600",
        gradient:
          "from-blue-500 to-cyan-500",
      },

      Biology: {
        icon:
          "bg-emerald-100 text-emerald-600",
        gradient:
          "from-emerald-500 to-teal-500",
      },

      "Mock Test": {
        icon:
          "bg-purple-100 text-purple-600",
        gradient:
          "from-purple-500 to-indigo-500",
      },

      Other: {
        icon:
          "bg-slate-100 text-slate-600",
        gradient:
          "from-slate-500 to-slate-700",
      },
    };

    return (
      styles[normalized] || {
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
    punctuality,
  ) => {
    if (
      punctuality === "early"
    ) {
      return {
        text: "Started Early",

        className:
          "bg-emerald-50 text-emerald-700",
      };
    }

    if (
      punctuality === "late"
    ) {
      return {
        text: "Started Late",

        className:
          "bg-orange-50 text-orange-700",
      };
    }

    if (
      punctuality === "on-time"
    ) {
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
    <div className="min-h-screen bg-slate-50 p-1 sm:p-2 lg:p-3">
      <div className="mx-auto max-w-7xl">

        {errorMessage && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() =>
                dispatch(
                  clearStudyError(),
                )
              }
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* HEADER */}

        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        {/* NO TARGET */}

        {!targetLoading &&
          subjects.length === 0 && (
            <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <h3 className="text-sm font-semibold text-amber-900">
                    No study targets for today
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Please create today's Daily Target first.
                    Your subjects and target hours will
                    automatically appear here.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* TIMER + SIDE INFO */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* MAIN TIMER */}

          <div className="lg:col-span-2">
            <div
              className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm sm:p-8 ${
                isTimerRunning
                  ? "border-purple-200"
                  : "border-slate-200"
              }`}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-100/60 blur-3xl" />

              <div className="relative">

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

                {/* SUBJECT */}

                <div className="mx-auto mt-4 max-w-md">
                  <label className="mb-2 block text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Study Subject
                  </label>

                  <div className="relative">
                    <select
                      value={
                        selectedSubjectId ||
                        ""
                      }
                      disabled={
                        isTimerRunning ||
                        startLoading ||
                        runningLoading ||
                        targetLoading ||
                        subjects.length ===
                          0
                      }
                      onChange={(e) =>
                        saveSelectedSubject(
                          e.target.value,
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-center text-sm font-semibold text-slate-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {subjects.length ===
                      0 ? (
                        <option value="">
                          No targets available
                        </option>
                      ) : (
                        subjects.map(
                          (subject) => (
                            <option
                              key={
                                subject.id
                              }
                              value={
                                subject.id
                              }
                            >
                              {
                                subject.name
                              }{" "}
                              —{" "}
                              {formatHours(
                                subject.targetHours,
                              )}
                            </option>
                          ),
                        )
                      )}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* TIMER */}

                <div className="mt-8 text-center">
                  <div className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
                    {runningLoading &&
                    !currentSession ? (
                      <span className="text-3xl text-slate-400 sm:text-4xl">
                        Loading...
                      </span>
                    ) : (
                      formatTimer(
                        todayStudySeconds,
                      )
                    )}
                  </div>

                  {isTimerRunning &&
                    startTime && (
                      <p className="mt-3 text-sm text-slate-500">
                        Started at{" "}
                        <span className="font-semibold text-slate-700">
                          {formatClockTime(
                            startTime,
                          )}
                        </span>
                      </p>
                    )}
                </div>

                {/* BUTTONS */}

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {!isTimerRunning ? (
                    <button
                      type="button"
                      disabled={
                        startLoading ||
                        runningLoading ||
                        summaryLoading ||
                        targetLoading ||
                        !selectedSubject
                      }
                      onClick={
                        handleStartWithPunctuality
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {startLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                          Starting...
                        </>
                      ) : runningLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                          Checking Session...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-current" />

                          Start Studying
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-7 py-3.5 text-sm font-semibold text-slate-400 sm:w-auto"
                      >
                        <Pause className="h-4 w-4" />

                        Pause
                      </button>

                      <button
                        type="button"
                        disabled={
                          stopLoading
                        }
                        onClick={
                          handleStopTimer
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {stopLoading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                            Saving...
                          </>
                        ) : (
                          <>
                            <Square className="h-4 w-4 fill-current" />

                            Stop Session
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* NEXT START NOTICE */}

                {!isTimerRunning &&
                  nextStartTimeState && (
                    <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-3 text-xs font-medium text-purple-700">
                      <AlarmClock className="h-4 w-4" />

                      <span>
                        Next session planned
                        for{" "}
                        <strong>
                          {
                            nextStartTimeState
                          }
                        </strong>
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* SIDE TARGET CARD */}

          <div className="space-y-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Today's Target
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {selectedSubject
                      ? selectedSubject.name
                      : "No Target"}
                  </h3>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    selectedSubject
                      ? getSubjectStyle(
                          selectedSubject.name,
                        ).icon
                      : "bg-slate-100 text-slate-500"
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
                      selectedSubject
                        ? getSubjectStyle(
                            selectedSubject.name,
                          ).gradient
                        : "from-purple-500 to-indigo-500"
                    } transition-all duration-500`}
                    style={{
                      width: `${targetProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {formatDuration(
                      subjectCurrentSeconds,
                    )}{" "}
                    studied
                  </span>

                  <span className="font-medium text-slate-700">
                    Target{" "}
                    {selectedSubject
                      ? formatHours(
                          selectedSubject.targetHours,
                        )
                      : "0h"}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-purple-600" />

                  <span className="text-xs text-slate-600">
                    {remainingSeconds >
                    0
                      ? `${formatDuration(
                          remainingSeconds,
                        )} remaining`
                      : "Target completed"}
                  </span>
                </div>
              </div>
            </div>

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
                    —
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Your study streak will appear here
                when the streak tracking API is connected.
              </p>
            </div>
          </div>
        </div>

        {/* TODAY SUMMARY */}

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Today's Study
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatDuration(
                    todayStudySeconds,
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

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Daily Target
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatHours(
                    totalDailyTargetHours,
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

        {/* TODAY'S SESSIONS */}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Today's Sessions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your completed study sessions for
                today.
              </p>
            </div>

            <div className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
              {todaySessions.length}{" "}
              completed
            </div>
          </div>

          <div className="mt-5 space-y-3">

            {summaryLoading &&
              todaySessions.length ===
                0 && (
                <div className="rounded-xl bg-slate-50 py-10 text-center">
                  <span className="mx-auto block h-6 w-6 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    Loading sessions...
                  </p>
                </div>
              )}

            {!summaryLoading &&
              todaySessions.length ===
                0 && (
                <div className="rounded-xl bg-slate-50 py-10 text-center">
                  <Clock3 className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No completed sessions
                    yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Start your first study
                    session today.
                  </p>
                </div>
              )}

            {todaySessions
              .slice()
              .reverse()
              .map((session) => {
                const punctuality =
                  getPunctualityLabel(
                    session.punctuality,
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
                            session.subjectName,
                          ).icon
                        }`}
                      >
                        <Check className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {
                            session.subjectName
                          }
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatClockTime(
                            session.startTime,
                          )}{" "}
                          →{" "}
                          {formatClockTime(
                            session.endTime,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {formatDuration(
                          session.durationSeconds,
                        )}
                      </span>

                      {punctuality && (
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${punctuality.className}`}
                        >
                          {
                            punctuality.text
                          }
                        </span>
                      )}

                      <span className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-500">
                        {
                          session.reason
                        }
                      </span>
                    </div>
                  </div>
                );
              })}

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
                          {
                            selectedSubject?.name ||
                            currentSession?.subject ||
                            "Study"
                          }
                        </h3>

                        <p className="mt-1 text-xs text-purple-700">
                          Started at{" "}
                          {formatClockTime(
                            startTime,
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-purple-700">
                      {formatTimer(
                        liveSeconds,
                      )}
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* TODAY SUBJECT OVERVIEW */}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Today's Subject Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              See how much time you have spent
              on each subject.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjects.map(
              (subject) => {
                const subjectSeconds =
                  todaySessions
                    .filter(
                      (session) =>
                        normalizeSubject(
                          session.subjectName,
                        ) ===
                        normalizeSubject(
                          subject.name,
                        ),
                    )
                    .reduce(
                      (
                        total,
                        session,
                      ) =>
                        total +
                        session.durationSeconds,
                      0,
                    ) +
                  (isTimerRunning &&
                  selectedSubject?.id ===
                    subject.id
                    ? liveSeconds
                    : 0);

                const subjectTargetSeconds =
                  subject.targetHours *
                  3600;

                const progress =
                  subjectTargetSeconds >
                  0
                    ? Math.min(
                        100,
                        Math.round(
                          (subjectSeconds /
                            subjectTargetSeconds) *
                            100,
                        ),
                      )
                    : 0;

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
                              subject.name,
                            ).icon
                          }`}
                        >
                          <span className="text-sm font-bold">
                            {subject.name.charAt(
                              0,
                            ).toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {
                              subject.name
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            Target{" "}
                            {formatHours(
                              subject.targetHours,
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
                            subject.name,
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
                          subjectSeconds,
                        )}{" "}
                        studied
                      </span>

                      <span className="text-xs font-medium text-slate-600">
                        {progress >=
                        100
                          ? "Target completed"
                          : `${formatDuration(
                              Math.max(
                                0,
                                subjectTargetSeconds -
                                  subjectSeconds,
                              ),
                            )} remaining`}
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* INFORMATION NOTE */}

        <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <Target className="h-4 w-4 text-purple-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-purple-900">
                How Study Timer works
              </h3>

              <p className="mt-1 text-xs leading-5 text-purple-700">
                Your study sessions are saved
                automatically in the backend. This page
                records the actual time you spend studying.
                Those sessions can later be used by Subject
                Tracker and Study Analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STOP SESSION MODAL */}

      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

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
                onClick={
                  handleCancelStop
                }
                disabled={
                  stopLoading
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={
                handleConfirmStop
              }
              className="p-5"
            >

              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-xs font-medium text-purple-600">
                  You studied for
                </p>

                <p className="mt-1 text-2xl font-bold text-purple-900">
                  {formatTimer(
                    elapsedSeconds,
                  )}
                </p>

                <p className="mt-1 text-xs text-purple-600">
                  {selectedSubject?.name ||
                    currentSession?.subject ||
                    "Study"}
                </p>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Why are you stopping?
                </label>

                <div className="relative">
                  <select
                    value={
                      stopReason
                    }
                    onChange={(e) =>
                      setStopReason(
                        e.target.value,
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                    disabled={
                      stopLoading
                    }
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

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  When will you start again?
                </label>

                <div className="relative">
                  <AlarmClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="time"
                    value={
                      nextStartInput
                    }
                    onChange={(e) =>
                      setNextStartInput(
                        e.target.value,
                      )
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    disabled={
                      stopLoading
                    }
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  This will be used to calculate whether
                  your next session starts early, on time,
                  or late.
                </p>
              </div>

              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    handleCancelStop
                  }
                  disabled={
                    stopLoading
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue Studying
                </button>

                <button
                  type="submit"
                  disabled={
                    !stopReason ||
                    !nextStartInput ||
                    stopLoading
                  }
                  className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
};

export default StudyTimer;

