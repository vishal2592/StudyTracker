
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,

  loading: false,
  loginLoading: false,
  registerLoading: false,
  profileLoading: false,

  error: null,
  successMessage: null,
};

// =====================================================
// REGISTER USER
// POST /api/auth/register
// =====================================================

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// =====================================================
// LOGIN USER
// POST /api/auth/login
// =====================================================

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", loginData);

      const data = response.data;

      // Save JWT token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

// =====================================================
// GET PROFILE
// GET /api/auth/profile
// =====================================================

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/profile");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get profile",
      );
    }
  },
);

// =====================================================
// LOGOUT USER
// =====================================================

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Backend currently does not have a logout API.
      // JWT is stored on frontend, so remove it here.

      localStorage.removeItem("token");

      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  },
);

// =====================================================
// USER SLICE
// =====================================================

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // -------------------------------------------------
    // CLEAR ERROR
    // -------------------------------------------------

    clearUserError: (state) => {
      state.error = null;
    },

    // -------------------------------------------------
    // CLEAR SUCCESS MESSAGE
    // -------------------------------------------------

    clearUserSuccess: (state) => {
      state.successMessage = null;
    },

    // -------------------------------------------------
    // CLEAR USER
    // -------------------------------------------------

    clearUser: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
    },

    // -------------------------------------------------
    // UPDATE USER LOCALLY
    // -------------------------------------------------

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },

  // ===================================================
  // EXTRA REDUCERS
  // ===================================================

  extraReducers: (builder) => {
    builder

      // ===============================================
      // REGISTER USER
      // ===============================================

      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;

        state.successMessage =
          action.payload?.message || "Registration successful";

        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;

        state.error =
          action.payload || "Registration failed";

        state.successMessage = null;
      })

      // ===============================================
      // LOGIN USER
      // ===============================================

      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;

        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;

        state.successMessage =
          action.payload?.message || "Login successful";

        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;

        state.user = null;
        state.token = null;

        state.error =
          action.payload || "Login failed";

        state.successMessage = null;
      })

      // ===============================================
      // GET PROFILE
      // ===============================================

      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;

        state.user = action.payload?.user || null;

        state.error = null;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;

        state.error =
          action.payload || "Failed to get profile";

        // If token is invalid/expired,
        // clear authentication state.
        if (
          action.payload === "Invalid or expired token" ||
          action.payload === "Authorization token is required"
        ) {
          state.user = null;
          state.token = null;

          localStorage.removeItem("token");
        }
      })

      // ===============================================
      // LOGOUT
      // ===============================================

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = null;
        state.token = null;

        state.successMessage =
          action.payload?.message || "Logout successful";

        state.error = null;

        localStorage.removeItem("token");
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Logout failed";
      });
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  clearUserError,
  clearUserSuccess,
  clearUser,
  updateUser,
} = userSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectUser = (state) => state.user.user;

export const selectToken = (state) => state.user.token;

export const selectUserLoading = (state) => state.user.loading;

export const selectLoginLoading = (state) =>
  state.user.loginLoading;

export const selectRegisterLoading = (state) =>
  state.user.registerLoading;

export const selectProfileLoading = (state) =>
  state.user.profileLoading;

export const selectUserError = (state) =>
  state.user.error;

export const selectUserSuccess = (state) =>
  state.user.successMessage;

// =====================================================
// EXPORT REDUCER
// =====================================================

export default userSlice.reducer;

