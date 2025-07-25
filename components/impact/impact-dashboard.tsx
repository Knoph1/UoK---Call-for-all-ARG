"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, Target, Award, BarChart3, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ImpactDashboardProps {
  projects: any[]
  userRole: string
  userId: string
}

export function ImpactDashboard({ projects, userRole, userId }: ImpactDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [metricData, setMetricData] = useState({
    indicator: "",
    baseline: "",
    result: "",
    unit: "",
  })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.proposal.researchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.proposal.researcher.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate impact metrics
  const totalProjects = projects.length
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length
  const totalMetrics = projects.reduce((sum, p) => sum + p.impactMetrics.length, 0)
  const avgScore =
    projects.length > 0
      ? projects
          .filter((p) => p.evaluations.length > 0 && p.evaluations[0].score)
          .reduce((sum, p) => sum + p.evaluations[0].score, 0) /
        projects.filter((p) => p.evaluations.length > 0 && p.evaluations[0].score).length
      : 0

  const handleAddMetric = async () => {
    if (!selectedProject || !metricData.indicator || !metricData.result) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metricData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Impact metric added successfully",
        })
        setSelectedProject(null)
        setMetricData({ indicator: "", baseline: "", result: "", unit: "" })
        router.refresh()
      } else {
        throw new Error("Failed to add metric")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add impact metric",
        variant: "destructive",
      })
    }
  }

  // Group metrics by indicator for analysis
  const metricsByIndicator = projects
    .flatMap((p) => p.impactMetrics)
    .reduce((acc: any, metric: any) => {
      if (!acc[metric.indicator]) {
        acc[metric.indicator] = []
      }
      acc[metric.indicator].push(metric)
      return acc
    }, {})

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Impact Metrics</p>
                <p className="text-2xl font-bold text-blue-600">{totalMetrics}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Avg Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {avgScore > 0 ? `${avgScore.toFixed(1)}/10` : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Project Impact</TabsTrigger>
          <TabsTrigger value="metrics">Metrics Analysis</TabsTrigger>
          <TabsTrigger value="trends">Impact Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Impact Tracking</CardTitle>
              <div className="flex gap-4">
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Researcher</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Metrics</TableHead>
                    <TableHead>Latest Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{project.proposal.researchTitle}</div>
                          <div className="text-sm text-muted-foreground">{project.proposal.theme.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.proposal.researcher.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.proposal.researcher.department.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={project.status === "COMPLETED" ? "default" : "secondary"}>
                          {project.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{project.impactMetrics.length} metrics</div>
                          {project.impactMetrics.length > 0 && (
                            <div className="text-muted-foreground">Latest: {project.impactMetrics[0].indicator}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {project.evaluations.length > 0 && project.evaluations[0].score ? (
                          <Badge variant="outline">{project.evaluations[0].score}/10</Badge>
                        ) : (
                          <span className="text-muted-foreground">No score</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/projects/${project.id}`}>View</Link>
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => setSelectedProject(project)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Metric
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Impact Metric</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Indicator</Label>
                                    <Input
                                      value={metricData.indicator}
                                      onChange={(e) => setMetricData({ ...metricData, indicator: e.target.value })}
                                      placeholder="e.g., Publications, Patents"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Unit</Label>
                                    <Input
                                      value={metricData.unit}
                                      onChange={(e) => setMetricData({ ...metricData, unit: e.target.value })}
                                      placeholder="e.g., count, percentage"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Baseline (Optional)</Label>
                                    <Input
                                      value={metricData.baseline}
                                      onChange={(e) => setMetricData({ ...metricData, baseline: e.target.value })}
                                      placeholder="Initial value"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Result *</Label>
                                    <Input
                                      value={metricData.result}
                                      onChange={(e) => setMetricData({ ...metricData, result: e.target.value })}
                                      placeholder="Current/final value"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleAddMetric}>Add Metric</Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProject(null)
                                      setMetricData({ indicator: "", baseline: "", result: "", unit: "" })
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Metrics Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(metricsByIndicator).map(([indicator, metrics]: [string, any[]]) => (
                  <div key={indicator} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">
                      {indicator} ({metrics.length} records)
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Baseline</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Recorded</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metrics.slice(0, 5).map((metric) => {
                          const project = projects.find((p) => p.id === metric.projectId)
                          return (
                            <TableRow key={metric.id}>
                              <TableCell className="max-w-xs truncate">{project?.proposal.researchTitle}</TableCell>
                              <TableCell>{metric.baseline || "-"}</TableCell>
                              <TableCell className="font-medium">{metric.result}</TableCell>
                              <TableCell>{metric.unit || "-"}</TableCell>
                              <TableCell>{new Date(metric.recordedAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                    {metrics.length > 5 && (
                      <p className="text-sm text-muted-foreground mt-2">And {metrics.length - 5} more records...</p>
                    )}
                  </div>
                ))}
                {Object.keys(metricsByIndicator).length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No impact metrics recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Impact Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Project Completion Rate</h4>
                  <div className="text-3xl font-bold">
                    {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {completedProjects} of {totalProjects} projects completed
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Average Project Score</h4>
                  <div className="text-3xl font-bold">{avgScore > 0 ? `${avgScore.toFixed(1)}/10` : "N/A"}</div>
                  <p className="text-sm text-muted-foreground">Based on latest evaluations</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Total Budget Allocated</h4>
                  <div className="text-3xl font-bold">
                    ${projects.reduce((sum, p) => sum + (p.proposal.approvedAmount || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Across all tracked projects</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Metrics per Project</h4>
                  <div className="text-3xl font-bold">
                    {totalProjects > 0 ? (totalMetrics / totalProjects).toFixed(1) : "0"}
                  </div>
                  <p className="text-sm text-muted-foreground">Average impact metrics recorded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
