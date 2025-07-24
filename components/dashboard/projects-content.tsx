"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

// Mock project data
const mockProject = {
  id: 15,
  title: "Agricultural Innovation Research Project",
  researcher: "Dr. Jane Smith",
  department: "Agriculture",
  status: "active",
  totalBudget: 75000,
  totalReleased: 29,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
}

// Mock funding data
const mockFundings = [
  {
    id: 2,
    user: "lilian kirwa",
    amount: 7,
    date: "Tue Sep 03 2024",
  },
  {
    id: 3,
    user: "lilian kirwa",
    amount: 22,
    date: "Tue Sep 03 2024",
  },
]

export function ProjectsContent() {
  const [activeTab, setActiveTab] = useState("info")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Research Project Details</h1>
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{mockProject.title}</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Principal Investigator: {mockProject.researcher} • {mockProject.department}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Research Info</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project ID</Label>
                  <p className="text-gray-900 dark:text-white">{mockProject.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</Label>
                  <p className="text-gray-900 dark:text-white capitalize">{mockProject.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</Label>
                  <p className="text-gray-900 dark:text-white">{mockProject.startDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</Label>
                  <p className="text-gray-900 dark:text-white">{mockProject.endDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Budget</Label>
                  <p className="text-gray-900 dark:text-white">${mockProject.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount Released</Label>
                  <p className="text-gray-900 dark:text-white">${mockProject.totalReleased}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Progress tracking features will be implemented here.</p>
              </div>
            </TabsContent>

            <TabsContent value="funding" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Amount Released
                    </Label>
                    <Input type="number" value={mockProject.totalReleased} readOnly className="w-32 mt-1" />
                  </div>
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Funding
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-700">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFundings.map((funding) => (
                      <TableRow key={funding.id}>
                        <TableCell>{funding.id}</TableCell>
                        <TableCell>{funding.user}</TableCell>
                        <TableCell>${funding.amount}</TableCell>
                        <TableCell>{funding.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
