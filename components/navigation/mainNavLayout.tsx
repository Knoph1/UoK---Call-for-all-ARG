"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  FolderOpen,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  Mail,
  Calendar,
  Building,
  Award,
  HelpCircle,
  Settings,
  Building2,
  Layers,
  Shield,
  Target,
  MessageSquare,
  UserCheck,
  BellDotIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { signIn, signOut, useSession } from "next-auth/react";
import type { NextAuthOptions } from "next-auth";

interface MainNavLayoutProps {
  children: React.ReactNode;
}

const getNavigationItems = (session: any) => {
  // Navigation structure matching folder structure
  const navigationItems = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
        },
        {
          title: "Proposals",
          url: "/proposals",
          icon: FileText,
          subItems: [
            { title: "All Proposals", url: "/proposals" },
            { title: "New Proposal", url: "/proposals/new" },
            { title: "Analytics", url: "/proposals/analytics" },
            { title: "Bulk Actions", url: "/proposals/bulk" },
          ],
        },
        {
          title: "Projects",
          url: "/projects",
          icon: FolderOpen,
        },
        {
          title: "Reports",
          url: "/reports",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Monitoring",
      items: [
        {
          title: "Supervision",
          url: "/supervision",
          icon: UserCheck,
        },
        {
          title: "Feedback",
          url: "/feedback",
          icon: MessageSquare,
        },
        {
          title: "Impact",
          url: "/impact",
          icon: Target,
        },
      ],
    },
  ];

  const adminNavigationItems = [
    {
      title: "Administration",
      items: [
        {
          title: "Financial Years",
          url: "/admin/financial-years",
          icon: Calendar,
        },
        {
          title: "Grant Management",
          url: "/admin/grants",
          icon: Award,
        },
        {
          title: "Theme Management",
          url: "/admin/themes",
          icon: Layers,
        },
        {
          title: "Departments",
          url: "/admin/departments",
          icon: Building2,
        },
        {
          title: "User Management",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Audit",
          url: "/admin/audit",
          icon: Shield,
        },
      ],
    },
  ];

  const userNavigationItems = [
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          url: "/account/profile",
          icon: User,
        },
        {
          title: "Notifications",
          url: "/account/notifications",
          icon: BellDotIcon,
        },
        {
          title: "Settings",
          url: "/account/settings",
          icon: Settings,
        },
        {
          title: "Help",
          url: "/help",
          icon: HelpCircle,
        },
      ],
    },
  ];
  const isAdmin = session?.user?.role === "ADMIN";
  const allNavigationItems = [
    ...navigationItems,
    ...(isAdmin ? adminNavigationItems : []),
    ...userNavigationItems,
  ];

  return allNavigationItems;
};

export function MainNavLayout({ children }: MainNavLayoutProps) {
  const { data: session } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const navigationItems = getNavigationItems(session);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AppHeader
          leftContent={
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-sky-500 mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          }
          rightContent={
  session?.user ? (
    <Button
      variant="ghost"
      size="sm"
      className="text-white hover:bg-sky-500"
      onClick={() => signOut()}
    >
      Logout
    </Button>
  ) : (
    <Button
      variant="ghost"
      size="sm"
      className="text-white hover:bg-sky-500"
      onClick={() => signIn()}
    >
      SignIn
    </Button>
  )
}

        />
      </div>

      {/* Main layout container */}

      <div className="flex flex-1 pt-8 pb-8">
        {/* Sidebar */}
        {session?.user && (
          <div
            className={cn(
              "fixed top-20 bottom-16 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:top-0 lg:bottom-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <nav className="px-4 py-6 space-y-2">
                {navigationItems.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {section.title}
                    </h3>
                    {section.items.map((item) => {
                      const isActive = pathname === item.url;
                      return (
                        <Link
                          key={item.title}
                          href={item.url}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1">
          <main className="h-[calc(100vh-4rem)] overflow-y-auto p-5">
            {children}
          </main>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AppFooter />
      </div>
    </div>
  );
}
