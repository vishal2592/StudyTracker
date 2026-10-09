
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  logoutUser,
  selectUser,
} from "../redux/slicer/userSlice";


const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const profileRef = useRef(null);

  // ==========================================
  // GET LOGGED-IN USER FROM REDUX
  // ==========================================
  const user = useSelector(selectUser);

  const userName =
    user?.fullName ||
    user?.name ||
    "Student";


  // ==========================================
  // GET GREETING BASED ON CURRENT TIME
  // ==========================================
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Good Evening";
    }

    return "Good Night";
  };

  const greeting = getGreeting();


  // ==========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // ==========================================
  // PROFILE
  // ==========================================
  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };


  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = async () => {
    setIsProfileOpen(false);

    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <>
      {/* Fixed Topbar */}
      <header className="fixed left-0 right-0 top-0 z-30 h-[72px] border-b border-slate-200 bg-white lg:left-64">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">

          {/* LEFT SECTION */}
          <div className="min-w-0">
            <h2 className="ml-12 truncate text-[18px] font-bold tracking-tight text-slate-900 lg:ml-0">
              {greeting}, {userName}
            </h2>

            <p className="ml-12 mt-0.5 text-[12px] text-slate-400 lg:ml-0">
              Let's make today productive
            </p>
          </div>


          {/* RIGHT SECTION */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            {/* PROFILE DROPDOWN */}
            <div
              ref={profileRef}
              className="relative"
            >

              {/* Profile Button */}
              <button
                type="button"
                onClick={() =>
                  setIsProfileOpen((prev) => !prev)
                }
                className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition ${
                  isProfileOpen
                    ? "bg-slate-100"
                    : "hover:bg-slate-50"
                }`}
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
              >

                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                  {userName.charAt(0).toUpperCase()}
                </div>

                {/* User Information */}
                <div className="hidden text-left sm:block">
                  <p className="text-[13px] font-semibold text-slate-800">
                    {userName}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Student
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`hidden text-slate-400 transition-transform duration-200 sm:block ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>


              {/* DROPDOWN */}
              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

                  {/* Dropdown User Header */}
                  <div className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                        {userName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {userName}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          Student
                        </p>
                      </div>

                    </div>
                  </div>


                  {/* Dropdown Actions */}
                  <div className="p-2">

                    {/* Profile */}
                    <button
                      type="button"
                      onClick={handleProfile}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-indigo-50"
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                        <User size={17} />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Profile
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          View and edit profile
                        </p>
                      </div>

                    </button>


                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-red-50"
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-red-100 group-hover:text-red-600">
                        <LogOut size={17} />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-red-600">
                          Logout
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Sign out of your account
                        </p>
                      </div>

                    </button>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Topbar;