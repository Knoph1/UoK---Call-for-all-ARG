"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  Star,
  MessageSquare,
  Calendar,
  User,
  Building,
  DollarSign,
  Send,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for applications
const mockApplications = [
  {
    id: "APP001",
    title: "Sustainable Agriculture Innovation",
    applicant: "Dr. Jane Smith",
    school: "Agricultural Sciences",
    department: "Agricultural Bio-systems",
    submissionDate: "2024-11-15",
    status: "Under Review",
    priority: "High",
    fundsRequested: 1500000,
    reviewScore: 85,
    reviewers: ["Dr. John Doe", "Prof. Mary Wilson"],
    stage: "Technical Review",
    documents: ["proposal.pdf", "budget.xlsx", "cv.pdf"],
    comments: 3,
  },
  {
    id: "APP002",
    title: "Climate Change Adaptation Strategies",
    applicant: "Prof. Michael Brown",
    school: "Environmental Studies",
    department: "Environmental Management",
    submissionDate: "2024-11-10",
    status: "Approved",
    priority: "Medium",
    fundsRequested: 2000000,
    reviewScore: 92,
    reviewers: ["Dr. Sarah Lee", "Dr. James Wilson"],
    stage: "Completed",
    documents: ["proposal.pdf", "budget.xlsx"],
    comments: 5,
  },
  {
    id: "APP003",
    title: "Digital Health Solutions",
    applicant: "Dr. Emily Davis",
    school: "Health Sciences",
    department: "Public Health",
    submissionDate: "2024-11-20",
    status: "Pending",
    priority: "Low",
    fundsRequested: 800000,
    reviewScore: 0,
    reviewers: [],
    stage: "Initial Review",
    documents: ["proposal.pdf"],
    comments: 0,
  },
]

const reviewStages = ["Initial Review", "Technical Review", "Budget Review", "Final Review", "Completed"]

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "Under Review": "bg-blue-100 text-blue-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  "Revision Required": "bg-orange-100 text-orange-800",
}

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
}

