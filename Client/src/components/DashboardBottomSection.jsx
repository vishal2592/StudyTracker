import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const DashboardBottomSection = () => {
  // =====================================================
  // CALENDAR STATE
  // =====================================================

  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 9, 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date(2026, 9, 5)
  );

  // =====================================================
  // WEEK STATE
  // =====================================================

  const [weekOffset, setWeekOffset] = useState(0);

  // =====================================================
  // STUDY DATA
  // =====================================================

  const [studyData] = useState({
    "2026-10-01": {
      hours: 8.5,
      completed: true,
    },
    "2026-10-02": {
      hours: 10,
      completed: true,
    },
    "2026-10-03": {
      hours: 4.5,
      completed: false,
    },
    "2026-10-04": {
      hours: 12,
      completed: true,
    },
    "2026-10-05": {
      hours: 6.5,
      completed: false,
    },
    "2026-10-06": {
      hours: 9,
      completed: true,
    },
    "2026-10-07": {
      hours: 11,
      completed: true,
    },
    "2026-10-08": {
      hours: 8,
      completed: true,
    },
    "2026-10-09": {
      hours: 10.5,
      completed: true,
    },
    "2026-10-10": {
      hours: 12,
      completed: true,
    },
    "2026-10-11": {
      hours: 5.5,
      completed: false,
    },
    "2026-10-12": {
      hours: 9,
      completed: true,
    },
    "2026-10-13": {
      hours: 11.5,
      completed: true,
    },
    "2026-10-14": {
      hours: 10,
      completed: true,
    },
    "2026-10-15": {
      hours: 7,
      completed: false,
    },
    "2026-10-16": {
      hours: 12,
      completed: true,
    },
    "2026-10-17": {
      hours: 8.5,
      completed: true,
    },
    "2026-10-18": {
      hours: 9.5,
      completed: true,
    },
    "2026-10-19": {
      hours: 6,
      completed: false,
    },
    "2026-10-20": {
      hours: 10,
      completed: true,
    },
    "2026-10-21": {
      hours: 12,
      completed: true,
    },
    "2026-10-22": {
      hours: 8,
      completed: true,
    },
    "2026-10-23": {
      hours: 9.5,
      completed: true,
    },
    "2026-10-24": {
      hours: 11,
      completed: true,
    },
    "2026-10-25": {
      hours: 5,
      completed: false,
    },
    "2026-10-26": {
      hours: 10.5,
      completed: true,
    },
    "2026-10-27": {
      hours: 12,
      completed: true,
    },
    "2026-10-28": {
      hours: 9,
      completed: true,
    },
    "2026-10-29": {
      hours: 0,
      completed: false,
    },
    "2026-10-30": {
      hours: 11,
      completed: true,
    },
    "2026-10-31": {
      hours: 12,
      completed: true,
    },
  });

  // =====================================================
  // SUBJECT PROGRESS
  // =====================================================

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Biology",
      completed: 72,
      hours: 86,
      targetHours: 120,
    },
    {
      id: 2,
      name: "Physics",
      completed: 58,
      hours: 70,
      targetHours: 120,
    },
    {
      id: 3,
      name: "Chemistry",
      completed: 64,
      hours: 77,
      targetHours: 120,
    },
    {
      id: 4,
      name: "Mock Tests",
      completed: 45,
      hours: 18,
      targetHours: 40,
    },
  ]);

  // =====================================================
  // DATE KEY
  // =====================================================

  const getDateKey = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(
      2,
      "0"
    );

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // SAME DATE
  // =====================================================

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // =====================================================
  // STUDY COLOR
  // =====================================================

  const getStudyColor = (hours) => {
    if (hours >= 12) {
      return {
        bg: "bg-emerald-500",
        hover: "hover:bg-emerald-600",
        text: "text-white",
      };
    }

    if (hours >= 6) {
      return {
        bg: "bg-yellow-400",
        hover: "hover:bg-yellow-500",
        text: "text-white",
      };
    }

    if (hours > 0) {
      return {
        bg: "bg-red-400",
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
  // CALENDAR DAYS
  // =====================================================

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    // Convert Sunday based JS index to Monday based index
    const startingDay =
      firstDay.getDay() === 0
        ? 6
        : firstDay.getDay() - 1;

    const totalDays = lastDay.getDate();

    const days = [];

    // Empty spaces before first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Month dates
    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentDate]);

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
  };

  // =====================================================
  // SELECTED DATE DATA
  // =====================================================

  const selectedDateKey = getDateKey(selectedDate);

  const selectedDayData = studyData[selectedDateKey] || {
    hours: 0,
    completed: false,
  };

  // =====================================================
  // WEEK HELPER
  // =====================================================

  const getStartOfWeek = (date) => {
    const result = new Date(date);

    const day = result.getDay();

    const difference = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + difference);

    result.setHours(0, 0, 0, 0);

    return result;
  };

  // =====================================================
  // GET WEEK DAYS
  // =====================================================

  const getWeekDays = () => {
    const baseDate = new Date();

    baseDate.setDate(
      baseDate.getDate() + weekOffset * 7
    );

    const monday = getStartOfWeek(baseDate);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);

      day.setDate(monday.getDate() + i);

      days.push(day);
    }

    return days;
  };

  const weekDays = getWeekDays();

  // =====================================================
  // WEEKLY DATA
  // =====================================================

  const weeklyStudyData = weekDays.map((day) => {
    const key = getDateKey(day);

    return {
      date: day,
      hours: studyData[key]?.hours || 0,
    };
  });

  const weeklyTotal = weeklyStudyData.reduce(
    (total, day) => total + day.hours,
    0
  );

  const weeklyAverage = weeklyTotal / 7;

  const maxWeeklyHours = Math.max(
    ...weeklyStudyData.map((day) => day.hours),
    12
  );

  // =====================================================
  // WEEK NAVIGATION
  // =====================================================

  const goToPreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const goToNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  // =====================================================
  // WEEK RANGE
  // =====================================================

  const weekRangeText = `${weekDays[0].toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
    }
  )} - ${weekDays[6].toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  // =====================================================
  // SUBJECT PROGRESS
  // =====================================================

  const increaseSubjectProgress = (id) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) => {
        if (subject.id !== id) {
          return subject;
        }

        const newCompleted = Math.min(
          subject.completed + 5,
          100
        );

        const newHours = Math.min(
          subject.hours + 1,
          subject.targetHours
        );

        return {
          ...subject,
          completed: newCompleted,
          hours: newHours,
        };
      })
    );
  };

  // =====================================================
  // OVERALL PROGRESS
  // =====================================================

  const overallProgress =
    subjects.length > 0
      ? Math.round(
          subjects.reduce(
            (sum, subject) => sum + subject.completed,
            0
          ) / subjects.length
        )
      : 0;

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
              onClick={goToPreviousMonth}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={goToNextMonth}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Month */}

        <div className="text-center mb-4">
          <h4 className="text-sm font-bold text-slate-700">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h4>
        </div>

        {/* Week Days */}

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["M", "T", "W", "T", "F", "S", "S"].map(
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
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-9"
                />
              );
            }

            const dateKey = getDateKey(date);

            const dayData = studyData[dateKey];

            const hours = dayData?.hours || 0;

            const isSelected = isSameDate(
              date,
              selectedDate
            );

            const studyColor = getStudyColor(hours);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => handleDateClick(date)}
                title={`${date.toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )} • ${hours} hours`}
                className={`
                  relative h-9 rounded-lg
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
          })}
        </div>

        {/* =====================================================
            STUDY HOURS LEGEND
        ===================================================== */}

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-600 mb-3">
            Study Hours
          </p>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {/* Green */}

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />

              <span className="text-[10px] text-slate-500">
                ≥ 12 hours
              </span>
            </div>

            {/* Yellow */}

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0" />

              <span className="text-[10px] text-slate-500">
                6 - 11 hours
              </span>
            </div>

            {/* Red */}

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 shrink-0" />

              <span className="text-[10px] text-slate-500">
                1 - 5 hours
              </span>
            </div>

            {/* No Study */}

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 shrink-0" />

              <span className="text-[10px] text-slate-500">
                No Study
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            SELECTED DATE
        ===================================================== */}

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-slate-400">
                Selected Date
              </p>

              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Clock3
                  size={14}
                  className="text-blue-500"
                />

                <span className="text-sm font-bold text-slate-700">
                  {selectedDayData.hours}h
                </span>
              </div>

              <p
                className={`text-[10px] font-semibold mt-0.5 ${
                  selectedDayData.hours >= 12
                    ? "text-emerald-500"
                    : selectedDayData.hours >= 6
                    ? "text-yellow-600"
                    : selectedDayData.hours > 0
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {selectedDayData.hours >= 12
                  ? "Excellent Study"
                  : selectedDayData.hours >= 6
                  ? "Good Study"
                  : selectedDayData.hours > 0
                  ? "Low Study"
                  : "No Study"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          WEEKLY STUDY HOURS
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        {/* Header */}

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp
                size={21}
                className="text-emerald-500"
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
              onClick={goToPreviousWeek}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={goToNextWeek}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Summary */}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-emerald-50">
            <p className="text-[10px] text-emerald-600 font-semibold">
              Total This Week
            </p>

            <p className="text-xl font-bold text-slate-800 mt-1">
              {weeklyTotal.toFixed(1)}h
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50">
            <p className="text-[10px] text-blue-600 font-semibold">
              Daily Average
            </p>

            <p className="text-xl font-bold text-slate-800 mt-1">
              {weeklyAverage.toFixed(1)}h
            </p>
          </div>
        </div>

        {/* Chart */}

        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyStudyData.map((day) => {
            const height =
              maxWeeklyHours > 0
                ? (day.hours / maxWeeklyHours) * 100
                : 0;

            const isToday = isSameDate(
              day.date,
              new Date()
            );

            return (
              <div
                key={getDateKey(day.date)}
                className="flex-1 h-full flex flex-col items-center justify-end gap-2"
              >
                {/* Hours */}

                <span className="text-[9px] font-semibold text-slate-400">
                  {day.hours > 0 ? `${day.hours}h` : "-"}
                </span>

                {/* Bar */}

                <div className="w-full max-w-[28px] h-24 bg-slate-100 rounded-lg flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday
                        ? "bg-blue-500"
                        : "bg-emerald-400"
                    }`}
                    style={{
                      height: `${Math.max(
                        height,
                        day.hours > 0 ? 8 : 0
                      )}%`,
                    }}
                  />
                </div>

                {/* Day */}

                <span
                  className={`text-[10px] font-semibold ${
                    isToday
                      ? "text-blue-500"
                      : "text-slate-400"
                  }`}
                >
                  {day.date
                    .toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                    .slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          SUBJECT-WISE PROGRESS
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        {/* Header */}

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <BookOpen
                size={21}
                className="text-purple-500"
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">
                Subject-wise Progress
              </h3>

              <p className="text-xs text-slate-400">
                Overall progress {overallProgress}%
              </p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <span className="text-xs font-bold text-purple-500">
              {overallProgress}%
            </span>
          </div>
        </div>

        {/* Progress List */}

        <div className="space-y-5">
          {subjects.map((subject) => {
            const remainingHours = Math.max(
              subject.targetHours - subject.hours,
              0
            );

            return (
              <div key={subject.id}>
                {/* Subject Header */}

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {subject.name}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {subject.hours}h /{" "}
                      {subject.targetHours}h
                    </p>
                  </div>

                  <span className="text-xs font-bold text-purple-500">
                    {subject.completed}%
                  </span>
                </div>

                {/* Progress Bar */}

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${subject.completed}%`,
                    }}
                  />
                </div>

                {/* Footer */}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-400">
                    {remainingHours > 0
                      ? `${remainingHours}h remaining`
                      : "Target completed"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseSubjectProgress(subject.id)
                    }
                    className="text-[10px] font-semibold text-purple-500 hover:text-purple-600 transition-colors"
                  >
                    +1h Study
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion */}

        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className="text-emerald-500"
            />

            <p className="text-xs font-semibold text-slate-600">
              Keep going! You're making great progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBottomSection;