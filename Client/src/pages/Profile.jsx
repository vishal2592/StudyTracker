
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  GraduationCap,
  Edit3,
  Camera,
  BookOpen,
  Target,
  Clock3,
  Flame,
  ShieldCheck,
  Lock,
  ChevronRight,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../redux/slicer/userSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const {
    user,
    profileLoading,
    error: profileError,
  } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    dob: "",
    education: "",
    goal: "Prepare for competitive exams",
    studyTime: "6 - 8 hours",
  });

  const [formData, setFormData] = useState(profile);

  // =====================================================
  // GET PROFILE FROM BACKEND
  // GET /api/auth/profile
  // =====================================================

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // =====================================================
  // SET BACKEND USER DATA INTO PROFILE STATE
  // =====================================================

  useEffect(() => {
    if (!user) return;

    const profileData = {
      name: user.fullName || "",
      email: user.email || "",
      phone: user.mobileNumber || "",
      location: user.location || "",
      dob: user.dob || "",
      education: user.education || "",
      goal: user.goal || "Prepare for competitive exams",
      studyTime: user.studyTime || "6 - 8 hours",
    };

    setProfile(profileData);
    setFormData(profileData);
  }, [user]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = (e) => {
    e.preventDefault();

    setProfile(formData);
    setIsEditing(false);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (profileLoading && !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">

      {/* =====================================================
          ERROR
      ===================================================== */}

      {profileError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {profileError}
        </div>
      )}

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-purple-600">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information and study preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-purple-200 transition hover:bg-purple-700"
        >
          <Edit3 size={17} />
          Edit Profile
        </button>
      </div>

      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Cover */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 sm:h-40">
          <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-purple-400/10 blur-2xl" />
          <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-white/5" />

          <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:flex">
            <CheckCircle2 size={14} className="text-white" />
            <span className="text-xs font-medium text-white">
              Active Student
            </span>
          </div>
        </div>

        {/* Profile information */}
        <div className="relative px-5 pb-5 sm:px-7 sm:pb-6">

          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

              {/* Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-purple-100 to-indigo-100 text-3xl font-bold text-purple-600 shadow-lg sm:h-28 sm:w-28 sm:text-4xl">
                  {getInitials(profile.name)}
                </div>

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-purple-600 text-white shadow-sm transition hover:bg-purple-700"
                  aria-label="Change profile photo"
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* Name */}
              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {profile.name || "Student"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Mail size={14} />
                    {profile.email || "No email"}
                  </div>

                  <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <GraduationCap size={14} />
                    Student
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 sm:mb-1">
              <Flame size={15} />
              12 Day Study Streak
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =================================================
            LEFT / PERSONAL INFORMATION
        ================================================= */}

        <div className="lg:col-span-2">

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Your basic account information
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <User size={17} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

              <ProfileInfo
                icon={User}
                label="Full Name"
                value={profile.name || "Not added"}
              />

              <ProfileInfo
                icon={Mail}
                label="Email Address"
                value={profile.email || "Not added"}
              />

              <ProfileInfo
                icon={Phone}
                label="Phone Number"
                value={profile.phone || "Not added"}
              />

              <ProfileInfo
                icon={MapPin}
                label="Location"
                value={profile.location || "Not added"}
              />

              <ProfileInfo
                icon={CalendarDays}
                label="Date of Birth"
                value={profile.dob || "Not added"}
              />

              <ProfileInfo
                icon={GraduationCap}
                label="Education"
                value={profile.education || "Not added"}
              />
            </div>
          </div>

          {/* =================================================
              STUDY PREFERENCES
          ================================================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Study Preferences
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Your current study goals and preferences
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <BookOpen size={17} />
              </div>
            </div>

            <div className="divide-y divide-slate-100">

              <PreferenceRow
                icon={Target}
                title="Primary Goal"
                value={profile.goal}
              />

              <PreferenceRow
                icon={Clock3}
                title="Preferred Study Time"
                value={profile.studyTime}
              />

              <PreferenceRow
                icon={BookOpen}
                title="Study Method"
                value="Focused Sessions"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="space-y-6">

          {/* Stats */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5">
              <h3 className="text-base font-bold text-slate-900">
                Study Overview
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                Your overall study progress
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <StatCard
                icon={Clock3}
                value="128h"
                label="Study Time"
                bg="bg-purple-50"
                text="text-purple-600"
              />

              <StatCard
                icon={Target}
                value="84%"
                label="Targets Done"
                bg="bg-indigo-50"
                text="text-indigo-600"
              />

              <StatCard
                icon={Flame}
                value="12"
                label="Day Streak"
                bg="bg-orange-50"
                text="text-orange-500"
              />

              <StatCard
                icon={BookOpen}
                value="6"
                label="Subjects"
                bg="bg-blue-50"
                text="text-blue-600"
              />
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Account Security
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Keep your account secure
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">

              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Lock size={16} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    Change Password
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Update your account password
                  </p>
                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
                />
              </button>

            </div>
          </div>

          {/* Member card */}
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-5">

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                <BookOpen size={19} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Keep learning
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Consistency is more important than perfection.
                  Keep showing up every day.
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
              <span>Weekly progress</span>
              <span>72%</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Profile
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Update your personal information
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSave}
              className="space-y-4 p-5 sm:p-6"
            >

              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
              />

              <InputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                icon={MapPin}
              />

              <InputField
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                icon={CalendarDays}
              />

              <InputField
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                icon={GraduationCap}
              />

              <InputField
                label="Primary Goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                icon={Target}
              />

              <div className="pt-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Preferred Study Time
                </label>

                <select
                  name="studyTime"
                  value={formData.studyTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                >
                  <option>2 - 4 hours</option>
                  <option>4 - 6 hours</option>
                  <option>6 - 8 hours</option>
                  <option>8 - 10 hours</option>
                  <option>10+ hours</option>
                </select>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   GET INITIALS
========================================================= */

const getInitials = (name) => {
  if (!name) return "U";

  const words = name.trim().split(" ");

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
};

/* =========================================================
   PROFILE INFO COMPONENT
========================================================= */

const ProfileInfo = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   PREFERENCE ROW
========================================================= */

const PreferenceRow = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>

      <ChevronRight
        size={16}
        className="shrink-0 text-slate-300"
      />
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  value,
  label,
  bg,
  text,
}) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div
        className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${text}`}
      >
        <Icon size={16} />
      </div>

      <p className="text-lg font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
};

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = "text",
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
        />
      </div>
    </div>
  );
};

export default Profile;

