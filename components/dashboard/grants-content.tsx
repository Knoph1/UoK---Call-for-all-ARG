"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Calendar, DollarSign, Clock, CheckCircle, XCircle, FileText } from "lucide-react"

// Mock data for grants
const mockGrants = [
  {
    id: 1,
    name: "Annual Research Grant 2024",
    year: "2024",
    totalBudget: 5000000,
    allocatedBudget: 3200000,
    remainingBudget: 1800000,
    status: "Open",
    openDate: "2024-01-15",
    closeDate: "2024-06-30",
    applications: 24,
    approved: 15,
    rejected: 5,
    pending: 4,
    description: "Annual research grants for faculty members across all schools and departments.",
  },
  {
    id: 2,
    name: "Agricultural Innovation Grant 2024",
    year: "2024",
    totalBudget: 2000000,
    allocatedBudget: 1500000,
    remainingBudget: 500000,
    status: "Open",
    openDate: "2024-02-01",
    closeDate: "2024-07-31",
    applications: 12,
    approved: 8,
    rejected: 2,
    pending: 2,
    description: "Specialized grants for agricultural innovation research projects.",
  },
  {
    id: 3,
    name: "Health Sciences Research Grant 2024",
    year: "2024",
    totalBudget: 3000000,
    allocatedBudget: 1800000,
    remainingBudget: 1200000,
    status: "Open",
    openDate: "2024-03-01",
    closeDate: "2024-08-31",
    applications: 18,
    approved: 10,
    rejected: 3,
    pending: 5,
    description: "Grants focused on health sciences research and innovation.",
  },
  {
    id: 4,
    name: "Annual Research Grant 2023",
    year: "2023",
    totalBudget: 4500000,
    allocatedBudget: 4500000,
    remainingBudget: 0,
    status: "Closed",
    openDate: "2023-01-15",
    closeDate: "2023-06-30",
    applications: 32,
    approved: 22,
    rejected: 10,
    pending: 0,
    description: "Annual research grants for faculty members across all schools and departments.",
  },
  {
    id: 5,
    name: "Technology Innovation Grant 2023",
    year: "2023",
    totalBudget: 2500000,
    allocatedBudget: 2500000,
    remainingBudget: 0,
    status: "Closed",
    openDate: "2023-02-15",
    closeDate: "2023-07-31",
    applications: 20,
    approved: 15,
    rejected: 5,
    pending: 0,
    description: "Grants for technology innovation and digital transformation research.",
  },
]

// Mock data for fiscal years
const mockFiscalYears = [
  {
    id: 1,
    year: "2024",
    totalBudget: 10000000,
    allocatedBudget: 6500000,
    remainingBudget: 3500000,
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    grants: 3,
  },
  {
    id: 2,
    year: "2023",
    totalBudget: 9000000,
    allocatedBudget: 9000000,
    remainingBudget: 0,
    status: "Closed",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    grants: 2,
  },
  {
    id: 3,
    year: "2022",
    totalBudget: 8500000,
    allocatedBudget: 8500000,
    remainingBudget: 0,
    status: "Closed",
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    grants: 2,
  },
]

