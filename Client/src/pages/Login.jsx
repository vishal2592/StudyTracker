
import React, { useState } from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../redux/slicer/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const { loginLoading, error: loginError } = useSelector(
    (state) => state.user,
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!validateForm()) return;

    // Clear previous backend errors
    setErrors({});

    try {
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const result = await dispatch(loginUser(loginData)).unwrap();

      console.log("Login Success:", result);

      // Login successful
      if (result?.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Backend error ko field ke according show karna
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Login failed. Please try again.";

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("email") &&
        !lowerMessage.includes("password")
      ) {
        setErrors({
          email: message,
        });
      } else if (
        lowerMessage.includes("password") ||
        lowerMessage.includes("invalid email or password")
      ) {
        setErrors({
          password: message,
        });
      } else {
        setErrors({
          general: message,
        });
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-3 sm:px-6 sm:py-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-3 flex flex-col items-center sm:mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 sm:h-12 sm:w-12">
            <BookOpen size={23} />
          </div>

          <h1 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            StudyTracker
          </h1>

          <p className="text-[10px] font-medium text-slate-400 sm:text-xs">
            Study Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl shadow-slate-200/60 sm:rounded-3xl sm:px-7 sm:py-5">

          {/* Header */}
          <div className="mb-4 text-center sm:mb-5">
            <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 sm:h-10 sm:w-10">
              <Lock size={18} />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Welcome back
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Sign in to continue your study journey.
            </p>
          </div>

          {/* General Backend Error */}
          {(errors.general || loginError) && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 sm:rounded-xl sm:text-sm">
              {errors.general || loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-sm"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 sm:rounded-xl sm:py-3 sm:text-sm ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-50"
                      : "border-slate-200 focus:border-purple-500 focus:ring-purple-50"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-[10px] font-medium text-red-500 sm:text-xs">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 sm:text-sm"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-[10px] font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-xs"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 sm:rounded-xl sm:py-3 sm:text-sm ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-50"
                      : "border-slate-200 focus:border-purple-500 focus:ring-purple-50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-[10px] font-medium text-red-500 sm:text-xs">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember */}
            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 sm:h-4 sm:w-4"
                />

                <span className="text-xs text-slate-500 sm:text-sm">
                  Remember me
                </span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loginLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-xl sm:py-3 sm:text-sm"
            >
              {loginLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white sm:h-4 sm:w-4" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="my-4 flex items-center gap-2.5 sm:my-5">
            <div className="h-px flex-1 bg-slate-100" />

            <span className="whitespace-nowrap text-[10px] text-slate-400 sm:text-xs">
              New to Study Tracker?
            </span>

            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <Link
            to="/register"
            className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 sm:rounded-xl sm:py-3 sm:text-sm"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

