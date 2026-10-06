
import React, { useMemo, useState } from "react";
import {
  BookOpen,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { registerUser } from "../redux/slicer/userSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const { registerLoading, error: registerError } = useSelector(
    (state) => state.user,
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  const [isSuccess, setIsSuccess] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =====================================================
  // PASSWORD STRENGTH
  // =====================================================

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        width: "w-0",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak",
        width: "w-1/3",
      };
    }

    if (score <= 3) {
      return {
        label: "Medium",
        width: "w-2/3",
      };
    }

    return {
      label: "Strong",
      width: "w-full",
    };
  }, [formData.password]);

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    // Full name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      )
    ) {
      newErrors.email = "Please enter a valid email.";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    // Terms
    if (!formData.agree) {
      newErrors.agree = "Please accept the terms.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!validateForm()) {
      return;
    }

    // ---------------------------------------------------
    // Backend payload
    // ---------------------------------------------------

    const userData = {
      fullName: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      mobileNumber: formData.phone.trim(),
      password: formData.password,
    };

    try {
      const result = await dispatch(
        registerUser(userData),
      ).unwrap();

      // -------------------------------------------------
      // Registration successful
      // -------------------------------------------------

      if (result?.success) {
        setIsSuccess(true);

        // Redirect to login after short delay
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      // -------------------------------------------------
      // Backend error
      // -------------------------------------------------

      console.error("Registration Error:", error);

      // Handle duplicate email
      if (
        typeof error === "string" &&
        error.toLowerCase().includes("email")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: error,
        }));
      }

      // Handle duplicate mobile
      else if (
        typeof error === "string" &&
        error.toLowerCase().includes("mobile")
      ) {
        setErrors((prev) => ({
          ...prev,
          phone: error,
        }));
      }
    }
  };

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (isSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/60 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={34} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Account Created!
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your StudyFlow account has been created
            successfully. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50">
      <div className="flex h-full w-full items-center justify-center px-3 py-2 sm:px-5 sm:py-3 lg:px-8 lg:py-4">
        <div className="flex h-full max-h-[700px] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:rounded-3xl">

          {/* =================================================
              LEFT BRANDING
              DESKTOP ONLY
          ================================================= */}

          <div className="relative hidden w-[42%] overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">

            {/* Decorative circles */}

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10" />

            {/* Logo */}

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <BookOpen size={23} />
                </div>

                <div>
                  <h1 className="text-lg font-bold">
                    StudyFlow
                  </h1>

                  <p className="text-[11px] text-indigo-100">
                    Study Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}

            <div className="relative z-10 max-w-md">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                <Sparkles size={13} />

                Start your journey
              </div>

              <h2 className="text-3xl font-bold leading-tight xl:text-4xl">
                Build better
                <br />
                study habits.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-indigo-100">
                Track your study time, manage daily targets,
                build good habits and stay consistent with
                StudyFlow.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xl font-bold">12h+</p>

                  <p className="mt-1 text-[11px] text-indigo-100">
                    Daily study goal
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xl font-bold">100%</p>

                  <p className="mt-1 text-[11px] text-indigo-100">
                    Your progress
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom */}

            <div className="relative z-10 text-xs text-indigo-100">
              Your progress. Your journey.
            </div>
          </div>

          {/* =================================================
              RIGHT REGISTER SECTION
          ================================================= */}

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

            {/* Mobile Logo */}

            <div className="flex shrink-0 items-center justify-center pt-3 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <BookOpen size={18} />
                </div>

                <div>
                  <h1 className="text-base font-bold text-slate-900">
                    StudyFlow
                  </h1>

                  <p className="text-[9px] font-medium text-slate-400">
                    Study Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Form Container */}

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-3 sm:px-7 sm:py-4 lg:px-10 xl:px-12">
              <div className="w-full max-w-lg">

                {/* Heading */}

                <div className="mb-3 text-center sm:mb-4 lg:text-left">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 lg:mx-0">
                    <User size={16} />
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Create your account
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
                    Start tracking your study journey today.
                  </p>
                </div>

                {/* =================================================
                    BACKEND ERROR
                ================================================= */}

                {registerError && (
                  <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <p className="text-[10px] leading-4 text-red-600 sm:text-xs">
                      {registerError}
                    </p>
                  </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-2.5 sm:space-y-3"
                >

                  {/* =========================================
                      FULL NAME
                  ========================================= */}

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                      Full Name
                    </label>

                    <div
                      className={`flex h-9 items-center rounded-lg border bg-white px-2.5 transition sm:h-10 ${
                        errors.name
                          ? "border-red-300"
                          : "border-slate-200 focus-within:border-indigo-400"
                      }`}
                    >
                      <User
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="ml-2 min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {errors.name && (
                      <p className="mt-0.5 text-[9px] text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      EMAIL
                  ========================================= */}

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                      Email
                    </label>

                    <div
                      className={`flex h-9 items-center rounded-lg border bg-white px-2.5 transition sm:h-10 ${
                        errors.email
                          ? "border-red-300"
                          : "border-slate-200 focus-within:border-indigo-400"
                      }`}
                    >
                      <Mail
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="ml-2 min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {errors.email && (
                      <p className="mt-0.5 text-[9px] text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      PHONE
                  ========================================= */}

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                      Phone
                    </label>

                    <div
                      className={`flex h-9 items-center rounded-lg border bg-white px-2.5 transition sm:h-10 ${
                        errors.phone
                          ? "border-red-300"
                          : "border-slate-200 focus-within:border-indigo-400"
                      }`}
                    >
                      <Phone
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength={10}
                        className="ml-2 min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {errors.phone && (
                      <p className="mt-0.5 text-[9px] text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      PASSWORD
                  ========================================= */}

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                      Password
                    </label>

                    <div
                      className={`flex h-9 items-center rounded-lg border bg-white px-2.5 transition sm:h-10 ${
                        errors.password
                          ? "border-red-300"
                          : "border-slate-200 focus-within:border-indigo-400"
                      }`}
                    >
                      <Lock
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
                        className="ml-2 min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="ml-1 text-slate-400 hover:text-slate-600"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength */}

                    {formData.password && (
                      <div className="mt-1">
                        <div className="flex h-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`${passwordStrength.width} rounded-full bg-indigo-500 transition-all duration-300`}
                          />
                        </div>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Strength:{" "}
                          <span className="font-semibold text-slate-500">
                            {passwordStrength.label}
                          </span>
                        </p>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-0.5 text-[9px] text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      CONFIRM PASSWORD
                  ========================================= */}

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                      Confirm Password
                    </label>

                    <div
                      className={`flex h-9 items-center rounded-lg border bg-white px-2.5 transition sm:h-10 ${
                        errors.confirmPassword
                          ? "border-red-300"
                          : "border-slate-200 focus-within:border-indigo-400"
                      }`}
                    >
                      <Lock
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className="ml-2 min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev,
                          )
                        }
                        className="ml-1 text-slate-400 hover:text-slate-600"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="mt-0.5 text-[9px] text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      TERMS
                  ========================================= */}

                  <div>
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />

                      <span className="text-[10px] leading-4 text-slate-500 sm:text-[11px]">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Terms
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>

                    {errors.agree && (
                      <p className="mt-0.5 text-[9px] text-red-500">
                        {errors.agree}
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      CREATE ACCOUNT
                  ========================================= */}

                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:text-sm"
                  >
                    {registerLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        <span>
                          Creating account...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>

                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                {/* Login */}

                <p className="mt-3 text-center text-[10px] text-slate-500 sm:mt-4 sm:text-xs">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Desktop Footer */}

            <div className="hidden shrink-0 pb-3 text-center lg:block">
              <p className="text-[10px] text-slate-400">
                © 2026 StudyFlow · Your progress. Your journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

