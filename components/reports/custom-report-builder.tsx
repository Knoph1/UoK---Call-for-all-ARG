"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, Play, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ReportField {
  id: string
  name: string
  type: string
  table: string
}

interface ReportFilter {
  field: string
  operator: string
  value: string
}

interface CustomReport {
  name: string
  description: string
  dataSource: string
  fields: string[]
  filters: ReportFilter[]
  groupBy: string[]
  orderBy: string
  dateRange: { from: Date | null; to: Date | null }
}

const availableFields: Record<string, ReportField[]> = {
  proposals: [
    { id: "title", name: "Title", type: "text", table: "proposals" },
    { id: "status", name: "Status", type: "select", table: "proposals" },
    { id: "submittedAt", name: "Submitted Date", type: "date", table: "proposals" },
    { id: "budget", name: "Budget", type: "number", table: "proposals" },
    { id: "researcher.name", name: "Researcher Name", type: "text", table: "users" },
    { id: "theme.name", name: "Theme", type: "text", table: "themes" },
  ],
  projects: [
    { id: "title", name: "Title", type: "text", table: "projects" },
    { id: "status", name: "Status", type: "select", table: "projects" },
    { id: "startDate", name: "Start Date", type: "date", table: "projects" },
    { id: "endDate", name: "End Date", type: "date", table: "projects" },
    { id: "budget", name: "Budget", type: "number", table: "projects" },
    { id: "progress", name: "Progress", type: "number", table: "projects" },
  ],
  users: [
    { id: "name", name: "Name", type: "text", table: "users" },
    { id: "email", name: "Email", type: "text", table: "users" },
    { id: "role", name: "Role", type: "select", table: "users" },
    { id: "department.name", name: "Department", type: "text", table: "departments" },
    { id: "createdAt", name: "Created Date", type: "date", table: "users" },
  ],
  evaluations: [
    { id: "score", name: "Score", type: "number", table: "evaluations" },
    { id: "feedback", name: "Feedback", type: "text", table: "evaluations" },
    { id: "createdAt", name: "Evaluation Date", type: "date", table: "evaluations" },
    { id: "project.title", name: "Project Title", type: "text", table: "projects" },
  ],
}

const operators = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "between", label: "Between" },
]

export function CustomReportBuilder() {
  const [report, setReport] = useState<CustomReport>({
    name: "",
    description: "",
    dataSource: "",
    fields: [],
    filters: [],
    groupBy: [],
    orderBy: "",
    dateRange: { from: null, to: null },
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportResult, setReportResult] = useState<any>(null)

  const addFilter = () => {
    setReport((prev) => ({
      ...prev,
      filters: [...prev.filters, { field: "", operator: "equals", value: "" }],
    }))
  }

  const removeFilter = (index: number) => {
    setReport((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }))
  }

  const updateFilter = (index: number, key: keyof ReportFilter, value: string) => {
    setReport((prev) => ({
      ...prev,
      filters: prev.filters.map((filter, i) => (i === index ? { ...filter, [key]: value } : filter)),
    }))
  }

  const toggleField = (fieldId: string) => {
    setReport((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldId) ? prev.fields.filter((f) => f !== fieldId) : [...prev.fields, fieldId],
    }))
  }

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/reports/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      })
      const result = await response.json()
      setReportResult(result)
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveReport = async () => {
    try {
      await fetch("/api/reports/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      })
      alert("Report template saved successfully!")
    } catch (error) {
      console.error("Failed to save report:", error)
    }
  }

  const currentFields = report.dataSource ? availableFields[report.dataSource] || [] : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Create custom reports with advanced filtering and grouping</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={report.name}
                onChange={(e) => setReport((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter report name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataSource">Data Source</Label>
              <Select
                value={report.dataSource}
                onValueChange={(value) =>
                  setReport((prev) => ({ ...prev, dataSource: value, fields: [], filters: [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proposals">Proposals</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="evaluations">Evaluations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={report.description}
              onChange={(e) => setReport((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this report shows"
            />
          </div>

          {/* Field Selection */}
          {report.dataSource && (
            <div className="space-y-4">
              <Label>Select Fields to Include</Label>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {currentFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={report.fields.includes(field.id)}
                      onCheckedChange={() => toggleField(field.id)}
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {field.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Filters</Label>
              <Button onClick={addFilter} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </div>
            {report.filters.map((filter, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Select value={filter.field} onValueChange={(value) => updateFilter(index, "field", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={filter.operator} onValueChange={(value) => updateFilter(index, "operator", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(index, "value", e.target.value)}
                    placeholder="Value"
                  />
                </div>
                <Button onClick={() => removeFilter(index)} size="sm" variant="outline">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <Label>Date Range (Optional)</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !report.dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {report.dateRange.from ? format(report.dateRange.from, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={report.dateRange.from || undefined}
                    onSelect={(date) =>
                      setReport((prev) => ({ ...prev, dateRange: { ...prev.dateRange, from: date || null } }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !report.dateRange.to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {report.dateRange.to ? format(report.dateRange.to, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={report.dateRange.to || undefined}
                    onSelect={(date) =>
                      setReport((prev) => ({ ...prev, dateRange: { ...prev.dateRange, to: date || null } }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={generateReport}
              disabled={!report.dataSource || report.fields.length === 0 || isGenerating}
            >
              <Play className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
            <Button onClick={saveReport} variant="outline" disabled={!report.name || !report.dataSource}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportResult && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
            <CardDescription>Generated report data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Records: {reportResult.data?.length || 0}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Export CSV
                  </Button>
                  <Button size="sm" variant="outline">
                    Export PDF
                  </Button>
                </div>
              </div>

              {reportResult.data && reportResult.data.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(reportResult.data[0]).map((key) => (
                          <th key={key} className="border border-gray-300 px-4 py-2 text-left">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportResult.data.slice(0, 10).map((row: any, index: number) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reportResult.data.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing first 10 of {reportResult.data.length} records
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
