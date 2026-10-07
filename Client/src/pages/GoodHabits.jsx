import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

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

import {
  getHabits,
  createHabit,
  editHabit,
  toggleHabit,
  deleteHabit,
} from "../redux/slicer/habitSlice";


// =====================================================
// DATE HELPER
// =====================================================

const getTodayKey = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(
    2,
    "0"
  );

  const day = String(today.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
};


// =====================================================
// COMPONENT
// =====================================================

const GoodHabits = () => {
  const dispatch = useDispatch();

  // ===================================================
  // REDUX STATE
  // ===================================================

  const {
    habits,
    totalHabits,
    completedHabits,
    pendingHabits,
    loading,
    error,
    createLoading,
    editLoading,
    toggleLoading,
    deleteLoading,
  } = useSelector((state) => state.habit);


  // ===================================================
  // DATE
  // ===================================================

  const todayKey = getTodayKey();

  const [selectedDate, setSelectedDate] =
    useState(todayKey);


  // ===================================================
  // MODAL STATE
  // ===================================================

  const [showModal, setShowModal] = useState(false);

  const [editingHabitId, setEditingHabitId] =
    useState(null);


  // ===================================================
  // FILTER
  // ===================================================

  const [statusFilter, setStatusFilter] =
    useState("all");


  // ===================================================
  // FORM
  // ===================================================

  const initialForm = {
    name: "",
    reminder: "08:00",
  };

  const [formData, setFormData] =
    useState(initialForm);


  // ===================================================
  // GET HABITS
  // ===================================================

  useEffect(() => {
    dispatch(getHabits(selectedDate));
  }, [dispatch, selectedDate]);


  // ===================================================
  // FILTERED HABITS
  // ===================================================

  const currentDayHabits = useMemo(() => {
    return habits.filter((habit) => {
      const completed =
        habit.completed ??
        habit.isCompleted ??
        false;

      if (statusFilter === "completed") {
        return completed;
      }

      if (statusFilter === "pending") {
        return !completed;
      }

      return true;
    });
  }, [habits, statusFilter]);


  // ===================================================
  // PROGRESS
  // ===================================================

  const progressPercentage =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedHabits / totalHabits) * 100
        );


  // ===================================================
  // STREAK
  // ===================================================

  // Backend currently does not return real streak data.
  // We will connect real streak later.

  const longestStreak = 0;


  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDate = (dateKey) => {
    const date = new Date(
      `${dateKey}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


  const formatShortDate = (dateKey) => {
    const date = new Date(
      `${dateKey}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  // ===================================================
  // CHANGE DATE
  // ===================================================

  const changeDate = (days) => {
    const date = new Date(
      `${selectedDate}T00:00:00`
    );

    date.setDate(date.getDate() + days);

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    setSelectedDate(
      `${year}-${month}-${day}`
    );
  };


  // ===================================================
  // GO TO TODAY
  // ===================================================

  const goToToday = () => {
    setSelectedDate(getTodayKey());
  };


  // ===================================================
  // ADD HABIT
  // ===================================================

  const handleAddHabit = () => {
    setEditingHabitId(null);

    setFormData({
      ...initialForm,
      reminder: "08:00",
    });

    setShowModal(true);
  };


  // ===================================================
  // EDIT HABIT
  // ===================================================

  const handleEditHabit = (habit) => {
    setEditingHabitId(
      habit._id || habit.id
    );

    setFormData({
      name: habit.name,
      reminder: habit.reminder || "08:00",
    });

    setShowModal(true);
  };


  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const handleCloseModal = () => {
    setShowModal(false);

    setEditingHabitId(null);

    setFormData(initialForm);
  };


  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ===================================================
  // SUBMIT HABIT
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName =
      formData.name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      // ===============================================
      // EDIT
      // ===============================================

      if (editingHabitId) {
        await dispatch(
          editHabit({
            id: editingHabitId,

            habitData: {
              name: trimmedName,
            },
          })
        ).unwrap();
      }

      // ===============================================
      // CREATE
      // ===============================================

      else {
        await dispatch(
          createHabit({
            name: trimmedName,
            reminder: formData.reminder,
            startDate: selectedDate,
          })
        ).unwrap();
      }

      // ===============================================
      // CLOSE MODAL
      // ===============================================

      handleCloseModal();

      // ===============================================
      // REFRESH HABITS
      // ===============================================

      dispatch(
        getHabits(selectedDate)
      );
    } catch (error) {
      console.error(
        "Habit submit error:",
        error
      );
    }
  };


  // ===================================================
  // DELETE HABIT
  // ===================================================

  const handleDeleteHabit = async (id) => {
    const habit = habits.find(
      (item) =>
        (item._id || item.id) === id
    );

    if (!habit) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${habit.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteHabit(id)
      ).unwrap();

      dispatch(
        getHabits(selectedDate)
      );
    } catch (error) {
      console.error(
        "Delete habit error:",
        error
      );
    }
  };


  // ===================================================
  // TOGGLE HABIT
  // ===================================================

  const handleToggleHabit = async (id) => {
    try {
      await dispatch(
        toggleHabit({
          id,
          date: selectedDate,
        })
      ).unwrap();

      dispatch(
        getHabits(selectedDate)
      );
    } catch (error) {
      console.error(
        "Toggle habit error:",
        error
      );
    }
  };


  // ===================================================
  // HABIT ICON
  // ===================================================

  const getHabitIcon = (
    icon,
    size = 20
  ) => {
    switch (icon) {
      case "water":
        return (
          <Droplets size={size} />
        );

      case "fitness":
        return (
          <Dumbbell size={size} />
        );

      case "target":
        return (
          <Target size={size} />
        );

      case "heart":
        return (
          <HeartPulse size={size} />
        );

      default:
        return (
          <Sparkles size={size} />
        );
    }
  };


  // ===================================================
  // ICON STYLE
  // ===================================================

  const getIconStyle = (color) => {
    const styles = {
      purple:
        "bg-purple-50 text-purple-600",

      blue:
        "bg-blue-50 text-blue-600",

      emerald:
        "bg-emerald-50 text-emerald-600",

      orange:
        "bg-orange-50 text-orange-600",

      pink:
        "bg-pink-50 text-pink-600",
    };

    return (
      styles[color] ||
      styles.purple
    );
  };


  // ===================================================
  // CATEGORY STYLE
  // ===================================================

  const getCategoryStyle = (
    category
  ) => {
    const styles = {
      Health:
        "bg-blue-50 text-blue-600",

      Fitness:
        "bg-indigo-50 text-indigo-600",

      Productivity:
        "bg-purple-50 text-purple-600",

      Lifestyle:
        "bg-violet-50 text-violet-600",

      Study:
        "bg-cyan-50 text-cyan-600",
    };

    return (
      styles[category] ||
      "bg-slate-100 text-slate-600"
    );
  };


  // ===================================================
  // WEEKLY DAYS
  // ===================================================

  const getWeekDays = () => {
    const selected = new Date(
      `${selectedDate}T00:00:00`
    );

    const day =
      selected.getDay();

    const mondayOffset =
      day === 0 ? -6 : 1 - day;

    const monday = new Date(
      selected
    );

    monday.setDate(
      selected.getDate() +
        mondayOffset
    );

    const days = [];

    const dayNames = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    for (let i = 0; i < 7; i++) {
      const current =
        new Date(monday);

      current.setDate(
        monday.getDate() + i
      );

      const year =
        current.getFullYear();

      const month = String(
        current.getMonth() + 1
      ).padStart(2, "0");

      const date = String(
        current.getDate()
      ).padStart(2, "0");

      days.push({
        day: dayNames[i],
        date: `${year}-${month}-${date}`,
      });
    }

    return days;
  };


  const weeklyDays =
    getWeekDays();


  // ===================================================
  // WEEKLY CONSISTENCY
  // ===================================================

  /*
    Current backend GET /habits?date=
    only returns selected day's status.

    It does not yet return complete weekly
    history, therefore we keep weekly values
    at 0 for now.

    Later we will create a history endpoint
    and make this section fully dynamic.
  */

  const weeklyConsistency =
    weeklyDays.map((item) => ({
      ...item,
      completed: 0,
      percentage: 0,
    }));


  // ===================================================
  // LOADING TEXT
  // ===================================================

  const isAnyActionLoading =
    loading ||
    createLoading ||
    editLoading ||
    toggleLoading ||
    deleteLoading;


  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Sparkles size={24} />
            </div>

            <div>
              <p className="text-sm font-medium text-purple-600">
                Personal Growth
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Good Habits
              </h1>
            </div>

          </div>

          <button
            type="button"
            onClick={handleAddHabit}
            disabled={isAnyActionLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={18} />
            Add Habit
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* =================================================
            DATE SELECTOR
        ================================================= */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <button
            type="button"
            onClick={() =>
              changeDate(-1)
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="flex items-center justify-center gap-3">

            <CalendarDays
              size={20}
              className="text-purple-600"
            />

            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Selected Date
              </p>

              <p className="font-semibold text-slate-900">
                {formatDate(selectedDate)}
              </p>
            </div>

          </div>

          <div className="flex items-center justify-center gap-2">

            <button
              type="button"
              onClick={goToToday}
              className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-100"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() =>
                changeDate(1)
              }
              className="flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <ListChecks size={20} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Total
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900">
              {totalHabits}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total habits
            </p>

          </div>


          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Done
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900">
              {completedHabits}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Completed today
            </p>

          </div>


          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Clock3 size={20} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Pending
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900">
              {pendingHabits}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Remaining today
            </p>

          </div>


          {/* STREAK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Flame size={20} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Best
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900">
              {longestStreak}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Best streak
            </p>

          </div>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Daily Progress
              </p>

              <p className="text-xs text-slate-500">
                {completedHabits} of{" "}
                {totalHabits} habits completed
              </p>
            </div>

            <span className="text-lg font-bold text-purple-600">
              {progressPercentage}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />

          </div>

        </div>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              HABITS LIST
          ================================================= */}

          <div className="lg:col-span-2">

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* LIST HEADER */}

              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Your Habits
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track your habits for{" "}
                    {formatShortDate(
                      selectedDate
                    )}
                  </p>
                </div>


                {/* FILTER */}

                <div className="flex rounded-xl bg-slate-100 p-1">

                  <button
                    type="button"
                    onClick={() =>
                      setStatusFilter("all")
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      statusFilter === "all"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        "pending"
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      statusFilter ===
                      "pending"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        "completed"
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      statusFilter ===
                      "completed"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Done
                  </button>

                </div>

              </div>


              {/* LOADING */}

              {loading && (
                <div className="flex items-center justify-center px-5 py-12">

                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">

                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-purple-600" />

                    Loading habits...

                  </div>

                </div>
              )}


              {/* EMPTY */}

              {!loading &&
                currentDayHabits.length ===
                  0 && (
                  <div className="px-5 py-12 text-center">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                      <Sparkles
                        size={24}
                      />
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      No habits found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {statusFilter ===
                      "all"
                        ? "Start building better habits by adding your first habit."
                        : "No habits match the selected filter."}
                    </p>

                    {statusFilter ===
                      "all" && (
                      <button
                        type="button"
                        onClick={
                          handleAddHabit
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        <Plus
                          size={17}
                        />
                        Add Habit
                      </button>
                    )}

                  </div>
                )}


              {/* HABITS */}

              {!loading &&
                currentDayHabits.length >
                  0 && (
                  <div className="divide-y divide-slate-100">

                    {currentDayHabits.map(
                      (habit) => {
                        const habitId =
                          habit._id ||
                          habit.id;

                        const completed =
                          habit.completed ??
                          habit.isCompleted ??
                          false;

                        return (
                          <div
                            key={
                              habitId
                            }
                            className="p-5 transition hover:bg-slate-50/70"
                          >

                            <div className="flex gap-4">

                              {/* CHECK BUTTON */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleHabit(
                                    habitId
                                  )
                                }
                                disabled={
                                  toggleLoading
                                }
                                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                                  completed
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-slate-300 bg-white text-slate-300 hover:border-purple-400 hover:text-purple-500"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                              >
                                {completed ? (
                                  <Check
                                    size={20}
                                  />
                                ) : (
                                  <Circle
                                    size={20}
                                  />
                                )}
                              </button>


                              {/* CONTENT */}

                              <div className="min-w-0 flex-1">

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                  <div className="flex min-w-0 gap-3">

                                    <div
                                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getIconStyle(
                                        habit.color
                                      )}`}
                                    >
                                      {getHabitIcon(
                                        habit.icon,
                                        19
                                      )}
                                    </div>

                                    <div className="min-w-0">

                                      <h3
                                        className={`truncate text-base font-bold ${
                                          completed
                                            ? "text-slate-400 line-through"
                                            : "text-slate-900"
                                        }`}
                                      >
                                        {
                                          habit.name
                                        }
                                      </h3>

                                      {habit.description && (
                                        <p className="mt-1 text-sm text-slate-500">
                                          {
                                            habit.description
                                          }
                                        </p>
                                      )}

                                    </div>

                                  </div>


                                  {/* ACTIONS */}

                                  <div className="flex shrink-0 items-center gap-1">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditHabit(
                                          habit
                                        )
                                      }
                                      disabled={
                                        editLoading
                                      }
                                      className="rounded-lg p-2 text-slate-400 transition hover:bg-purple-50 hover:text-purple-600 disabled:opacity-50"
                                      title="Edit habit"
                                    >
                                      <Pencil
                                        size={
                                          17
                                        }
                                      />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteHabit(
                                          habitId
                                        )
                                      }
                                      disabled={
                                        deleteLoading
                                      }
                                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                      title="Delete habit"
                                    >
                                      <Trash2
                                        size={
                                          17
                                        }
                                      />
                                    </button>

                                  </div>

                                </div>


                                {/* META */}

                                <div className="mt-4 flex flex-wrap items-center gap-2">

                                  <span
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${getCategoryStyle(
                                      habit.category
                                    )}`}
                                  >
                                    {
                                      habit.category ||
                                      "Productivity"
                                    }
                                  </span>

                                  <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                    <CheckCheck
                                      size={
                                        13
                                      }
                                    />
                                    {
                                      habit.frequency ||
                                      "Daily"
                                    }
                                  </span>

                                  <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                    <Bell
                                      size={
                                        13
                                      }
                                    />
                                    {
                                      habit.reminder ||
                                      "08:00"
                                    }
                                  </span>

                                  {habit.streak >
                                    0 && (
                                    <span className="flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                                      <Flame
                                        size={
                                          13
                                        }
                                      />
                                      {
                                        habit.streak
                                      }{" "}
                                      day
                                      streak
                                    </span>
                                  )}

                                </div>

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

            </div>

          </div>


          {/* =================================================
              SIDEBAR
          ================================================= */}

          <div className="space-y-6">

            {/* STREAK CARD */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="bg-purple-600 p-5 text-white">

                <div className="mb-3 flex items-center gap-2">
                  <Flame
                    size={20}
                  />

                  <span className="text-sm font-semibold">
                    Keep Your Streak Alive
                  </span>
                </div>

                <p className="text-3xl font-bold">
                  {completedHabits}
                </p>

                <p className="mt-1 text-sm text-purple-100">
                  habits completed today
                </p>

              </div>

              <div className="p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Today's progress
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {progressPercentage}%
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                    <Trophy
                      size={22}
                    />
                  </div>

                </div>

              </div>

            </div>


            {/* WEEKLY CONSISTENCY */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h3 className="font-bold text-slate-900">
                    Weekly Consistency
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Your habit activity
                  </p>
                </div>

                <CalendarDays
                  size={20}
                  className="text-purple-600"
                />

              </div>


              <div className="space-y-3">

                {weeklyConsistency.map(
                  (item) => (
                    <div
                      key={
                        item.date
                      }
                      className="flex items-center gap-3"
                    >

                      <span className="w-8 text-xs font-semibold text-slate-500">
                        {
                          item.day
                        }
                      </span>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-purple-500 transition-all"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />

                      </div>

                      <span className="w-8 text-right text-xs font-semibold text-slate-500">
                        {
                          item.percentage
                        }%
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* HABIT TIP */}

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-purple-600">
                  <Sparkles
                    size={18}
                  />
                </div>

                <h3 className="font-bold text-purple-900">
                  Habit Tip
                </h3>

              </div>

              <p className="text-sm leading-6 text-purple-800">
                Start small and stay consistent.
                Completing a habit every day is
                more important than trying to do
                everything perfectly.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM CATEGORY SECTION
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">

            <Target
              size={19}
              className="text-purple-600"
            />

            <h3 className="font-bold text-slate-900">
              Build Better Habits
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-blue-50 p-4">

              <div className="mb-2 flex items-center gap-2 text-blue-600">

                <HeartPulse
                  size={18}
                />

                <span className="font-semibold">
                  Health
                </span>

              </div>

              <p className="text-xs leading-5 text-blue-700">
                Build habits that improve your
                health and wellbeing.
              </p>

            </div>


            <div className="rounded-xl bg-indigo-50 p-4">

              <div className="mb-2 flex items-center gap-2 text-indigo-600">

                <Dumbbell
                  size={18}
                />

                <span className="font-semibold">
                  Fitness
                </span>

              </div>

              <p className="text-xs leading-5 text-indigo-700">
                Stay active and make exercise a
                daily habit.
              </p>

            </div>


            <div className="rounded-xl bg-purple-50 p-4">

              <div className="mb-2 flex items-center gap-2 text-purple-600">

                <Target
                  size={18}
                />

                <span className="font-semibold">
                  Productivity
                </span>

              </div>

              <p className="text-xs leading-5 text-purple-700">
                Create routines that help you stay
                focused and productive.
              </p>

            </div>


            <div className="rounded-xl bg-cyan-50 p-4">

              <div className="mb-2 flex items-center gap-2 text-cyan-600">

                <ListChecks
                  size={18}
                />

                <span className="font-semibold">
                  Study
                </span>

              </div>

              <p className="text-xs leading-5 text-cyan-700">
                Build consistent study habits and
                improve every day.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  {editingHabitId
                    ? "Edit Habit"
                    : "Add New Habit"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a simple daily habit
                  and stay consistent.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="p-5"
            >

              {/* NAME */}

              <div className="mb-5">

                <label
                  htmlFor="habit-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Habit Name
                </label>

                <input
                  id="habit-name"
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. Read for 30 minutes"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                  autoFocus
                />

              </div>


              {/* REMINDER */}

              <div className="mb-6">

                <label
                  htmlFor="habit-reminder"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Reminder Time
                </label>

                <div className="relative">

                  <Clock3
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="habit-reminder"
                    type="time"
                    name="reminder"
                    value={
                      formData.reminder
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                  />

                </div>

                {editingHabitId && (
                  <p className="mt-2 text-xs text-slate-400">
                    Reminder update requires
                    backend support.
                  </p>
                )}

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createLoading ||
                    editLoading ||
                    !formData.name.trim()
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {createLoading ||
                  editLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingHabitId ? (
                        <Save
                          size={17}
                        />
                      ) : (
                        <Plus
                          size={17}
                        />
                      )}

                      {editingHabitId
                        ? "Save Changes"
                        : "Add Habit"}
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