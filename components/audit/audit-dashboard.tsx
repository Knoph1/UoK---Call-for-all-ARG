"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Activity, Users, Download, Search, CalendarIcon, Eye, AlertTriangle, Database } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AuditLog {
  id: string
  entityName: string
  entityId: string
  userId: string
  action: string
  prevDataJSON: string | null
  newDataJSON: string | null
  timestamp: string
  ip: string | null
  userAgent: string | null
  user: {
    name: string
    email: string
  }
}

interface LoginAudit {
  id: string
  userId: string
  eventType: string
  ip: string | null
  userAgent: string | null
  timestamp: string
  user: {
    name: string
    email: string
  }
}

interface AuditStats {
  totalActivities: number
  todayActivities: number
  uniqueUsers: number
  failedLogins: number
  entityBreakdown: Record<string, number>
  actionBreakdown: Record<string, number>
  hourlyActivity: Array<{ hour: number; count: number }>
}

export function AuditDashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loginAudits, setLoginAudits] = useState<LoginAudit[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntity, setSelectedEntity] = useState<string>("all")
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(50)

  useEffect(() => {
    fetchAuditData()
  }, [searchTerm, selectedEntity, selectedAction, selectedUser, dateFrom, dateTo, currentPage])

  const fetchAuditData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedEntity !== "all" && { entity: selectedEntity }),
        ...(selectedAction !== "all" && { action: selectedAction }),
        ...(selectedUser !== "all" && { userId: selectedUser }),
        ...(dateFrom && { dateFrom: dateFrom.toISOString() }),
        ...(dateTo && { dateTo: dateTo.toISOString() }),
      })

      const [auditResponse, loginResponse, statsResponse] = await Promise.all([
        fetch(`/api/audit/logs?${params}`),
        fetch(`/api/audit/login-logs?${params}`),
        fetch(`/api/audit/stats?${params}`),
      ])

      if (auditResponse.ok) {
        const auditData = await auditResponse.json()
        setAuditLogs(auditData.logs || [])
      }

      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        setLoginAudits(loginData.logs || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching audit data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportAuditReport = async (format: "csv" | "pdf") => {
    try {
      const params = new URLSearchParams({
        format,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedEntity !== "all" && { entity: selectedEntity }),
        ...(selectedAction !== "all" && { action: selectedAction }),
        ...(selectedUser !== "all" && { userId: selectedUser }),
        ...(dateFrom && { dateFrom: dateFrom.toISOString() }),
        ...(dateTo && { dateTo: dateTo.toISOString() }),
      })

      const response = await fetch(`/api/audit/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit-report-${format}-${format === "csv" ? new Date().toISOString().split("T")[0] : Date.now()}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error exporting report:", error)
    }
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      case "LOGIN":
        return "bg-purple-100 text-purple-800"
      case "LOGOUT":
        return "bg-gray-100 text-gray-800"
      case "EXPORT":
        return "bg-orange-100 text-orange-800"
      case "VIEW":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventTypeBadgeColor = (eventType: string) => {
    switch (eventType) {
      case "LOGIN":
        return "bg-green-100 text-green-800"
      case "LOGOUT":
        return "bg-blue-100 text-blue-800"
      case "FAILED_LOGIN":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDataChange = (prevData: string | null, newData: string | null) => {
    if (!prevData && !newData) return null

    try {
      const prev = prevData ? JSON.parse(prevData) : {}
      const current = newData ? JSON.parse(newData) : {}

      const changes: Array<{ field: string; from: any; to: any }> = []

      // Find changed fields
      const allKeys = new Set([...Object.keys(prev), ...Object.keys(current)])

      for (const key of allKeys) {
        if (prev[key] !== current[key]) {
          changes.push({
            field: key,
            from: prev[key],
            to: current[key],
          })
        }
      }

      return changes
    } catch {
      return null
    }
  }

  if (loading && !stats) {
    return <div className="flex items-center justify-center h-64">Loading audit data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.todayActivities} today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">Unique users with activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
              <p className="text-xs text-muted-foreground">Security incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Changes</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.actionBreakdown.CREATE || 0) +
                  (stats.actionBreakdown.UPDATE || 0) +
                  (stats.actionBreakdown.DELETE || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Create, Update, Delete operations</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Filter audit logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {stats &&
                    Object.keys(stats.entityBreakdown).map((entity) => (
                      <SelectItem key={entity} value={entity}>
                        {entity} ({stats.entityBreakdown[entity]})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {stats &&
                    Object.keys(stats.actionBreakdown).map((action) => (
                      <SelectItem key={action} value={action}>
                        {action} ({stats.actionBreakdown[action]})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => exportAuditReport("csv")} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => exportAuditReport("pdf")} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedEntity("all")
                setSelectedAction("all")
                setSelectedUser("all")
                setDateFrom(undefined)
                setDateTo(undefined)
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="security">Security Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
              <CardDescription>
                All system activities including data changes, user actions, and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getActionBadgeColor(log.action)}>{log.action}</Badge>
                          <span className="font-medium">{log.entityName}</span>
                          <span className="text-sm text-muted-foreground">by {log.user.name}</span>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <div>Entity ID: {log.entityId}</div>
                          <div>Time: {format(new Date(log.timestamp), "PPpp")}</div>
                          {log.ip && <div>IP: {log.ip}</div>}
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                            <DialogDescription>Detailed information about this activity</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Action</Label>
                                <div className="mt-1">
                                  <Badge className={getActionBadgeColor(log.action)}>{log.action}</Badge>
                                </div>
                              </div>
                              <div>
                                <Label>Entity</Label>
                                <div className="mt-1 font-medium">{log.entityName}</div>
                              </div>
                              <div>
                                <Label>User</Label>
                                <div className="mt-1">
                                  <div className="font-medium">{log.user.name}</div>
                                  <div className="text-sm text-muted-foreground">{log.user.email}</div>
                                </div>
                              </div>
                              <div>
                                <Label>Timestamp</Label>
                                <div className="mt-1">{format(new Date(log.timestamp), "PPpp")}</div>
                              </div>
                              {log.ip && (
                                <div>
                                  <Label>IP Address</Label>
                                  <div className="mt-1">{log.ip}</div>
                                </div>
                              )}
                              <div>
                                <Label>Entity ID</Label>
                                <div className="mt-1 font-mono text-sm">{log.entityId}</div>
                              </div>
                            </div>

                            {(log.prevDataJSON || log.newDataJSON) && (
                              <div className="space-y-4">
                                <Separator />
                                <div>
                                  <Label>Data Changes</Label>
                                  <div className="mt-2">
                                    {(() => {
                                      const changes = formatDataChange(log.prevDataJSON, log.newDataJSON)
                                      if (!changes || changes.length === 0) {
                                        return (
                                          <div className="text-sm text-muted-foreground">No field changes detected</div>
                                        )
                                      }

                                      return (
                                        <div className="space-y-2">
                                          {changes.map((change, index) => (
                                            <div key={index} className="p-3 bg-muted rounded-lg">
                                              <div className="font-medium text-sm">{change.field}</div>
                                              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                                <div>
                                                  <div className="text-muted-foreground">From:</div>
                                                  <div className="font-mono bg-red-50 p-2 rounded">
                                                    {change.from === null ? "null" : JSON.stringify(change.from)}
                                                  </div>
                                                </div>
                                                <div>
                                                  <div className="text-muted-foreground">To:</div>
                                                  <div className="font-mono bg-green-50 p-2 rounded">
                                                    {change.to === null ? "null" : JSON.stringify(change.to)}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}

                  {auditLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No audit logs found matching your criteria
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Authentication Logs</CardTitle>
              <CardDescription>Login attempts, authentication events, and security-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {loginAudits.map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getEventTypeBadgeColor(log.eventType)}>
                            {log.eventType.replace("_", " ")}
                          </Badge>
                          <span className="font-medium">{log.user.name}</span>
                          <span className="text-sm text-muted-foreground">({log.user.email})</span>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <div>Time: {format(new Date(log.timestamp), "PPpp")}</div>
                          {log.ip && <div>IP: {log.ip}</div>}
                          {log.userAgent && <div className="truncate max-w-md">User Agent: {log.userAgent}</div>}
                        </div>
                      </div>

                      {log.eventType === "FAILED_LOGIN" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    </div>
                  ))}

                  {loginAudits.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No security logs found matching your criteria
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activity by Entity Type</CardTitle>
                  <CardDescription>Distribution of activities across different entity types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.entityBreakdown).map(([entity, count]) => (
                      <div key={entity} className="flex items-center justify-between">
                        <span className="font-medium">{entity}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(count / Math.max(...Object.values(stats.entityBreakdown))) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity by Action Type</CardTitle>
                  <CardDescription>Breakdown of different types of actions performed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.actionBreakdown).map(([action, count]) => (
                      <div key={action} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getActionBadgeColor(action)} variant="outline">
                            {action}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(count / Math.max(...Object.values(stats.actionBreakdown))) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Hourly Activity Distribution</CardTitle>
                  <CardDescription>System activity patterns throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-32 gap-1">
                    {stats.hourlyActivity.map((item) => (
                      <div key={item.hour} className="flex flex-col items-center gap-1">
                        <div
                          className="bg-primary rounded-t w-4 min-h-[4px]"
                          style={{
                            height: `${(item.count / Math.max(...stats.hourlyActivity.map((h) => h.count))) * 100}%`,
                          }}
                        />
                        <span className="text-xs text-muted-foreground">{item.hour.toString().padStart(2, "0")}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
