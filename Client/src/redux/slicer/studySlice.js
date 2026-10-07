import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import api from "../api";

// =====================================================
// START STUDY
// POST /api/study/start
// =====================================================

export const startStudy = createAsyncThunk(
  "study/startStudy",
  async (studyData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/study/start",
        studyData,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to start study session",
        },
      );
    }
  },
);

// =====================================================
// STOP STUDY
// POST /api/study/stop
// =====================================================

export const stopStudy = createAsyncThunk(
  "study/stopStudy",
  async (stopData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/study/stop",
        stopData,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to stop study session",
        },
      );
    }
  },
);

// =====================================================
// GET STUDY SUMMARY
// GET /api/study/summary?date=YYYY-MM-DD
// =====================================================

export const getStudySummary = createAsyncThunk(
  "study/getStudySummary",
  async (date, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/study/summary",
        {
          params: {
            date,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get study summary",
        },
      );
    }
  },
);

// =====================================================
// GET MONTHLY OVERVIEW
// GET /api/study/monthly?month=YYYY-MM
// =====================================================

export const getMonthlyOverview = createAsyncThunk(
  "study/getMonthlyOverview",
  async (month, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/study/monthly",
        {
          params: {
            month,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get monthly overview",
        },
      );
    }
  },
);

// =====================================================
// GET STUDY CALENDAR
// GET /api/study/calendar?month=YYYY-MM
// =====================================================

export const getStudyCalendar = createAsyncThunk(
  "study/getStudyCalendar",
  async (month, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/study/calendar",
        {
          params: {
            month,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get study calendar",
        },
      );
    }
  },
);

// =====================================================
// GET WEEKLY STUDY HOURS
// GET /api/study/weekly?date=YYYY-MM-DD
// =====================================================

export const getWeeklyStudyHours = createAsyncThunk(
  "study/getWeeklyStudyHours",
  async (date, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/study/weekly",
        {
          params: {
            date,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get weekly study hours",
        },
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  // Current session
  currentSession: null,
  isStudying: false,

  // Start / Stop loading
  startLoading: false,
  stopLoading: false,

  // Summary
  summary: null,
  summaryLoading: false,

  // Monthly
  monthlyOverview: null,
  monthlyLoading: false,

  // Calendar
  calendar: [],
  calendarLoading: false,

  // Weekly
  weeklyStudy: null,
  weeklyLoading: false,

  // Common
  error: null,
  successMessage: null,
};

// =====================================================
// SLICE
// =====================================================

const studySlice = createSlice({
  name: "study",

  initialState,

  reducers: {
    // Clear error
    clearStudyError: (state) => {
      state.error = null;
    },

    // Clear success message
    clearStudySuccess: (state) => {
      state.successMessage = null;
    },

    // Clear current session
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.isStudying = false;
    },

    // Reset complete study state
    resetStudyState: (state) => {
      state.currentSession = null;
      state.isStudying = false;

      state.startLoading = false;
      state.stopLoading = false;

      state.summary = null;
      state.summaryLoading = false;

      state.monthlyOverview = null;
      state.monthlyLoading = false;

      state.calendar = [];
      state.calendarLoading = false;

      state.weeklyStudy = null;
      state.weeklyLoading = false;

      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // START STUDY
    // =================================================

    builder
      .addCase(startStudy.pending, (state) => {
        state.startLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(startStudy.fulfilled, (state, action) => {
        state.startLoading = false;
        state.error = null;

        state.successMessage =
          action.payload?.message ||
          "Study session started successfully";

        if (action.payload?.session) {
          state.currentSession =
            action.payload.session;

          state.isStudying = true;
        }
      })

      .addCase(startStudy.rejected, (state, action) => {
        state.startLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to start study session";
      });

    // =================================================
    // STOP STUDY
    // =================================================

    builder
      .addCase(stopStudy.pending, (state) => {
        state.stopLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(stopStudy.fulfilled, (state, action) => {
        state.stopLoading = false;
        state.error = null;

        state.successMessage =
          action.payload?.message ||
          "Study session stopped successfully";

        if (action.payload?.session) {
          state.currentSession =
            action.payload.session;
        }

        state.isStudying = false;
      })

      .addCase(stopStudy.rejected, (state, action) => {
        state.stopLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to stop study session";
      });

    // =================================================
    // GET STUDY SUMMARY
    // =================================================

    builder
      .addCase(getStudySummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })

      .addCase(getStudySummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.error = null;

        state.summary = action.payload;
      })

      .addCase(getStudySummary.rejected, (state, action) => {
        state.summaryLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to get study summary";
      });

    // =================================================
    // GET MONTHLY OVERVIEW
    // =================================================

    builder
      .addCase(getMonthlyOverview.pending, (state) => {
        state.monthlyLoading = true;
        state.error = null;
      })

      .addCase(
        getMonthlyOverview.fulfilled,
        (state, action) => {
          state.monthlyLoading = false;
          state.error = null;

          state.monthlyOverview =
            action.payload;
        },
      )

      .addCase(
        getMonthlyOverview.rejected,
        (state, action) => {
          state.monthlyLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to get monthly overview";
        },
      );

    // =================================================
    // GET STUDY CALENDAR
    // =================================================

    builder
      .addCase(getStudyCalendar.pending, (state) => {
        state.calendarLoading = true;
        state.error = null;
      })

      .addCase(
        getStudyCalendar.fulfilled,
        (state, action) => {
          state.calendarLoading = false;
          state.error = null;

          state.calendar =
            action.payload?.calendar || [];
        },
      )

      .addCase(
        getStudyCalendar.rejected,
        (state, action) => {
          state.calendarLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to get study calendar";
        },
      );

    // =================================================
    // GET WEEKLY STUDY HOURS
    // =================================================

    builder
      .addCase(
        getWeeklyStudyHours.pending,
        (state) => {
          state.weeklyLoading = true;
          state.error = null;
        },
      )

      .addCase(
        getWeeklyStudyHours.fulfilled,
        (state, action) => {
          state.weeklyLoading = false;
          state.error = null;

          state.weeklyStudy =
            action.payload;
        },
      )

      .addCase(
        getWeeklyStudyHours.rejected,
        (state, action) => {
          state.weeklyLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to get weekly study hours";
        },
      );
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearStudyError,
  clearStudySuccess,
  clearCurrentSession,
  resetStudyState,
} = studySlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default studySlice.reducer;