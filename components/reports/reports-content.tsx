"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, BarChart3, TrendingUp, DollarSign, Calendar, Filter, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for reports
const reportTemplates = [
  {
    id: "RPT001",
    name: "Applications Summary Report",
    description: "Overview of all research grant applications",
    category: "Applications",
    lastGenerated: "2024-12-05",
    frequency: "Weekly",
    format: "PDF",
  },
  {
    id: "RPT002",
    name: "Financial Disbursement Report",
    description: "Detailed breakdown of fund disbursements",
    category: "Financial",
    lastGenerated: "2024-12-01",
    frequency: "Monthly",
    format: "Excel",
  },
  {
    id: "RPT003",
    name: "Performance Analytics Report",
    description: "Research project performance metrics",
    category: "Performance",
    lastGenerated: "2024-11-30",
    frequency: "Quarterly",
    format: "PDF",
  },
  {
    id: "RPT004",
    name: "School-wise Distribution Report",
    description: "Grant distribution across schools and departments",
    category: "Distribution",
    lastGenerated: "2024-12-03",
    frequency: "Monthly",
    format: "PDF",
  },
]

const analyticsData = {
  totalApplications: 156,
  approvedApplications: 89,
  rejectedApplications: 23,
  pendingApplications: 44,
  totalFunding: 45600000,
  disbursedFunding: 32400000,
  averageGrantSize: 512000,
  successRate: 57,
}

const schoolData = [
  { school: "Agricultural Sciences", applications: 45, approved: 28, funding: 15600000 },
  { school: "Health Sciences", applications: 38, approved: 22, funding: 12800000 },
  { school: "Science & Technology", applications: 32, approved: 18, funding: 9200000 },
  { school: "Business & Economics", applications: 25, approved: 14, funding: 5400000 },
  { school: "Education & Arts", applications: 16, approved: 7, funding: 2600000 },
]

export function ReportsContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedPeriod, setSelectedPeriod] = useState("2024")
  const [selectedSchool, setSelectedSchool] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    toast({
      title: "Report Generated",
      description: "Your report has been generated and is ready for download.",
    })
  }

  const handleExportData = (format: string) => {
    toast({
      title: "Export Started",
      description: `Data export in ${format} format has been initiated.`,
    })
  }

  const handleScheduleReport = (reportId: string) => {
    toast({
      title: "Report Scheduled",
      description: "Report has been scheduled for automatic generation.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate comprehensive reports and view analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportData("CSV")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExportData("Excel")}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700">
            <FileText className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.totalApplications}</p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.successRate}%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">KShs. {(analyticsData.totalFunding / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-gray-600">Total Funding</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">KShs. {(analyticsData.averageGrantSize / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600">Avg. Grant Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approved</span>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={(analyticsData.approvedApplications / analyticsData.totalApplications) * 100}
                        className="w-24"
                      />
                      <span className="text-sm font-medium">{analyticsData.approvedApplications}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending</span>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={(analyticsData.pendingApplications / analyticsData.totalApplications) * 100}
                        className="w-24"
                      />
                      <span className="text-sm font-medium">{analyticsData.pendingApplications}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rejected</span>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={(analyticsData.rejectedApplications / analyticsData.totalApplications) * 100}
                        className="w-24"
                      />
                      <span className="text-sm font-medium">{analyticsData.rejectedApplications}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funding Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Disbursed</span>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={(analyticsData.disbursedFunding / analyticsData.totalFunding) * 100}
                        className="w-24"
                      />
                      <span className="text-sm font-medium">
                        KShs. {(analyticsData.disbursedFunding / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Remaining</span>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={
                          ((analyticsData.totalFunding - analyticsData.disbursedFunding) / analyticsData.totalFunding) *
                          100
                        }
                        className="w-24"
                      />
                      <span className="text-sm font-medium">
                        KShs. {((analyticsData.totalFunding - analyticsData.disbursedFunding) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* School Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by School</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Total Funding</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schoolData.map((school) => (
                      <TableRow key={school.school}>
                        <TableCell className="font-medium">{school.school}</TableCell>
                        <TableCell>{school.applications}</TableCell>
                        <TableCell>{school.approved}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={(school.approved / school.applications) * 100} className="w-16" />
                            <span className="text-sm">
                              {Math.round((school.approved / school.applications) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>KShs. {(school.funding / 1000000).toFixed(1)}M</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Report Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="period">Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="q4-2024">Q4 2024</SelectItem>
                      <SelectItem value="q3-2024">Q3 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="school">School</Label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Schools</SelectItem>
                      <SelectItem value="agricultural">Agricultural Sciences</SelectItem>
                      <SelectItem value="health">Health Sciences</SelectItem>
                      <SelectItem value="science">Science & Technology</SelectItem>
                      <SelectItem value="business">Business & Economics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="applications">Applications</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((report) => (
                  <Card key={report.id} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{report.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                          </div>
                          <Badge variant="outline">{report.category}</Badge>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Last: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                          <span>{report.frequency}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleGenerateReport(report.id)}
                            disabled={isGenerating}
                            className="bg-sky-600 hover:bg-sky-700"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {isGenerating ? "Generating..." : "Generate"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleScheduleReport(report.id)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Application Growth</span>
                      <span className="text-sm text-green-600">+15%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Funding Utilization</span>
                      <span className="text-sm text-blue-600">71%</span>
                    </div>
                    <Progress value={71} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Success Rate Improvement</span>
                      <span className="text-sm text-purple-600">+8%</span>
                    </div>
                    <Progress value={65} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Publications Generated</span>
                    <span className="text-lg font-bold">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patents Filed</span>
                    <span className="text-lg font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Industry Partnerships</span>
                    <span className="text-lg font-bold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Student Researchers</span>
                    <span className="text-lg font-bold">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Weekly Applications Summary</h4>
                    <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Disable
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Monthly Financial Report</h4>
                    <p className="text-sm text-gray-600">First day of each month at 8:00 AM</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Disable
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Quarterly Performance Review</h4>
                    <p className="text-sm text-gray-600">End of each quarter</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Disable
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
