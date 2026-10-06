
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

const StudyAnalytics = () => {
  // =====================================================
  // DATE STATE
  // =====================================================

  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  // =====================================================
  // DEMO DAILY DATA
  // Later this data can come from Redux / API
  // =====================================================

  const dailyData = {
    "2026-10-06": {
      studySeconds: 8 * 3600 + 35 * 60,

      sessions: [
        {
          id: 1,
          subject: "Biology",
          startTime: "06:10 PM",
          endTime: "08:10 PM",
          durationSeconds: 2 * 3600,
        },
        {
          id: 2,
          subject: "Physics",
          startTime: "09:05 PM",
          endTime: "11:30 PM",
          durationSeconds: 2 * 3600 + 25 * 60,
        },
        {
          id: 3,
          subject: "Chemistry",
          startTime: "11:45 PM",
          endTime: "01:55 AM",
          durationSeconds: 2 * 3600 + 10 * 60,
        },
        {
          id: 4,
          subject: "MCQ Practice",
          startTime: "02:15 AM",
          endTime: "04:15 AM",
          durationSeconds: 2 * 3600,
        },
      ],

      targets: [
        {
          id: 1,
          title: "Biology - Human Physiology",
          duration: "2 hours",
          completed: true,
        },
        {
          id: 2,
          title: "Physics - Current Electricity",
          duration: "2 hours",
          completed: true,
        },
        {
          id: 3,
          title: "Chemistry - Organic Chemistry",
          duration: "1.5 hours",
          completed: true,
        },
        {
          id: 4,
          title: "50 MCQs Practice",
          duration: "1 hour",
          completed: false,
        },
        {
          id: 5,
          title: "Revision - Previous Questions",
          duration: "1 hour",
          completed: true,
        },
      ],

      habits: [
        {
          id: 1,
          title: "Wake up early",
          subtitle: "Before 6:00 AM",
          completed: true,
        },
        {
          id: 2,
          title: "Drink enough water",
          subtitle: "8 glasses",
          completed: true,
        },
        {
          id: 3,
          title: "No social media",
          subtitle: "During study hours",
          completed: true,
        },
        {
          id: 4,
          title: "Exercise",
          subtitle: "30 minutes",
          completed: false,
        },
        {
          id: 5,
          title: "Sleep on time",
          subtitle: "Before 11:00 PM",
          completed: false,
        },
      ],

      punctuality: [
        {
          id: 1,
          expected: "09:10 PM",
          actual: "08:50 PM",
          status: "early",
          score: 5,
        },
        {
          id: 2,
          expected: "11:45 PM",
          actual: "11:45 PM",
          status: "on-time",
          score: 0,
        },
        {
          id: 3,
          expected: "02:00 AM",
          actual: "02:15 AM",
          status: "late",
          score: -5,
        },
      ],
    },
  };

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const getDateKey = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // SELECTED DAY DATA
  // =====================================================

  const dateKey = getDateKey(selectedDate);

  const selectedDayData = dailyData[dateKey] || {
    studySeconds: 0,
    sessions: [],
    targets: [],
    habits: [],
    punctuality: [],
  };

  // =====================================================
  // DERIVED DATA
  // =====================================================

  const completedTargets = selectedDayData.targets.filter(
    (target) => target.completed
  ).length;

  const totalTargets =
    selectedDayData.targets.length;

  const pendingTargets =
    totalTargets - completedTargets;

  const completedHabits =
    selectedDayData.habits.filter(
      (habit) => habit.completed
    ).length;

  const totalHabits =
    selectedDayData.habits.length;

  const pendingHabits =
    totalHabits - completedHabits;

  const earlyStarts =
    selectedDayData.punctuality.filter(
      (item) => item.status === "early"
    ).length;

  const lateStarts =
    selectedDayData.punctuality.filter(
      (item) => item.status === "late"
    ).length;

  const twelveHourBonus =
    selectedDayData.studySeconds >=
    12 * 60 * 60
      ? 5
      : 0;

  const targetPositiveScore =
    completedTargets;

  const targetNegativeScore =
    pendingTargets;

  const habitPositiveScore =
    completedHabits * 5;

  const habitNegativeScore =
    pendingHabits * 5;

  const punctualityPositiveScore =
    earlyStarts * 5;

  const punctualityNegativeScore =
    lateStarts * 5;

  const positiveScore =
    twelveHourBonus +
    targetPositiveScore +
    habitPositiveScore +
    punctualityPositiveScore;

  const negativeScore =
    targetNegativeScore +
    habitNegativeScore +
    punctualityNegativeScore;

  // =====================================================
  // FORMAT STUDY TIME
  // =====================================================

  const formatStudyTime = (seconds) => {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    if (hours === 0) {
      return `${minutes}m`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  // =====================================================
  // CHANGE DATE
  // =====================================================

  const changeDate = (amount) => {
    const newDate = new Date(selectedDate);

    newDate.setDate(
      newDate.getDate() + amount
    );

    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // =====================================================
  // CHECK TODAY
  // =====================================================

  const isToday = useMemo(() => {
    const todayKey = getDateKey(
      new Date()
    );

    return todayKey === dateKey;
  }, [dateKey]);

  // =====================================================
  // MONTH CALENDAR
  // =====================================================

  const [calendarMonth, setCalendarMonth] =
    useState(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
    );

  const calendarYear =
    calendarMonth.getFullYear();

  const calendarMonthIndex =
    calendarMonth.getMonth();

  const daysInMonth = new Date(
    calendarYear,
    calendarMonthIndex + 1,
    0
  ).getDate();

  const firstDay = new Date(
    calendarYear,
    calendarMonthIndex,
    1
  ).getDay();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  const changeCalendarMonth = (amount) => {
    setCalendarMonth(
      new Date(
        calendarYear,
        calendarMonthIndex + amount,
        1
      )
    );
  };

  const selectCalendarDate = (day) => {
    if (!day) return;

    const newDate = new Date(
      calendarYear,
      calendarMonthIndex,
      day
    );

    const today = new Date();

    if (newDate > today) {
      return;
    }

    setSelectedDate(newDate);
  };

  // =====================================================
  // MONTHLY SUMMARY
  // =====================================================

  const monthlySummary = {
    totalStudyHours: 86,
    twelveHourDays: 6,
    targetsCompleted: 42,
    positiveScore: 318,
    negativeScore: 74,
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">

              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <ChartIcon />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Study Analytics
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Track your daily study performance,
                  targets and scores.
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={goToToday}
            className="w-fit px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Today
          </button>

        </div>

      </div>

      {/* =================================================
          DATE NAVIGATION
      ================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">

        <div className="flex items-center justify-between gap-3">

          <button
            onClick={() =>
              changeDate(-1)
            }
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="text-center">

            <div className="flex items-center justify-center gap-2 text-slate-500 mb-1">
              <CalendarDays size={17} />

              <span className="text-xs font-semibold uppercase tracking-wide">
                Selected Date
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-slate-800">
              {formatDate(selectedDate)}
            </h2>

            {isToday && (
              <span className="inline-flex mt-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                Today
              </span>
            )}

          </div>

          <button
            onClick={() =>
              changeDate(1)
            }
            disabled={isToday}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${
              isToday
                ? "border-slate-100 text-slate-300 cursor-not-allowed"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ArrowRight size={19} />
          </button>

        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">

        <AnalyticsCard
          icon={
            <Clock3
              size={21}
              className="text-emerald-500"
            />
          }
          title={formatStudyTime(
            selectedDayData.studySeconds
          )}
          subtitle="Study Time"
          extra={
            selectedDayData.studySeconds >=
            12 * 3600
              ? "12h target completed"
              : "Target 12h"
          }
          bg="bg-emerald-50"
        />

        <AnalyticsCard
          icon={
            <Target
              size={21}
              className="text-purple-500"
            />
          }
          title={`${completedTargets}/${totalTargets}`}
          subtitle="Targets"
          extra={`${pendingTargets} pending`}
          bg="bg-purple-50"
        />

        <AnalyticsCard
          icon={
            <Trophy
              size={21}
              className="text-orange-500"
            />
          }
          title={`+${positiveScore}`}
          subtitle="Positive Score"
          extra="Today's total"
          bg="bg-orange-50"
        />

        <AnalyticsCard
          icon={
            <Flame
              size={21}
              className="text-red-500"
            />
          }
          title={`-${negativeScore}`}
          subtitle="Negative Score"
          extra="Today's total"
          bg="bg-red-50"
        />

        <AnalyticsCard
          icon={
            <Zap
              size={21}
              className="text-blue-500"
            />
          }
          title={`${earlyStarts}/${lateStarts}`}
          subtitle="Early / Late"
          extra="Start performance"
          bg="bg-blue-50"
        />

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ===============================================
            LEFT / MAIN COLUMN
        =============================================== */}

        <div className="xl:col-span-2 space-y-5">

          {/* =============================================
              STUDY SESSIONS
          ============================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Study Sessions
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Every study session for this day
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                {selectedDayData.sessions.length} Sessions
              </div>

            </div>

            {selectedDayData.sessions.length ===
            0 ? (
              <EmptyState
                icon={<Clock3 size={24} />}
                text="No study sessions recorded for this day."
              />
            ) : (
              <div className="space-y-3">

                {selectedDayData.sessions.map(
                  (session) => (
                    <div
                      key={session.id}
                      className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Clock3
                              size={19}
                              className="text-indigo-500"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {session.subject}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                              {session.startTime}{" "}
                              →{" "}
                              {session.endTime}
                            </p>
                          </div>

                        </div>

                        <div className="text-left md:text-right">

                          <div className="text-base font-bold text-slate-800">
                            {formatStudyTime(
                              session.durationSeconds
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 mt-1">
                            Study duration
                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

              <span className="text-sm font-semibold text-slate-600">
                Total Study Time
              </span>

              <span className="text-lg font-bold text-emerald-600">
                {formatStudyTime(
                  selectedDayData.studySeconds
                )}
              </span>

            </div>

          </section>

          {/* =============================================
              TARGETS
          ============================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Daily Targets
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Target completion for this day
                </p>
              </div>

              <div className="text-sm font-bold text-purple-600">
                {completedTargets}/{totalTargets}
              </div>

            </div>

            {selectedDayData.targets.length ===
            0 ? (
              <EmptyState
                icon={<Target size={24} />}
                text="No targets recorded for this day."
              />
            ) : (
              <div className="space-y-2">

                {selectedDayData.targets.map(
                  (target) => (
                    <div
                      key={target.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                        target.completed
                          ? "bg-emerald-50/50 border-emerald-100"
                          : "bg-red-50/40 border-red-100"
                      }`}
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        {target.completed ? (
                          <CheckCircle2
                            size={20}
                            className="text-emerald-500 shrink-0"
                          />
                        ) : (
                          <XCircle
                            size={20}
                            className="text-red-400 shrink-0"
                          />
                        )}

                        <div className="min-w-0">

                          <p
                            className={`text-sm font-semibold truncate ${
                              target.completed
                                ? "text-slate-700"
                                : "text-slate-600"
                            }`}
                          >
                            {target.title}
                          </p>

                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {target.duration}
                          </p>

                        </div>

                      </div>

                      <span
                        className={`shrink-0 text-xs font-bold ${
                          target.completed
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {target.completed
                          ? "+1"
                          : "-1"}
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

          {/* =============================================
              GOOD HABITS
          ============================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <div className="mb-5">

              <h2 className="text-lg font-bold text-slate-800">
                Good Habits
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Daily habit performance
              </p>

            </div>

            {selectedDayData.habits.length ===
            0 ? (
              <EmptyState
                icon={<CheckCircle2 size={24} />}
                text="No habits recorded for this day."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {selectedDayData.habits.map(
                  (habit) => (
                    <div
                      key={habit.id}
                      className={`p-4 rounded-xl border ${
                        habit.completed
                          ? "bg-emerald-50/50 border-emerald-100"
                          : "bg-red-50/40 border-red-100"
                      }`}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex gap-3">

                          {habit.completed ? (
                            <CheckCircle2
                              size={20}
                              className="text-emerald-500 mt-0.5"
                            />
                          ) : (
                            <XCircle
                              size={20}
                              className="text-red-400 mt-0.5"
                            />
                          )}

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {habit.title}
                            </p>

                            <p className="text-[11px] text-slate-500 mt-1">
                              {habit.subtitle}
                            </p>
                          </div>

                        </div>

                        <span
                          className={`text-xs font-bold ${
                            habit.completed
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {habit.completed
                            ? "+5"
                            : "-5"}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>

        {/* ===============================================
            RIGHT COLUMN
        =============================================== */}

        <div className="space-y-5">

          {/* =============================================
              SCORE BREAKDOWN
          ============================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <div className="mb-5">

              <h2 className="text-lg font-bold text-slate-800">
                Score Breakdown
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                How today's score was calculated
              </p>

            </div>

            <div className="space-y-3">

              <ScoreRow
                label="12h Study Bonus"
                value={`+${twelveHourBonus}`}
                positive
              />

              <ScoreRow
                label={`Completed Targets (${completedTargets})`}
                value={`+${targetPositiveScore}`}
                positive
              />

              <ScoreRow
                label={`Completed Habits (${completedHabits})`}
                value={`+${habitPositiveScore}`}
                positive
              />

              <ScoreRow
                label={`Early Starts (${earlyStarts})`}
                value={`+${punctualityPositiveScore}`}
                positive
              />

              <div className="my-4 border-t border-slate-100" />

              <ScoreRow
                label={`Pending Targets (${pendingTargets})`}
                value={`-${targetNegativeScore}`}
                positive={false}
              />

              <ScoreRow
                label={`Incomplete Habits (${pendingHabits})`}
                value={`-${habitNegativeScore}`}
                positive={false}
              />

              <ScoreRow
                label={`Late Starts (${lateStarts})`}
                value={`-${punctualityNegativeScore}`}
                positive={false}
              />

            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100">

              <div className="rounded-xl bg-orange-50 p-3">
                <p className="text-[11px] text-slate-500">
                  Positive
                </p>

                <p className="text-xl font-bold text-orange-600 mt-1">
                  +{positiveScore}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-[11px] text-slate-500">
                  Negative
                </p>

                <p className="text-xl font-bold text-red-600 mt-1">
                  -{negativeScore}
                </p>
              </div>

            </div>

          </section>

          {/* =============================================
              PUNCTUALITY
          ============================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <div className="mb-5">

              <h2 className="text-lg font-bold text-slate-800">
                Start Performance
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Expected vs actual next start
              </p>

            </div>

            {selectedDayData.punctuality.length ===
            0 ? (
              <EmptyState
                icon={<Zap size={24} />}
                text="No planned start times recorded."
              />
            ) : (
              <div className="space-y-3">

                {selectedDayData.punctuality.map(
                  (item) => {

                    const isEarly =
                      item.status === "early";

                    const isLate =
                      item.status === "late";

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-100"
                      >

                        <div className="flex items-center justify-between mb-3">

                          <span className="text-xs font-semibold text-slate-500">
                            Start #{item.id}
                          </span>

                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              isEarly
                                ? "bg-emerald-50 text-emerald-600"
                                : isLate
                                ? "bg-red-50 text-red-500"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isEarly
                              ? "Early"
                              : isLate
                              ? "Late"
                              : "On Time"}
                          </span>

                        </div>

                        <div className="grid grid-cols-2 gap-3">

                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">
                              Expected
                            </p>

                            <p className="text-sm font-bold text-slate-700 mt-1">
                              {item.expected}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">
                              Actual
                            </p>

                            <p className="text-sm font-bold text-slate-700 mt-1">
                              {item.actual}
                            </p>
                          </div>

                        </div>

                        <div
                          className={`mt-3 pt-3 border-t border-slate-100 text-xs font-bold ${
                            item.score > 0
                              ? "text-emerald-600"
                              : item.score < 0
                              ? "text-red-500"
                              : "text-slate-500"
                          }`}
                        >
                          {item.score > 0
                            ? `+${item.score} Positive`
                            : item.score < 0
                            ? `${item.score} Negative`
                            : "0 On Time"}
                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>

        </div>

      </div>

      {/* =================================================
          MONTHLY OVERVIEW
      ================================================= */}

      <section className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Monthly Overview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Overall performance for this month
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            {selectedDate.toLocaleDateString(
              "en-IN",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">

          <MiniSummary
            label="Study Hours"
            value={`${monthlySummary.totalStudyHours}h`}
            icon={
              <Clock3
                size={18}
                className="text-emerald-500"
              />
            }
          />

          <MiniSummary
            label="12h+ Days"
            value={monthlySummary.twelveHourDays}
            icon={
              <Trophy
                size={18}
                className="text-orange-500"
              />
            }
          />

          <MiniSummary
            label="Targets Done"
            value={monthlySummary.targetsCompleted}
            icon={
              <Target
                size={18}
                className="text-purple-500"
              />
            }
          />

          <MiniSummary
            label="Positive"
            value={`+${monthlySummary.positiveScore}`}
            icon={
              <TrendingUp
                size={18}
                className="text-emerald-500"
              />
            }
          />

          <MiniSummary
            label="Negative"
            value={`-${monthlySummary.negativeScore}`}
            icon={
              <TrendingDown
                size={18}
                className="text-red-500"
              />
            }
          />

        </div>

      </section>

      {/* =================================================
          CALENDAR
      ================================================= */}

      <section className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Study Calendar
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Select any previous day to view its details
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                changeCalendarMonth(-1)
              }
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
            </button>

            <button
              onClick={() =>
                changeCalendarMonth(1)
              }
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
            >
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

        <div className="text-center font-bold text-slate-800 mb-4">
          {calendarMonth.toLocaleDateString(
            "en-IN",
            {
              month: "long",
              year: "numeric",
            }
          )}
        </div>

        {/* WEEK DAYS */}

        <div className="grid grid-cols-7 gap-1.5 mb-2">

          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] md:text-xs font-semibold text-slate-400 py-2"
            >
              {day}
            </div>
          ))}

        </div>

        {/* CALENDAR DAYS */}

        <div className="grid grid-cols-7 gap-1.5">

          {calendarDays.map(
            (day, index) => {

              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square"
                  />
                );
              }

              const cellDate = new Date(
                calendarYear,
                calendarMonthIndex,
                day
              );

              const cellKey =
                getDateKey(cellDate);

              const isSelected =
                cellKey === dateKey;

              const isFuture =
                cellDate >
                new Date();

              const hasData =
                Boolean(
                  dailyData[cellKey]
                );

              const studySeconds =
                dailyData[cellKey]
                  ?.studySeconds || 0;

              let intensityClass =
                "bg-slate-50 text-slate-600";

              if (hasData) {
                if (
                  studySeconds >=
                  12 * 3600
                ) {
                  intensityClass =
                    "bg-emerald-100 text-emerald-700";
                } else if (
                  studySeconds >=
                  6 * 3600
                ) {
                  intensityClass =
                    "bg-yellow-100 text-yellow-700";
                } else if (
                  studySeconds > 0
                ) {
                  intensityClass =
                    "bg-red-100 text-red-600";
                }
              }

              return (
                <button
                  key={day}
                  disabled={isFuture}
                  onClick={() =>
                    selectCalendarDate(day)
                  }
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center transition border ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-100"
                      : "border-transparent"
                  } ${
                    isFuture
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:scale-[1.02]"
                  } ${intensityClass}`}
                >

                  <span className="text-xs md:text-sm font-bold">
                    {day}
                  </span>

                  {hasData && (
                    <span className="text-[8px] md:text-[9px] mt-0.5">
                      {formatStudyTime(
                        studySeconds
                      )}
                    </span>
                  )}

                </button>
              );
            }
          )}

        </div>

        {/* LEGEND */}

        <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-slate-100">

          <Legend
            className="bg-emerald-100"
            label="12h+"
          />

          <Legend
            className="bg-yellow-100"
            label="6h - 12h"
          />

          <Legend
            className="bg-red-100"
            label="1h - 6h"
          />

          <Legend
            className="bg-slate-100"
            label="No study"
          />

        </div>

      </section>

    </div>
  );
};

// =====================================================
// ANALYTICS CARD
// =====================================================

const AnalyticsCard = ({
  icon,
  title,
  subtitle,
  extra,
  bg,
}) => {
  return (
    <div
      className={`${bg} rounded-2xl p-4 shadow-sm border border-white/60`}
    >

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">

          <div className="text-xl font-bold text-slate-800 leading-tight">
            {title}
          </div>

          <div className="text-xs font-semibold text-slate-600 mt-1 truncate">
            {subtitle}
          </div>

          {extra && (
            <div className="text-[10px] text-slate-500 mt-1 truncate">
              {extra}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

// =====================================================
// SCORE ROW
// =====================================================

const ScoreRow = ({
  label,
  value,
  positive,
}) => {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span
        className={`text-sm font-bold ${
          positive
            ? "text-emerald-600"
            : "text-red-500"
        }`}
      >
        {value}
      </span>

    </div>
  );
};

// =====================================================
// MINI SUMMARY
// =====================================================

const MiniSummary = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">

      <div className="flex items-center gap-2">
        {icon}

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <div className="text-xl font-bold text-slate-800 mt-2">
        {value}
      </div>

    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({
  icon,
  text,
}) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center text-center">

      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
        {icon}
      </div>

      <p className="text-sm text-slate-500 mt-3">
        {text}
      </p>

    </div>
  );
};

// =====================================================
// LEGEND
// =====================================================

const Legend = ({
  className,
  label,
}) => {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`w-3 h-3 rounded-sm ${className}`}
      />

      <span className="text-xs text-slate-500">
        {label}
      </span>

    </div>
  );
};

// =====================================================
// SIMPLE CHART ICON
// =====================================================

const ChartIcon = () => {
  return (
    <div className="flex items-end gap-1 h-5">
      <span className="w-1.5 h-3 rounded-full bg-indigo-400" />
      <span className="w-1.5 h-5 rounded-full bg-indigo-500" />
      <span className="w-1.5 h-4 rounded-full bg-indigo-400" />
      <span className="w-1.5 h-6 rounded-full bg-indigo-600" />
    </div>
  );
};

export default StudyAnalytics;
