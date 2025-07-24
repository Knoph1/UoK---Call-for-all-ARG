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
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign, Calendar, FileText, CheckCircle, AlertTriangle, Plus, Edit, Download, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock funding batches data
const mockBatches = [
  {
    id: 1,
    name: "Q4 2024 Research Grants",
    description: "Quarterly research funding allocation for approved projects",
    totalAmount: 5000000,
    allocatedAmount: 3200000,
    remainingAmount: 1800000,
    status: "Active",
    createdDate: "2024-10-01",
    releaseDate: "2024-12-01",
    applications: 24,
    approvedApplications: 15,
    disbursedApplications: 8,
    pendingApplications: 7,
  },
  {
    id: 2,
    name: "Emergency Research Fund",
    description: "Special funding for urgent research needs",
    totalAmount: 1000000,
    allocatedAmount: 750000,
    remainingAmount: 250000,
    status: "Active",
    createdDate: "2024-11-15",
    releaseDate: "2024-11-20",
    applications: 8,
    approvedApplications: 6,
    disbursedApplications: 4,
    pendingApplications: 2,
  },
  {
    id: 3,
    name: "Q3 2024 Research Grants",
    description: "Previous quarter research funding - completed",
    totalAmount: 4500000,
    allocatedAmount: 4500000,
    remainingAmount: 0,
    status: "Completed",
    createdDate: "2024-07-01",
    releaseDate: "2024-09-01",
    applications: 32,
    approvedApplications: 22,
    disbursedApplications: 22,
    pendingApplications: 0,
  },
]

// Mock applications in batches
const mockBatchApplications = [
  {
    id: 1,
    batchId: 1,
    title: "Agricultural Innovation Research",
    applicant: "Dr. Jane Smith",
    department: "Agricultural Sciences",
    requestedAmount: 750000,
    approvedAmount: 600000,
    disbursedAmount: 300000,
    remainingAmount: 300000,
    status: "Partially Disbursed",
    approvalDate: "2024-11-01",
    lastDisbursement: "2024-11-15",
  },
  {
    id: 2,
    batchId: 1,
    title: "Climate Change Impact Study",
    applicant: "Prof. Michael Johnson",
    department: "Environmental Studies",
    requestedAmount: 500000,
    approvedAmount: 500000,
    disbursedAmount: 500000,
    remainingAmount: 0,
    status: "Fully Disbursed",
    approvalDate: "2024-10-28",
    lastDisbursement: "2024-11-10",
  },
  {
    id: 3,
    batchId: 1,
    title: "Health Sciences Research",
    applicant: "Dr. Sarah Williams",
    department: "Health Sciences",
    requestedAmount: 800000,
    approvedAmount: 700000,
    disbursedAmount: 0,
    remainingAmount: 700000,
    status: "Approved - Pending Disbursement",
    approvalDate: "2024-11-20",
    lastDisbursement: null,
  },
]

