"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Building, Users, BookOpen } from "lucide-react"

// Mock data for schools and departments
const mockSchoolsAndDepartments = [
  {
    id: 1,
    name: "School of Education, Arts and Social Sciences",
    dean: "Prof. Alice Johnson",
    departments: [
      { id: 1, name: "Curriculum Instruction and Educational Media", head: "Dr. Robert Smith", staff: 12, projects: 5 },
      { id: 2, name: "Humanities and Social Sciences", head: "Prof. Mary Williams", staff: 15, projects: 7 },
      { id: 3, name: "Linguistics, Literature & Communication", head: "Dr. James Brown", staff: 10, projects: 4 },
    ],
  },
  {
    id: 2,
    name: "School of Business and Economics",
    dean: "Prof. Michael Davis",
    departments: [
      {
        id: 4,
        name: "Marketing, Management Science, Tourism & Hospitality",
        head: "Dr. Sarah Miller",
        staff: 14,
        projects: 6,
      },
      { id: 5, name: "Finance, Accounting & Economics", head: "Prof. David Wilson", staff: 16, projects: 8 },
    ],
  },
  {
    id: 3,
    name: "School of Agricultural Sciences and Natural Resources",
    dean: "Prof. Thomas Anderson",
    departments: [
      {
        id: 6,
        name: "Agro-forestry, Environmental Studies and Integrated Natural Resources Management",
        head: "Dr. Jennifer Lee",
        staff: 13,
        projects: 9,
      },
      {
        id: 7,
        name: "Agricultural Bio-systems, Economics and Horticulture",
        head: "Prof. Richard Taylor",
        staff: 11,
        projects: 7,
      },
    ],
  },
  {
    id: 4,
    name: "School of Health Sciences",
    dean: "Prof. Elizabeth Martin",
    departments: [
      {
        id: 8,
        name: "Department of Clinical Medicine and Optometry",
        head: "Dr. William Clark",
        staff: 18,
        projects: 10,
      },
      { id: 9, name: "Department of Public Health", head: "Prof. Patricia White", staff: 15, projects: 8 },
      {
        id: 10,
        name: "Department of Nursing and Nutritional Sciences",
        head: "Dr. Susan Harris",
        staff: 17,
        projects: 6,
      },
    ],
  },
  {
    id: 5,
    name: "School of Science and Technology",
    dean: "Prof. Joseph Thompson",
    departments: [
      { id: 11, name: "Biological Sciences", head: "Dr. Daniel Lewis", staff: 14, projects: 7 },
      {
        id: 12,
        name: "Computing, Information Science and Knowledge Management",
        head: "Prof. Karen Moore",
        staff: 16,
        projects: 9,
      },
      {
        id: 13,
        name: "Mathematics, Actuarial and Physical Sciences",
        head: "Dr. Christopher Walker",
        staff: 12,
        projects: 5,
      },
    ],
  },
]

export function DepartmentsContent() {
  const [activeTab, setActiveTab] = useState("schools")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [isEditingSchool, setIsEditingSchool] = useState(false)
  const [isEditingDepartment, setIsEditingDepartment] = useState(false)

  // Filter schools and departments based on search query
  const filteredSchools = mockSchoolsAndDepartments.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const allDepartments = mockSchoolsAndDepartments.flatMap((school) =>
    school.departments.map((dept) => ({
      ...dept,
      schoolName: school.name,
      schoolId: school.id,
    })),
  )

  const filteredDepartments = allDepartments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.schoolName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSchoolSelect = (school: any) => {
    setSelectedSchool(school)
    setIsEditingSchool(true)
  }

  const handleDepartmentSelect = (department: any) => {
    setSelectedDepartment(department)
    setIsEditingDepartment(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schools & Departments</h1>
        <div className="flex space-x-2">
          <Button className="bg-sky-600 hover:bg-sky-700">
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        {/* Search Bar */}
        <div className="my-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab === "schools" ? "schools" : "departments"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Schools Tab */}
        <TabsContent value="schools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchools.map((school) => (
              <Card key={school.id} className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-sky-600" />
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleSchoolSelect(school)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Dean:</span> {school.dean}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Departments:</span> {school.departments.length}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                        <Users className="h-3 w-3 mr-1" />
                        {school.departments.reduce((total, dept) => total + dept.staff, 0)} Staff
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {school.departments.reduce((total, dept) => total + dept.projects, 0)} Projects
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No schools match your search criteria.</p>
              </CardContent>
            </Card>
          )}

          {/* School Edit Form */}
          {isEditingSchool && selectedSchool && (
            <Card className="mt-6 border-2 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <CardTitle className="text-lg">Edit School</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input id="schoolName" defaultValue={selectedSchool.name} />
                  </div>
                  <div>
                    <Label htmlFor="dean">Dean</Label>
                    <Input id="dean" defaultValue={selectedSchool.dean} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditingSchool(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-sky-600 hover:bg-sky-700">Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Head of Department</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.schoolName}</TableCell>
                      <TableCell>{department.head}</TableCell>
                      <TableCell>{department.staff}</TableCell>
                      <TableCell>{department.projects}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleDepartmentSelect(department)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredDepartments.length === 0 && (
            <Card className="mt-4 bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No departments match your search criteria.</p>
              </CardContent>
            </Card>
          )}

          {/* Department Edit Form */}
          {isEditingDepartment && selectedDepartment && (
            <Card className="mt-6 border-2 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <CardTitle className="text-lg">Edit Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="departmentName">Department Name</Label>
                    <Input id="departmentName" defaultValue={selectedDepartment.name} />
                  </div>
                  <div>
                    <Label htmlFor="headOfDepartment">Head of Department</Label>
                    <Input id="headOfDepartment" defaultValue={selectedDepartment.head} />
                  </div>
                  <div>
                    <Label htmlFor="staffCount">Staff Count</Label>
                    <Input id="staffCount" type="number" defaultValue={selectedDepartment.staff} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditingDepartment(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-sky-600 hover:bg-sky-700">Save Changes</Button>
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
