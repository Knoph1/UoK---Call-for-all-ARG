"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign, Target, Clock, CheckCircle, XCircle, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ProjectDetailsProps {
  project: any
  userRole: string
  userId: string
}

export function ProjectDetails({ project, userRole, userId }: ProjectDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAddingFeedback, setIsAddingFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    type: "RESEARCHER",
    content: "",
  })
  const [isAddingMetric, setIsAddingMetric] = useState(false)
  const [metricData, setMetricData] = useState({
    indicator: "",
    baseline: "",
    result: "",
    unit: "",
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      INITIATED: { variant: "outline" as const, icon: Clock, color: "text-blue-600" },
      IN_PROGRESS: { variant: "default" as const, icon: Clock, color: "text-yellow-600" },
      COMPLETED: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      SUSPENDED: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
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

  const budgetUtilization = project.proposal.approvedAmount
    ? (project.budgetUtilized / project.proposal.approvedAmount) * 100
    : 0

  const handleAddFeedback = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback added successfully",
        })
        setIsAddingFeedback(false)
        setFeedbackData({ type: "RESEARCHER", content: "" })
        router.refresh()
      } else {
        throw new Error("Failed to add feedback")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add feedback",
        variant: "destructive",
      })
    }
  }

  const handleAddMetric = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metricData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Impact metric added successfully",
        })
        setIsAddingMetric(false)
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

  const getDaysRemaining = () => {
    if (!project.endDate) return null
    const today = new Date()
    const end = new Date(project.endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()
  const averageScore =
    project.evaluations.length > 0
      ? project.evaluations.reduce((sum: number, evaluation: any) => sum + (evaluation.score || 0), 0) /
        project.evaluations.length
      : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{project.proposal.researchTitle}</h1>
            {getStatusBadge(project.status)}
          </div>
          <p className="text-muted-foreground">
            Principal Investigator: {project.proposal.researcher.user.name} • Supervisor: {project.supervisor.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/proposals/${project.proposal.id}`}>View Proposal</Link>
          </Button>
          {(userRole === "ADMIN" || project.supervisorId === userId) && (
            <Button asChild>
              <Link href={`/projects/${project.id}/evaluate`}>Add Evaluation</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Progress</p>
                <p className="text-2xl font-bold">{project.overallProgress}%</p>
                <Progress value={project.overallProgress} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Budget Used</p>
                <p className="text-2xl font-bold">{budgetUtilization.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">
                  ${project.budgetUtilized.toLocaleString()} / ${project.proposal.approvedAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-lg font-semibold">
                  {daysRemaining !== null && daysRemaining >= 0
                    ? `${daysRemaining} days left`
                    : daysRemaining !== null && daysRemaining < 0
                      ? `${Math.abs(daysRemaining)} days overdue`
                      : "No end date"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Started: {new Date(project.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Avg. Score</p>
                <p className="text-2xl font-bold">{averageScore ? `${averageScore.toFixed(1)}/10` : "N/A"}</p>
                <p className="text-xs text-muted-foreground">
                  {project.evaluations.length} evaluation{project.evaluations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="metrics">Impact Metrics</TabsTrigger>
          <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Research Theme</Label>
                  <p>{project.proposal.theme.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Grant Opening</Label>
                  <p>{project.proposal.grantOpening.name}</p>
                  <p className="text-sm text-muted-foreground">{project.proposal.grantOpening.financialYear.label}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p>{project.proposal.researcher.department.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Project Duration</Label>
                  <p>
                    {new Date(project.startDate).toLocaleDateString()} -
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Plan Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {project.proposal.workplanItems.length > 0 ? (
                  <div className="space-y-3">
                    {project.proposal.workplanItems.map((item: any, index: number) => {
                      const startDate = new Date(item.startDate)
                      const endDate = new Date(item.endDate)
                      const today = new Date()
                      const isCompleted = today > endDate
                      const isInProgress = today >= startDate && today <= endDate

                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isCompleted ? "bg-green-500" : isInProgress ? "bg-yellow-500" : "bg-gray-300"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.activity}</p>
                            <p className="text-sm text-muted-foreground">
                              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No work plan items defined</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Evaluations ({project.evaluations.length})</span>
                {(userRole === "ADMIN" || project.supervisorId === userId) && (
                  <Button asChild size="sm">
                    <Link href={`/projects/${project.id}/evaluate`}>Add Evaluation</Link>
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.evaluations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Evaluator</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.evaluations.map((evaluation: any) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>{new Date(evaluation.date).toLocaleDateString()}</TableCell>
                        <TableCell>{evaluation.evaluator.name}</TableCell>
                        <TableCell>
                          {evaluation.score ? (
                            <Badge
                              variant={
                                evaluation.score >= 7 ? "default" : evaluation.score >= 5 ? "secondary" : "destructive"
                              }
                            >
                              {evaluation.score}/10
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{evaluation.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No evaluations yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Feedback ({project.feedbacks.length})</span>
                <Button onClick={() => setIsAddingFeedback(true)} size="sm">
                  Add Feedback
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAddingFeedback && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Feedback Type</Label>
                    <Select
                      value={feedbackData.type}
                      onValueChange={(value) => setFeedbackData({ ...feedbackData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RESEARCHER">Researcher</SelectItem>
                        <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                        <SelectItem value="STAKEHOLDER">Stakeholder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Feedback Content</Label>
                    <Textarea
                      value={feedbackData.content}
                      onChange={(e) => setFeedbackData({ ...feedbackData, content: e.target.value })}
                      placeholder="Enter your feedback..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddFeedback} size="sm">
                      Submit Feedback
                    </Button>
                    <Button onClick={() => setIsAddingFeedback(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {project.feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {project.feedbacks.map((feedback: any) => (
                    <div key={feedback.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{feedback.type}</Badge>
                          <span className="font-medium">{feedback.author.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{feedback.content}</p>
                      {feedback.followUpTasks.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground">
                            Follow-up tasks: {feedback.followUpTasks.length}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No feedback yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Impact Metrics ({project.impactMetrics.length})</span>
                <Button onClick={() => setIsAddingMetric(true)} size="sm">
                  Add Metric
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAddingMetric && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Baseline</Label>
                      <Input
                        value={metricData.baseline}
                        onChange={(e) => setMetricData({ ...metricData, baseline: e.target.value })}
                        placeholder="Initial value"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Result</Label>
                      <Input
                        value={metricData.result}
                        onChange={(e) => setMetricData({ ...metricData, result: e.target.value })}
                        placeholder="Current/final value"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddMetric} size="sm">
                      Add Metric
                    </Button>
                    <Button onClick={() => setIsAddingMetric(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {project.impactMetrics.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Indicator</TableHead>
                      <TableHead>Baseline</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Recorded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.impactMetrics.map((metric: any) => (
                      <TableRow key={metric.id}>
                        <TableCell className="font-medium">{metric.indicator}</TableCell>
                        <TableCell>{metric.baseline || "-"}</TableCell>
                        <TableCell>{metric.result}</TableCell>
                        <TableCell>{metric.unit || "-"}</TableCell>
                        <TableCell>{new Date(metric.recordedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No impact metrics recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Approved Budget</p>
                    <p className="text-2xl font-bold">${project.proposal.approvedAmount?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Utilized</p>
                    <p className="text-2xl font-bold text-orange-600">${project.budgetUtilized.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${((project.proposal.approvedAmount || 0) - project.budgetUtilized).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Budget Utilization</span>
                    <span className="text-sm text-muted-foreground">{budgetUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={budgetUtilization} className="h-3" />
                </div>

                {project.proposal.budgetItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Original Budget Breakdown</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Planned Cost</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.proposal.budgetItems.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                            <TableCell>${item.cost.toLocaleString()}</TableCell>
                            <TableCell>{item.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
