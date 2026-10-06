import React, { useMemo, useState } from "react";

import DashboardBanner from "../components/DashboardBanner";
import DashboardStats from "../components/DashboardStats";
import DashboardMiddleSection from "../components/DashboardMiddleSection";
import DashboardBottomSection from "../components/DashboardBottomSection";

const Dashboard = () => {
  // =====================================================
  // TODAY'S TARGETS
  // =====================================================

  const [targets, setTargets] = useState([
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
      completed: false,
    },
    {
      id: 3,
      title: "Chemistry - Organic Chemistry",
      duration: "1.5 hours",
      completed: false,
    },
    {
      id: 4,
      title: "50 MCQs Practice",
      duration: "1 hour",
      completed: false,
    },
  ]);

  // =====================================================
  // TODAY'S GOOD HABITS
  // =====================================================

  const [habits, setHabits] = useState([
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
  ]);

  // =====================================================
  // STUDY DATA
  // =====================================================
  //
  // Date-wise total study time will be stored in seconds.
  //
  // Example:
  // {
  //   "2026-10-06": 7200
  // }
  //
  // 7200 seconds = 2 hours
  // =====================================================

  const [studyData, setStudyData] = useState({});

  // =====================================================
  // CURRENT RUNNING SESSION
  // =====================================================
  //
  // This is used so Stats can update while the timer
  // is currently running.
  // =====================================================

  const [liveStudySeconds, setLiveStudySeconds] = useState(0);

  // =====================================================
  // ADD COMPLETED STUDY SESSION
  // =====================================================

  const handleStudySessionComplete = ({
    dateKey,
    durationSeconds,
    subject,
    startTime,
    endTime,
  }) => {
    setStudyData((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || 0) + durationSeconds,
    }));

    // Subject, startTime and endTime are intentionally
    // received here because later we can use them for
    // subject-wise progress and study history.
    console.log("Study session completed:", {
      subject,
      startTime,
      endTime,
      durationSeconds,
      dateKey,
    });

    // Current live session is finished.
    setLiveStudySeconds(0);
  };

  // =====================================================
  // GET TODAY'S DATE KEY
  // =====================================================

  const getTodayKey = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // TODAY'S COMPLETED STUDY
  // =====================================================

  const todayStudySeconds = useMemo(() => {
    const todayKey = getTodayKey();

    return (studyData[todayKey] || 0) + liveStudySeconds;
  }, [studyData, liveStudySeconds]);

  // =====================================================
  // THIS MONTH - DAYS WITH 12+ HOURS
  // =====================================================

  const twelveHourDays = useMemo(() => {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let count = 0;

    Object.entries(studyData).forEach(([dateKey, seconds]) => {
      const [year, month] = dateKey.split("-").map(Number);

      if (
        year === currentYear &&
        month === currentMonth + 1 &&
        seconds >= 12 * 60 * 60
      ) {
        count += 1;
      }
    });

    // If today's running session makes today's total reach
    // 12 hours, count today as well.
    const todayKey = getTodayKey();

    const todayTotal =
      (studyData[todayKey] || 0) + liveStudySeconds;

    const todayAlreadyCounted = studyData[todayKey] >= 12 * 60 * 60;

    if (
      todayTotal >= 12 * 60 * 60 &&
      !todayAlreadyCounted
    ) {
      count += 1;
    }

    return count;
  }, [studyData, liveStudySeconds]);

  // =====================================================
  // TARGET STATS
  // =====================================================

  const completedTargets = useMemo(() => {
    return targets.filter((target) => target.completed).length;
  }, [targets]);

  const totalTargets = targets.length;

  // =====================================================
  // HABIT STATS
  // =====================================================

  const completedHabits = useMemo(() => {
    return habits.filter((habit) => habit.completed).length;
  }, [habits]);

  const totalHabits = habits.length;

  // =====================================================
  // POSITIVE SCORE
  // =====================================================
  //
  // For now:
  //
  // 12+ hours study       = +5
  // Completed target      = +1 each
  // Completed habit       = +5 each
  //
  // Early/late start score
  // will be connected after we update MiddleSection.
  // =====================================================

  const study12HourBonus =
    todayStudySeconds >= 12 * 60 * 60 ? 5 : 0;

  const targetPositiveScore = completedTargets;

  const habitPositiveScore = completedHabits * 5;

  const positiveScore =
    study12HourBonus +
    targetPositiveScore +
    habitPositiveScore;

  // =====================================================
  // NEGATIVE SCORE
  // =====================================================
  //
  // Pending target          = +1 each
  // Pending habit           = +5 each
  //
  // Late start score will be
  // connected after MiddleSection update.
  // =====================================================

  const pendingTargets =
    totalTargets - completedTargets;

  const pendingHabits =
    totalHabits - completedHabits;

  const targetNegativeScore = pendingTargets;

  const habitNegativeScore = pendingHabits * 5;

  const negativeScore =
    targetNegativeScore +
    habitNegativeScore;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      <DashboardBanner />

      <DashboardStats
        todayStudySeconds={todayStudySeconds}
        twelveHourDays={twelveHourDays}
        completedTargets={completedTargets}
        totalTargets={totalTargets}
        positiveScore={positiveScore}
        negativeScore={negativeScore}
      />

      <DashboardMiddleSection
        targets={targets}
        setTargets={setTargets}
        habits={habits}
        setHabits={setHabits}
        onStudySessionComplete={handleStudySessionComplete}
        onLiveStudySecondsChange={setLiveStudySeconds}
      />

      <DashboardBottomSection
        studyData={studyData}
      />
    </div>
  );
};

export default Dashboard;