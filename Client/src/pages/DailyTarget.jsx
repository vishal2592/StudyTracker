
import React, { useEffect, useMemo, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  getTargets,
  createTarget,
  editTarget,
  toggleTarget,
  deleteTarget,
} from "../redux/slicer/dailyTargetSlice";

const DailyTargets = () => {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const {
    targets,
    loading,
    error,
    createLoading,
    editLoading,
    toggleLoading,
    deleteLoading,
    positiveScore,
    negativeScore,
  } = useSelector((state) => state.dailyTarget);

  // =====================================================
  // DATE HELPERS
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
  // FETCH TARGETS
  // =====================================================

  useEffect(() => {
    dispatch(getTargets(selectedDate));
  }, [dispatch, selectedDate]);

  // =====================================================
  // ADD / EDIT MODAL STATE
  // =====================================================

  const [showModal, setShowModal] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState(null);

  // =====================================================
  // DELETE MODAL STATE
  // =====================================================

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState(null);

  // =====================================================
  // FORM STATE
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
  // DURATION HELPER
  // =====================================================

  const durationToMinutes = (duration) => {
    const durationMap = {
      "30 minutes": 30,
      "1 hour": 60,
      "1.5 hours": 90,
      "2 hours": 120,
      "2.5 hours": 150,
      "3 hours": 180,
      "4 hours": 240,
    };

    return durationMap[duration] || 60;
  };

  const minutesToDuration = (minutes) => {
    const durationMap = {
      30: "30 minutes",
      60: "1 hour",
      90: "1.5 hours",
      120: "2 hours",
      150: "2.5 hours",
      180: "3 hours",
      240: "4 hours",
    };

    return durationMap[minutes] || "1 hour";
  };

  // =====================================================
  // CURRENT DATE TARGETS
  // =====================================================

  const dailyTargets = useMemo(() => {
    return Array.isArray(targets) ? targets : [];
  }, [targets]);

  // =====================================================
  // FILTERED TARGETS
  // =====================================================

  const filteredTargets = useMemo(() => {
    return dailyTargets.filter((target) => {
      if (statusFilter === "completed") {
        return target.isCompleted;
      }

      if (statusFilter === "pending") {
        return !target.isCompleted;
      }

      return true;
    });
  }, [dailyTargets, statusFilter]);

  // =====================================================
  // DAILY SUMMARY
  // =====================================================

  const totalTargets = dailyTargets.length;

  const completedTargets = dailyTargets.filter(
    (target) => target.isCompleted
  ).length;

  const pendingTargets = totalTargets - completedTargets;

  const progressPercentage =
    totalTargets === 0
      ? 0
      : Math.round((completedTargets / totalTargets) * 100);

  // =====================================================
  // SCORE
  // =====================================================

  const currentPositiveScore = Number(positiveScore || 0);
  const currentNegativeScore = Number(negativeScore || 0);

  const totalScore =
    currentPositiveScore + currentNegativeScore;

  // =====================================================
  // ERROR MESSAGE HELPER
  // =====================================================

  const getErrorMessage = (error, fallbackMessage) => {
    if (typeof error === "string") {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.error) {
      return error.error;
    }

    return fallbackMessage;
  };

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
    setEditingTargetId(target._id);

    setFormData({
      title: target.title || "",
      duration: minutesToDuration(target.durationMinutes),
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE ADD / EDIT MODAL
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      toast.error("Target title is required");
      return;
    }

    const durationMinutes = durationToMinutes(formData.duration);

    try {
      // =================================================
      // UPDATE TARGET
      // =================================================

      if (editingTargetId) {
        const response = await dispatch(
          editTarget({
            id: editingTargetId,
            targetData: {
              title: trimmedTitle,
              durationMinutes,
              date: selectedDate,
            },
          })
        ).unwrap();

        toast.success(
          response?.message || "Target updated successfully"
        );
      }

      // =================================================
      // CREATE TARGET
      // =================================================

      else {
        const response = await dispatch(
          createTarget({
            title: trimmedTitle,
            durationMinutes,
            date: selectedDate,
          })
        ).unwrap();

        toast.success(
          response?.message || "Target created successfully"
        );
      }

      handleCloseModal();
    } catch (error) {
      console.error("Target save error:", error);

      toast.error(
        getErrorMessage(
          error,
          editingTargetId
            ? "Failed to update target"
            : "Failed to create target"
        )
      );
    }
  };

  // =====================================================
  // OPEN DELETE CONFIRMATION MODAL
  // =====================================================

  const handleDeleteTarget = (id) => {
    const target = dailyTargets.find(
      (item) => item._id === id
    );

    if (!target) return;

    setTargetToDelete(target);
    setShowDeleteModal(true);
  };

  // =====================================================
  // CLOSE DELETE CONFIRMATION MODAL
  // =====================================================

  const handleCloseDeleteModal = () => {
    if (deleteLoading) return;

    setShowDeleteModal(false);
    setTargetToDelete(null);
  };

  // =====================================================
  // CONFIRM DELETE TARGET
  // =====================================================

  const handleConfirmDelete = async () => {
    if (!targetToDelete || deleteLoading) {
      return;
    }

    try {
      const response = await dispatch(
        deleteTarget(targetToDelete._id)
      ).unwrap();

      toast.success(
        response?.message || "Target deleted successfully"
      );

      setShowDeleteModal(false);
      setTargetToDelete(null);
    } catch (error) {
      console.error("Delete target error:", error);

      toast.error(
        getErrorMessage(
          error,
          "Failed to delete target"
        )
      );
    }
  };

  // =====================================================
  // TOGGLE TARGET
  // =====================================================

  const handleToggleTarget = async (id) => {
    try {
      const response = await dispatch(
        toggleTarget(id)
      ).unwrap();

      const completed =
        response?.target?.isCompleted;

      if (completed) {
        toast.success(
          "Target completed! +1 Positive Score"
        );
      } else {
        toast.error(
          "Target marked incomplete! -1 Negative Score"
        );
      }
    } catch (error) {
      console.error("Toggle target error:", error);

      toast.error(
        getErrorMessage(
          error,
          "Failed to update target"
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-1 sm:p-2 lg:p-3">
      <div className="mx-auto max-w-7xl space-y-4">

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

                  <span>
                    {formatDate(selectedDate)}
                  </span>

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
            ERROR
        ===================================================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>

              <p className="text-sm font-semibold">
                Unable to load targets
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

                <div className="mt-2 flex flex-wrap items-center gap-1.5">

                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                    +{currentPositiveScore} Positive
                  </span>

                  <span className="rounded-lg bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600">
                    {currentNegativeScore} Negative
                  </span>

                </div>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CheckCheck size={21} />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            SCORE SUMMARY
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                Today's Study Score
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Completed targets add positive points and pending
                targets reduce your score.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              <div className="rounded-xl bg-emerald-50 px-4 py-2 text-center">

                <p className="text-[11px] font-medium text-emerald-600">
                  Positive
                </p>

                <p className="text-lg font-bold text-emerald-700">
                  +{currentPositiveScore}
                </p>

              </div>

              <div className="rounded-xl bg-red-50 px-4 py-2 text-center">

                <p className="text-[11px] font-medium text-red-600">
                  Negative
                </p>

                <p className="text-lg font-bold text-red-700">
                  {currentNegativeScore}
                </p>

              </div>

              <div
                className={`rounded-xl px-4 py-2 text-center ${
                  totalScore >= 0
                    ? "bg-blue-50"
                    : "bg-orange-50"
                }`}
              >

                <p
                  className={`text-[11px] font-medium ${
                    totalScore >= 0
                      ? "text-blue-600"
                      : "text-orange-600"
                  }`}
                >
                  Total Score
                </p>

                <p
                  className={`text-lg font-bold ${
                    totalScore >= 0
                      ? "text-blue-700"
                      : "text-orange-700"
                  }`}
                >
                  {totalScore >= 0 ? "+" : ""}
                  {totalScore}
                </p>

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

            {loading ? (
              <div className="px-5 py-16 text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading your targets...
                </p>

              </div>
            ) : filteredTargets.length === 0 ? (
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
                    key={target._id}
                    className={`p-5 transition hover:bg-slate-50/70 ${
                      target.isCompleted
                        ? "bg-emerald-50/20"
                        : ""
                    }`}
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

                      {/* Checkbox */}

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleTarget(target._id)
                        }
                        disabled={toggleLoading}
                        className="mt-1 shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={
                          target.isCompleted
                            ? "Mark target as pending"
                            : "Mark target as completed"
                        }
                      >
                        {target.isCompleted ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                            <Check
                              size={18}
                              strokeWidth={3}
                            />
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
                                target.isCompleted
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
                              disabled={
                                editLoading ||
                                deleteLoading
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Edit target"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteTarget(
                                  target._id
                                )
                              }
                              disabled={deleteLoading}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete target"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                        </div>

                        {/* Meta */}

                        <div className="mt-4 flex flex-wrap items-center gap-2">

                          <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">
                            Study Target
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            <Clock3 size={13} />

                            {minutesToDuration(
                              target.durationMinutes
                            )}
                          </span>

                          {target.isCompleted &&
                            target.completedAt && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">

                                <CheckCircle2 size={13} />

                                Completed at{" "}
                                {new Date(
                                  target.completedAt
                                ).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}

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

              <div className="space-y-4">

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
                  disabled={createLoading || editLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createLoading || editLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : editingTargetId ? (
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

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {showDeleteModal && targetToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !deleteLoading
            ) {
              handleCloseDeleteModal();
            }
          }}
        >

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Delete Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Trash2 size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Delete Target?
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    This action cannot be undone.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleteLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* Delete Modal Body */}

            <div className="p-5 sm:p-6">

              <div className="rounded-xl border border-red-100 bg-red-50/70 p-4">

                <div className="flex items-start gap-3">

                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div className="min-w-0">

                    <p className="text-sm text-slate-600">
                      Are you sure you want to delete this target?
                    </p>

                    <p className="mt-2 break-words text-sm font-bold text-slate-900">
                      "{targetToDelete.title}"
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

                      <Clock3 size={14} />

                      <span>
                        {minutesToDuration(
                          targetToDelete.durationMinutes
                        )}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* Delete Modal Footer */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={deleteLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={17} />
                      Delete Target
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DailyTargets;

