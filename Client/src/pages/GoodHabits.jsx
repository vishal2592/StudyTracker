import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Dumbbell,
  HeartPulse,
  ListChecks,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Droplets,
  X,
  Flame,
} from "lucide-react";

const GoodHabits = () => {
  // =====================================================
  // HELPERS
  // =====================================================

  const getTodayKey = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayKey = getTodayKey();

  // =====================================================
  // DUMMY HABIT DATA
  // =====================================================

  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Wake up early",
      category: "Productivity",
      description: "Wake up before 6:00 AM every morning.",
      frequency: "Daily",
      reminder: "05:45",
      startDate: "2026-10-01",
      streak: 12,
      completed: true,
      icon: "sparkles",
      color: "purple",
      completionHistory: {
        "2026-10-01": true,
        "2026-10-02": true,
        "2026-10-03": true,
        "2026-10-04": true,
        "2026-10-05": true,
        "2026-10-06": true,
      },
    },
    {
      id: 2,
      name: "Drink enough water",
      category: "Health",
      description:
        "Drink at least 8 glasses of water throughout the day.",
      frequency: "Daily",
      reminder: "09:00",
      startDate: "2026-09-28",
      streak: 8,
      completed: true,
      icon: "water",
      color: "blue",
      completionHistory: {
        "2026-10-01": true,
        "2026-10-02": true,
        "2026-10-03": true,
        "2026-10-04": true,
        "2026-10-05": true,
        "2026-10-06": true,
      },
    },
    {
      id: 3,
      name: "Exercise",
      category: "Fitness",
      description: "Exercise or walk for at least 30 minutes.",
      frequency: "Daily",
      reminder: "06:30",
      startDate: "2026-09-30",
      streak: 5,
      completed: false,
      icon: "fitness",
      color: "blue",
      completionHistory: {
        "2026-10-01": true,
        "2026-10-02": true,
        "2026-10-03": false,
        "2026-10-04": true,
        "2026-10-05": true,
        "2026-10-06": false,
      },
    },
    {
      id: 4,
      name: "No social media",
      category: "Productivity",
      description:
        "Avoid social media during your planned study hours.",
      frequency: "Daily",
      reminder: "08:00",
      startDate: "2026-10-02",
      streak: 4,
      completed: false,
      icon: "target",
      color: "purple",
      completionHistory: {
        "2026-10-01": false,
        "2026-10-02": true,
        "2026-10-03": true,
        "2026-10-04": true,
        "2026-10-05": true,
        "2026-10-06": false,
      },
    },
    {
      id: 5,
      name: "Sleep on time",
      category: "Health",
      description: "Go to bed before 11:00 PM.",
      frequency: "Daily",
      reminder: "22:30",
      startDate: "2026-09-25",
      streak: 7,
      completed: false,
      icon: "heart",
      color: "purple",
      completionHistory: {
        "2026-10-01": true,
        "2026-10-02": true,
        "2026-10-03": true,
        "2026-10-04": true,
        "2026-10-05": true,
        "2026-10-06": false,
      },
    },
  ]);

  // =====================================================
  // DATE
  // =====================================================

  const [selectedDate, setSelectedDate] = useState(todayKey);

  // =====================================================
  // MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);

  // =====================================================
  // FILTER
  // =====================================================

  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // FORM
  // Only Habit Name + Reminder Time
  // =====================================================

  const initialForm = {
    name: "",
    reminder: "08:00",
  };

  const [formData, setFormData] = useState(initialForm);

  // =====================================================
  // FILTERED HABITS
  // =====================================================

  const currentDayHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (statusFilter === "completed") {
        return habit.completed;
      }

      if (statusFilter === "pending") {
        return !habit.completed;
      }

      return true;
    });
  }, [habits, statusFilter, selectedDate]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalHabits = habits.length;

  const completedHabits = habits.filter(
    (habit) => habit.completed
  ).length;

  const pendingHabits = totalHabits - completedHabits;

  const progressPercentage =
    totalHabits === 0
      ? 0
      : Math.round((completedHabits / totalHabits) * 100);

  const longestStreak =
    habits.length > 0
      ? Math.max(...habits.map((habit) => habit.streak))
      : 0;

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (dateKey) => {
    const date = new Date(`${dateKey}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (dateKey) => {
    const date = new Date(`${dateKey}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // CHANGE DATE
  // =====================================================

  const changeDate = (days) => {
    const date = new Date(`${selectedDate}T00:00:00`);

    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    setSelectedDate(`${year}-${month}-${day}`);
  };

  const goToToday = () => {
    setSelectedDate(getTodayKey());
  };

  // =====================================================
  // ADD HABIT
  // =====================================================

  const handleAddHabit = () => {
    setEditingHabitId(null);

    setFormData({
      ...initialForm,
      reminder: "08:00",
    });

    setShowModal(true);
  };

  // =====================================================
  // EDIT HABIT
  // =====================================================

  const handleEditHabit = (habit) => {
    setEditingHabitId(habit.id);

    setFormData({
      name: habit.name,
      reminder: habit.reminder || "08:00",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHabitId(null);
    setFormData(initialForm);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD / UPDATE
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      return;
    }

    if (editingHabitId) {
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === editingHabitId
            ? {
                ...habit,
                name: trimmedName,
                reminder: formData.reminder,
              }
            : habit
        )
      );
    } else {
      const newHabit = {
        id: Date.now(),

        name: trimmedName,

        // Keep existing structure so the rest of the UI
        // continues working without changes.
        category: "Productivity",
        description: "",
        frequency: "Daily",
        reminder: formData.reminder,
        startDate: selectedDate,

        streak: 0,
        completed: false,

        icon: "sparkles",
        color: "purple",

        completionHistory: {},
      };

      setHabits((prev) => [newHabit, ...prev]);
    }

    handleCloseModal();
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDeleteHabit = (id) => {
    const habit = habits.find((item) => item.id === id);

    if (!habit) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${habit.name}"?`
    );

    if (!confirmed) return;

    setHabits((prev) =>
      prev.filter((habit) => habit.id !== id)
    );
  };

  // =====================================================
  // TOGGLE
  // =====================================================

  const handleToggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;

        const nextCompleted = !habit.completed;
        const currentStreak = habit.streak || 0;

        return {
          ...habit,
          completed: nextCompleted,
          streak: nextCompleted
            ? currentStreak + 1
            : Math.max(0, currentStreak - 1),
          completionHistory: {
            ...(habit.completionHistory || {}),
            [selectedDate]: nextCompleted,
          },
        };
      })
    );
  };

  // =====================================================
  // ICON
  // =====================================================

  const getHabitIcon = (icon, size = 20) => {
    switch (icon) {
      case "water":
        return <Droplets size={size} />;

      case "fitness":
        return <Dumbbell size={size} />;

      case "target":
        return <Target size={size} />;

      case "heart":
        return <HeartPulse size={size} />;

      default:
        return <Sparkles size={size} />;
    }
  };

  // =====================================================
  // ICON COLOR
  // =====================================================

  const getIconStyle = (color) => {
    const styles = {
      purple: "bg-purple-50 text-purple-600",
      blue: "bg-blue-50 text-blue-600",
      emerald: "bg-emerald-50 text-emerald-600",
      orange: "bg-orange-50 text-orange-600",
      pink: "bg-pink-50 text-pink-600",
    };

    return styles[color] || styles.purple;
  };

  // =====================================================
  // CATEGORY COLOR
  // =====================================================

  const getCategoryStyle = (category) => {
    const styles = {
      Health: "bg-blue-50 text-blue-600",
      Fitness: "bg-indigo-50 text-indigo-600",
      Productivity: "bg-purple-50 text-purple-600",
      Lifestyle: "bg-violet-50 text-violet-600",
      Study: "bg-cyan-50 text-cyan-600",
    };

    return styles[category] || "bg-slate-100 text-slate-600";
  };

  // =====================================================
  // WEEKLY DAYS
  // =====================================================

  const weeklyDays = [
    {
      day: "Mon",
      date: "2026-10-05",
    },
    {
      day: "Tue",
      date: "2026-10-06",
    },
    {
      day: "Wed",
      date: "2026-10-07",
    },
    {
      day: "Thu",
      date: "2026-10-08",
    },
    {
      day: "Fri",
      date: "2026-10-09",
    },
    {
      day: "Sat",
      date: "2026-10-10",
    },
    {
      day: "Sun",
      date: "2026-10-11",
    },
  ];

  // =====================================================
  // WEEKLY CONSISTENCY
  // =====================================================

  const weeklyConsistency = weeklyDays.map((item) => {
    const completed = habits.filter(
      (habit) => habit.completionHistory?.[item.date]
    ).length;

    return {
      ...item,
      completed,
      percentage:
        totalHabits === 0
          ? 0
          : Math.round((completed / totalHabits) * 100),
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Sparkles size={21} />
              </div>

              <span className="text-sm font-semibold text-purple-600">
                Personal Growth
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Good Habits
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
              Build better habits, maintain your streaks and become more
              consistent every day.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddHabit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.98]"
          >
            <Plus size={18} />
            Add Habit
          </button>
        </div>

        {/* =====================================================
            DATE SELECTOR
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeDate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-purple-600"
              >
                <ChevronLeft size={19} />
              </button>

              <div className="min-w-0 flex-1 px-2 text-center sm:min-w-[260px]">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-900">
                  <CalendarDays
                    size={17}
                    className="text-purple-500"
                  />

                  <span>{formatDate(selectedDate)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => changeDate(1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-purple-600"
              >
                <ChevronRight size={19} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  selectedDate === getTodayKey()
                    ? "bg-purple-100 text-purple-700"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Today
              </button>

              <div className="hidden rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-500 sm:block">
                {formatShortDate(selectedDate)}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Habits
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalHabits}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Active habits
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <ListChecks size={21} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed
                </p>

                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  {completedHabits}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Done today
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending
                </p>

                <h3 className="mt-2 text-3xl font-bold text-orange-500">
                  {pendingHabits}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Need attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Clock3 size={21} />
              </div>
            </div>
          </div>

          {/* Best Streak */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Best Streak
                </p>

                <h3 className="mt-2 text-3xl font-bold text-orange-500">
                  {longestStreak}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Days in a row
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Flame size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TODAY PROGRESS
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Today's Habit Progress
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {completedHabits} of {totalHabits} habits completed
              </p>
            </div>

            <span className="text-sm font-bold text-purple-600">
              {progressPercentage}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* =====================================================
            HABITS + RIGHT SIDE
        ===================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* =====================================================
              HABIT LIST
          ===================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    My Habits
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Build consistency one day at a time.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      statusFilter === "all"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("pending")}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      statusFilter === "pending"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("completed")}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      statusFilter === "completed"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>

            {/* Habit Items */}
            <div className="divide-y divide-slate-100">

              {currentDayHabits.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-400">
                    <Sparkles size={28} />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No habits found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a habit and start building your daily routine.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddHabit}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    <Plus size={17} />
                    Add Habit
                  </button>
                </div>
              ) : (
                currentDayHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className={`p-5 transition hover:bg-slate-50/70 ${
                      habit.completed
                        ? "bg-emerald-50/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">

                      {/* Complete */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleHabit(habit.id)
                        }
                        className="mt-1 shrink-0"
                      >
                        {habit.completed ? (
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                            <Check
                              size={18}
                              strokeWidth={3}
                            />
                          </span>
                        ) : (
                          <Circle
                            size={34}
                            strokeWidth={1.6}
                            className="text-slate-300 transition hover:text-purple-500"
                          />
                        )}
                      </button>

                      {/* Icon */}
                      <div
                        className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:flex ${getIconStyle(
                          habit.color
                        )}`}
                      >
                        {getHabitIcon(habit.icon, 20)}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <h3
                              className={`text-base font-semibold sm:text-lg ${
                                habit.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-900"
                              }`}
                            >
                              {habit.name}
                            </h3>

                            {habit.description && (
                              <p className="mt-1 text-sm leading-6 text-slate-500">
                                {habit.description}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center gap-1">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditHabit(habit)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                              title="Edit habit"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteHabit(habit.id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete habit"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          <span
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${getCategoryStyle(
                              habit.category
                            )}`}
                          >
                            {habit.category}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            <Clock3 size={13} />
                            {habit.frequency}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            <Bell size={13} />
                            {habit.reminder}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                            <Flame size={13} />
                            {habit.streak} day streak
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ===================================================== */}

          <div className="space-y-6">

            {/* Streak */}
            <div className="overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-5 shadow-sm">
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-semibold text-purple-700">
                    Keep Your Streak Alive
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-purple-900">
                    {longestStreak} Days
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-purple-700/80">
                    Consistency is more important than perfection.
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                  <Flame size={24} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/80 p-3">
                <Trophy
                  size={17}
                  className="text-purple-500"
                />

                <span className="text-xs font-medium text-purple-800">
                  Complete today's habits to continue your streak.
                </span>
              </div>
            </div>

            {/* Weekly Consistency */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-bold text-slate-900">
                    Weekly Consistency
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your habit completion
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <CheckCheck size={18} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-2">
                {weeklyConsistency.map((item) => (
                  <div
                    key={item.date}
                    className="text-center"
                  >
                    <p className="mb-2 text-[10px] font-semibold text-slate-400">
                      {item.day}
                    </p>

                    <div
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                        item.percentage >= 80
                          ? "bg-purple-600 text-white"
                          : item.percentage >= 50
                          ? "bg-purple-100 text-purple-700"
                          : item.percentage > 0
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* Tip */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-indigo-900">
                    Habit Tip
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-indigo-700/80">
                    Start with small habits that are easy to repeat. Once
                    consistency becomes natural, increase the difficulty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            HABIT CATEGORIES
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-slate-900">
              Build a Balanced Routine
            </h2>

            <p className="text-sm text-slate-500">
              Good habits across different areas can improve your overall
              study and lifestyle consistency.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <HeartPulse
                size={20}
                className="text-blue-600"
              />

              <h3 className="mt-3 text-sm font-semibold text-blue-900">
                Health
              </h3>

              <p className="mt-1 text-xs text-blue-700/70">
                Water, sleep, nutrition
              </p>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <Dumbbell
                size={20}
                className="text-indigo-600"
              />

              <h3 className="mt-3 text-sm font-semibold text-indigo-900">
                Fitness
              </h3>

              <p className="mt-1 text-xs text-indigo-700/70">
                Exercise and movement
              </p>
            </div>

            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
              <Target
                size={20}
                className="text-purple-600"
              />

              <h3 className="mt-3 text-sm font-semibold text-purple-900">
                Productivity
              </h3>

              <p className="mt-1 text-xs text-purple-700/70">
                Focus and discipline
              </p>
            </div>

            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <Sparkles
                size={20}
                className="text-violet-600"
              />

              <h3 className="mt-3 text-sm font-semibold text-violet-900">
                Lifestyle
              </h3>

              <p className="mt-1 text-xs text-violet-700/70">
                Better daily routines
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADD / EDIT HABIT MODAL
          ONLY HABIT NAME + REMINDER TIME
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

              <div>
                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <Sparkles size={19} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {editingHabitId
                      ? "Update Habit"
                      : "Add New Habit"}
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {editingHabitId
                    ? "Update your habit name and reminder time."
                    : "Create your habit and set a reminder time."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >
              <div className="space-y-5">

                {/* Habit Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Habit Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Wake up early"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                    required
                  />
                </div>

                {/* Reminder Time */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Reminder Time
                  </label>

                  <div className="relative">
                    <Bell
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="time"
                      name="reminder"
                      value={formData.reminder}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
                >
                  {editingHabitId ? (
                    <>
                      <Save size={17} />
                      Update Habit
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Save Habit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodHabits;