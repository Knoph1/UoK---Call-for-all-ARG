"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, ClipboardCheck, Calendar, BarChart2, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react"

// Mock research projects data
const mockProjects = [
  {
    id: 1,
    title: "Agricultural Innovation Research Project",
    researcher: "Dr. Jane Smith",
    department: "Agricultural Bio-systems, Economics and Horticulture",
    school: "School of Agricultural Sciences and Natural Resources",
    campus: "Main Campus",
    status: "In Progress",
    phase: "Phase 2",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    lastEvaluation: "2024-03-15",
    progress: 65,
    evaluator: "Prof. John Doe",
  },
  {
    id: 2,
    title: "Climate Change Impact on Local Communities",
    researcher: "Prof. Michael Johnson",
    department: "Agro-forestry, Environmental Studies and Integrated Natural Resources Management",
    school: "School of Agricultural Sciences and Natural Resources",
    campus: "Town Campus",
    status: "In Progress",
    phase: "Phase 1",
    startDate: "2024-02-15",
    endDate: "2025-02-14",
    lastEvaluation: "2024-04-10",
    progress: 30,
    evaluator: "Dr. Sarah Williams",
  },
  {
    id: 3,
    title: "Educational Technology Implementation in Rural Schools",
    researcher: "Dr. Robert Brown",
    department: "Curriculum Instruction and Educational Media",
    school: "School of Education, Arts and Social Sciences",
    campus: "Kapkatet Campus",
    status: "Completed",
    phase: "Phase 3",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    lastEvaluation: "2024-05-20",
    progress: 100,
    evaluator: "Prof. Elizabeth Taylor",
  },
]

// Mock evaluation criteria
const evaluationCriteria = [
  { id: 1, name: "Research Progress", weight: 30 },
  { id: 2, name: "Budget Utilization", weight: 20 },
  { id: 3, name: "Timeline Adherence", weight: 15 },
  { id: 4, name: "Documentation Quality", weight: 15 },
  { id: 5, name: "Stakeholder Engagement", weight: 10 },
  { id: 6, name: "Risk Management", weight: 10 },
]

export function MonitoringContent() {
  const [activeTab, setActiveTab] = useState("projects")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCampus, setFilterCampus] = useState("all")
  const [filterSchool, setFilterSchool] = useState("all")

  // Filter projects based on search query and filters
  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.researcher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesCampus = filterCampus === "all" || project.campus === filterCampus
    const matchesSchool = filterSchool === "all" || project.school === filterSchool

    return matchesSearch && matchesStatus && matchesCampus && matchesSchool
  })

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project)
    setActiveTab("evaluation")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Delayed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Research Monitoring & Evaluation</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="evaluation" disabled={!selectedProject}>
            Evaluation
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search projects by title, researcher, or department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{filterStatus === "all" ? "All Statuses" : filterStatus}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filterCampus} onValueChange={setFilterCampus}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{filterCampus === "all" ? "All Campuses" : filterCampus}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campuses</SelectItem>
                      <SelectItem value="Main Campus">Main Campus</SelectItem>
                      <SelectItem value="Town Campus">Town Campus</SelectItem>
                      <SelectItem value="Kapkatet Campus">Kapkatet Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="grid gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card key={project.id} className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="space-y-2 mb-4 md:mb-0">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-sky-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          <Badge variant="outline">{project.phase}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Researcher:</span> {project.researcher}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Department:</span> {project.department}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {project.startDate} to {project.endDate}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <ClipboardCheck className="h-4 w-4 mr-1" />
                            <span>Last evaluated: {project.lastEvaluation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium">{project.progress}%</span>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(project.progress)}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button onClick={() => handleProjectSelect(project)} className="bg-sky-600 hover:bg-sky-700">
                          Evaluate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No projects match your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="space-y-4">
          {selectedProject && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-sky-600" />
                    <span>{selectedProject.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-sm text-gray-500">Researcher</Label>
                      <p className="font-medium">{selectedProject.researcher}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Department</Label>
                      <p className="font-medium">{selectedProject.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Current Phase</Label>
                      <p className="font-medium">{selectedProject.phase}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Start Date</Label>
                      <p className="font-medium">{selectedProject.startDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">End Date</Label>
                      <p className="font-medium">{selectedProject.endDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Last Evaluation</Label>
                      <p className="font-medium">{selectedProject.lastEvaluation}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Evaluation Form</h3>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="evaluationDate">Evaluation Date</Label>
                        <Input id="evaluationDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                      </div>

                      <div>
                        <Label>Evaluation Criteria</Label>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Criteria</TableHead>
                              <TableHead>Weight</TableHead>
                              <TableHead>Score (1-5)</TableHead>
                              <TableHead>Comments</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {evaluationCriteria.map((criteria) => (
                              <TableRow key={criteria.id}>
                                <TableCell>{criteria.name}</TableCell>
                                <TableCell>{criteria.weight}%</TableCell>
                                <TableCell>
                                  <Select>
                                    <SelectTrigger className="w-20">
                                      <SelectValue placeholder="Score" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="2">2</SelectItem>
                                      <SelectItem value="3">3</SelectItem>
                                      <SelectItem value="4">4</SelectItem>
                                      <SelectItem value="5">5</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Input placeholder="Comments" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div>
                        <Label htmlFor="overallProgress">Overall Progress (%)</Label>
                        <Input
                          id="overallProgress"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={selectedProject.progress}
                        />
                      </div>

                      <div>
                        <Label htmlFor="findings">Key Findings</Label>
                        <Textarea
                          id="findings"
                          placeholder="Enter key findings from your evaluation"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="recommendations">Recommendations</Label>
                        <Textarea
                          id="recommendations"
                          placeholder="Enter your recommendations"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="nextEvaluation">Next Evaluation Date</Label>
                        <Input id="nextEvaluation" type="date" />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setActiveTab("projects")}>
                          Cancel
                        </Button>
                        <Button className="bg-sky-600 hover:bg-sky-700">Submit Evaluation</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring & Evaluation Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Badge variant="outline">Monthly</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Progress Summary</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Overall research progress across all active projects
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <Badge variant="outline">Quarterly</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Milestone Report</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Key milestones achieved and upcoming deadlines
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <Badge variant="outline">On Demand</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Identify potential risks and mitigation strategies
                    </p>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Generate Report</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated On</TableHead>
                      <TableHead>Generated By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Q1 2024 Research Progress</TableCell>
                      <TableCell>Quarterly</TableCell>
                      <TableCell>2024-03-31</TableCell>
                      <TableCell>Prof. Elizabeth Taylor</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Agricultural Research Risk Assessment</TableCell>
                      <TableCell>Risk Assessment</TableCell>
                      <TableCell>2024-02-15</TableCell>
                      <TableCell>Dr. Sarah Williams</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Monthly Progress - April 2024</TableCell>
                      <TableCell>Monthly</TableCell>
                      <TableCell>2024-04-30</TableCell>
                      <TableCell>Prof. John Doe</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
