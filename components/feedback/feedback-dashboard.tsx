"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Users, AlertTriangle, Plus, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface FeedbackDashboardProps {
  feedbacks: any[]
  userRole: string
  userId: string
}

export function FeedbackDashboard({ feedbacks, userRole, userId }: FeedbackDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)
  const [taskData, setTaskData] = useState({
    description: "",
    dueDate: "",
  })

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.project.proposal.researchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || feedback.type === typeFilter
    return matchesSearch && matchesType
  })

  // Calculate metrics
  const totalFeedbacks = feedbacks.length
  const researcherFeedbacks = feedbacks.filter((f) => f.type === "RESEARCHER").length
  const supervisorFeedbacks = feedbacks.filter((f) => f.type === "SUPERVISOR").length
  const stakeholderFeedbacks = feedbacks.filter((f) => f.type === "STAKEHOLDER").length
  const pendingTasks = feedbacks.reduce(
    (sum, f) => sum + f.followUpTasks.filter((t: any) => t.status === "PENDING").length,
    0,
  )

  const getTypeColor = (type: string) => {
    const colors = {
      RESEARCHER: "bg-blue-100 text-blue-800",
      SUPERVISOR: "bg-green-100 text-green-800",
      STAKEHOLDER: "bg-purple-100 text-purple-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleAddTask = async () => {
    if (!selectedFeedback || !taskData.description || !taskData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/feedback/${selectedFeedback.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Follow-up task added successfully",
        })
        setIsAddingTask(false)
        setTaskData({ description: "", dueDate: "" })
        setSelectedFeedback(null)
        router.refresh()
      } else {
        throw new Error("Failed to add task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add follow-up task",
        variant: "destructive",
      })
    }
  }

  const handleTaskStatusUpdate = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/feedback/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task status updated successfully",
        })
        router.refresh()
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Feedback</p>
                <p className="text-2xl font-bold">{totalFeedbacks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Researcher</p>
                <p className="text-2xl font-bold text-blue-600">{researcherFeedbacks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Supervisor</p>
                <p className="text-2xl font-bold text-green-600">{supervisorFeedbacks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Stakeholder</p>
                <p className="text-2xl font-bold text-purple-600">{stakeholderFeedbacks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback">All Feedback</TabsTrigger>
          <TabsTrigger value="tasks">Follow-up Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Collection</CardTitle>
              <div className="flex gap-4">
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="RESEARCHER">Researcher</SelectItem>
                    <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                    <SelectItem value="STAKEHOLDER">Stakeholder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(feedback.type)}>{feedback.type}</Badge>
                          <span className="font-medium">{feedback.author.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium mb-1 truncate">{feedback.project.proposal.researchTitle}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Researcher: {feedback.project.proposal.researcher.user.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/projects/${feedback.project.id}`}>View Project</Link>
                        </Button>
                        {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => setSelectedFeedback(feedback)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Task
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Follow-up Task</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Task Description</Label>
                                  <Textarea
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                    placeholder="Describe the follow-up action needed..."
                                    rows={3}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Due Date</Label>
                                  <Input
                                    type="date"
                                    value={taskData.dueDate}
                                    onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleAddTask}>Add Task</Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedFeedback(null)
                                      setTaskData({ description: "", dueDate: "" })
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>

                    <p className="text-sm mb-3">{feedback.content}</p>

                    {feedback.followUpTasks.length > 0 && (
                      <div className="border-t pt-3">
                        <h5 className="text-sm font-medium mb-2">Follow-up Tasks ({feedback.followUpTasks.length})</h5>
                        <div className="space-y-2">
                          {feedback.followUpTasks.map((task: any) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                            >
                              <div className="flex-1">
                                <span className="font-medium">{task.description}</span>
                                <span className="text-muted-foreground ml-2">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={task.status === "COMPLETED" ? "default" : "secondary"}>
                                  {task.status.replace("_", " ")}
                                </Badge>
                                {task.status !== "COMPLETED" && (userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleTaskStatusUpdate(task.id, "COMPLETED")}
                                  >
                                    Mark Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Tasks</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {feedbacks
                    .flatMap((f) => f.followUpTasks.map((task: any) => ({ ...task, feedback: f })))
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((task) => {
                      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED"
                      return (
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
                            <div className={`text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                              {new Date(task.dueDate).toLocaleDateString()}
                              {isOverdue && <div className="text-xs">OVERDUE</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.status === "COMPLETED" ? "default" : isOverdue ? "destructive" : "secondary"
                              }
                            >
                              {task.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/projects/${task.feedback.project.id}`}>View Project</Link>
                              </Button>
                              {task.status !== "COMPLETED" && (userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                                <Button size="sm" onClick={() => handleTaskStatusUpdate(task.id, "COMPLETED")}>
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
