
import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

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

    document.addEventListener("mousedown", handleClickOutside);

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
  const handleLogout = () => {
    setIsProfileOpen(false);

    // Clear authentication data if added later
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">

        {/* ==========================================
            LEFT SECTION
        ========================================== */}
        <div>
          <h2 className="ml-10 text-[18px] font-bold tracking-tight text-slate-900 lg:ml-0">
            Good Morning, Vishal 👋
          </h2>

          <p className="ml-10 mt-0.5 text-[12px] text-slate-400 lg:ml-0">
            Let's make today productive
          </p>
        </div>

        {/* ==========================================
            RIGHT SECTION
        ========================================== */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* ========================================
              SEARCH
          ======================================== */}
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:flex">
            <Search
              size={17}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-[180px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* ========================================
              NOTIFICATION
          ======================================== */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={19} />

            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* ========================================
              PROFILE DROPDOWN WRAPPER
          ======================================== */}
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
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                V
              </div>

              {/* User info */}
              <div className="hidden text-left sm:block">
                <p className="text-[13px] font-semibold text-slate-800">
                  Vishal
                </p>

                <p className="text-[11px] text-slate-400">
                  Student
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-slate-400 transition-transform duration-200 sm:block ${
                  isProfileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ========================================
                DROPDOWN
            ======================================== */}
            {isProfileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

                {/* Dropdown User Header */}
                <div className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                      V
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">
                        Vishal
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
  );
};

export default Topbar;