export function GrantsContent() {
  const [activeTab, setActiveTab] = useState("grants")
  const [selectedGrant, setSelectedGrant] = useState<any>(null)
  const [selectedYear, setSelectedYear] = useState<any>(null)
  const [isEditingGrant, setIsEditingGrant] = useState(false)
  const [isEditingYear, setIsEditingYear] = useState(false)
  const [isAddingGrant, setIsAddingGrant] = useState(false)
  const [isAddingYear, setIsAddingYear] = useState(false)
  const [filterYear, setFilterYear] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Filter grants based on filters
  const filteredGrants = mockGrants.filter((grant) => {
    const matchesYear = filterYear === "all" || grant.year === filterYear
    const matchesStatus = filterStatus === "all" || grant.status === filterStatus
    return matchesYear && matchesStatus
  })

  const handleGrantSelect = (grant: any) => {
    setSelectedGrant(grant)
    setIsEditingGrant(true)
    setIsAddingGrant(false)
  }

  const handleYearSelect = (year: any) => {
    setSelectedYear(year)
    setIsEditingYear(true)
    setIsAddingYear(false)
  }

  const handleAddGrant = () => {
    setSelectedGrant(null)
    setIsEditingGrant(false)
    setIsAddingGrant(true)
  }

  const handleAddYear = () => {
    setSelectedYear(null)
    setIsEditingYear(false)
    setIsAddingYear(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grants & Fiscal Years</h1>
        <div className="flex space-x-2">
          {activeTab === "grants" ? (
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleAddGrant}>
              <Plus className="mr-2 h-4 w-4" />
              Add Grant
            </Button>
          ) : (
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleAddYear}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fiscal Year
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grants">Research Grants</TabsTrigger>
          <TabsTrigger value="years">Fiscal Years</TabsTrigger>
        </TabsList>

        {/* Grants Tab */}
        <TabsContent value="grants" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <Label htmlFor="yearFilter">Filter by Year</Label>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger id="yearFilter">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="statusFilter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="statusFilter">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grants List */}
          <div className="grid gap-4">
            {filteredGrants.map((grant) => (
              <Card key={grant.id} className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-sky-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{grant.name}</h3>
                        <Badge className={getStatusColor(grant.status)}>{grant.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{grant.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {grant.openDate} to {grant.closeDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>Budget: KShs. {grant.totalBudget.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                          <FileText className="h-3 w-3 mr-1" />
                          {grant.applications} Applications
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {grant.approved} Approved
                        </Badge>
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20">
                          <XCircle className="h-3 w-3 mr-1" />
                          {grant.rejected} Rejected
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">
                          <Clock className="h-3 w-3 mr-1" />
                          {grant.pending} Pending
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleGrantSelect(grant)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Remaining Budget:</span> KShs.{" "}
                          {grant.remainingBudget.toLocaleString()}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-sky-600 h-2.5 rounded-full"
                            style={{ width: `${(grant.allocatedBudget / grant.totalBudget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGrants.length === 0 && (
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No grants match your filter criteria.</p>
              </CardContent>
            </Card>
          )}

          {/* Grant Form (Add/Edit) */}
          {(isEditingGrant || isAddingGrant) && (
            <Card className="mt-6 border-2 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <CardTitle className="text-lg">{isAddingGrant ? "Add New Grant" : "Edit Grant"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="grantName">Grant Name</Label>
                    <Input id="grantName" defaultValue={selectedGrant?.name || ""} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grantYear">Fiscal Year</Label>
                      <Select defaultValue={selectedGrant?.year || "2024"}>
                        <SelectTrigger id="grantYear">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="grantStatus">Status</Label>
                      <Select defaultValue={selectedGrant?.status || "Open"}>
                        <SelectTrigger id="grantStatus">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="grantDescription">Description</Label>
                    <Textarea
                      id="grantDescription"
                      defaultValue={selectedGrant?.description || ""}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="totalBudget">Total Budget (KShs.)</Label>
                      <Input id="totalBudget" type="number" defaultValue={selectedGrant?.totalBudget || ""} />
                    </div>
                    <div>
                      <Label htmlFor="openDate">Open Date</Label>
                      <Input id="openDate" type="date" defaultValue={selectedGrant?.openDate || ""} />
                    </div>
                    <div>
                      <Label htmlFor="closeDate">Close Date</Label>
                      <Input id="closeDate" type="date" defaultValue={selectedGrant?.closeDate || ""} />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingGrant(false)
                        setIsAddingGrant(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-sky-600 hover:bg-sky-700">
                      {isAddingGrant ? "Add Grant" : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Fiscal Years Tab */}
        <TabsContent value="years" className="space-y-4">
          <div className="grid gap-4">
            {mockFiscalYears.map((year) => (
              <Card key={year.id} className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-sky-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fiscal Year {year.year}</h3>
                        <Badge className={getStatusColor(year.status)}>{year.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {year.startDate} to {year.endDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>Total Budget: KShs. {year.totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{year.grants} Grant Programs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleYearSelect(year)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Remaining Budget:</span> KShs.{" "}
                          {year.remainingBudget.toLocaleString()}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-sky-600 h-2.5 rounded-full"
                            style={{ width: `${(year.allocatedBudget / year.totalBudget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Fiscal Year Form (Add/Edit) */}
          {(isEditingYear || isAddingYear) && (
            <Card className="mt-6 border-2 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <CardTitle className="text-lg">{isAddingYear ? "Add New Fiscal Year" : "Edit Fiscal Year"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fiscalYear">Fiscal Year</Label>
                      <Input id="fiscalYear" defaultValue={selectedYear?.year || ""} placeholder="e.g., 2025" />
                    </div>
                    <div>
                      <Label htmlFor="yearStatus">Status</Label>
                      <Select defaultValue={selectedYear?.status || "Active"}>
                        <SelectTrigger id="yearStatus">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="yearTotalBudget">Total Budget (KShs.)</Label>
                      <Input id="yearTotalBudget" type="number" defaultValue={selectedYear?.totalBudget || ""} />
                    </div>
                    <div>
                      <Label htmlFor="yearStartDate">Start Date</Label>
                      <Input id="yearStartDate" type="date" defaultValue={selectedYear?.startDate || ""} />
                    </div>
                    <div>
                      <Label htmlFor="yearEndDate">End Date</Label>
                      <Input id="yearEndDate" type="date" defaultValue={selectedYear?.endDate || ""} />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingYear(false)
                        setIsAddingYear(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-sky-600 hover:bg-sky-700">
                      {isAddingYear ? "Add Fiscal Year" : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
