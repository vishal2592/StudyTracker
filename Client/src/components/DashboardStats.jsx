import React, { useEffect, useMemo } from "react";
import {
  Clock,
  Calendar,
  Target,
  Flame,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  getStudySummary,
} from "../redux/slicer/studySlice";

import {
  getTargets,
} from "../redux/slicer/dailyTargetSlice";

import {
  getHabits,
} from "../redux/slicer/habitSlice";

// =====================================================
// DASHBOARD STATS
// =====================================================

const DashboardStats = () => {
  const dispatch = useDispatch();

  // =====================================================
  // STUDY REDUX STATE
  // =====================================================

  const studyState = useSelector(
    (state) => state.study || {},
  );

  const {
    summary = null,
    summaryLoading = false,
  } = studyState;

  // =====================================================
  // DAILY TARGET REDUX STATE
  // =====================================================

  const dailyTargetState = useSelector(
    (state) => state.dailyTarget || {},
  );

  const {
    totalTargets = 0,
    completedTargets = 0,

    // Daily Target Scores
    positiveScore: targetPositiveScore = 0,
    negativeScore: targetNegativeScore = 0,

    loading: targetsLoading = false,
  } = dailyTargetState;

  // =====================================================
  // GOOD HABITS REDUX STATE
  // =====================================================

  const habitState = useSelector(
    (state) => state.habit || {},
  );

  const {
    positiveScore: habitPositiveScore = 0,
    negativeScore: habitNegativeScore = 0,
    loading: habitsLoading = false,
  } = habitState;

  // =====================================================
  // TODAY DATE
  // =====================================================

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  // =====================================================
  // GET TODAY'S STUDY SUMMARY
  // =====================================================

  useEffect(() => {
    dispatch(getStudySummary(today));
  }, [dispatch, today]);

  // =====================================================
  // GET TODAY'S TARGETS
  // =====================================================

  useEffect(() => {
    dispatch(getTargets(today));
  }, [dispatch, today]);

  // =====================================================
  // GET TODAY'S GOOD HABITS
  // =====================================================

  useEffect(() => {
    dispatch(getHabits(today));
  }, [dispatch, today]);

  // =====================================================
  // FORMAT STUDY TIME
  // =====================================================

  const formatStudyTime = (seconds = 0) => {
    const safeSeconds = Math.max(
      0,
      Number(seconds) || 0,
    );

    const hours = Math.floor(
      safeSeconds / 3600,
    );

    const minutes = Math.floor(
      (safeSeconds % 3600) / 60,
    );

    if (hours === 0) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  };

  // =====================================================
  // TODAY'S STUDY SECONDS
  // =====================================================
  //
  // IMPORTANT:
  // Same logic as DashboardMiddleSection.
  //
  // First calculate from individual sessions because
  // session durationSeconds contains the actual study
  // duration.
  //
  // Example:
  // Session 1 = 1200 sec
  // Session 2 = 778 sec
  //
  // Total = 1978 sec
  //       = 32m 58s
  //
  // =====================================================

  const todayStudySeconds = useMemo(() => {
    if (!summary) {
      return 0;
    }

    // =================================================
    // 1. PRIMARY SOURCE
    // Calculate from sessions
    // =================================================

    if (
      Array.isArray(summary.sessions) &&
      summary.sessions.length > 0
    ) {
      return summary.sessions.reduce(
        (total, session) => {
          return (
            total +
            Number(
              session?.durationSeconds || 0,
            )
          );
        },
        0,
      );
    }

    // =================================================
    // 2. FALLBACK - TOTAL SECONDS
    // =================================================

    if (
      summary.totalSeconds !== undefined &&
      summary.totalSeconds !== null
    ) {
      return Number(
        summary.totalSeconds,
      ) || 0;
    }

    // =================================================
    // 3. FALLBACK - TOTAL MINUTES
    // =================================================

    if (
      summary.totalMinutes !== undefined &&
      summary.totalMinutes !== null
    ) {
      return (
        (Number(
          summary.totalMinutes,
        ) || 0) * 60
      );
    }

    // =================================================
    // 4. FALLBACK - TOTAL HOURS
    // =================================================

    if (
      summary.totalHours !== undefined &&
      summary.totalHours !== null
    ) {
      return (
        (Number(
          summary.totalHours,
        ) || 0) * 3600
      );
    }

    return 0;
  }, [summary]);

  // =====================================================
  // TODAY'S STUDY DISPLAY
  // =====================================================

  const todayStudy = formatStudyTime(
    todayStudySeconds,
  );

  // =====================================================
  // CURRENT MONTH DAYS
  // =====================================================

  const currentMonthDays = useMemo(() => {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate();
  }, []);

  // =====================================================
  // 12+ HOURS TODAY
  // =====================================================
  //
  // NOTE:
  // A monthly 12-hour-days count requires a monthly
  // analytics endpoint. We do NOT create fake data here.
  //
  // This value represents today's contribution only.
  //
  // =====================================================

  const twelveHourDays = useMemo(() => {
    const totalHours =
      Number(summary?.totalHours) || 0;

    return totalHours >= 12 ? 1 : 0;
  }, [summary]);

  // =====================================================
  // COMBINED POSITIVE SCORE
  // =====================================================
  //
  // Good Habit Positive Score
  // +
  // Daily Target Positive Score
  //
  // =====================================================

  const positiveScore =
    (Number(habitPositiveScore) || 0) +
    (Number(targetPositiveScore) || 0);

  // =====================================================
  // COMBINED NEGATIVE SCORE
  // =====================================================
  //
  // Good Habit Negative Score
  // +
  // Daily Target Negative Score
  //
  // Example:
  // Habit = -1
  // Target = -2
  // Total = -3
  //
  // =====================================================

  const negativeScore =
    (Number(habitNegativeScore) || 0) +
    (Number(targetNegativeScore) || 0);

  // =====================================================
  // LOADING
  // =====================================================

  const isLoading =
    summaryLoading ||
    targetsLoading ||
    habitsLoading;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 shadow-sm">

      {/* =================================================
          TODAY'S STUDY
      ================================================= */}

      <StatCard
        icon={
          <Clock
            className="text-emerald-500"
            size={22}
          />
        }
        title={
          isLoading
            ? "..."
            : todayStudy
        }
        subtitle="Today's Study"
        subtext="Target 12h"
        color="bg-emerald-50"
      />

      {/* =================================================
          THIS MONTH
      ================================================= */}

      <StatCard
        icon={
          <Calendar
            className="text-pink-500"
            size={22}
          />
        }
        title={
          isLoading
            ? "..."
            : `${twelveHourDays} Days`
        }
        subtitle="This Month > 12 hours"
        subtext={`of ${currentMonthDays} days`}
        color="bg-pink-50"
      />

      {/* =================================================
          TODAY'S TARGETS
      ================================================= */}

      <StatCard
        icon={
          <Target
            className="text-purple-500"
            size={22}
          />
        }
        title={
          isLoading
            ? "..."
            : `${completedTargets} / ${totalTargets}`
        }
        subtitle="Today's Targets"
        subtext=""
        color="bg-purple-50"
      />

      {/* =================================================
          COMBINED POSITIVE SCORE
      ================================================= */}

      <StatCard
        icon={
          <Flame
            className="text-orange-500"
            size={22}
          />
        }
        title={
          isLoading
            ? "..."
            : positiveScore
        }
        subtitle="Positive Score"
        subtext="Today"
        color="bg-orange-50"
      />

      {/* =================================================
          COMBINED NEGATIVE SCORE
      ================================================= */}

      <StatCard
        icon={
          <Flame
            className="text-red-500"
            size={22}
          />
        }
        title={
          isLoading
            ? "..."
            : negativeScore
        }
        subtitle="Negative Score"
        subtext="Today"
        color="bg-red-50"
      />
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  icon,
  title,
  subtitle,
  subtext,
  color,
}) => {
  return (
    <div
      className={`${color} rounded-2xl p-4 shadow-sm border border-white/60`}
    >
      <div className="flex items-center gap-3">

        {/* Left Icon */}

        <div className="w-11 h-11 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>

        {/* Right Content */}

        <div className="min-w-0">

          <div className="text-xl font-bold text-slate-800 leading-tight">
            {title}
          </div>

          <div className="text-xs font-semibold text-slate-600 mt-1 truncate">
            {subtitle}
          </div>

          {subtext && (
            <div className="text-[10px] text-slate-500 mt-1">
              {subtext}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardStats;