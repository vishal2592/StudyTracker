import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { getSubjectTracker } from "../redux/slicer/subjectTrackerSlice";
import { getStudySummary } from "../redux/slicer/studySlice";
import { getTargets } from "../redux/slicer/dailyTargetSlice";


// =====================================================
// DATE HELPERS
// =====================================================

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// =====================================================
// SUBJECT DISPLAY NAME
// =====================================================

const formatSubjectName = (subject = "") => {
  return String(subject)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
};


// =====================================================
// SUBJECT KEY
// =====================================================

const normalizeSubject = (subject = "") => {
  return String(subject)
    .trim()
    .toLowerCase();
};


// =====================================================
// FORMAT MINUTES
// =====================================================

const formatMinutes = (minutes = 0) => {
  const value = Math.max(
    0,
    Number(minutes) || 0,
  );

  if (value === 0) {
    return "0m";
  }

  const hours = Math.floor(
    value / 60,
  );

  const mins = value % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};


// =====================================================
// FORMAT HOURS
// =====================================================

const formatHours = (hours = 0) => {
  const value = Number(hours) || 0;

  return formatMinutes(
    Math.round(value * 60),
  );
};


// =====================================================
// FORMAT LAST STUDIED
// =====================================================

const formatLastStudied = (
  dateString,
) => {
  if (!dateString) {
    return "—";
  }

  const date = new Date(
    dateString,
  );

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  );
};


// =====================================================
// COMPONENT
// =====================================================

