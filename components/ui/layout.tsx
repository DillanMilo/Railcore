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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                RailCore CM
              </span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Projects"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {user?.email || "User"}
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 top-16 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.isActive
                        ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:pl-0">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
