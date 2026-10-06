import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================================
  // UI STATE
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }

    setSuccessMessage("");
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      newErrors.fullName = "Please enter your full name.";
    } else if (trimmedName.length < 3) {
      newErrors.fullName =
        "Name must be at least 3 characters.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please create a password.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!agreeTerms) {
      newErrors.terms =
        "Please accept the Terms & Privacy Policy.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);

      /*
        Backend API will be connected here.

        Example:

        const response = await api.post("/auth/register", {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setSuccessMessage(
        "Account created successfully!"
      );

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAgreeTerms(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      setErrors({
        general:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // PASSWORD STRENGTH
  // =====================================================

  const password = formData.password;

  const passwordChecks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
  };

  const passwordStrength =
    Object.values(passwordChecks).filter(Boolean).length;

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const getInputClass = (fieldName) => {
    return `
      box-border w-full rounded-xl border bg-white
      py-3 sm:py-3.5
      pl-11 pr-4
      text-sm text-slate-900
      outline-none transition
      placeholder:text-slate-400
      ${
        errors[fieldName]
          ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      }
    `;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <div className="flex min-h-screen w-full">

        {/* =================================================
            LEFT BRANDING SECTION
            DESKTOP + LARGE TABLET
        ================================================= */}

        <div className="relative hidden w-5/12 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 lg:flex xl:w-1/2">
          {/* Decorative circles */}

          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 xl:h-72 xl:w-72" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/10 xl:h-80 xl:w-80" />

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-8 xl:p-12 2xl:p-16">

            {/* Logo */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-lg xl:h-11 xl:w-11">
                <BookOpen size={21} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-white xl:text-xl">
                  StudyFlow
                </h1>

                <p className="text-[11px] text-indigo-100 xl:text-xs">
                  Study Dashboard
                </p>
              </div>
            </div>

            {/* Main Content */}

            <div className="my-8 max-w-lg">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-indigo-50 backdrop-blur-sm xl:mb-6 xl:px-3.5 xl:py-2 xl:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                Start your study journey
              </div>

              <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl 2xl:text-5xl">
                Study smarter.
                <br />
                Stay consistent.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100 xl:mt-5 xl:text-base xl:leading-7">
                Build better study habits, track your progress,
                manage daily targets and understand how you are
                improving every day.
              </p>

              {/* Features */}

              <div className="mt-6 space-y-3 xl:mt-8 xl:space-y-4">
                <BrandFeature text="Track your study sessions" />

                <BrandFeature text="Manage your daily targets" />

                <BrandFeature text="Build good study habits" />

                <BrandFeature text="Understand your progress" />
              </div>

              {/* Quote */}

              <div className="mt-7 max-w-md rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md xl:mt-10 xl:p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <CheckCircle2
                      size={16}
                      className="text-indigo-100"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium leading-5 text-white">
                      "Small progress every day adds up."
                    </p>

                    <p className="mt-1 text-[11px] text-indigo-200 xl:text-xs">
                      Stay consistent. Keep learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}

            <p className="text-[11px] text-indigo-200 xl:text-xs">
              © {new Date().getFullYear()} StudyFlow. All
              rights reserved.
            </p>
          </div>
        </div>

        {/* =================================================
            RIGHT REGISTER SECTION
        ================================================= */}

        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-10 lg:w-7/12 lg:px-8 xl:w-1/2 xl:px-12 2xl:px-20">
          <div className="w-full max-w-md">

            {/* =================================================
                MOBILE / TABLET LOGO
            ================================================= */}

            <div className="mb-7 flex justify-center lg:hidden sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm sm:h-11 sm:w-11">
                  <BookOpen size={21} />
                </div>

                <div>
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    StudyFlow
                  </h1>

                  <p className="text-[11px] text-slate-400 sm:text-xs">
                    Study Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="mb-6 sm:mb-8">
              <p className="mb-1.5 text-xs font-semibold text-indigo-600 sm:mb-2 sm:text-sm">
                Get started
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                Start building better study habits today.
              </p>
            </div>

            {/* =================================================
                GENERAL ERROR
            ================================================= */}

            {errors.general && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-600 sm:mb-5 sm:px-4 sm:text-sm">
                {errors.general}
              </div>
            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs text-emerald-600 sm:mb-5 sm:px-4 sm:text-sm">
                <CheckCircle2 size={16} />

                <span>{successMessage}</span>
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >
              {/* Full Name */}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={getInputClass("fullName")}
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-1.5 text-[11px] text-rose-500 sm:text-xs">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={getInputClass("email")}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-[11px] text-rose-500 sm:text-xs">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className={`${getInputClass(
                      "password"
                    )} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-[11px] text-rose-500 sm:text-xs">
                    {errors.password}
                  </p>
                )}

                {/* Password Strength */}

                {password.length > 0 && (
                  <div className="mt-2.5 sm:mt-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400 sm:text-[11px]">
                        Password strength
                      </span>

                      <span
                        className={`text-[10px] font-semibold sm:text-[11px] ${
                          passwordStrength === 3
                            ? "text-emerald-500"
                            : passwordStrength === 2
                            ? "text-orange-500"
                            : "text-rose-500"
                        }`}
                      >
                        {passwordStrength === 3
                          ? "Strong"
                          : passwordStrength === 2
                          ? "Medium"
                          : "Weak"}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className={`h-1 flex-1 rounded-full transition ${
                            passwordStrength >= item
                              ? passwordStrength === 3
                                ? "bg-emerald-500"
                                : passwordStrength === 2
                                ? "bg-orange-400"
                                : "bg-rose-400"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-2">
                      <PasswordRequirement
                        checked={passwordChecks.length}
                        text="8+ characters"
                      />

                      <PasswordRequirement
                        checked={passwordChecks.number}
                        text="One number"
                      />

                      <PasswordRequirement
                        checked={passwordChecks.uppercase}
                        text="One uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className={`${getInputClass(
                      "confirmPassword"
                    )} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-[11px] text-rose-500 sm:text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}

              <div>
                <label className="flex cursor-pointer items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setAgreeTerms((prev) => !prev)
                    }
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                      agreeTerms
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : errors.terms
                        ? "border-rose-400 bg-white"
                        : "border-slate-300 bg-white"
                    }`}
                    aria-label="Accept terms"
                  >
                    {agreeTerms && <Check size={12} />}
                  </button>

                  <span className="text-[11px] leading-5 text-slate-500 sm:text-xs">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Terms of Service
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

                {errors.terms && (
                  <p className="mt-1.5 text-[11px] text-rose-500 sm:text-xs">
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Create Account */}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-md sm:py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>

              {/* Security */}

              <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[10px] text-slate-400 sm:gap-2 sm:pt-1 sm:text-xs">
                <ShieldCheck size={14} />

                <span>
                  Your information is kept secure.
                </span>
              </div>
            </form>

            {/* =================================================
                LOGIN
            ================================================= */}

            <div className="mt-6 text-center sm:mt-7">
              <p className="text-xs text-slate-500 sm:text-sm">
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
        </div>
      </div>
    </div>
  );
};

// =====================================================
// BRAND FEATURE
// =====================================================

const BrandFeature = ({ text }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-white xl:h-7 xl:w-7">
        <Check size={14} />
      </div>

      <span className="text-xs text-indigo-50 xl:text-sm">
        {text}
      </span>
    </div>
  );
};

// =====================================================
// PASSWORD REQUIREMENT
// =====================================================

const PasswordRequirement = ({ checked, text }) => {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <div
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
          checked
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {checked && <Check size={9} />}
      </div>

      <span
        className={`truncate text-[10px] ${
          checked
            ? "text-slate-500"
            : "text-slate-400"
        }`}
      >
        {text}
      </span>
    </div>
  );
};

export default Register;