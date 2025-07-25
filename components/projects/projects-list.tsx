"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Eye, Edit, FileText, CheckCircle, Clock, AlertTriangle, Play } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  status: string
  overallProgress: number
  budgetUtilized: number
  startDate: Date
  endDate: Date | null
  createdAt: Date
  proposal: {
    id: string
    researchTitle: string
    requestedAmount: number
    approvedAmount: number | null
    theme: {
      name: string
    }
    researcher: {
      user: {
        name: string
      }
      department: {
        name: string
      }
    }
    grantOpening: {
      name: string
      financialYear: {
        label: string
      }
    }
  }
  supervisor: {
    name: string
  }
  evaluations: Array<{
    score: number | null
    date: Date
  }>
  _count: {
    evaluations: number
    feedbacks: number
  }
}

interface ProjectsListProps {
  projects: Project[]
  userRole: string
}

export function ProjectsList({ projects, userRole }: ProjectsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.proposal.researchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.proposal.researcher.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      INITIATED: { variant: "outline" as const, icon: Play, color: "text-blue-600" },
      IN_PROGRESS: { variant: "default" as const, icon: Clock, color: "text-yellow-600" },
      COMPLETED: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      SUSPENDED: { variant: "destructive" as const, icon: AlertTriangle, color: "text-red-600" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INITIATED
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project status updated successfully",
        })
        router.refresh()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      })
    }
  }

  const getDaysRemaining = (endDate: Date | null) => {
    if (!endDate) return null
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                {userRole !== "RESEARCHER" && <TableHead>Researcher</TableHead>}
                <TableHead>Supervisor</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => {
                const daysRemaining = getDaysRemaining(project.endDate)
                const budgetUtilization = project.proposal.approvedAmount
                  ? (project.budgetUtilized / project.proposal.approvedAmount) * 100
                  : 0

                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{project.proposal.researchTitle}</div>
                        <div className="text-sm text-muted-foreground">{project.proposal.theme.name}</div>
                      </div>
                    </TableCell>
                    {userRole !== "RESEARCHER" && (
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.proposal.researcher.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.proposal.researcher.department.name}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{project.supervisor.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall</span>
                          <span>{project.overallProgress}%</span>
                        </div>
                        <Progress value={project.overallProgress} className="h-2" />
                        {project.evaluations.length > 0 && project.evaluations[0].score && (
                          <div className="text-xs text-muted-foreground">
                            Latest score: {project.evaluations[0].score}/10
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>${project.budgetUtilized.toLocaleString()} used</div>
                        <div className="text-muted-foreground">
                          {budgetUtilization.toFixed(1)}% of $
                          {project.proposal.approvedAmount?.toLocaleString() || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Started: {new Date(project.startDate).toLocaleDateString()}</div>
                        {project.endDate && (
                          <div
                            className={`${daysRemaining && daysRemaining < 30 ? "text-orange-600" : "text-muted-foreground"}`}
                          >
                            {daysRemaining !== null && daysRemaining >= 0
                              ? `${daysRemaining} days left`
                              : daysRemaining !== null && daysRemaining < 0
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : "No end date"}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/proposals/${project.proposal.id}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Proposal
                            </Link>
                          </DropdownMenuItem>
                          {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}/evaluate`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Add Evaluation
                                </Link>
                              </DropdownMenuItem>
                              {project.status === "INITIATED" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(project.id, "IN_PROGRESS")}>
                                  Start Project
                                </DropdownMenuItem>
                              )}
                              {project.status === "IN_PROGRESS" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(project.id, "COMPLETED")}>
                                    Mark Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(project.id, "SUSPENDED")}>
                                    Suspend Project
                                  </DropdownMenuItem>
                                </>
                              )}
                              {project.status === "SUSPENDED" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(project.id, "IN_PROGRESS")}>
                                  Resume Project
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
