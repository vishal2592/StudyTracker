import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// =====================================================
// GET TARGET COUNTDOWN
// GET /api/target/countdown
// =====================================================

export const getTargetCountdown = createAsyncThunk(
  "target/getTargetCountdown",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/target/countdown");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch target countdown"
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  target: null,

  loading: false,

  error: null,

  success: false,
};

// =====================================================
// TARGET SLICE
// =====================================================

const targetSlice = createSlice({
  name: "target",

  initialState,

  reducers: {
    // -------------------------------------------------
    // CLEAR ERROR
    // -------------------------------------------------

    clearTargetError: (state) => {
      state.error = null;
    },

    // -------------------------------------------------
    // CLEAR SUCCESS
    // -------------------------------------------------

    clearTargetSuccess: (state) => {
      state.success = false;
    },

    // -------------------------------------------------
    // CLEAR TARGET
    // -------------------------------------------------

    clearTarget: (state) => {
      state.target = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    // -------------------------------------------------
    // RESET TARGET STATE
    // -------------------------------------------------

    resetTargetState: (state) => {
      state.target = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  // ===================================================
  // EXTRA REDUCERS
  // ===================================================

  extraReducers: (builder) => {
    builder

      // -------------------------------------------------
      // GET TARGET COUNTDOWN - PENDING
      // -------------------------------------------------

      .addCase(
        getTargetCountdown.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )

      // -------------------------------------------------
      // GET TARGET COUNTDOWN - FULFILLED
      // -------------------------------------------------

      .addCase(
        getTargetCountdown.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;
          state.success = true;

          state.target =
            action.payload?.target || null;
        }
      )

      // -------------------------------------------------
      // GET TARGET COUNTDOWN - REJECTED
      // -------------------------------------------------

      .addCase(
        getTargetCountdown.rejected,
        (state, action) => {
          state.loading = false;
          state.success = false;

          state.error =
            action.payload ||
            "Failed to fetch target countdown";
        }
      );
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearTargetError,
  clearTargetSuccess,
  clearTarget,
  resetTargetState,
} = targetSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectTarget = (state) =>
  state.target?.target || null;

export const selectTargetLoading = (state) =>
  state.target?.loading || false;

export const selectTargetError = (state) =>
  state.target?.error || null;

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default targetSlice.reducer;