const SubjectTracker = () => {
  const dispatch = useDispatch();

  // ===================================================
  // LOCAL STATE
  // ===================================================

  const [selectedSubject, setSelectedSubject] =
    useState("All Subjects");

  const [sortBy, setSortBy] =
    useState("Study Hours");


  // ===================================================
  // SUBJECT TRACKER REDUX
  // ===================================================

  const {
    tracker,
    loading: trackerLoading,
    error: trackerError,
  } = useSelector(
    (state) =>
      state.subjectTracker || {},
  );


  // ===================================================
  // STUDY TIMER REDUX
  // ===================================================

  const {
    summary,
    summaryLoading,
    error: summaryError,
  } = useSelector(
    (state) =>
      state.study || {},
  );


  // ===================================================
  // DAILY TARGET REDUX
  // ===================================================

  const {
    targets = [],
    totalTargets = 0,
    completedTargets = 0,
    pendingTargets = 0,
    loading: targetLoading,
    error: targetError,
  } = useSelector(
    (state) =>
      state.dailyTarget || {},
  );


  // ===================================================
  // TODAY
  // ===================================================

  const today = useMemo(
    () => getToday(),
    [],
  );


  // ===================================================
  // FETCH TODAY'S DATA
  // ===================================================

  useEffect(() => {
    // -----------------------------------------------
    // Subject Tracker
    // -----------------------------------------------

    dispatch(
      getSubjectTracker(today),
    );

    // -----------------------------------------------
    // Study Timer Summary
    // -----------------------------------------------

    dispatch(
      getStudySummary(today),
    );

    // -----------------------------------------------
    // Daily Targets
    // -----------------------------------------------

    dispatch(
      getTargets(today),
    );
  }, [
    dispatch,
    today,
  ]);


  // ===================================================
  // DYNAMIC SUBJECTS
  //
  // Subjects are loaded from today's Daily Targets.
  // ===================================================

  const dynamicSubjects = useMemo(() => {
    if (!Array.isArray(targets)) {
      return [];
    }

    const subjectMap = new Map();

    targets.forEach((target) => {
      const rawTitle =
        String(
          target?.title || "",
        ).trim();

      if (!rawTitle) {
        return;
      }

      const key =
        normalizeSubject(
          rawTitle,
        );

      if (!key) {
        return;
      }

      if (!subjectMap.has(key)) {
        subjectMap.set(
          key,
          {
            key,
            name:
              formatSubjectName(
                rawTitle,
              ),
          },
        );
      }
    });

    return Array.from(
      subjectMap.values(),
    );
  }, [targets]);


  // ===================================================
  // BUILD SUBJECT DATA
  // ===================================================

  const subjects = useMemo(() => {
    // -------------------------------------------------
    // BACKEND SUBJECT TRACKER DATA
    //
    // Controller now returns selected day's data only.
    // -------------------------------------------------

    const subjectWiseHours =
      tracker?.subjectWiseHours ||
      {};

    const subjectWiseMinutes =
      tracker?.subjectWise ||
      {};


    // -------------------------------------------------
    // STUDY TIMER SESSIONS
    //
    // getStudySummary(today) returns today's sessions.
    // -------------------------------------------------

    const studySessions =
      Array.isArray(
        summary?.sessions,
      )
        ? summary.sessions
        : [];


    // -------------------------------------------------
    // CREATE SESSION MAP
    // -------------------------------------------------

    const sessionMap = new Map();

    dynamicSubjects.forEach(
      (subject) => {
        sessionMap.set(
          subject.key,
          {
            sessions: 0,
            todayMinutes: 0,
            lastStudied: null,
          },
        );
      },
    );


    // -------------------------------------------------
    // ADD TODAY'S STUDY TIMER DATA
    // -------------------------------------------------

    studySessions.forEach(
      (session) => {
        const sessionSubject =
          String(
            session?.subject || "",
          ).trim();

        if (!sessionSubject) {
          return;
        }

        const key =
          normalizeSubject(
            sessionSubject,
          );

        // Only subjects from today's targets
        if (!sessionMap.has(key)) {
          return;
        }

        const current =
          sessionMap.get(key);

        const durationMinutes =
          Number(
            session?.durationMinutes,
          ) || 0;

        current.sessions += 1;

        current.todayMinutes +=
          durationMinutes;

        // Find latest session
        if (
          session?.startTime
        ) {
          if (
            !current.lastStudied ||
            new Date(
              session.startTime,
            ) >
              new Date(
                current.lastStudied,
              )
          ) {
            current.lastStudied =
              session.startTime;
          }
        }

        sessionMap.set(
          key,
          current,
        );
      },
    );


    // -------------------------------------------------
    // CREATE TARGET MAP
    // -------------------------------------------------

    const targetMap = new Map();

    dynamicSubjects.forEach(
      (subject) => {
        targetMap.set(
          subject.key,
          {
            totalTargets: 0,
            completedTargets: 0,
            targetMinutes: 0,
          },
        );
      },
    );


    // -------------------------------------------------
    // ADD TODAY'S DAILY TARGET DATA
    // -------------------------------------------------

    targets.forEach((target) => {
      const rawTitle =
        String(
          target?.title || "",
        ).trim();

      if (!rawTitle) {
        return;
      }

      const key =
        normalizeSubject(
          rawTitle,
        );

      if (!targetMap.has(key)) {
        return;
      }

      const current =
        targetMap.get(key);

      current.totalTargets += 1;

      current.targetMinutes +=
        Number(
          target?.durationMinutes,
        ) || 0;

      if (
        target?.isCompleted === true
      ) {
        current.completedTargets +=
          1;
      }

      targetMap.set(
        key,
        current,
      );
    });


    // -------------------------------------------------
    // FINAL SUBJECT OBJECTS
    // -------------------------------------------------

    return dynamicSubjects.map(
      (subject) => {
        const key =
          subject.key;

        const targetData =
          targetMap.get(key) || {
            totalTargets: 0,
            completedTargets: 0,
            targetMinutes: 0,
          };

        const sessionData =
          sessionMap.get(key) || {
            sessions: 0,
            todayMinutes: 0,
            lastStudied: null,
          };


        // ---------------------------------------------
        // STUDY TIME
        //
        // New Subject Tracker Controller:
        //
        // subjectWise = minutes
        // subjectWiseHours = hours
        // ---------------------------------------------

        const studyMinutes =
          Number(
            subjectWiseMinutes?.[
              subject.name
            ],
          ) || 0;


        const studyHours =
          Number(
            subjectWiseHours?.[
              subject.name
            ],
          ) ||
          studyMinutes / 60;


        // ---------------------------------------------
        // TARGET TIME
        //
        // Comes from Daily Target durationMinutes.
        // ---------------------------------------------

        const targetMinutes =
          Number(
            targetData.targetMinutes,
          ) || 0;


        // ---------------------------------------------
        // PROGRESS
        //
        // Actual Study Time / Today's Target Time
        // ---------------------------------------------

        let progress = 0;

        if (
          targetMinutes > 0
        ) {
          progress = Math.round(
            (studyMinutes /
              targetMinutes) *
              100,
          );

          progress =
            Math.min(
              progress,
              100,
            );
        }


        // ---------------------------------------------
        // TARGET COMPLETION
        // ---------------------------------------------

        let targetCompletion = 0;

        if (
          targetData.totalTargets >
          0
        ) {
          targetCompletion =
            Math.round(
              (targetData.completedTargets /
                targetData.totalTargets) *
                100,
            );
        }


        // ---------------------------------------------
        // REMAINING TIME
        // ---------------------------------------------

        const remainingMinutes =
          Math.max(
            targetMinutes -
              studyMinutes,
            0,
          );


        return {
          id: key,

          key,

          name:
            subject.name,

          description:
            `${subject.name} study and preparation`,

          // -----------------------------------------
          // STUDY TIMER
          // -----------------------------------------

          studyMinutes,

          studyHours,

          todayMinutes:
            sessionData.todayMinutes,

          sessions:
            sessionData.sessions,

          lastStudied:
            sessionData.lastStudied,

          // -----------------------------------------
          // DAILY TARGET
          // -----------------------------------------

          targetMinutes,

          targetHours:
            targetMinutes / 60,

          totalTargets:
            targetData.totalTargets,

          completedTargets:
            targetData.completedTargets,

          pendingTargets:
            Math.max(
              targetData.totalTargets -
                targetData.completedTargets,
              0,
            ),

          // -----------------------------------------
          // PROGRESS
          // -----------------------------------------

          progress,

          targetCompletion,

          remainingMinutes,

          // -----------------------------------------
          // UI COMPATIBILITY
          // -----------------------------------------

          streak: 0,

          weeklyHours: 0,

          topics: [],
        };
      },
    );
  }, [
    dynamicSubjects,
    targets,
    tracker,
    summary,
  ]);


  // ===================================================
  // FILTER + SORT
  // ===================================================

  const filteredSubjects =
    useMemo(() => {
      let result = [
        ...subjects,
      ];

      // -----------------------------------------------
      // SUBJECT FILTER
      // -----------------------------------------------

      if (
        selectedSubject !==
        "All Subjects"
      ) {
        result =
          result.filter(
            (subject) =>
              subject.key ===
              normalizeSubject(
                selectedSubject,
              ),
          );
      }


      // -----------------------------------------------
      // SORT
      // -----------------------------------------------

      switch (sortBy) {
        case "Study Hours":
          result.sort(
            (a, b) =>
              b.studyMinutes -
              a.studyMinutes,
          );
          break;

        case "Target Progress":
          result.sort(
            (a, b) =>
              b.progress -
              a.progress,
          );
          break;

        case "Sessions":
          result.sort(
            (a, b) =>
              b.sessions -
              a.sessions,
          );
          break;

        case "Last Studied":
          result.sort(
            (a, b) => {
              if (
                !a.lastStudied
              ) {
                return 1;
              }

              if (
                !b.lastStudied
              ) {
                return -1;
              }

              return (
                new Date(
                  b.lastStudied,
                ) -
                new Date(
                  a.lastStudied,
                )
              );
            },
          );
          break;

        default:
          break;
      }

      return result;
    }, [
      subjects,
      selectedSubject,
      sortBy,
    ]);


  // ===================================================
  // TOTAL STUDY
  //
  // Comes from new daily Subject Tracker controller.
  // ===================================================

  const totalStudyMinutes =
    Number(
      tracker?.totalStudyMinutes,
    ) || 0;

  const totalStudyHours =
    Number(
      tracker?.totalStudyHours,
    ) ||
    totalStudyMinutes / 60;


  // ===================================================
  // TOTAL TARGETS
  //
  // Comes directly from today's Daily Target API.
  // ===================================================

  const actualTotalTargets =
    Number(totalTargets);

  const actualCompletedTargets =
    Number(completedTargets);

  const actualPendingTargets =
    Number(pendingTargets);


  // ===================================================
  // TARGET COMPLETION
  // ===================================================

  const targetCompletion =
    actualTotalTargets > 0
      ? Math.round(
          (actualCompletedTargets /
            actualTotalTargets) *
            100,
        )
      : 0;


  // ===================================================
  // AVERAGE PROGRESS
  //
  // Daily study time vs daily target time.
  // =====================================================

  const subjectsWithTargets =
    subjects.filter(
      (subject) =>
        subject.targetMinutes >
        0,
    );

  const averageProgress =
    subjectsWithTargets.length >
    0
      ? Math.round(
          subjectsWithTargets.reduce(
            (sum, subject) =>
              sum +
              subject.progress,
            0,
          ) /
            subjectsWithTargets.length,
        )
      : 0;


  // ===================================================
  // ACTIVE SUBJECTS
  // ===================================================

  const activeSubjects =
    subjects.length;


  // ===================================================
  // BEST PERFORMING
  // ===================================================

  const bestSubject =
    useMemo(() => {
      if (!subjects.length) {
        return null;
      }

      return [...subjects].sort(
        (a, b) => {
          if (
            b.progress !==
            a.progress
          ) {
            return (
              b.progress -
              a.progress
            );
          }

          return (
            b.studyMinutes -
            a.studyMinutes
          );
        },
      )[0];
    }, [subjects]);


  // ===================================================
  // NEEDS MORE FOCUS
  // ===================================================

  const focusSubject =
    useMemo(() => {
      if (!subjects.length) {
        return null;
      }

      return [...subjects].sort(
        (a, b) => {
          if (
            a.progress !==
            b.progress
          ) {
            return (
              a.progress -
              b.progress
            );
          }

          return (
            a.studyMinutes -
            b.studyMinutes
          );
        },
      )[0];
    }, [subjects]);


  // ===================================================
  // LOADING
  // ===================================================

  const isLoading =
    trackerLoading ||
    summaryLoading ||
    targetLoading;


  // ===================================================
  // ERROR
  // ===================================================

  const error =
    trackerError ||
    summaryError ||
    targetError;


  // ===================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-1 sm:p-2 lg:p-3">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-4 flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <BookOpen size={20} />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Subject Tracker
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Track your study progress subject-wise
                </p>

              </div>

            </div>
          </div>


          {/* TODAY */}

          <div className="relative">

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

              <CalendarDays
                size={18}
                className="text-slate-500"
              />

              <span className="text-sm font-medium text-slate-700">
                Today
              </span>

              <ChevronDown
                size={16}
                className="text-slate-400"
              />

            </div>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

            <XCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>

              <p className="font-medium">
                Unable to load tracker data
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>

            </div>

          </div>
        )}


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL STUDY TIME */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Study Time
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading
                    ? "..."
                    : formatHours(
                        totalStudyHours,
                      )}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {formatMinutes(
                    totalStudyMinutes,
                  )}{" "}
                  today
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock3 size={21} />
              </div>

            </div>

          </div>


          {/* TARGET COMPLETION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Target Completion
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading
                    ? "..."
                    : `${targetCompletion}%`}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {actualCompletedTargets}/
                  {actualTotalTargets}{" "}
                  targets
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Target size={21} />
              </div>

            </div>

          </div>


          {/* AVERAGE PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Average Progress
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading
                    ? "..."
                    : `${averageProgress}%`}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Today's study vs target
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <TrendingUp size={21} />
              </div>

            </div>

          </div>


          {/* ACTIVE SUBJECTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Active Subjects
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading
                    ? "..."
                    : activeSubjects}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Today's target subjects
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Activity size={21} />
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                Subject Performance
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Today's study time and target progress
              </p>

            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SUBJECT FILTER */}

              <div className="relative">

                <select
                  value={
                    selectedSubject
                  }
                  onChange={(e) =>
                    setSelectedSubject(
                      e.target.value,
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-48"
                >

                  <option value="All Subjects">
                    All Subjects
                  </option>

                  {dynamicSubjects.map(
                    (subject) => (
                      <option
                        key={
                          subject.key
                        }
                        value={
                          subject.name
                        }
                      >
                        {subject.name}
                      </option>
                    ),
                  )}

                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>


              {/* SORT */}

              <div className="relative">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value,
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-48"
                >

                  <option value="Study Hours">
                    Study Hours
                  </option>

                  <option value="Target Progress">
                    Target Progress
                  </option>

                  <option value="Sessions">
                    Sessions
                  </option>

                  <option value="Last Studied">
                    Last Studied
                  </option>

                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

          {/* =================================================
              SUBJECT LIST
          ================================================= */}

          <div className="space-y-4 xl:col-span-2">

            {isLoading ? (
              <>
                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >

                      <div className="mb-5 h-6 w-40 rounded bg-slate-200" />

                      <div className="mb-4 h-3 rounded bg-slate-200" />

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                        <div className="h-12 rounded bg-slate-100" />

                        <div className="h-12 rounded bg-slate-100" />

                        <div className="h-12 rounded bg-slate-100" />

                        <div className="h-12 rounded bg-slate-100" />

                      </div>

                    </div>
                  ),
                )}
              </>
            ) : filteredSubjects.length ===
              0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <BookOpen
                  size={38}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-900">
                  No targets for today
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create a Daily Target to see the subject here.
                </p>

              </div>
            ) : (
              filteredSubjects.map(
                (subject) => (
                  <div
                    key={
                      subject.id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >

                    {/* SUBJECT HEADER */}

                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <BookOpen size={20} />
                        </div>

                        <div>

                          <h3 className="text-lg font-bold text-slate-900">
                            {
                              subject.name
                            }
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {
                              subject.description
                            }
                          </p>

                        </div>

                      </div>


                      {subject.sessions >
                        0 && (
                        <div className="flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">

                          <Flame
                            size={14}
                          />

                          Active

                        </div>
                      )}

                    </div>


                    {/* =================================================
                        PROGRESS BAR
                    ================================================= */}

                    <div className="mb-6">

                      <div className="mb-2 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <Target
                            size={16}
                            className="text-blue-600"
                          />

                          <span className="text-sm font-medium text-slate-700">
                            Study Progress
                          </span>

                        </div>

                        <span className="text-sm font-bold text-slate-900">
                          {
                            subject.progress
                          }
                          %
                        </span>

                      </div>


                      {/* BAR */}

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-700"
                          style={{
                            width: `${subject.progress}%`,
                          }}
                        />

                      </div>


                      {/* STUDY VS TARGET */}

                      <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

                        <span>
                          Studied:{" "}
                          <strong className="text-slate-700">
                            {formatMinutes(
                              subject.studyMinutes,
                            )}
                          </strong>
                        </span>

                        <span>
                          Target:{" "}
                          <strong className="text-slate-700">
                            {formatMinutes(
                              subject.targetMinutes,
                            )}
                          </strong>
                        </span>

                        <span>
                          {subject.progress >=
                          100
                            ? "Target completed"
                            : `${formatMinutes(
                                subject.remainingMinutes,
                              )} remaining`}
                        </span>

                      </div>


                      {/* TARGET BADGES */}

                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          Targets:{" "}
                          {
                            subject.totalTargets
                          }
                        </span>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          Completed:{" "}
                          {
                            subject.completedTargets
                          }
                        </span>

                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                          Pending:{" "}
                          {
                            subject.pendingTargets
                          }
                        </span>

                      </div>

                    </div>


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                      {/* STUDY TIME */}

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">

                          <Clock3
                            size={14}
                          />

                          Study Time

                        </div>

                        <p className="font-bold text-slate-900">
                          {formatMinutes(
                            subject.studyMinutes,
                          )}
                        </p>

                      </div>


                      {/* SESSIONS */}

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">

                          <Activity
                            size={14}
                          />

                          Sessions

                        </div>

                        <p className="font-bold text-slate-900">
                          {
                            subject.sessions
                          }
                        </p>

                      </div>


                      {/* TARGET */}

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">

                          <CheckCircle2
                            size={14}
                          />

                          Target

                        </div>

                        <p className="font-bold text-slate-900">
                          {
                            subject.completedTargets
                          }
                          /
                          {
                            subject.totalTargets
                          }
                        </p>

                      </div>


                      {/* LAST STUDIED */}

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">

                          <CalendarDays
                            size={14}
                          />

                          Last Studied

                        </div>

                        <p className="break-words text-sm font-bold text-slate-900">
                          {subject.lastStudied
                            ? formatLastStudied(
                                subject.lastStudied,
                              )
                            : "—"}
                        </p>

                      </div>

                    </div>


                    {/* TODAY SESSION */}

                    {subject.todayMinutes >
                      0 && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">

                        <Clock3
                          size={16}
                        />

                        <span>
                          Today you studied{" "}
                          <strong>
                            {formatMinutes(
                              subject.todayMinutes,
                            )}
                          </strong>{" "}
                          in{" "}
                          <strong>
                            {
                              subject.sessions
                            }
                          </strong>{" "}
                          {subject.sessions ===
                          1
                            ? "session"
                            : "sessions"}
                          .
                        </span>

                      </div>
                    )}

                  </div>
                ),
              )
            )}

          </div>


          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-4">

            {/* DAILY OVERVIEW */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h3 className="font-bold text-slate-900">
                    Today's Activity
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Study activity overview
                  </p>

                </div>

                <Activity
                  size={20}
                  className="text-blue-600"
                />

              </div>


              <div className="space-y-4">

                {/* STUDY */}

                <div className="rounded-xl bg-blue-50 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Clock3
                        size={17}
                        className="text-blue-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Study Time
                      </span>

                    </div>

                    <span className="font-bold text-blue-700">
                      {formatMinutes(
                        totalStudyMinutes,
                      )}
                    </span>

                  </div>

                </div>


                {/* TARGET */}

                <div className="rounded-xl bg-emerald-50 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Target
                        size={17}
                        className="text-emerald-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Targets
                      </span>

                    </div>

                    <span className="font-bold text-emerald-700">
                      {actualCompletedTargets}/
                      {actualTotalTargets}
                    </span>

                  </div>

                </div>


                {/* SESSIONS */}

                <div className="rounded-xl bg-violet-50 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Activity
                        size={17}
                        className="text-violet-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Sessions
                      </span>

                    </div>

                    <span className="font-bold text-violet-700">
                      {Array.isArray(
                        summary?.sessions,
                      )
                        ? summary.sessions.length
                        : 0}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* BEST PERFORMING */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Trophy size={18} />
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Best Performing Subject
                  </h3>

                  <p className="text-xs text-slate-500">
                    Based on today's study progress
                  </p>

                </div>

              </div>


              {bestSubject ? (
                <div>

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-slate-900">
                      {
                        bestSubject.name
                      }
                    </span>

                    <span className="font-bold text-emerald-600">
                      {
                        bestSubject.progress
                      }
                      %
                    </span>

                  </div>


                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${bestSubject.progress}%`,
                      }}
                    />

                  </div>


                  <p className="mt-3 text-xs text-slate-500">
                    {formatMinutes(
                      bestSubject.studyMinutes,
                    )}{" "}
                    studied ·{" "}
                    {
                      bestSubject.sessions
                    }{" "}
                    sessions
                  </p>

                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No performance data yet.
                </p>
              )}

            </div>


            {/* NEEDS MORE FOCUS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Target size={18} />
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Needs More Focus
                  </h3>

                  <p className="text-xs text-slate-500">
                    Lowest study progress today
                  </p>

                </div>

              </div>


              {focusSubject ? (
                <div>

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-slate-900">
                      {
                        focusSubject.name
                      }
                    </span>

                    <span className="font-bold text-red-600">
                      {
                        focusSubject.progress
                      }
                      %
                    </span>

                  </div>


                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{
                        width: `${focusSubject.progress}%`,
                      }}
                    />

                  </div>


                  <p className="mt-3 text-xs text-slate-500">
                    {formatMinutes(
                      focusSubject.remainingMinutes,
                    )}{" "}
                    remaining
                  </p>

                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No target data yet.
                </p>
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            SUBJECT COMPARISON
        ================================================= */}

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <h2 className="font-bold text-slate-900">
              Subject Comparison
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Compare today's study time, targets and sessions
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50 text-left">

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subject
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Study Time
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Target
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Progress
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sessions
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Studied
                  </th>

                </tr>

              </thead>


              <tbody>

                {subjects.map(
                  (subject) => (
                    <tr
                      key={
                        subject.id
                      }
                      className="border-b border-slate-100 last:border-b-0"
                    >

                      {/* SUBJECT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                            <BookOpen
                              size={15}
                            />

                          </div>

                          <span className="font-semibold text-slate-900">
                            {
                              subject.name
                            }
                          </span>

                        </div>

                      </td>


                      {/* STUDY TIME */}

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">

                        {formatMinutes(
                          subject.studyMinutes,
                        )}

                      </td>


                      {/* TARGET */}

                      <td className="px-5 py-4">

                        <div className="text-sm text-slate-700">

                          {
                            subject.completedTargets
                          }
                          /
                          {
                            subject.totalTargets
                          }

                        </div>

                        <div className="mt-1 text-xs text-slate-400">

                          {formatMinutes(
                            subject.targetMinutes,
                          )}

                        </div>

                      </td>


                      {/* PROGRESS */}

                      <td className="px-5 py-4">

                        <div className="flex min-w-[150px] items-center gap-3">

                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-blue-600 transition-all duration-500"
                              style={{
                                width: `${subject.progress}%`,
                              }}
                            />

                          </div>

                          <span className="text-xs font-bold text-slate-700">

                            {
                              subject.progress
                            }
                            %

                          </span>

                        </div>

                      </td>


                      {/* SESSIONS */}

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">

                        {
                          subject.sessions
                        }

                      </td>


                      {/* LAST STUDIED */}

                      <td className="px-5 py-4 text-sm text-slate-500">

                        {subject.lastStudied
                          ? formatLastStudied(
                              subject.lastStudied,
                            )
                          : "—"}

                      </td>

                    </tr>
                  ),
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">

              <BookOpen size={18} />

            </div>

            <div>

              <h3 className="font-semibold text-blue-900">
                How Subject Tracker works
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">

                Subjects are automatically loaded from today's
                Daily Targets. Target duration comes from the
                Daily Target API, while actual study time and
                subject-wise study data come from the Subject
                Tracker API. Sessions and Last Studied come from
                today's Study Timer Summary. Study Progress is
                calculated using today's actual study time against
                today's target duration.

              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SubjectTracker;