import React from "react";
import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

const Topbar = () => {
  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">

        {/* Left Section */}
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-slate-900 ml-10 lg:ml-0">
            Good Morning, Vishal 👋
          </h2>

          <p className="mt-0.5 text-[12px] text-slate-400 ml-10 lg:ml-0">
            Let's make today productive
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Search */}
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

          {/* Notification */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={19} />

            {/* Notification dot */}
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200" />

          {/* Profile */}
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
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
              className="hidden text-slate-400 sm:block"
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Topbar;