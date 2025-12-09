"use client";
import { useNavigate } from "react-router-dom";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GraduationCap,
  User,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Star,
  Layers,
  Menu,
  StarHalf,
  CircleStar,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ManagerLayout() {
  function logout() {
    localStorage.removeItem("xy9a7b");
    navigate("/");
  }
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initial check: if large screen (≥ 1024px), open sidebar
    return window.innerWidth >= 1024;
  });
  const [listOpen, setListOpen] = useState(() => {
    return window.innerWidth >= 1024;
  });
  const navigation = [
    {
      name: "Dashboard",
      href: "/general-manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      href: "/general-manager/students",
      icon: Users,
    },
    {
      name: "Teachers",
      href: "/general-manager/teachers",
      icon: Users,
    },
    { name: "Dean", href: "/general-manager/dean", icon: Star },
    { name: "ViceDean", href: "/general-manager/vice-dean", icon: CircleStar },
    {
      name: "Registrar",
      href: "/general-manager/registrar",
      icon: User,
    },
    {
      name: "Department",
      href: "/general-manager/department",
      icon: Layers,
    },

    { name: "Reports", href: "/general-manager/reports", icon: BarChart3 },
  ];

  useEffect(() => {
    // Update when resizing
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-transparent lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed flex flex-col inset-y-0 left-0 z-50 w-64
              bg-white dark:bg-gray-800 shadow-xl
              transform transition-transform duration-300 ease-in-out
              border-r border-gray-200 dark:border-gray-700
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600 shadow-md">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/companylogo.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="text-white">
              <div className="text-sm font-bold">DHFM COLLEGE</div>
              <div className="text-xs opacity-75">Registrar Portal</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-blue-500 transition"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
            >
              <g>
                <path d="M32.6,22.6a1.9,1.9,0,0,0,0,2.8l5.9,6a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3L38.8,26H44a2,2,0,0,0,0-4H38.8l2.6-2.6a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2Z" />
                <path d="M15.4,25.4a1.9,1.9,0,0,0,0-2.8l-5.9-6a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3L9.2,22H4a2,2,0,0,0,0,4H9.2L6.6,28.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2Z" />
                <path d="M26,6V42a2,2,0,0,0,4,0V6a2,2,0,0,0-4,0Z" />
                <path d="M22,42V6a2,2,0,0,0-4,0V42a2,2,0,0,0,4,0Z" />
              </g>
            </svg>
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() =>
                    window.innerWidth <= 1024 && setSidebarOpen(false)
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-gray-600 dark:text-gray-300"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`inset-0 w-full transition-all duration-300 ${
          sidebarOpen && window.innerWidth >= 1024 ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={() => setSidebarOpen(true)}
          >
            {!sidebarOpen && <Menu className="h-6 w-6" />}{" "}
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Genearl Manager Portal
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                {window.innerWidth < 720 && (
                  <div
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    onClick={() => setListOpen((prev) => !prev)}
                  >
                    <span className="text-white text-sm font-medium">DN</span>
                  </div>
                )}
                {window.innerWidth > 720 && (
                  <div className="lg:flex items-center gap-x-4 ml-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      General Manager
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Academic Leadership
                    </div>
                    <Button onClick={logout}>Logout</Button>
                  </div>
                )}
                {listOpen && (
                  <div className="absolute top-12 right-0 lg:hidden w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50">
                    <div className="mb-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Student
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Academic Records
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => console.log("Logout")}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
