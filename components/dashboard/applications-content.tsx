"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Plus } from "lucide-react"

// Mock applications data
const mockApplications = [
  {
    id: 1,
    title: "Agricultural Innovation Research",
    applicant: "Dr. Jane Smith",
    department: "Agriculture",
    status: "pending",
    submittedDate: "2024-01-15",
    amount: 50000,
  },
  {
    id: 2,
    title: "Climate Change Impact Study",
    applicant: "Prof. John Doe",
    department: "Environmental Science",
    status: "approved",
    submittedDate: "2024-01-10",
    amount: 75000,
  },
  {
    id: 3,
    title: "Educational Technology Development",
    applicant: "Dr. Mary Johnson",
    department: "Education",
    status: "rejected",
    submittedDate: "2024-01-08",
    amount: 30000,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function ApplicationsContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Research Applications</h1>
        <Button className="bg-sky-600 hover:bg-sky-700">
          <Plus className="mr-2 h-4 w-4" />
          New Application
        </Button>
      </div>

      <div className="grid gap-6">
        {mockApplications.map((application) => (
          <Card key={application.id} className="bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {application.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    by {application.applicant} • {application.department}
                  </p>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Amount:</span> ${application.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Submitted:</span> {application.submittedDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
