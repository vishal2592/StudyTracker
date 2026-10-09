
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  getStudyCalendar,
  getStudySummary,
  getWeeklyStudyHours,
} from "../redux/slicer/studySlice";

import {
  getSubjectTracker,
} from "../redux/slicer/subjectTrackerSlice";

import {
  getTargets,
} from "../redux/slicer/dailyTargetSlice";

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

const isSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const normalizeSubject = (subject = "") => {
  return String(subject)
    .trim()
    .toLowerCase();
};

const formatSubjectName = (subject = "") => {
  return String(subject)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

// =====================================================
// SUBJECT COLORS
// =====================================================

const subjectColors = [
  {
    bar: "bg-emerald-300",
    text: "text-emerald-500",
  },
  {
    bar: "bg-violet-300",
    text: "text-violet-500",
  },
  {
    bar: "bg-blue-300",
    text: "text-blue-500",
  },
  {
    bar: "bg-amber-300",
    text: "text-amber-500",
  },
  {
    bar: "bg-violet-300",
    text: "text-violet-500",
  },
  {
    bar: "bg-indigo-300",
    text: "text-indigo-500",
  },
  {
    bar: "bg-rose-300",
    text: "text-rose-500",
  },
  {
    bar: "bg-teal-300",
    text: "text-teal-500",
  },
];

// =====================================================
// COMPONENT
// =====================================================

const DashboardBottomSection = () => {
  const dispatch = useDispatch();

  // =====================================================
  // TODAY
  // =====================================================

  const today = useMemo(() => {
    return getDateKey(new Date());
  }, []);

  // =====================================================
  // CALENDAR STATE
  // =====================================================

  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
  });

  const [selectedDate, setSelectedDate] = useState(
    () => new Date()
  );

  // =====================================================
  // WEEK STATE
  // =====================================================

  const [weekOffset, setWeekOffset] = useState(0);

  // =====================================================
  // SUBJECT LOAD MORE STATE
  // =====================================================

  const [showAllSubjects, setShowAllSubjects] = useState(false);

  // =====================================================
  // STUDY STATE
  // =====================================================

  const studyState = useSelector(
    (state) => state.study || {}
  );

  const {
    calendar = [],
    calendarLoading = false,

    summary = null,
    summaryLoading = false,

    weeklyStudy = null,
    weeklyLoading = false,
  } = studyState;

  // =====================================================
  // SUBJECT TRACKER STATE
  // =====================================================

  const subjectTrackerState = useSelector(
    (state) => state.subjectTracker || {}
  );

  const {
    tracker = null,
    loading: subjectTrackerLoading = false,
  } = subjectTrackerState;

  // =====================================================
  // DAILY TARGET STATE
  // =====================================================

  const dailyTargetState = useSelector(
    (state) => state.dailyTarget || {}
  );

  const {
    targets = [],
    loading: targetLoading = false,
  } = dailyTargetState;

  // =====================================================
  // SELECTED DATE KEY
  // =====================================================

  const selectedDateKey = useMemo(() => {
    return getDateKey(selectedDate);
  }, [selectedDate]);

  // =====================================================
  // MONTH KEY
  // =====================================================

  const currentMonthKey = useMemo(() => {
    const year = currentDate.getFullYear();

    const month = String(
      currentDate.getMonth() + 1
    ).padStart(2, "0");

    return `${year}-${month}`;
  }, [currentDate]);

  // =====================================================
  // STUDY COLOR FOR CALENDAR
  // =====================================================

  const getStudyColor = (hours) => {
    if (hours >= 12) {
      return {
        bg: "bg-emerald-300",
        hover: "hover:bg-emerald-600",
        text: "text-white",
      };
    }

    if (hours >= 6) {
      return {
        bg: "bg-yellow-300",
        hover: "hover:bg-yellow-500",
        text: "text-white",
      };
    }

    if (hours > 0) {
      return {
        bg: "bg-red-300",
        hover: "hover:bg-red-500",
        text: "text-white",
      };
    }

    return {
      bg: "bg-slate-100",
      hover: "hover:bg-slate-200",
      text: "text-slate-500",
    };
  };

  // =====================================================
  // GET CALENDAR DATA
  // =====================================================

  useEffect(() => {
    dispatch(
      getStudyCalendar(currentMonthKey)
    );
  }, [
    dispatch,
    currentMonthKey,
  ]);

  // =====================================================
  // GET SELECTED DATE DATA
  //
  // Subject Tracker = selected date only
  // Study Summary = selected date only
  // Daily Targets = selected date only
  // =====================================================

  useEffect(() => {
    dispatch(
      getStudySummary(selectedDateKey)
    );

    dispatch(
      getSubjectTracker(selectedDateKey)
    );

    dispatch(
      getTargets(selectedDateKey)
    );
  }, [
    dispatch,
    selectedDateKey,
  ]);

  // =====================================================
  // GET WEEKLY STUDY DATA
  // =====================================================

  const getStartOfWeek = (date) => {
    const result = new Date(date);

    const day = result.getDay();

    const difference =
      day === 0
        ? -6
        : 1 - day;

    result.setDate(
      result.getDate() + difference
    );

    result.setHours(
      0,
      0,
      0,
      0
    );

    return result;
  };

  function getWeekDays() {
    const baseDate = new Date();

    baseDate.setDate(
      baseDate.getDate() +
        weekOffset * 7
    );

    const monday =
      getStartOfWeek(baseDate);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);

      day.setDate(
        monday.getDate() + i
      );

      days.push(day);
    }

    return days;
  }

  const weekDays = getWeekDays();

  useEffect(() => {
    if (weekDays.length > 0) {
      dispatch(
        getWeeklyStudyHours(
          getDateKey(weekDays[0])
        )
      );
    }
  }, [
    dispatch,
    weekOffset,
  ]);

  // =====================================================
  // CALENDAR DAYS
  // =====================================================

  const calendarDays = useMemo(() => {
    const year =
      currentDate.getFullYear();

    const month =
      currentDate.getMonth();

    const firstDay =
      new Date(
        year,
        month,
        1
      );

    const lastDay =
      new Date(
        year,
        month + 1,
        0
      );

    const startingDay =
      firstDay.getDay() === 0
        ? 6
        : firstDay.getDay() - 1;

    const totalDays =
      lastDay.getDate();

    const days = [];

    for (
      let i = 0;
      i < startingDay;
      i++
    ) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {
      days.push(
        new Date(
          year,
          month,
          day
        )
      );
    }

    return days;
  }, [
    currentDate,
  ]);

  // =====================================================
  // CALENDAR DATA MAP
  // =====================================================

  const calendarDataMap =
    useMemo(() => {
      const map = {};

      if (!Array.isArray(calendar)) {
        return map;
      }

      calendar.forEach((item) => {
        if (!item?.date) return;

        map[item.date] = {
          studyMinutes:
            Number(
              item.studyMinutes
            ) || 0,

          studyHours:
            Number(
              item.studyHours
            ) || 0,

          status:
            item.status ||
            "none",
        };
      });

      return map;
    }, [
      calendar,
    ]);

  // =====================================================
  // MONTH NAVIGATION
  // =====================================================

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  // =====================================================
  // DATE SELECT
  // =====================================================

  const handleDateClick = (date) => {
    if (!date) return;

    setSelectedDate(date);

    setCurrentDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      )
    );
  };

  // =====================================================
  // SELECTED DATE CALENDAR DATA
  // =====================================================

  const selectedCalendarData =
    calendarDataMap[
      selectedDateKey
    ] || {
      studyMinutes: 0,
      studyHours: 0,
      status: "none",
    };

  const selectedDayHours =
    Number(
      summary?.totalHours
    ) ||
    Number(
      selectedCalendarData.studyHours
    ) ||
    0;

  // =====================================================
  // WEEKLY BACKEND DATA
  // =====================================================

  const weeklyBackendDays =
    Array.isArray(
      weeklyStudy?.days
    )
      ? weeklyStudy.days
      : [];

  const weeklyStudyData =
    weekDays.map(
      (day, index) => {
        const backendDay =
          weeklyBackendDays[index];

        return {
          date: day,

          hours:
            Number(
              backendDay?.studyHours
            ) || 0,

          minutes:
            Number(
              backendDay?.studyMinutes
            ) || 0,
        };
      }
    );

  const weeklyTotal =
    Number(
      weeklyStudy?.totalStudyHours
    ) ||
    weeklyStudyData.reduce(
      (total, day) =>
        total + day.hours,
      0
    );

  const weeklyAverage =
    Number(
      weeklyStudy?.dailyAverageHours
    ) ||
    weeklyTotal / 7;

  const maxWeeklyHours =
    Math.max(
      ...weeklyStudyData.map(
        (day) => day.hours
      ),
      1
    );

  // =====================================================
  // WEEK NAVIGATION
  // =====================================================

  const goToPreviousWeek = () => {
    setWeekOffset(
      (prev) => prev - 1
    );
  };

  const goToNextWeek = () => {
    setWeekOffset(
      (prev) => prev + 1
    );
  };

  // =====================================================
  // WEEK RANGE
  // =====================================================

  const weekRangeText =
    weekDays.length > 0
      ? `${weekDays[0].toLocaleDateString(
          "en-US",
          {
            day: "numeric",
            month: "short",
          }
        )} - ${weekDays[6].toLocaleDateString(
          "en-US",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )}`
      : "";

  // =====================================================
  // SUBJECT TRACKER DATA
  // =====================================================

  const subjectWiseHours =
    tracker?.subjectWiseHours ||
    {};

  // =====================================================
  // DYNAMIC SUBJECTS
  // ONLY DAILY TARGET SUBJECTS
  // =====================================================

  const subjects = useMemo(() => {
    if (!Array.isArray(targets)) {
      return [];
    }

    const subjectMap =
      new Map();

    targets.forEach(
      (target) => {
        const rawTitle =
          String(
            target?.title || ""
          ).trim();

        if (!rawTitle) {
          return;
        }

        const key =
          normalizeSubject(
            rawTitle
          );

        if (!key) {
          return;
        }

        if (
          !subjectMap.has(key)
        ) {
          subjectMap.set(
            key,
            {
              key,
              name:
                formatSubjectName(
                  rawTitle
                ),
            }
          );
        }
      }
    );

    return Array.from(
      subjectMap.values()
    ).map(
      (subject, index) => {
        const backendSubject =
          Object.keys(
            subjectWiseHours
          ).find(
            (name) =>
              normalizeSubject(
                name
              ) === subject.key
          );

        const hours =
          backendSubject
            ? Number(
                subjectWiseHours[
                  backendSubject
                ]
              ) || 0
            : 0;

        return {
          id:
            subject.key,

          name:
            subject.name,

          hours,

          color:
            subjectColors[
              index %
                subjectColors.length
            ],
        };
      }
    );
  }, [
    targets,
    subjectWiseHours,
  ]);

  // =====================================================
  // SUBJECT TOTAL HOURS
  // =====================================================

  const totalSubjectHours =
    subjects.reduce(
      (sum, subject) =>
        sum + subject.hours,
      0
    );

  // =====================================================
  // SUBJECT OVERALL PROGRESS
  // =====================================================

  const subjectsWithStudy =
    subjects.filter(
      (subject) =>
        subject.hours > 0
    );

  const overallProgress =
    totalSubjectHours > 0
      ? 100
      : 0;

  // =====================================================
  // SUBJECT LOAD MORE
  //
  // First 4 subjects are shown.
  // If more than 4 subjects exist,
  // Load More button is displayed.
  // =====================================================

  const visibleSubjects =
    showAllSubjects
      ? subjects
      : subjects.slice(0, 4);

  const hasMoreSubjects =
    subjects.length > 4;

  // =====================================================
  // LOADING
  // =====================================================

  const isCalendarLoading =
    calendarLoading;

  const isWeeklyLoading =
    weeklyLoading;

  const isSubjectLoading =
    subjectTrackerLoading ||
    targetLoading;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">

      {/* =====================================================
          CALENDAR OVERVIEW
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

        {/* Header */}

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

              <CalendarDays
                size={21}
                className="text-blue-500"
              />

            </div>

            <div>

              <h3 className="text-base font-bold text-slate-800">
                Calendar Overview
              </h3>

              <p className="text-xs text-slate-400">
                Track your daily study
              </p>

            </div>

          </div>

          {/* Month Navigation */}

          <div className="flex items-center gap-1">

            <button
              type="button"
              onClick={
                goToPreviousMonth
              }
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={
                goToNextMonth
              }
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

        {/* Month */}

        <div className="text-center mb-4">

          <h4 className="text-sm font-bold text-slate-700">
            {currentDate.toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </h4>

        </div>

        {/* Week Days */}

        <div className="grid grid-cols-7 gap-1 mb-2">

          {[
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
            "S",
          ].map(
            (day, index) => (
              <div
                key={`${day}-${index}`}
                className="text-center text-[10px] font-bold text-slate-400 py-1"
              >
                {day}
              </div>
            )
          )}

        </div>

        {/* Calendar */}

        <div className="grid grid-cols-7 gap-1">

          {calendarDays.map(
            (date, index) => {

              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-9"
                  />
                );
              }

              const dateKey =
                getDateKey(date);

              const dayData =
                calendarDataMap[
                  dateKey
                ];

              const hours =
                Number(
                  dayData?.studyHours
                ) || 0;

              const isSelected =
                isSameDate(
                  date,
                  selectedDate
                );

              const studyColor =
                getStudyColor(
                  hours
                );

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() =>
                    handleDateClick(
                      date
                    )
                  }
                  title={`${date.toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )} • ${hours} hours`}
                  className={`
                    relative h-9 rounded-full
                    flex items-center justify-center
                    text-xs font-semibold
                    transition-all duration-200
                    ${studyColor.bg}
                    ${studyColor.hover}
                    ${studyColor.text}
                    ${
                      isSelected
                        ? "ring-2 ring-blue-500 ring-offset-1"
                        : ""
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            }
          )}

        </div>

        {/* Loading */}

        {isCalendarLoading && (
          <p className="text-[10px] text-center text-slate-400 mt-3">
            Loading study calendar...
          </p>
        )}

        {/* =====================================================
            LEGEND
            Desktop + Tablet = One Line
            Mobile = 2 Columns
        ===================================================== */}

        <div className="mt-4 pt-4 border-t border-slate-100">

          <p className="text-[11px] font-bold text-slate-600 mb-3">
            Study Hours
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">

            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />

              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                ≥ 12 hours
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0" />

              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                6 - 11 hours
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full bg-red-400 shrink-0" />

              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                1 - 5 hours
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 shrink-0" />

              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                No Study
              </span>
            </div>

          </div>

        </div>

        {/* Selected Date */}

        {/* <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">

          <div className="flex items-center justify-between gap-3">

            <div>

              <p className="text-[11px] text-slate-400">
                Selected Date
              </p>

              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {selectedDate.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }
                )}
              </p>

            </div>

            <div className="text-right">

              <div className="flex items-center justify-end gap-1.5">

                <Clock3
                  size={14}
                  className="text-blue-500"
                />

                <span className="text-sm font-bold text-slate-700">

                  {summaryLoading
                    ? "..."
                    : `${selectedDayHours}h`}

                </span>

              </div>

              <p
                className={`text-[10px] font-semibold mt-0.5 ${
                  selectedDayHours >= 12
                    ? "text-emerald-500"
                    : selectedDayHours >= 6
                    ? "text-yellow-600"
                    : selectedDayHours > 0
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {selectedDayHours >= 12
                  ? "Excellent Study"
                  : selectedDayHours >= 6
                  ? "Good Study"
                  : selectedDayHours > 0
                  ? "Low Study"
                  : "No Study"}
              </p>

            </div>

          </div>

        </div> */}

      </div>

      {/* =====================================================
          WEEKLY STUDY HOURS
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

        {/* Header */}

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">

              <TrendingUp
                size={21}
                className="text-cyan-500"
              />

            </div>

            <div>

              <h3 className="text-base font-bold text-slate-800">
                Weekly Study Hours
              </h3>

              <p className="text-xs text-slate-400">
                {weekRangeText}
              </p>

            </div>

          </div>

          {/* Week Navigation */}

          <div className="flex items-center gap-1">

            <button
              type="button"
              onClick={
                goToPreviousWeek
              }
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={
                goToNextWeek
              }
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

        {/* Summary */}

        <div className="grid grid-cols-2 gap-3 mb-5">

          <div className="p-3 rounded-xl bg-cyan-50">

            <p className="text-[10px] text-cyan-600 font-semibold">
              Total This Week
            </p>

            <p className="text-xl font-bold text-slate-800 mt-1">

              {isWeeklyLoading
                ? "..."
                : `${weeklyTotal.toFixed(1)}h`}

            </p>

          </div>

          <div className="p-3 rounded-xl bg-blue-50">

            <p className="text-[10px] text-blue-600 font-semibold">
              Daily Average
            </p>

            <p className="text-xl font-bold text-slate-800 mt-1">

              {isWeeklyLoading
                ? "..."
                : `${weeklyAverage.toFixed(1)}h`}

            </p>

          </div>

        </div>

        {/* Chart */}

        <div className="flex items-end justify-between gap-2 h-40">

          {weeklyStudyData.map(
            (day) => {

              const height =
                maxWeeklyHours > 0
                  ? (day.hours /
                      maxWeeklyHours) *
                    100
                  : 0;

              const isToday =
                isSameDate(
                  day.date,
                  new Date()
                );

              return (
                <div
                  key={getDateKey(
                    day.date
                  )}
                  className="flex-1 h-full flex flex-col items-center justify-end gap-2"
                >

                  {/* Hours */}

                  <span className="text-[9px] font-semibold text-slate-400">
                    {day.hours > 0
                      ? `${day.hours}h`
                      : "-"}
                  </span>

                  {/* Bar */}

                  <div className="w-full max-w-[28px] h-24 bg-slate-100 rounded-lg flex items-end overflow-hidden">

                    <div
                      className="w-full bg-cyan-300 rounded-lg transition-all duration-500"
                      style={{
                        height: `${Math.max(
                          height,
                          day.hours > 0
                            ? 8
                            : 0
                        )}%`,
                      }}
                    />

                  </div>

                  {/* Day */}

                  <span
                    className={`text-[10px] font-semibold ${
                      isToday
                        ? "text-cyan-500"
                        : "text-slate-400"
                    }`}
                  >
                    {day.date
                      .toLocaleDateString(
                        "en-US",
                        {
                          weekday:
                            "short",
                        }
                      )
                      .slice(0, 3)}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =====================================================
          SUBJECT-WISE PROGRESS
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

        {/* Header */}

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">

              <BookOpen
                size={21}
                className="text-purple-500"
              />

            </div>

            <div className="min-w-0">

              <h3 className="text-base font-bold text-slate-800">
                Subject-wise Progress
              </h3>

              <p className="text-xs text-slate-400">

                {isSubjectLoading
                  ? "Loading..."
                  : `${selectedDate.toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )} • Total study ${totalSubjectHours.toFixed(
                      2
                    )}h`}

              </p>

            </div>

          </div>

          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">

            <span className="text-xs font-bold text-purple-500">
              {overallProgress}%
            </span>

          </div>

        </div>

        {/* =====================================================
            PROGRESS LIST
        ===================================================== */}

        <div className="space-y-5">

          {visibleSubjects.map(
            (subject) => {

              const subjectPercentage =
                totalSubjectHours > 0
                  ? Math.round(
                      (subject.hours /
                        totalSubjectHours) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={subject.id}
                >

                  {/* Subject Header */}

                  <div className="flex items-center justify-between mb-2">

                    <div>

                      <p className="text-sm font-semibold text-slate-700">
                        {subject.name}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {subject.hours.toFixed(
                          2
                        )}
                        h study
                      </p>

                    </div>

                    <span
                      className={`text-xs font-bold ${subject.color.text}`}
                    >
                      {subjectPercentage}%
                    </span>

                  </div>

                  {/* Progress Bar */}

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full transition-all duration-500 ${subject.color.bar}`}
                      style={{
                        width: `${subjectPercentage}%`,
                      }}
                    />

                  </div>

                  {/* Footer */}

                  <div className="flex items-center justify-between mt-2">

                    <span className="text-[10px] text-slate-400">

                      {subject.hours > 0
                        ? `${subject.hours.toFixed(
                            2
                          )}h studied`
                        : "No study yet"}

                    </span>

                    <span
                      className={`text-[10px] font-semibold ${subject.color.text}`}
                    >
                      {subject.hours > 0
                        ? "Studied"
                        : "Not started"}
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* =====================================================
            LOAD MORE / SHOW LESS
        ===================================================== */}

        {!isSubjectLoading &&
          hasMoreSubjects && (
            <div className="mt-5 flex justify-center">

              <button
                type="button"
                onClick={() =>
                  setShowAllSubjects(
                    (prev) => !prev
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-600 transition hover:bg-purple-100 hover:text-purple-700"
              >
                {showAllSubjects ? (
                  <>
                    Show Less
                    <ChevronUp size={15} />
                  </>
                ) : (
                  <>
                    Load More
                    <ChevronDown size={15} />
                  </>
                )}
              </button>

            </div>
          )}

        {/* Loading */}

        {isSubjectLoading && (
          <p className="text-[10px] text-center text-slate-400 mt-4">
            Loading subject progress...
          </p>
        )}

        {/* Empty */}

        {!isSubjectLoading &&
          subjects.length === 0 && (
            <div className="py-5 text-center">

              <BookOpen
                size={24}
                className="mx-auto text-slate-300 mb-2"
              />

              <p className="text-[10px] text-slate-400">
                No daily target subjects
                created for this date.
              </p>

            </div>
          )}

        {/* Has Subjects But No Study */}

        {!isSubjectLoading &&
          subjects.length > 0 &&
          subjectsWithStudy.length === 0 && (
            <p className="text-[10px] text-center text-slate-400 mt-4">
              No study recorded for these
              subjects yet.
            </p>
          )}

        {/* Completion */}

        {subjects.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={16}
                className="text-emerald-500"
              />

              <p className="text-xs font-semibold text-slate-600">
                Keep going! You're making
                great progress.
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default DashboardBottomSection;

