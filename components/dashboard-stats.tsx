"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, FolderOpen, DollarSign, Users, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface DashboardStats {
  proposals: {
    total: number
    submitted: number
    approved: number
    rejected: number
    underReview: number
  }
  projects: {
    total: number
    active: number
    completed: number
    suspended: number
  }
  financial: {
    totalBudget: number
    utilized: number
    remaining: number
  }
  personal: {
    myProposals: number
    myProjects: number
    pendingTasks: number
  }
  supervision?: {
    supervisedProjects: number
    pendingReviews: number
  }
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError("Failed to load statistics")
      }
    } catch (err) {
      setError("Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error || "Unable to load dashboard statistics"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Proposals Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.proposals.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.proposals.approved} approved, {stats.proposals.underReview} under review
          </p>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.projects.active}</div>
          <p className="text-xs text-muted-foreground">
            {stats.projects.total} total, {stats.projects.completed} completed
          </p>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      {stats.financial.totalBudget > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.financial.utilized / stats.financial.totalBudget) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.financial.utilized)} of {formatCurrency(stats.financial.totalBudget)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Personal Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Research</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.personal.myProposals + stats.personal.myProjects}</div>
          <p className="text-xs text-muted-foreground">
            {stats.personal.myProposals} proposals, {stats.personal.myProjects} projects
          </p>
        </CardContent>
      </Card>

      {/* Supervision Stats (if applicable) */}
      {stats.supervision && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supervised Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.supervision.supervisedProjects}</div>
              <p className="text-xs text-muted-foreground">Projects under supervision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.supervision.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">Proposals awaiting review</p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Pending Tasks */}
      {stats.personal.pendingTasks > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.personal.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks requiring attention</p>
          </CardContent>
        </Card>
      )}

      {/* Success Rate */}
      {stats.proposals.total > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.proposals.approved / stats.proposals.total) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Proposal approval rate</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
