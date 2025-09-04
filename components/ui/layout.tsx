"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, getUser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FolderOpen,
  CheckSquare,
  Calendar,
  FileText,
  Users,
  Camera,
  AlertTriangle,
  DollarSign,
  ClipboardList,
  Settings,
  Search,
  LogOut,
  Menu,
  X,
  Home,
  Briefcase,
  Clock,
  FileImage,
  Shield,
  UserCheck,
  Archive,
  Layers,
  Info,
  Grid3X3,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };

    initializeUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigationItems = [
    {
      name: "Projects",
      href: "/dashboard",
      icon: Building2,
      isActive: pathname === "/dashboard",
    },
    {
      name: "Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
      isActive: pathname.startsWith("/dashboard/tasks"),
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      isActive: pathname.startsWith("/dashboard/calendar"),
    },
    {
      name: "Daily Reports",
      href: "/dashboard/daily-reports",
      icon: FileText,
      isActive: pathname.startsWith("/dashboard/daily-reports"),
    },
    {
      name: "Change Orders",
      href: "/dashboard/change-orders",
      icon: ClipboardList,
      isActive: pathname.startsWith("/dashboard/change-orders"),
    },
    {
      name: "Documents",
      href: "/dashboard/documents",
      icon: FolderOpen,
      isActive: pathname.startsWith("/dashboard/documents"),
    },
    {
      name: "Inspections",
      href: "/dashboard/inspections",
      icon: UserCheck,
      isActive: pathname.startsWith("/dashboard/inspections"),
    },
    {
      name: "Material Usage",
      href: "/dashboard/material-usage",
      icon: Archive,
      isActive: pathname.startsWith("/dashboard/material-usage"),
    },
    {
      name: "Meeting Minutes",
      href: "/dashboard/meeting-minutes",
      icon: Clock,
      isActive: pathname.startsWith("/dashboard/meeting-minutes"),
    },
    {
      name: "Pay Applications",
      href: "/dashboard/pay-applications",
      icon: DollarSign,
      isActive: pathname.startsWith("/dashboard/pay-applications"),
    },
    {
      name: "Photos",
      href: "/dashboard/photos",
      icon: Camera,
      isActive: pathname.startsWith("/dashboard/photos"),
    },
    {
      name: "Safety Incidents",
      href: "/dashboard/safety-incidents",
      icon: AlertTriangle,
      isActive: pathname.startsWith("/dashboard/safety-incidents"),
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      isActive: pathname.startsWith("/dashboard/users"),
    },
    {
      name: "Work Breakdown Structure",
      href: "/dashboard/work-breakdown",
      icon: Layers,
      isActive: pathname.startsWith("/dashboard/work-breakdown"),
    },
    {
      name: "Search",
      href: "/dashboard/search",
      icon: Search,
      isActive: pathname.startsWith("/dashboard/search"),
    },
    {
      name: "About",
      href: "/dashboard/about",
      icon: Info,
      isActive: pathname.startsWith("/dashboard/about"),
    },
    {
      name: "App Gallery",
      href: "/dashboard/app-gallery",
      icon: Grid3X3,
      isActive: pathname.startsWith("/dashboard/app-gallery"),
    },
  ];

  return (
    <div className="min-h-screen railcore-bg">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 railcore-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 railcore-add-btn rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                RailCore CM
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setIsSidebarOpen(false);
                  }}
                  className={`railcore-nav-item w-full text-left ${
                    item.isActive ? "active" : ""
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || "User"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-gray-900">RailCore CM</h1>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-6 xl:p-6 2xl:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
