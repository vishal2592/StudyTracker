
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// =====================================================
// GET DAILY TARGETS
// GET /api/daily-targets?date=YYYY-MM-DD
// =====================================================

export const getTargets = createAsyncThunk(
  "dailyTarget/getTargets",
  async (date, { rejectWithValue }) => {
    try {
      const response = await api.get("/targets", {
        params: {
          date,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get daily targets",
        },
      );
    }
  },
);

// =====================================================
// CREATE DAILY TARGET
// POST /api/daily-targets
// =====================================================

export const createTarget = createAsyncThunk(
  "dailyTarget/createTarget",
  async (targetData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/targets",
        targetData,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create daily target",
        },
      );
    }
  },
);

// =====================================================
// EDIT DAILY TARGET
// PATCH /api/daily-targets/:id
// =====================================================

export const editTarget = createAsyncThunk(
  "dailyTarget/editTarget",
  async ({ id, targetData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/targets/${id}`,
        targetData,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update daily target",
        },
      );
    }
  },
);

// =====================================================
// TOGGLE DAILY TARGET
// PATCH /api/daily-targets/:id/toggle
// =====================================================

export const toggleTarget = createAsyncThunk(
  "dailyTarget/toggleTarget",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/targets/${id}/toggle`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update target",
        },
      );
    }
  },
);

// =====================================================
// DELETE DAILY TARGET
// DELETE /api/daily-targets/:id
// =====================================================

export const deleteTarget = createAsyncThunk(
  "dailyTarget/deleteTarget",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/targets/${id}`,
      );

      return {
        ...response.data,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete daily target",
        },
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  targets: [],

  selectedDate: "",

  totalTargets: 0,
  completedTargets: 0,
  pendingTargets: 0,

  targetCount: "0/0",

  positiveScore: 0,
  negativeScore: 0,

  loading: false,
  error: null,

  createLoading: false,
  editLoading: false,
  toggleLoading: false,
  deleteLoading: false,

  successMessage: null,
};

// =====================================================
// SLICE
// =====================================================

const dailyTargetSlice = createSlice({
  name: "dailyTarget",

  initialState,

  reducers: {
    clearDailyTargetError: (state) => {
      state.error = null;
    },

    clearDailyTargetSuccess: (state) => {
      state.successMessage = null;
    },

    clearDailyTargets: (state) => {
      state.targets = [];
      state.selectedDate = "";
      state.totalTargets = 0;
      state.completedTargets = 0;
      state.pendingTargets = 0;
      state.targetCount = "0/0";
      state.positiveScore = 0;
      state.negativeScore = 0;
    },
  },

  // ===================================================
  // EXTRA REDUCER
  // ===================================================

  extraReducers: (builder) => {
    builder

      // =================================================
      // GET TARGETS
      // =================================================

      .addCase(getTargets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTargets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.targets = action.payload.targets || [];

        state.selectedDate = action.payload.date || "";

        state.totalTargets =
          action.payload.totalTargets || 0;

        state.completedTargets =
          action.payload.completedTargets || 0;

        state.pendingTargets =
          action.payload.pendingTargets || 0;

        state.targetCount =
          action.payload.targetCount || "0/0";

        state.positiveScore =
          action.payload.positiveScore || 0;

        state.negativeScore =
          action.payload.negativeScore || 0;
      })

      .addCase(getTargets.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          "Failed to get daily targets";
      })

      // =================================================
      // CREATE TARGET
      // =================================================

      .addCase(createTarget.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(createTarget.fulfilled, (state, action) => {
        state.createLoading = false;
        state.error = null;

        const newTarget = action.payload.target;

        if (newTarget) {
          state.targets.push(newTarget);

          state.totalTargets += 1;

          state.pendingTargets += 1;

          state.targetCount = `${state.completedTargets}/${state.totalTargets}`;

          state.negativeScore -= 1;
        }

        state.successMessage =
          action.payload.message ||
          "Daily target created successfully";
      })

      .addCase(createTarget.rejected, (state, action) => {
        state.createLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to create daily target";
      })

      // =================================================
      // EDIT TARGET
      // =================================================

      .addCase(editTarget.pending, (state) => {
        state.editLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(editTarget.fulfilled, (state, action) => {
        state.editLoading = false;
        state.error = null;

        const updatedTarget = action.payload.target;

        if (updatedTarget) {
          const index = state.targets.findIndex(
            (target) => target._id === updatedTarget._id,
          );

          if (index !== -1) {
            state.targets[index] = updatedTarget;
          }
        }

        state.successMessage =
          action.payload.message ||
          "Daily target updated successfully";
      })

      .addCase(editTarget.rejected, (state, action) => {
        state.editLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to update daily target";
      })

      // =================================================
      // TOGGLE TARGET
      // =================================================

      .addCase(toggleTarget.pending, (state) => {
        state.toggleLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(toggleTarget.fulfilled, (state, action) => {
        state.toggleLoading = false;
        state.error = null;

        const updatedTarget = action.payload.target;

        if (updatedTarget) {
          const index = state.targets.findIndex(
            (target) => target._id === updatedTarget._id,
          );

          if (index !== -1) {
            state.targets[index] = updatedTarget;
          }

          // ---------------------------------------------
          // Update counts
          // ---------------------------------------------

          if (updatedTarget.isCompleted) {
            state.completedTargets += 1;
            state.pendingTargets -= 1;

            state.positiveScore += 1;
            state.negativeScore += 1;
          } else {
            state.completedTargets -= 1;
            state.pendingTargets += 1;

            state.positiveScore -= 1;
            state.negativeScore -= 1;
          }

          state.targetCount = `${state.completedTargets}/${state.totalTargets}`;
        }

        state.successMessage =
          action.payload.message ||
          "Target updated successfully";
      })

      .addCase(toggleTarget.rejected, (state, action) => {
        state.toggleLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to update target";
      })

      // =================================================
      // DELETE TARGET
      // =================================================

      .addCase(deleteTarget.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(deleteTarget.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.error = null;

        const deletedTarget = state.targets.find(
          (target) => target._id === action.payload.id,
        );

        if (deletedTarget) {
          state.targets = state.targets.filter(
            (target) => target._id !== action.payload.id,
          );

          state.totalTargets -= 1;

          if (deletedTarget.isCompleted) {
            state.completedTargets -= 1;
            state.positiveScore -= 1;
          } else {
            state.pendingTargets -= 1;
            state.negativeScore += 1;
          }

          state.targetCount = `${state.completedTargets}/${state.totalTargets}`;
        }

        state.successMessage =
          action.payload.message ||
          "Target deleted successfully";
      })

      .addCase(deleteTarget.rejected, (state, action) => {
        state.deleteLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to delete daily target";
      });
  },
});

// =====================================================
// EXPORT
// =====================================================

export const {
  clearDailyTargetError,
  clearDailyTargetSuccess,
  clearDailyTargets,
} = dailyTargetSlice.actions;

export default dailyTargetSlice.reducer;
