import React, { useState } from "react";
import {
  LayoutDashboard,
  Timer,
  Target,
  BookOpen,
  Heart,
  Settings,
  ChartNoAxesCombined,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Study Timer",
    path: "/study-timer",
    icon: Timer,
  },
  {
    name: "Daily Target",
    path: "/daily-target",
    icon: Target,
  },
  {
    name: "Subject Tracker",
    path: "/subject-tracker",
    icon: BookOpen,
  },
  {
    name: "Good Habits",
    path: "/good-habits",
    icon: Heart,
  },
  {
    name: "Study Analytics",
    path: "/study-analytics",
    icon: ChartNoAxesCombined,
  },
];

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* =====================================================
          MOBILE HAMBURGER BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[260px]
          flex-col border-r border-slate-200 bg-white
          transition-transform duration-300 ease-in-out

          lg:translate-x-0

          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BookOpen size={21} />
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
                StudyFlow
              </h1>

              <p className="text-[11px] font-medium text-slate-400">
                Study Dashboard
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={
                          isActive ? 2.4 : 2
                        }
                        className={
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }
                      />

                      <span>{item.name}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="shrink-0 border-t border-slate-100 p-4">
          {/* Settings */}

          <NavLink
            to="/settings"
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Settings size={18} />

            <span>Settings</span>
          </NavLink>

          {/* Profile */}

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
              V
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Vishal
              </p>

              <p className="text-[11px] text-slate-400">
                Student
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;