import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";

const SubjectTracker = () => {
  // =====================================================
  // DUMMY SUBJECT DATA
  // Later this data will come from Daily Targets / Redux
  // =====================================================

  const [subjects] = useState([
    {
      id: 1,
      name: "Mathematics",
      description: "Algebra, Calculus, Geometry",
      targetHours: 20,
      studyHours: 16.5,
      totalTargets: 14,
      completedTargets: 11,
      sessions: 9,
      lastStudied: "Today",
      streak: 5,
      weeklyHours: [2, 3, 1.5, 2.5, 3, 2, 0.5],
      topics: [
        { name: "Algebra", completed: true },
        { name: "Calculus", completed: true },
        { name: "Geometry", completed: true },
        { name: "Probability", completed: false },
        { name: "Trigonometry", completed: false },
      ],
    },
    {
      id: 2,
      name: "Physics",
      description: "Mechanics, Electricity, Optics",
      targetHours: 18,
      studyHours: 11.5,
      totalTargets: 12,
      completedTargets: 8,
      sessions: 7,
      lastStudied: "Today",
      streak: 3,
      weeklyHours: [1, 2, 1.5, 2, 1, 2.5, 1.5],
      topics: [
        { name: "Mechanics", completed: true },
        { name: "Current Electricity", completed: true },
        { name: "Optics", completed: true },
        { name: "Magnetism", completed: false },
        { name: "Modern Physics", completed: false },
      ],
    },
    {
      id: 3,
      name: "Chemistry",
      description: "Organic, Inorganic, Physical",
      targetHours: 16,
      studyHours: 11.75,
      totalTargets: 10,
      completedTargets: 7,
      sessions: 6,
      lastStudied: "Yesterday",
      streak: 4,
      weeklyHours: [1.5, 2, 2.5, 1, 2, 1.5, 1.25],
      topics: [
        { name: "Organic Chemistry", completed: true },
        { name: "Chemical Bonding", completed: true },
        { name: "Thermodynamics", completed: true },
        { name: "Equilibrium", completed: false },
        { name: "Coordination Compounds", completed: false },
      ],
    },
    {
      id: 4,
      name: "Biology",
      description: "Human Physiology, Genetics, Ecology",
      targetHours: 15,
      studyHours: 12,
      totalTargets: 9,
      completedTargets: 8,
      sessions: 8,
      lastStudied: "Today",
      streak: 7,
      weeklyHours: [2, 1.5, 2, 2.5, 1.5, 1.5, 1],
      topics: [
        { name: "Human Physiology", completed: true },
        { name: "Genetics", completed: true },
        { name: "Ecology", completed: true },
        { name: "Cell Biology", completed: true },
        { name: "Evolution", completed: false },
      ],
    },
  ]);

  // =====================================================
  // STATE
  // =====================================================

  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState("This Month");
  const [sortBy, setSortBy] = useState("progress");

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const getProgress = (subject) => {
    if (!subject.targetHours) return 0;

    return Math.min(
      100,
      Math.round((subject.studyHours / subject.targetHours) * 100)
    );
  };

  const getTargetCompletion = (subject) => {
    if (!subject.totalTargets) return 0;

    return Math.round(
      (subject.completedTargets / subject.totalTargets) * 100
    );
  };

  const totalStudyHours = useMemo(() => {
    return subjects.reduce((sum, subject) => sum + subject.studyHours, 0);
  }, [subjects]);

  const totalTargets = useMemo(() => {
    return subjects.reduce((sum, subject) => sum + subject.totalTargets, 0);
  }, [subjects]);

  const completedTargets = useMemo(() => {
    return subjects.reduce(
      (sum, subject) => sum + subject.completedTargets,
      0
    );
  }, [subjects]);

  const averageProgress = useMemo(() => {
    if (!subjects.length) return 0;

    const total = subjects.reduce(
      (sum, subject) => sum + getProgress(subject),
      0
    );

    return Math.round(total / subjects.length);
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    let result =
      selectedSubject === "all"
        ? [...subjects]
        : subjects.filter((subject) => subject.name === selectedSubject);

    if (sortBy === "progress") {
      result.sort((a, b) => getProgress(b) - getProgress(a));
    }

    if (sortBy === "hours") {
      result.sort((a, b) => b.studyHours - a.studyHours);
    }

    if (sortBy === "targets") {
      result.sort(
        (a, b) =>
          getTargetCompletion(b) -
          getTargetCompletion(a)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [subjects, selectedSubject, sortBy]);

  // =====================================================
  // FORMAT HOURS
  // =====================================================

  const formatHours = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours}h`;
    }

    return `${wholeHours}h ${minutes}m`;
  };

  // =====================================================
  // SUBJECT COLORS
  // =====================================================

  const subjectStyles = {
    Mathematics: {
      icon: "bg-purple-100 text-purple-600",
      progress: "from-purple-500 to-indigo-500",
      light: "bg-purple-50",
    },
    Physics: {
      icon: "bg-indigo-100 text-indigo-600",
      progress: "from-indigo-500 to-blue-500",
      light: "bg-indigo-50",
    },
    Chemistry: {
      icon: "bg-blue-100 text-blue-600",
      progress: "from-blue-500 to-cyan-500",
      light: "bg-blue-50",
    },
    Biology: {
      icon: "bg-emerald-100 text-emerald-600",
      progress: "from-emerald-500 to-teal-500",
      light: "bg-emerald-50",
    },
  };

  const getSubjectStyle = (name) => {
    return (
      subjectStyles[name] || {
        icon: "bg-purple-100 text-purple-600",
        progress: "from-purple-500 to-indigo-500",
        light: "bg-purple-50",
      }
    );
  };

  // =====================================================
  // WEEKLY TOTALS
  // =====================================================

  const weeklyTotals = useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0];

    subjects.forEach((subject) => {
      subject.weeklyHours.forEach((hours, index) => {
        totals[index] += hours;
      });
    });

    return totals;
  }, [subjects]);

  const maxWeeklyHours = Math.max(...weeklyTotals, 1);

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
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>

              <span className="text-sm font-semibold text-purple-600">
                Performance Tracking
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Subject Tracker
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
              Track your study progress, targets, consistency and
              performance subject by subject.
            </p>
          </div>

          {/* Date Range */}
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Study */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Study Time
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatHours(totalStudyHours)}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Across all subjects
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <Clock3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Targets */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Target Completion
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {completedTargets}/{totalTargets}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Targets completed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Average Progress
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {averageProgress}%
                </h2>

                <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Subjects
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {subjects.length}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Being tracked
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Subject Performance
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Compare your study performance across subjects.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Subject Filter */}
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) =>
                    setSelectedSubject(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 sm:w-48"
                >
                  <option value="all">All Subjects</option>

                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 sm:w-44"
                >
                  <option value="progress">
                    Highest Progress
                  </option>

                  <option value="hours">
                    Most Study Hours
                  </option>

                  <option value="targets">
                    Target Completion
                  </option>

                  <option value="name">
                    Subject Name
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* =================================================
              SUBJECT LIST
          ================================================= */}

          <div className="space-y-4 xl:col-span-2">
            {filteredSubjects.map((subject) => {
              const progress = getProgress(subject);
              const targetCompletion =
                getTargetCompletion(subject);

              const style = getSubjectStyle(subject.name);

              return (
                <div
                  key={subject.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Subject Header */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                      >
                        <span className="text-lg font-bold">
                          {subject.name.charAt(0)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {subject.name}
                        </h3>

                        <p className="mt-0.5 text-sm text-slate-500">
                          {subject.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                        <Flame className="h-3.5 w-3.5" />
                        {subject.streak} day streak
                      </div>
                    </div>
                  </div>

                  {/* Progress */}

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-slate-700">
                          Study Progress
                        </span>

                        <span className="ml-2 text-xs text-slate-400">
                          {formatHours(subject.studyHours)} /{" "}
                          {formatHours(subject.targetHours)}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-purple-600">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${style.progress} transition-all duration-500`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Targets
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {subject.completedTargets}/
                        {subject.totalTargets}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Completion
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {targetCompletion}%
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Sessions
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {subject.sessions}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Last Studied
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {subject.lastStudied}
                      </p>
                    </div>
                  </div>

                  {/* Topics */}

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-800">
                        Topics
                      </h4>

                      <span className="text-xs font-medium text-slate-500">
                        {
                          subject.topics.filter(
                            (topic) => topic.completed
                          ).length
                        }{" "}
                        / {subject.topics.length} completed
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {subject.topics.map((topic, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                            topic.completed
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <span className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                          )}

                          {topic.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSubjects.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                <BarChart3 className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-3 text-lg font-semibold text-slate-800">
                  No subject data
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  There is no tracking data for the selected subject.
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-6">
            {/* Weekly Activity */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Weekly Activity
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Total study time by day
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
              </div>

              <div className="mt-6 flex h-44 items-end justify-between gap-2">
                {weeklyTotals.map((hours, index) => {
                  const days = [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                  ];

                  const height =
                    (hours / maxWeeklyHours) * 100;

                  return (
                    <div
                      key={index}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-2 text-[10px] font-semibold text-slate-500">
                        {hours}h
                      </span>

                      <div className="flex h-28 w-full items-end justify-center">
                        <div
                          className="w-full max-w-7 rounded-t-lg bg-gradient-to-t from-purple-600 to-indigo-400 transition-all"
                          style={{
                            height: `${Math.max(height, 8)}%`,
                          }}
                        />
                      </div>

                      <span className="mt-2 text-[10px] font-medium text-slate-400">
                        {days[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Best Subject */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Best Performing Subject
                  </h3>

                  <p className="text-xs text-slate-500">
                    Based on current progress
                  </p>
                </div>
              </div>

              {subjects.length > 0 && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  {(() => {
                    const bestSubject = [...subjects].sort(
                      (a, b) => getProgress(b) - getProgress(a)
                    )[0];

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">
                            {bestSubject.name}
                          </span>

                          <span className="font-bold text-emerald-600">
                            {getProgress(bestSubject)}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                              width: `${getProgress(
                                bestSubject
                              )}%`,
                            }}
                          />
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                          {formatHours(bestSubject.studyHours)}{" "}
                          studied with{" "}
                          {bestSubject.completedTargets}{" "}
                          completed targets.
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Improvement Area */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <ArrowUp className="h-5 w-5 text-orange-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Needs More Focus
                  </h3>

                  <p className="text-xs text-slate-500">
                    Subject with lowest progress
                  </p>
                </div>
              </div>

              {subjects.length > 0 && (
                <div className="mt-5 rounded-xl bg-orange-50 p-4">
                  {(() => {
                    const weakSubject = [...subjects].sort(
                      (a, b) => getProgress(a) - getProgress(b)
                    )[0];

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">
                            {weakSubject.name}
                          </span>

                          <span className="font-bold text-orange-600">
                            {getProgress(weakSubject)}%
                          </span>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-600">
                          You have completed{" "}
                          {weakSubject.completedTargets} of{" "}
                          {weakSubject.totalTargets} targets.
                          Consider giving this subject more
                          study time.
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            SUBJECT COMPARISON
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Subject Comparison
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Compare study hours and target completion.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ArrowDown className="h-3.5 w-3.5" />
              Sorted by performance
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Subject
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Study Time
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Targets
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Completion
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Progress
                  </th>

                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSubjects.map((subject) => {
                  const progress = getProgress(subject);
                  const targetCompletion =
                    getTargetCompletion(subject);

                  return (
                    <tr
                      key={subject.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              getSubjectStyle(subject.name).icon
                            }`}
                          >
                            <span className="text-sm font-bold">
                              {subject.name.charAt(0)}
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-slate-800">
                            {subject.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 text-sm text-slate-600">
                        {formatHours(subject.studyHours)}
                      </td>

                      <td className="py-4 text-sm text-slate-600">
                        {subject.completedTargets}/
                        {subject.totalTargets}
                      </td>

                      <td className="py-4">
                        <span className="text-sm font-semibold text-slate-700">
                          {targetCompletion}%
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-slate-600">
                            {progress}%
                          </span>
                        </div>
                      </td>

                      <td className="py-4 text-right">
                        {progress >= 80 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            On Track
                          </span>
                        ) : progress >= 60 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Improving
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                            <ArrowUp className="h-3.5 w-3.5" />
                            Needs Focus
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
              <Target className="h-4 w-4 text-purple-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-purple-900">
                How Subject Tracker works
              </h3>

              <p className="mt-1 text-xs leading-5 text-purple-700">
                Subjects are tracked automatically from your Daily
                Targets and study sessions. This page is only for
                viewing your subject-wise performance — subjects are
                not created or edited here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTracker;