"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { FileText, Play, Edit, Trash2, Copy } from "lucide-react"
import { format } from "date-fns"

interface ReportTemplate {
  id: string
  name: string
  description: string
  dataSource: string
  fields: string[]
  filters: any[]
  createdAt: Date
  createdBy: string
  usageCount: number
}

export function ReportTemplates() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/reports/templates")
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const runTemplate = async (template: ReportTemplate) => {
    try {
      const response = await fetch("/api/reports/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          dataSource: template.dataSource,
          fields: template.fields,
          filters: template.filters,
        }),
      })
      const result = await response.json()
      // Handle result - could open in new tab or show in modal
      console.log("Report generated:", result)
    } catch (error) {
      console.error("Failed to run template:", error)
    }
  }

  const duplicateTemplate = async (template: ReportTemplate) => {
    try {
      await fetch("/api/reports/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...template,
          name: `${template.name} (Copy)`,
          id: undefined,
        }),
      })
      fetchTemplates()
    } catch (error) {
      console.error("Failed to duplicate template:", error)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await fetch(`/api/reports/templates/${id}`, {
          method: "DELETE",
        })
        fetchTemplates()
      } catch (error) {
        console.error("Failed to delete template:", error)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading templates...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Saved report configurations for quick reuse</CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Report Templates</h3>
              <p className="text-muted-foreground mb-4">
                Create report templates in the Custom Reports tab to save configurations for reuse.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Data Source</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Filters</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.dataSource}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{template.fields.length} fields</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{template.filters.length} filters</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(template.createdAt, "MMM dd, yyyy")}</div>
                        <div className="text-muted-foreground">by {template.createdBy}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.usageCount} times</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => runTemplate(template)}>
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => duplicateTemplate(template)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedTemplate(template)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Template Details</DialogTitle>
                              <DialogDescription>View template configuration</DialogDescription>
                            </DialogHeader>
                            {selectedTemplate && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold">Name</h4>
                                  <p>{selectedTemplate.name}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Description</h4>
                                  <p>{selectedTemplate.description}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Data Source</h4>
                                  <Badge>{selectedTemplate.dataSource}</Badge>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Fields</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedTemplate.fields.map((field) => (
                                      <Badge key={field} variant="outline">
                                        {field}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Filters</h4>
                                  <div className="space-y-2">
                                    {selectedTemplate.filters.map((filter, index) => (
                                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                        {filter.field} {filter.operator} {filter.value}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" onClick={() => deleteTemplate(template.id)}>
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