export function ApplicationReviewContent() {
  const [activeTab, setActiveTab] = useState("applications")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [reviewForm, setReviewForm] = useState({
    technicalScore: "",
    budgetScore: "",
    innovationScore: "",
    feasibilityScore: "",
    comments: "",
    recommendation: "",
  })
  const { toast } = useToast()

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesPriority = priorityFilter === "all" || app.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleReviewSubmit = () => {
    toast({
      title: "Review Submitted",
      description: "Your review has been submitted successfully.",
    })
    setSelectedApplication(null)
    setReviewForm({
      technicalScore: "",
      budgetScore: "",
      innovationScore: "",
      feasibilityScore: "",
      comments: "",
      recommendation: "",
    })
  }

  const handleAssignReviewer = (applicationId: string, reviewer: string) => {
    toast({
      title: "Reviewer Assigned",
      description: `${reviewer} has been assigned to review application ${applicationId}.`,
    })
  }

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Application ${applicationId} status changed to ${newStatus}.`,
    })
  }

  const calculateOverallScore = () => {
    const scores = [
      Number(reviewForm.technicalScore),
      Number(reviewForm.budgetScore),
      Number(reviewForm.innovationScore),
      Number(reviewForm.feasibilityScore),
    ].filter((score) => !isNaN(score) && score > 0)

    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Review System</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and manage research grant applications</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reviews
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700">
            <FileText className="mr-2 h-4 w-4" />
            Review Guidelines
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="review">Review Form</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Applications</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by title, applicant, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Revision Required">Revision Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Funds Requested</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={app.title}>
                            {app.title}
                          </div>
                        </TableCell>
                        <TableCell>{app.applicant}</TableCell>
                        <TableCell>{app.school}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[app.status as keyof typeof statusColors]}>{app.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[app.priority as keyof typeof priorityColors]}>
                            {app.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>KShs. {app.fundsRequested.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{app.reviewScore}%</span>
                            {app.reviewScore > 0 && <Progress value={app.reviewScore} className="w-16" />}
                          </div>
                        </TableCell>
                        <TableCell>{app.stage}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedApplication(app)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setActiveTab("review")}>
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Form Tab */}
        <TabsContent value="review" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Review Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Review Form</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="technicalScore">Technical Merit (0-100)</Label>
                    <Input
                      id="technicalScore"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.technicalScore}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, technicalScore: e.target.value }))}
                      placeholder="0-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetScore">Budget Justification (0-100)</Label>
                    <Input
                      id="budgetScore"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.budgetScore}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, budgetScore: e.target.value }))}
                      placeholder="0-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="innovationScore">Innovation (0-100)</Label>
                    <Input
                      id="innovationScore"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.innovationScore}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, innovationScore: e.target.value }))}
                      placeholder="0-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feasibilityScore">Feasibility (0-100)</Label>
                    <Input
                      id="feasibilityScore"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.feasibilityScore}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, feasibilityScore: e.target.value }))}
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div>
                  <Label>Overall Score</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Progress value={calculateOverallScore()} className="flex-1" />
                    <span className="text-lg font-bold">{calculateOverallScore()}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Review Comments</Label>
                  <Textarea
                    id="comments"
                    value={reviewForm.comments}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, comments: e.target.value }))}
                    placeholder="Provide detailed feedback on the application..."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Select
                    value={reviewForm.recommendation}
                    onValueChange={(value) => setReviewForm((prev) => ({ ...prev, recommendation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="approve-with-conditions">Approve with Conditions</SelectItem>
                      <SelectItem value="revision-required">Revision Required</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleReviewSubmit} className="w-full bg-sky-600 hover:bg-sky-700">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Review
                </Button>
              </CardContent>
            </Card>

            {/* Review Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Review Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Merit (25%)</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Scientific rigor and methodology</li>
                    <li>• Research design and approach</li>
                    <li>• Literature review quality</li>
                    <li>• Expected outcomes and impact</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Budget Justification (25%)</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Cost-effectiveness</li>
                    <li>• Budget breakdown clarity</li>
                    <li>• Equipment vs. operational costs (60:40 rule)</li>
                    <li>• Value for money</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Innovation (25%)</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Novelty of approach</li>
                    <li>• Potential for breakthrough</li>
                    <li>• Interdisciplinary collaboration</li>
                    <li>• Technology transfer potential</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Feasibility (25%)</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Timeline realism</li>
                    <li>• Resource availability</li>
                    <li>• Team expertise</li>
                    <li>• Risk assessment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{mockApplications.length}</p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {mockApplications.filter((app) => app.status === "Under Review").length}
                    </p>
                    <p className="text-sm text-gray-600">Under Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {mockApplications.filter((app) => app.status === "Approved").length}
                    </p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      KShs. {(mockApplications.reduce((sum, app) => sum + app.fundsRequested, 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-sm text-gray-600">Total Requested</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Progress by School</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Agricultural Sciences</span>
                      <span className="text-sm">75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Health Sciences</span>
                      <span className="text-sm">60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Environmental Studies</span>
                      <span className="text-sm">90%</span>
                    </div>
                    <Progress value={90} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Science & Technology</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Review Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical Merit</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={82} className="w-24" />
                      <span className="text-sm font-medium">82%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Budget Justification</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-24" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Innovation</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feasibility</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={79} className="w-24" />
                      <span className="text-sm font-medium">79%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedApplication.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">Application ID: {selectedApplication.id}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedApplication(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Applicant</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{selectedApplication.applicant}</span>
                  </div>
                </div>
                <div>
                  <Label>School</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{selectedApplication.school}</span>
                  </div>
                </div>
                <div>
                  <Label>Department</Label>
                  <span className="block mt-1">{selectedApplication.department}</span>
                </div>
                <div>
                  <Label>Submission Date</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(selectedApplication.submissionDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <Label>Funds Requested</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>KShs. {selectedApplication.fundsRequested.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <Label>Current Stage</Label>
                  <span className="block mt-1">{selectedApplication.stage}</span>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <div className="mt-2">
                  <Badge className={statusColors[selectedApplication.status as keyof typeof statusColors]}>
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Documents</Label>
                <div className="mt-2 space-y-2">
                  {selectedApplication.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{doc}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Assigned Reviewers</Label>
                <div className="mt-2">
                  {selectedApplication.reviewers.length > 0 ? (
                    <div className="space-y-1">
                      {selectedApplication.reviewers.map((reviewer: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{reviewer}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviewers assigned</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="bg-sky-600 hover:bg-sky-700">Assign Reviewer</Button>
                <Button variant="outline">Change Status</Button>
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
