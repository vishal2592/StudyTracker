
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
// GET RUNNING STUDY
// GET /api/study/running
// =====================================================

export const getRunningStudy = createAsyncThunk(
  "study/getRunningStudy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/study/running",
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get running study session",
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
  // Current running study session
  currentSession: null,

  // Whether study is currently running
  isStudying: false,

  // Start study loading
  startLoading: false,

  // Stop study loading
  stopLoading: false,

  // Running study loading
  runningLoading: false,

  // Daily summary
  summary: null,

  // Summary loading
  summaryLoading: false,

  // Monthly overview
  monthlyOverview: null,

  // Monthly loading
  monthlyLoading: false,

  // Calendar
  calendar: [],

  // Calendar loading
  calendarLoading: false,

  // Weekly study
  weeklyStudy: null,

  // Weekly loading
  weeklyLoading: false,

  // Error
  error: null,

  // Success message
  successMessage: null,
};

// =====================================================
// SLICE
// =====================================================

const studySlice = createSlice({
  name: "study",

  initialState,

  reducers: {
    // =================================================
    // CLEAR ERROR
    // =================================================

    clearStudyError: (state) => {
      state.error = null;
    },

    // =================================================
    // CLEAR SUCCESS
    // =================================================

    clearStudySuccess: (state) => {
      state.successMessage = null;
    },

    // =================================================
    // CLEAR CURRENT SESSION
    // =================================================

    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.isStudying = false;
    },

    // =================================================
    // RESET STUDY STATE
    // =================================================

    resetStudyState: (state) => {
      state.currentSession = null;
      state.isStudying = false;

      state.startLoading = false;
      state.stopLoading = false;
      state.runningLoading = false;

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
    // GET RUNNING STUDY
    // =================================================

    builder
      .addCase(getRunningStudy.pending, (state) => {
        state.runningLoading = true;
        state.error = null;
      })

      .addCase(getRunningStudy.fulfilled, (state, action) => {
        state.runningLoading = false;
        state.error = null;

        /*
         * Expected backend response:
         *
         * {
         *   success: true,
         *   session: {...}
         * }
         *
         * OR
         *
         * {
         *   success: true,
         *   session: null
         * }
         */

        const session =
          action.payload?.session || null;

        state.currentSession = session;

        state.isStudying = Boolean(session);
      })

      .addCase(getRunningStudy.rejected, (state, action) => {
        state.runningLoading = false;

        state.error =
          action.payload?.message ||
          "Failed to get running study session";

        /*
         * If backend says there is no running session,
         * frontend should not remain in studying state.
         */
        state.currentSession = null;
        state.isStudying = false;
      });

    // =================================================
    // GET STUDY SUMMARY
    // =================================================

    builder
      .addCase(getStudySummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })

      .addCase(
        getStudySummary.fulfilled,
        (state, action) => {
          state.summaryLoading = false;
          state.error = null;

          state.summary = action.payload;
        },
      )

      .addCase(
        getStudySummary.rejected,
        (state, action) => {
          state.summaryLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to get study summary";
        },
      );

    // =================================================
    // GET MONTHLY OVERVIEW
    // =================================================

    builder
      .addCase(
        getMonthlyOverview.pending,
        (state) => {
          state.monthlyLoading = true;
          state.error = null;
        },
      )

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
      .addCase(
        getStudyCalendar.pending,
        (state) => {
          state.calendarLoading = true;
          state.error = null;
        },
      )

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
// SELECTORS
// =====================================================

export const selectCurrentSession = (state) =>
  state.study.currentSession;

export const selectIsStudying = (state) =>
  state.study.isStudying;

export const selectStudyLoading = (state) =>
  state.study.startLoading ||
  state.study.stopLoading;

export const selectRunningLoading = (state) =>
  state.study.runningLoading;

export const selectStudySummary = (state) =>
  state.study.summary;

export const selectStudyError = (state) =>
  state.study.error;

// =====================================================
// EXPORT REDUCER
// =====================================================

export default studySlice.reducer;

