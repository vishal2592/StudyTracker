
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import StudyTimer from "./pages/StudyTimer";
import DailyTarget from "./pages/DailyTarget";
import Tasks from "./pages/Tasks";
import Report from "./pages/Report";
import SubjectTracker from "./pages/SubjectTracker";
import Notes from "./pages/Notes";
import Tests from "./pages/Tests";
import Progress from "./pages/Progress";
import GoodHabits from "./pages/GoodHabits";
import Calendar from "./pages/Calendar";
import StudyAnalytics from "./pages/StudyAnalytics";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* =========================================
          PUBLIC ROUTES
          Login/Register ke liye authentication nahi chahiye
      ========================================== */}

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      {/* =========================================
          PRIVATE ROUTES
          Login required
      ========================================== */}

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/study-timer"
            element={<StudyTimer />}
          />

          <Route
            path="/daily-target"
            element={<DailyTarget />}
          />

          <Route path="/tasks" element={<Tasks />} />

          <Route path="/report" element={<Report />} />

          <Route
            path="/subject-tracker"
            element={<SubjectTracker />}
          />

          <Route path="/notes" element={<Notes />} />

          <Route path="/tests" element={<Tests />} />

          <Route path="/progress" element={<Progress />} />

          <Route
            path="/good-habits"
            element={<GoodHabits />}
          />

          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/study-analytics"
            element={<StudyAnalytics />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Route>

      {/* =========================================
          DEFAULT ROUTE
      ========================================== */}

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* =========================================
          404
      ========================================== */}

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;

