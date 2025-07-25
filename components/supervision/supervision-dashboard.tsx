"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Clock, AlertTriangle, CheckCircle, TrendingUp, FileText, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SupervisionDashboardProps {
  projects: any[]
  followUpTasks: any[]
  userRole: string
}

export function SupervisionDashboard({ projects, followUpTasks, userRole }: SupervisionDashboardProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.proposal.researchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.proposal.researcher.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate dashboard metrics
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "IN_PROGRESS").length
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length
  const overdueTasks = followUpTasks.filter((task) => new Date(task.dueDate) < new Date()).length
  const avgProgress =
    projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.overallProgress, 0) / projects.length) : 0

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      INITIATED: { variant: "outline" as const, color: "text-blue-600" },
      IN_PROGRESS: { variant: "default" as const, color: "text-yellow-600" },
      COMPLETED: { variant: "default" as const, color: "text-green-600" },
      SUSPENDED: { variant: "destructive" as const, color: "text-red-600" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INITIATED
    return <Badge variant={config.variant}>{status.replace("_", " ")}</Badge>
  }

  const getPriorityColor = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return "text-red-600"
    if (days <= 3) return "text-orange-600"
    if (days <= 7) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
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
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-yellow-600">{activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
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
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Avg Progress</p>
                <p className="text-2xl font-bold text-blue-600">{avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Follow-up Tasks</TabsTrigger>
          <TabsTrigger value="evaluations">Recent Evaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Supervision</CardTitle>
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
                    <SelectItem value="INITIATED">Initiated</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
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
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Evaluation</TableHead>
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
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.overallProgress}%</span>
                          </div>
                          <Progress value={project.overallProgress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        {project.evaluations.length > 0 ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {project.evaluations[0].score || "N/A"}/10
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(project.evaluations[0].date).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No evaluations</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/projects/${project.id}`}>View</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/projects/${project.id}/evaluate`}>Evaluate</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Tasks ({followUpTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {followUpTasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {followUpTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{task.description}</div>
                            <div className="text-sm text-muted-foreground">From: {task.feedback.author.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{task.feedback.project.proposal.researchTitle}</div>
                        </TableCell>
                        <TableCell>
                          <div className={`text-sm ${getPriorityColor(task.dueDate)}`}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={task.status === "PENDING" ? "destructive" : "default"}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/projects/${task.feedback.project.id}`}>View Project</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No pending follow-up tasks</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>Recent Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects
                  .filter((p) => p.evaluations.length > 0)
                  .slice(0, 10)
                  .map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium truncate max-w-md">{project.proposal.researchTitle}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Score: {project.evaluations[0].score || "N/A"}/10</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(project.evaluations[0].date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Researcher: {project.proposal.researcher.user.name}
                      </p>
                      <p className="text-sm line-clamp-2">{project.evaluations[0].comment}</p>
                      <div className="flex gap-2 mt-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/projects/${project.id}`}>View Project</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
