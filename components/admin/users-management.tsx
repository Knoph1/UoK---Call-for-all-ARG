"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Shield } from "lucide-react"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@kabianga.ac.ke",
    role: "admin",
    department: "Administration",
    status: "active",
    pfNumber: "PF001",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@kabianga.ac.ke",
    role: "applicant",
    department: "Agriculture",
    status: "active",
    pfNumber: "PF002",
  },
  {
    id: 3,
    name: "Prof. Wilson",
    email: "wilson@kabianga.ac.ke",
    role: "committee",
    department: "Research Committee",
    status: "active",
    pfNumber: "PF003",
  },
]

const permissions = [
  "Create Applications",
  "Review Applications",
  "Approve Funding",
  "Manage Users",
  "Generate Reports",
  "System Settings",
  "View All Projects",
  "Edit Project Details",
]

export function UsersManagement() {
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedUser, setSelectedUser] = useState(mockUsers[0])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <Button className="bg-sky-600 hover:bg-sky-700">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser.id === user.id
                      ? "bg-sky-100 dark:bg-sky-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>User Details - {selectedUser.name}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="rights">Rights</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={selectedUser.name} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={selectedUser.email} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="pfNumber">PF Number</Label>
                    <Input id="pfNumber" value={selectedUser.pfNumber} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={selectedUser.department} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={selectedUser.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="applicant">Applicant</SelectItem>
                        <SelectItem value="committee">Committee Member</SelectItem>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={selectedUser.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    Reset Password
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Send Welcome Email
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Suspend Account
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Export User Data
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="rights" className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                    <Shield className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">Select permissions preferred for this user only!</p>
                      <p className="text-sm">This is a superuser (Admin) and reserves all rights exclusively!</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">User Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          defaultChecked={selectedUser.role === "admin"}
                          disabled={selectedUser.role === "admin"}
                        />
                        <Label htmlFor={permission} className="text-sm font-normal cursor-pointer">
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-sky-600 hover:bg-sky-700">Save Changes</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
