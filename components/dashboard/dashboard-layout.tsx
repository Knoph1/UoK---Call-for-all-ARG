"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/shared/app-header"
import { AppFooter } from "@/components/shared/app-footer"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Mock user data - in real app, this would come from authentication context
const mockUser = {
  name: "John Doe",
  role: "admin", // 'admin', 'applicant', 'committee', 'coordinator'
  email: "john.doe@kabianga.ac.ke",
}

const getNavigationItems = (userRole: string) => {
  const baseItems = [{ name: "Home", href: "/dashboard", icon: Home }]

  if (userRole === "applicant") {
    return [
      ...baseItems,
      { name: "New Proposal", href: "/dashboard/new-proposal", icon: FileText },
      { name: "My Applications", href: "/dashboard/applications", icon: FolderOpen },
      { name: "My Projects", href: "/dashboard/projects", icon: Award },
      { name: "My Account", href: "/dashboard/account", icon: User },
    ]
  }

  if (userRole === "admin") {
    return [
      ...baseItems,
      { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { name: "All Applications", href: "/dashboard/applications", icon: FileText },
      { name: "Research Projects", href: "/dashboard/projects", icon: FolderOpen },
      { name: "M & E Links", href: "/dashboard/monitoring", icon: BarChart3 },
      { name: "Departments", href: "/dashboard/departments", icon: Building },
      { name: "Grants & Years", href: "/dashboard/grants", icon: Calendar },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Mailing", href: "/dashboard/mailing", icon: Mail },
      { name: "My Account", href: "/dashboard/account", icon: User },
    ]
  }

  return baseItems
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const navigationItems = getNavigationItems(mockUser.role)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
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
          <Button variant="ghost" size="sm" className="text-white hover:bg-sky-500" asChild>
            <Link href="/auth/login">
              <LogOut size={16} className="mr-2" />
              Logout
            </Link>
          </Button>
        }
      />

      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <AppFooter />
    </div>
  )
}
