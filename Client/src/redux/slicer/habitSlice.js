import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import api from "../api";


// =====================================================
// GET HABITS
// GET /api/habits?date=YYYY-MM-DD
// =====================================================

export const getHabits = createAsyncThunk(
  "habit/getHabits",

  async (date, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/habits",
        {
          params: {
            date,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get habits",
        }
      );
    }
  }
);


// =====================================================
// CREATE HABIT
// POST /api/habits
// =====================================================

export const createHabit = createAsyncThunk(
  "habit/createHabit",

  async (habitData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/habits",
        habitData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create habit",
        }
      );
    }
  }
);


// =====================================================
// EDIT HABIT
// PATCH /api/habits/:habitId
// =====================================================

export const editHabit = createAsyncThunk(
  "habit/editHabit",

  async (
    { id, habitData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/habits/${id}`,
        habitData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update habit",
        }
      );
    }
  }
);


// =====================================================
// TOGGLE HABIT
// PATCH /api/habits/:habitId/toggle
// =====================================================

export const toggleHabit = createAsyncThunk(
  "habit/toggleHabit",

  async (
    { id, date },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/habits/${id}/toggle`,
        {
          date,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update habit",
        }
      );
    }
  }
);


// =====================================================
// DELETE HABIT
// DELETE /api/habits/:habitId
// =====================================================

export const deleteHabit = createAsyncThunk(
  "habit/deleteHabit",

  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/habits/${id}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete habit",
        }
      );
    }
  }
);


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  habits: [],

  totalHabits: 0,
  completedHabits: 0,
  pendingHabits: 0,

  positiveScore: 0,
  negativeScore: 0,

  loading: false,
  error: null,

  createLoading: false,
  editLoading: false,
  toggleLoading: false,
  deleteLoading: false,

  successMessage: null,

  selectedDate: "",
};


// =====================================================
// HABIT SLICE
// =====================================================

