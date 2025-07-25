"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Plus, Play, Pause, Trash2, Mail } from "lucide-react"
import { format } from "date-fns"

interface ScheduledReport {
  id: string
  name: string
  description: string
  schedule: string
  frequency: string
  recipients: string[]
  lastRun: Date | null
  nextRun: Date
  status: "active" | "paused" | "error"
  reportType: string
}

export function ScheduledReports() {
  const [reports, setReports] = useState<ScheduledReport[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newReport, setNewReport] = useState({
    name: "",
    description: "",
    reportType: "",
    frequency: "weekly",
    recipients: "",
    schedule: "09:00",
  })

  useEffect(() => {
    fetchScheduledReports()
  }, [])

  const fetchScheduledReports = async () => {
    try {
      const response = await fetch("/api/reports/scheduled")
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("Failed to fetch scheduled reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const createScheduledReport = async () => {
    try {
      const response = await fetch("/api/reports/scheduled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReport,
          recipients: newReport.recipients.split(",").map((email) => email.trim()),
        }),
      })

      if (response.ok) {
        setShowCreateDialog(false)
        setNewReport({
          name: "",
          description: "",
          reportType: "",
          frequency: "weekly",
          recipients: "",
          schedule: "09:00",
        })
        fetchScheduledReports()
      }
    } catch (error) {
      console.error("Failed to create scheduled report:", error)
    }
  }

  const toggleReportStatus = async (id: string, status: "active" | "paused") => {
    try {
      await fetch(`/api/reports/scheduled/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchScheduledReports()
    } catch (error) {
      console.error("Failed to update report status:", error)
    }
  }

  const runReportNow = async (id: string) => {
    try {
      await fetch(`/api/reports/scheduled/${id}/run`, {
        method: "POST",
      })
      alert("Report execution started")
    } catch (error) {
      console.error("Failed to run report:", error)
    }
  }

  const deleteReport = async (id: string) => {
    if (confirm("Are you sure you want to delete this scheduled report?")) {
      try {
        await fetch(`/api/reports/scheduled/${id}`, {
          method: "DELETE",
        })
        fetchScheduledReports()
      } catch (error) {
        console.error("Failed to delete report:", error)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading scheduled reports...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage automated report generation and delivery</CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule New Report</DialogTitle>
                  <DialogDescription>Create a new scheduled report with automatic delivery</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Report Name</Label>
                    <Input
                      id="name"
                      value={newReport.name}
                      onChange={(e) => setNewReport((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter report name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select
                      value={newReport.reportType}
                      onValueChange={(value) => setNewReport((prev) => ({ ...prev, reportType: value }))}
                    >
                      <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={newReport.frequency}
                      onValueChange={(value) => setNewReport((prev) => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule">Time</Label>
                    <Input
                      id="schedule"
                      type="time"
                      value={newReport.schedule}
                      onChange={(e) => setNewReport((prev) => ({ ...prev, schedule: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients (comma-separated emails)</Label>
                    <Input
                      id="recipients"
                      value={newReport.recipients}
                      onChange={(e) => setNewReport((prev) => ({ ...prev, recipients: e.target.value }))}
                      placeholder="email1@example.com, email2@example.com"
                    />
                  </div>

                  <Button onClick={createScheduledReport} className="w-full">
                    Create Scheduled Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Scheduled Reports</h3>
              <p className="text-muted-foreground mb-4">
                Create your first scheduled report to automate report generation and delivery.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.reportType}</Badge>
                    </TableCell>
                    <TableCell>{report.frequency}</TableCell>
                    <TableCell>{report.lastRun ? format(report.lastRun, "MMM dd, yyyy HH:mm") : "Never"}</TableCell>
                    <TableCell>{format(report.nextRun, "MMM dd, yyyy HH:mm")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === "active"
                            ? "default"
                            : report.status === "paused"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{report.recipients.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => runReportNow(report.id)}>
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toggleReportStatus(report.id, report.status === "active" ? "paused" : "active")
                          }
                        >
                          {report.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteReport(report.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
