import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 min-w-0 ml-0 md:ml-64 px-4 md:px-8 py-6 mt-16 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default MainLayout;