const habitSlice = createSlice({
  name: "habit",

  initialState,

  reducers: {
    clearHabitError: (state) => {
      state.error = null;
    },

    clearHabitSuccess: (state) => {
      state.successMessage = null;
    },

    clearHabits: (state) => {
      state.habits = [];

      state.totalHabits = 0;
      state.completedHabits = 0;
      state.pendingHabits = 0;

      state.positiveScore = 0;
      state.negativeScore = 0;

      state.selectedDate = "";
    },
  },


  // ===================================================
  // EXTRA REDUCERS
  // ===================================================

  extraReducers: (builder) => {
    builder


      // =================================================
      // GET HABITS
      // =================================================

      .addCase(
        getHabits.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getHabits.fulfilled,
        (state, action) => {
          state.loading = false;

          state.error = null;

          state.selectedDate =
            action.payload?.date || "";

          state.totalHabits =
            action.payload?.totalHabits || 0;

          state.completedHabits =
            action.payload?.completedHabits || 0;

          state.pendingHabits =
            action.payload?.pendingHabits || 0;

          state.positiveScore =
            action.payload?.positiveScore || 0;

          state.negativeScore =
            action.payload?.negativeScore || 0;


          // ---------------------------------------------
          // NORMALIZE BACKEND DATA
          // ---------------------------------------------

          state.habits = (
            action.payload?.habits || []
          ).map((habit) => ({
            ...habit,

            // MongoDB ID -> UI ID
            id: habit._id,

            // Backend isCompleted -> UI completed
            completed:
              habit.isCompleted ?? false,

            // Default UI values
            category:
              habit.category ||
              "Productivity",

            description:
              habit.description || "",

            frequency:
              habit.frequency ||
              "Daily",

            reminder:
              habit.reminder ||
              "08:00",

            icon:
              habit.icon ||
              "sparkles",

            color:
              habit.color ||
              "purple",

            // Real streak is not available yet
            streak: 0,
          }));
        }
      )

      .addCase(
        getHabits.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload?.message ||
            "Failed to get habits";
        }
      )


      // =================================================
      // CREATE HABIT
      // =================================================

      .addCase(
        createHabit.pending,
        (state) => {
          state.createLoading = true;

          state.error = null;

          state.successMessage = null;
        }
      )

      .addCase(
        createHabit.fulfilled,
        (state, action) => {
          state.createLoading = false;

          state.error = null;

          state.successMessage =
            action.payload?.message ||
            "Habit created successfully";


          // ---------------------------------------------
          // Add created habit to Redux
          // ---------------------------------------------

          if (action.payload?.habit) {
            const habit =
              action.payload.habit;

            state.habits.unshift({
              ...habit,

              id: habit._id,

              completed:
                habit.isCompleted ??
                false,

              category:
                habit.category ||
                "Productivity",

              description:
                habit.description || "",

              frequency:
                habit.frequency ||
                "Daily",

              reminder:
                habit.reminder ||
                "08:00",

              icon:
                habit.icon ||
                "sparkles",

              color:
                habit.color ||
                "purple",

              streak: 0,
            });
          }
        }
      )

      .addCase(
        createHabit.rejected,
        (state, action) => {
          state.createLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to create habit";
        }
      )


      // =================================================
      // EDIT HABIT
      // =================================================

      .addCase(
        editHabit.pending,
        (state) => {
          state.editLoading = true;

          state.error = null;

          state.successMessage = null;
        }
      )

      .addCase(
        editHabit.fulfilled,
        (state, action) => {
          state.editLoading = false;

          state.error = null;

          state.successMessage =
            action.payload?.message ||
            "Habit updated successfully";


          // ---------------------------------------------
          // Update habit inside Redux
          // ---------------------------------------------

          if (action.payload?.habit) {
            const updatedHabit =
              action.payload.habit;

            const index =
              state.habits.findIndex(
                (habit) =>
                  habit.id ===
                  updatedHabit._id
              );

            if (index !== -1) {
              state.habits[index] = {
                ...state.habits[index],

                ...updatedHabit,

                id: updatedHabit._id,

                completed:
                  updatedHabit.isCompleted ??
                  state.habits[index]
                    .completed ??
                  false,

                category:
                  updatedHabit.category ||
                  "Productivity",

                description:
                  updatedHabit.description ||
                  "",

                frequency:
                  updatedHabit.frequency ||
                  "Daily",

                reminder:
                  updatedHabit.reminder ||
                  "08:00",

                icon:
                  updatedHabit.icon ||
                  "sparkles",

                color:
                  updatedHabit.color ||
                  "purple",

                streak:
                  state.habits[index]
                    .streak || 0,
              };
            }
          }
        }
      )

      .addCase(
        editHabit.rejected,
        (state, action) => {
          state.editLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to update habit";
        }
      )


      // =================================================
      // TOGGLE HABIT
      // =================================================

      .addCase(
        toggleHabit.pending,
        (state) => {
          state.toggleLoading = true;

          state.error = null;

          state.successMessage = null;
        }
      )

      .addCase(
        toggleHabit.fulfilled,
        (state, action) => {
          state.toggleLoading = false;

          state.error = null;

          state.successMessage =
            action.payload?.message ||
            "Habit updated successfully";
        }
      )

      .addCase(
        toggleHabit.rejected,
        (state, action) => {
          state.toggleLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to update habit";
        }
      )


      // =================================================
      // DELETE HABIT
      // =================================================

      .addCase(
        deleteHabit.pending,
        (state) => {
          state.deleteLoading = true;

          state.error = null;

          state.successMessage = null;
        }
      )

      .addCase(
        deleteHabit.fulfilled,
        (state, action) => {
          state.deleteLoading = false;

          state.error = null;

          state.successMessage =
            action.payload?.message ||
            "Habit deleted successfully";


          // ---------------------------------------------
          // Remove habit from Redux
          // ---------------------------------------------

          const deletedId =
            action.meta.arg;

          state.habits =
            state.habits.filter(
              (habit) =>
                habit.id !== deletedId &&
                habit._id !== deletedId
            );


          // ---------------------------------------------
          // Update counts locally
          // ---------------------------------------------

          state.totalHabits =
            state.habits.length;

          state.completedHabits =
            state.habits.filter(
              (habit) =>
                habit.completed ||
                habit.isCompleted
            ).length;

          state.pendingHabits =
            state.totalHabits -
            state.completedHabits;
        }
      )

      .addCase(
        deleteHabit.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.error =
            action.payload?.message ||
            "Failed to delete habit";
        }
      );
  },
});


// =====================================================
// ACTIONS
// =====================================================

export const {
  clearHabitError,
  clearHabitSuccess,
  clearHabits,
} = habitSlice.actions;


// =====================================================
// REDUCER
// =====================================================

export default habitSlice.reducer;