
import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  ListChecks,
  Pencil,
  Plus,
  Save,
  Target,
  Trash2,
  X,
} from "lucide-react";

const DailyTargets = () => {
  // =====================================================
  // DUMMY TARGET DATA
  // Later this will come from backend / Redux
  // =====================================================

  const [targets, setTargets] = useState([
    {
      id: 1,
      title: "Biology - Human Physiology",
      subject: "Biology",
      duration: "2 hours",
      priority: "High",
      date: "2026-10-06",
      description:
        "Complete Human Physiology chapter and revise important concepts.",
      completed: true,
      completedAt: "08:45 AM",
    },
    {
      id: 2,
      title: "Physics - Current Electricity",
      subject: "Physics",
      duration: "2 hours",
      priority: "High",
      date: "2026-10-06",
      description:
        "Study current electricity concepts and solve numerical problems.",
      completed: false,
      completedAt: null,
    },
    {
      id: 3,
      title: "Chemistry - Organic Chemistry",
      subject: "Chemistry",
      duration: "1.5 hours",
      priority: "Medium",
      date: "2026-10-06",
      description:
        "Revise important organic chemistry reactions and mechanisms.",
      completed: false,
      completedAt: null,
    },
    {
      id: 4,
      title: "50 MCQs Practice",
      subject: "Practice",
      duration: "1 hour",
      priority: "High",
      date: "2026-10-06",
      description: "Solve 50 mixed subject MCQs and analyze mistakes.",
      completed: false,
      completedAt: null,
    },
    {
      id: 5,
      title: "Revision - Previous Questions",
      subject: "Revision",
      duration: "1 hour",
      priority: "Low",
      date: "2026-10-06",
      description:
        "Revise previous year questions and mark difficult topics.",
      completed: false,
      completedAt: null,
    },
    {
      id: 6,
      title: "Mathematics - Integration",
      subject: "Mathematics",
      duration: "2 hours",
      priority: "High",
      date: "2026-10-07",
      description:
        "Practice integration formulas and previous questions.",
      completed: false,
      completedAt: null,
    },
  ]);

  // =====================================================
  // DATE STATE
  // =====================================================

  const getTodayKey = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayKey());

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [showModal, setShowModal] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState(null);

  // =====================================================
  // FORM STATE
  // ONLY TITLE + PLANNED DURATION
  // =====================================================

  const initialForm = {
    title: "",
    duration: "1 hour",
  };

  const [formData, setFormData] = useState(initialForm);

  // =====================================================
  // FILTER
  // =====================================================

  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // CURRENT DATE TARGETS
  // =====================================================

  const filteredTargets = useMemo(() => {
    return targets
      .filter((target) => target.date === selectedDate)
      .filter((target) => {
        if (statusFilter === "completed") {
          return target.completed;
        }

        if (statusFilter === "pending") {
          return !target.completed;
        }

        return true;
      });
  }, [targets, selectedDate, statusFilter]);

  // =====================================================
  // DAILY SUMMARY
  // =====================================================

  const dailyTargets = useMemo(() => {
    return targets.filter((target) => target.date === selectedDate);
  }, [targets, selectedDate]);

  const totalTargets = dailyTargets.length;

  const completedTargets = dailyTargets.filter(
    (target) => target.completed
  ).length;

  const pendingTargets = totalTargets - completedTargets;

  const progressPercentage =
    totalTargets === 0
      ? 0
      : Math.round((completedTargets / totalTargets) * 100);

  // =====================================================
  // DATE HELPERS
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
  // OPEN ADD MODAL
  // =====================================================

  const handleAddTarget = () => {
    setEditingTargetId(null);

    setFormData({
      ...initialForm,
    });

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEditTarget = (target) => {
    setEditingTargetId(target.id);

    setFormData({
      title: target.title,
      duration: target.duration,
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTargetId(null);
    setFormData(initialForm);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD / UPDATE TARGET
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      return;
    }

    if (editingTargetId) {
      // =================================================
      // UPDATE TARGET
      // =================================================

      setTargets((prev) =>
        prev.map((target) =>
          target.id === editingTargetId
            ? {
                ...target,
                title: trimmedTitle,
                duration: formData.duration,
              }
            : target
        )
      );
    } else {
      // =================================================
      // ADD TARGET
      // =================================================

      const newTarget = {
        id: Date.now(),

        title: trimmedTitle,

        duration: formData.duration,

        // Existing fields are kept for current UI/data structure.
        subject: "Other",
        priority: "Medium",
        date: selectedDate,
        description: "",

        completed: false,
        completedAt: null,
      };

      setTargets((prev) => [newTarget, ...prev]);
    }

    handleCloseModal();
  };

  // =====================================================
  // DELETE TARGET
  // =====================================================

  const handleDeleteTarget = (id) => {
    const target = targets.find((item) => item.id === id);

    if (!target) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${target.title}"?`
    );

    if (!confirmed) return;

    setTargets((prev) =>
      prev.filter((target) => target.id !== id)
    );
  };

  // =====================================================
  // TOGGLE TARGET
  // =====================================================

  const handleToggleTarget = (id) => {
    setTargets((prev) =>
      prev.map((target) => {
        if (target.id !== id) return target;

        const nextCompleted = !target.completed;

        return {
          ...target,
          completed: nextCompleted,
          completedAt: nextCompleted
            ? new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null,
        };
      })
    );
  };

  // =====================================================
  // SUBJECT STYLE
  // =====================================================

  const getSubjectStyle = (subject) => {
    const styles = {
      Biology: "bg-emerald-50 text-emerald-600",
      Physics: "bg-blue-50 text-blue-600",
      Chemistry: "bg-purple-50 text-purple-600",
      Mathematics: "bg-orange-50 text-orange-600",
      Practice: "bg-pink-50 text-pink-600",
      Revision: "bg-cyan-50 text-cyan-600",
    };

    return styles[subject] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Target size={22} />
              </div>

              <span className="text-sm font-semibold text-purple-600">
                Study Planning
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Daily Targets
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
              Plan your daily study goals, track your progress and
              stay consistent with your preparation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddTarget}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.98]"
          >
            <Plus size={18} />
            Add Target
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
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
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
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
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
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                  Total Targets
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalTargets}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Planned for today
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
                  {completedTargets}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Targets completed
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
                  {pendingTargets}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Still remaining
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <AlertCircle size={21} />
              </div>

            </div>

          </div>

          {/* Progress */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Daily Progress
                </p>

                <h3 className="mt-2 text-3xl font-bold text-blue-600">
                  {progressPercentage}%
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Completion rate
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CheckCheck size={21} />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            PROGRESS BAR
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Today's Progress
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {completedTargets} of {totalTargets} targets completed
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
            TARGET LIST
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Today's Targets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your study goals for{" "}
                  <span className="font-medium text-slate-700">
                    {formatShortDate(selectedDate)}
                  </span>
                </p>
              </div>

              {/* Filters */}

              <div className="flex rounded-xl bg-slate-100 p-1">

                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    statusFilter === "all"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
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
                      : "text-slate-500 hover:text-slate-700"
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
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Completed
                </button>

              </div>

            </div>

          </div>

          {/* =====================================================
              TARGET ITEMS
          ===================================================== */}

          <div className="divide-y divide-slate-100">

            {filteredTargets.length === 0 ? (
              <div className="px-5 py-16 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Target size={28} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  No targets found
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  You don't have any targets matching this filter
                  for the selected date.
                </p>

                <button
                  type="button"
                  onClick={handleAddTarget}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  <Plus size={17} />
                  Add Target
                </button>

              </div>
            ) : (
              filteredTargets.map((target) => {

                return (
                  <div
                    key={target.id}
                    className={`p-5 transition hover:bg-slate-50/70 ${
                      target.completed
                        ? "bg-emerald-50/20"
                        : ""
                    }`}
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

                      {/* Checkbox */}

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleTarget(target.id)
                        }
                        className="mt-1 shrink-0"
                        aria-label={
                          target.completed
                            ? "Mark target as pending"
                            : "Mark target as completed"
                        }
                      >
                        {target.completed ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                            <Check size={18} strokeWidth={3} />
                          </span>
                        ) : (
                          <Circle
                            size={30}
                            strokeWidth={1.7}
                            className="text-slate-300 transition hover:text-purple-500"
                          />
                        )}
                      </button>

                      {/* Content */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <div className="min-w-0">

                            <h3
                              className={`text-base font-semibold sm:text-lg ${
                                target.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-900"
                              }`}
                            >
                              {target.title}
                            </h3>

                          </div>

                          {/* Actions */}

                          <div className="flex shrink-0 items-center gap-1">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditTarget(target)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                              title="Edit target"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteTarget(target.id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete target"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                        </div>

                        {/* Meta */}

                        <div className="mt-4 flex flex-wrap items-center gap-2">

                          <span
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${getSubjectStyle(
                              target.subject
                            )}`}
                          >
                            {target.subject}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            <Clock3 size={13} />
                            {target.duration}
                          </span>

                          {target.completed &&
                            target.completedAt && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                                <CheckCircle2 size={13} />
                                Completed at{" "}
                                {target.completedAt}
                              </span>
                            )}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* =====================================================
            QUICK INFO
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                <BookOpen size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-purple-900">
                  Plan Smart
                </h3>

                <p className="mt-1 text-sm leading-6 text-purple-700/80">
                  Break large subjects into smaller daily targets
                  so they are easier to complete.
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-emerald-900">
                  Complete Daily
                </h3>

                <p className="mt-1 text-sm leading-6 text-emerald-700/80">
                  Completing your daily targets contributes to
                  your overall positive study score.
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                <Clock3 size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-orange-900">
                  Stay Consistent
                </h3>

                <p className="mt-1 text-sm leading-6 text-orange-700/80">
                  Keep your targets realistic and focus on
                  completing them consistently every day.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
          ONLY:
          1. Target Title
          2. Planned Duration
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Target size={19} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {editingTargetId
                      ? "Update Target"
                      : "Add New Target"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Set your study target.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Body */}

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >

              <div className="space-y-5">

                {/* Target Title */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Target Title
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Physics - Current Electricity"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                    autoFocus
                    required
                  />

                </div>

                {/* Planned Duration */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Planned Duration
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                  >
                    <option value="30 minutes">
                      30 minutes
                    </option>

                    <option value="1 hour">
                      1 hour
                    </option>

                    <option value="1.5 hours">
                      1.5 hours
                    </option>

                    <option value="2 hours">
                      2 hours
                    </option>

                    <option value="2.5 hours">
                      2.5 hours
                    </option>

                    <option value="3 hours">
                      3 hours
                    </option>

                    <option value="4 hours">
                      4 hours
                    </option>
                  </select>

                </div>

              </div>

              {/* Modal Footer */}

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
                  {editingTargetId ? (
                    <>
                      <Save size={17} />
                      Update Target
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Save Target
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

export default DailyTargets;
