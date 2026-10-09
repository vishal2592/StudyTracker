import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// =====================================================
// GET SUBJECT TRACKER
// GET /api/subject-tracker?date=YYYY-MM-DD
// =====================================================

export const getSubjectTracker = createAsyncThunk(
  "subjectTracker/getSubjectTracker",
  async (date, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/subject-tracker?date=${date}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch subject tracker",
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  tracker: null,

  loading: false,
  error: null,

  success: false,
};

// =====================================================
// SLICE
// =====================================================

const subjectTrackerSlice = createSlice({
  name: "subjectTracker",

  initialState,

  reducers: {
    clearSubjectTrackerError: (state) => {
      state.error = null;
    },

    clearSubjectTrackerSuccess: (state) => {
      state.success = false;
    },

    clearSubjectTracker: (state) => {
      state.tracker = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // GET SUBJECT TRACKER
    // =================================================

    builder
      .addCase(getSubjectTracker.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(getSubjectTracker.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.tracker = action.payload;
      })

      .addCase(getSubjectTracker.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error =
          action.payload ||
          "Failed to fetch subject tracker";
      });
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  clearSubjectTrackerError,
  clearSubjectTrackerSuccess,
  clearSubjectTracker,
} = subjectTrackerSlice.actions;

// =====================================================
// EXPORT REDUCER
// =====================================================

export default subjectTrackerSlice.reducer;