export function FundingBatchSystem() {
  const [activeTab, setActiveTab] = useState("batches")
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [selectedApplications, setSelectedApplications] = useState<number[]>([])
  const [disbursementAmount, setDisbursementAmount] = useState("")
  const [disbursementNote, setDisbursementNote] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  const handleBatchSelect = (batch: any) => {
    setSelectedBatch(batch)
    setActiveTab("applications")
  }

  const handleApplicationToggle = (applicationId: number) => {
    setSelectedApplications((prev) =>
      prev.includes(applicationId) ? prev.filter((id) => id !== applicationId) : [...prev, applicationId],
    )
  }

  const handleBulkDisbursement = () => {
    if (selectedApplications.length === 0) {
      toast({
        title: "No Applications Selected",
        description: "Please select at least one application for disbursement.",
        variant: "destructive",
      })
      return
    }

    if (!disbursementAmount) {
      toast({
        title: "Amount Required",
        description: "Please enter the disbursement amount.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Disbursement Initiated",
      description: `Disbursement of KShs. ${Number(disbursementAmount).toLocaleString()} initiated for ${selectedApplications.length} application(s).`,
    })

    // Reset form
    setSelectedApplications([])
    setDisbursementAmount("")
    setDisbursementNote("")
  }

  const handleCreateBatch = () => {
    toast({
      title: "Batch Created",
      description: "New funding batch has been created successfully.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Fully Disbursed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Partially Disbursed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Approved - Pending Disbursement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const filteredApplications = mockBatchApplications.filter((app) => {
    if (!selectedBatch) return false
    if (app.batchId !== selectedBatch.id) return false
    if (filterStatus === "all") return true
    return app.status === filterStatus
  })

  const totalSelectedAmount = selectedApplications.reduce((total, appId) => {
    const app = mockBatchApplications.find((a) => a.id === appId)
    return total + (app?.remainingAmount || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Funding Batch Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button onClick={handleCreateBatch} className="bg-sky-600 hover:bg-sky-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Batch
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="batches">Funding Batches</TabsTrigger>
          <TabsTrigger value="applications" disabled={!selectedBatch}>
            Batch Applications
          </TabsTrigger>
          <TabsTrigger value="disbursement" disabled={!selectedBatch}>
            Disbursement
          </TabsTrigger>
        </TabsList>

        {/* Funding Batches Tab */}
        <TabsContent value="batches" className="space-y-4">
          <div className="grid gap-4">
            {mockBatches.map((batch) => (
              <Card key={batch.id} className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between">
                    <div className="space-y-2 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{batch.name}</h3>
                        <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{batch.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Created: {batch.createdDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Release: {batch.releaseDate}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{batch.applications} Applications</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>{batch.approvedApplications} Approved</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between space-y-2">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Budget</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          KShs. {batch.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Allocated</div>
                        <div className="text-md font-medium text-blue-600">
                          KShs. {batch.allocatedAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Remaining</div>
                        <div className="text-md font-medium text-green-600">
                          KShs. {batch.remainingAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleBatchSelect(batch)}>
                          <FileText className="h-4 w-4 mr-1" />
                          View Applications
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-sky-600 h-2.5 rounded-full"
                          style={{ width: `${(batch.allocatedAmount / batch.totalAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Batch Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          {selectedBatch && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span>{selectedBatch.name} - Applications</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="statusFilter">Filter by Status:</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Fully Disbursed">Fully Disbursed</SelectItem>
                          <SelectItem value="Partially Disbursed">Partially Disbursed</SelectItem>
                          <SelectItem value="Approved - Pending Disbursement">Pending Disbursement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedApplications.length === filteredApplications.length &&
                              filteredApplications.length > 0
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedApplications(filteredApplications.map((app) => app.id))
                              } else {
                                setSelectedApplications([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Project Title</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Approved Amount</TableHead>
                        <TableHead>Disbursed</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Disbursement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedApplications.includes(application.id)}
                              onCheckedChange={() => handleApplicationToggle(application.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{application.title}</TableCell>
                          <TableCell>{application.applicant}</TableCell>
                          <TableCell>{application.department}</TableCell>
                          <TableCell>KShs. {application.approvedAmount.toLocaleString()}</TableCell>
                          <TableCell>KShs. {application.disbursedAmount.toLocaleString()}</TableCell>
                          <TableCell>KShs. {application.remainingAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                          </TableCell>
                          <TableCell>{application.lastDisbursement || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Disbursement Tab */}
        <TabsContent value="disbursement" className="space-y-4">
          {selectedBatch && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    <span>Bulk Disbursement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedApplications.length > 0 ? (
                    <>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-300">
                              {selectedApplications.length} application(s) selected
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              Total remaining amount: KShs. {totalSelectedAmount.toLocaleString()}
                            </p>
                          </div>
                          <Button variant="outline" onClick={() => setSelectedApplications([])}>
                            Clear Selection
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="disbursementAmount">Disbursement Amount (KShs.) *</Label>
                          <Input
                            id="disbursementAmount"
                            type="number"
                            value={disbursementAmount}
                            onChange={(e) => setDisbursementAmount(e.target.value)}
                            placeholder="Enter amount to disburse"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum: KShs. {totalSelectedAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="disbursementDate">Disbursement Date</Label>
                          <Input
                            id="disbursementDate"
                            type="date"
                            defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="disbursementNote">Disbursement Note</Label>
                        <Textarea
                          id="disbursementNote"
                          value={disbursementNote}
                          onChange={(e) => setDisbursementNote(e.target.value)}
                          placeholder="Enter any notes or comments for this disbursement..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setActiveTab("applications")}>
                          Back to Applications
                        </Button>
                        <Button onClick={handleBulkDisbursement} className="bg-green-600 hover:bg-green-700">
                          <Send className="mr-2 h-4 w-4" />
                          Process Disbursement
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Applications Selected
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Please go back to the applications tab and select the applications you want to disburse funds
                        to.
                      </p>
                      <Button onClick={() => setActiveTab("applications")} className="bg-sky-600 hover:bg-sky-700">
                        Select Applications
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
