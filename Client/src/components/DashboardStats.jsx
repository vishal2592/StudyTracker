import React from "react";
import {
  Clock,
  Calendar,
  Target,
  Flame,
} from "lucide-react";

const DashboardStats = ({
  todayStudySeconds = 0,
  twelveHourDays = 0,
  completedTargets = 0,
  totalTargets = 0,
  positiveScore = 0,
  negativeScore = 0,
}) => {
  // =====================================================
  // FORMAT STUDY TIME
  // =====================================================

  const formatStudyTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    // If less than 1 hour, show minutes only
    if (hours === 0) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  };

  // =====================================================
  // TODAY'S STUDY
  // =====================================================

  const todayStudy = formatStudyTime(
    todayStudySeconds
  );

  // =====================================================
  // TARGET DAYS
  // =====================================================

  const currentMonthDays = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

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
        title={todayStudy}
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
        title={`${twelveHourDays} Days`}
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
        title={`${completedTargets} / ${totalTargets}`}
        subtitle="Today's Targets"
        subtext=""
        color="bg-purple-50"
      />

      {/* =================================================
          POSITIVE SCORE
      ================================================= */}

      <StatCard
        icon={
          <Flame
            className="text-orange-500"
            size={22}
          />
        }
        title={positiveScore}
        subtitle="Positive Score"
        subtext="Today"
        color="bg-orange-50"
      />

      {/* =================================================
          NEGATIVE SCORE
      ================================================= */}

      <StatCard
        icon={
          <Flame
            className="text-red-500"
            size={22}
          />
        }
        title={negativeScore}
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