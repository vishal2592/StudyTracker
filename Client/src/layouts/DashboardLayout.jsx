import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 pt-20">
      <Sidebar />

      <div className="ml-0 lg:ml-64">
        <Topbar />

        <main className="p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;