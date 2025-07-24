"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Play, Ban, CheckCircle, FileText, Clock, X, Check } from "lucide-react"

// Mock data - in real app, this would come from API
const mockStats = {
  totalFunding: 5555.0,
  activeProjects: 1,
  canceledProjects: 0,
  completedProjects: 0,
  totalProposals: 1,
  pendingProposals: 0,
  rejectedProposals: 0,
  approvedProposals: 1,
}

const mockUser = {
  name: "John Doe",
  role: "admin",
}

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-sky-400 to-sky-600 dark:from-sky-600 dark:to-sky-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {mockUser.name}</h1>
        <p className="text-sky-100 mt-2">
          {mockUser.role === "admin" ? "Administrator Dashboard" : "Research Portal Dashboard"}
        </p>
      </div>

      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Home. My Analysis</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Funding */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Fundings</CardTitle>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalFunding.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</CardTitle>
            <Play className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.activeProjects}</div>
          </CardContent>
        </Card>

        {/* Canceled Projects */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Canceled Projects</CardTitle>
            <Ban className="h-8 w-8 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.canceledProjects}</div>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Projects</CardTitle>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.completedProjects}</div>
          </CardContent>
        </Card>

        {/* Total Proposals */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Proposals</CardTitle>
            <FileText className="h-8 w-8 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalProposals}</div>
          </CardContent>
        </Card>

        {/* Pending Proposals */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Proposals</CardTitle>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.pendingProposals}</div>
          </CardContent>
        </Card>

        {/* Rejected Proposals */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected Proposals</CardTitle>
            <X className="h-8 w-8 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.rejectedProposals}</div>
          </CardContent>
        </Card>

        {/* Approved Proposals */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Proposals</CardTitle>
            <Check className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.approvedProposals}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
