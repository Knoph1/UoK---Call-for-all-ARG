"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, BarChart3, Users, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ReportData {
  proposals: {
    total: number
    approved: number
    pending: number
    rejected: number
    approvalRate: number
  }
  projects: {
    total: number
    active: number
    completed: number
    overdue: number
    completionRate: number
    totalBudget: number
    utilizedBudget: number
  }
  users: {
    total: number
    active: number
    researchers: number
    supervisors: number
    admins: number
  }
  evaluations: {
    total: number
    averageScore: number
    completed: number
    pending: number
  }
  feedback: {
    total: number
    followUpTasks: number
    completedTasks: number
    overdueTasks: number
  }
  audit: {
    totalActivities: number
    failedLogins: number
    dataChanges: number
    activeUsers: number
  }
}

export function ReportsDashboard() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("overview")

  useEffect(() => {
    fetchReportData()
  }, [dateRange, reportType])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/reports/dashboard?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}&type=${reportType}`,
      )
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format: "pdf" | "csv") => {
    try {
      const response = await fetch(
        `/api/reports/export?format=${format}&type=${reportType}&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`,
      )
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${reportType}-${format(new Date(), "yyyy-MM-dd")}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to export report:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading reports...</div>
  }

  if (!data) {
    return <div className="flex items-center justify-center h-64">Failed to load report data</div>
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Configure date range and report type</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => date && setDateRange((prev) => ({ ...prev, from: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => date && setDateRange((prev) => ({ ...prev, to: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview Report</SelectItem>
              <SelectItem value="proposals">Proposals Report</SelectItem>
              <SelectItem value="projects">Projects Report</SelectItem>
              <SelectItem value="financial">Financial Report</SelectItem>
              <SelectItem value="supervision">Supervision Report</SelectItem>
              <SelectItem value="audit">Audit Report</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2 ml-auto">
            <Button onClick={() => exportReport("csv")} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => exportReport("pdf")} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="supervision">Supervision</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.proposals.total}</div>
                <p className="text-xs text-muted-foreground">{data.proposals.approvalRate.toFixed(1)}% approval rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.projects.active}</div>
                <p className="text-xs text-muted-foreground">
                  {data.projects.completionRate.toFixed(1)}% completion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.projects.totalBudget.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ${data.projects.utilizedBudget.toLocaleString()} utilized
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.users.active}</div>
                <p className="text-xs text-muted-foreground">{data.users.total} total users</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Approved</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{data.proposals.approved}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {((data.proposals.approved / data.proposals.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{data.proposals.pending}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {((data.proposals.pending / data.proposals.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rejected</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{data.proposals.rejected}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {((data.proposals.rejected / data.proposals.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposal Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Submissions</span>
                  <span className="font-semibold">{data.proposals.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approval Rate</span>
                  <span className="font-semibold">{data.proposals.approvalRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Review</span>
                  <span className="font-semibold">{data.proposals.pending}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Projects</span>
                  <Badge variant="default">{data.projects.active}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed Projects</span>
                  <Badge variant="secondary">{data.projects.completed}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Overdue Projects</span>
                  <Badge variant="destructive">{data.projects.overdue}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completion Rate</span>
                  <span className="font-semibold">{data.projects.completionRate.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Allocated</span>
                  <span className="font-semibold">${data.projects.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Utilized</span>
                  <span className="font-semibold">${data.projects.utilizedBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilization Rate</span>
                  <span className="font-semibold">
                    {((data.projects.utilizedBudget / data.projects.totalBudget) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Researchers</span>
                  <Badge variant="default">{data.users.researchers}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Supervisors</span>
                  <Badge variant="secondary">{data.users.supervisors}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Administrators</span>
                  <Badge variant="outline">{data.users.admins}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Users</span>
                  <span className="font-semibold">{data.users.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-semibold">{data.users.active}</span>
                </div>
                <div className="flex justify-between">
                  <span>Activity Rate</span>
                  <span className="font-semibold">{((data.users.active / data.users.total) * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supervision" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Evaluations</span>
                  <span className="font-semibold">{data.evaluations.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Score</span>
                  <span className="font-semibold">{data.evaluations.averageScore.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span className="font-semibold">{data.evaluations.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span className="font-semibold">{data.evaluations.pending}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback & Follow-up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Feedback</span>
                  <span className="font-semibold">{data.feedback.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Follow-up Tasks</span>
                  <span className="font-semibold">{data.feedback.followUpTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Tasks</span>
                  <span className="font-semibold">{data.feedback.completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overdue Tasks</span>
                  <Badge variant="destructive">{data.feedback.overdueTasks}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Activities</span>
                  <span className="font-semibold">{data.audit.totalActivities}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Changes</span>
                  <span className="font-semibold">{data.audit.dataChanges}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-semibold">{data.audit.activeUsers}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Failed Logins</span>
                  <Badge variant={data.audit.failedLogins > 10 ? "destructive" : "secondary"}>
                    {data.audit.failedLogins}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Security Status</span>
                  <Badge variant={data.audit.failedLogins > 10 ? "destructive" : "default"}>
                    {data.audit.failedLogins > 10 ? "Alert" : "Normal"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
