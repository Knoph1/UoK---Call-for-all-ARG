"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Camera,
  Lock,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Download,
  Activity,
  Calendar,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const mockUser = {
  id: 1,
  name: "Dr. Jane Smith",
  email: "jane.smith@kabianga.ac.ke",
  pfNumber: "PF002",
  phone: "+254 712 345 678",
  role: "applicant",
  campus: "Main Campus",
  school: "School of Agricultural Sciences and Natural Resources",
  department: "Agricultural Bio-systems, Economics and Horticulture",
  position: "Senior Lecturer",
  qualification: "PhD in Agricultural Economics",
  specialization: "Sustainable Agriculture, Food Security",
  joinDate: "2020-03-15",
  profilePicture: "/placeholder-user.jpg",
  bio: "Dr. Jane Smith is a Senior Lecturer specializing in sustainable agriculture and food security research.",
  researchInterests: "Sustainable Agriculture, Food Security, Climate Change Adaptation",
  publications: 15,
  activeProjects: 3,
  completedProjects: 8,
  totalFunding: 2500000,
  lastLogin: "2024-12-06 14:30:00",
  accountStatus: "Active",
  emailVerified: true,
  twoFactorEnabled: false,
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    systemAlerts: true,
    weeklyDigest: true,
    marketingEmails: false,
  },
}

const campuses = ["Main Campus", "Town Campus", "Kapkatet Campus"]

const schoolsAndDepartments = [
  {
    school: "School of Education, Arts and Social Sciences",
    departments: [
      "Curriculum Instruction and Educational Media",
      "Humanities and Social Sciences",
      "Linguistics, Literature & Communication",
    ],
  },
  {
    school: "School of Business and Economics",
    departments: ["Marketing, Management Science, Tourism & Hospitality", "Finance, Accounting & Economics"],
  },
  {
    school: "School of Agricultural Sciences and Natural Resources",
    departments: [
      "Agro-forestry, Environmental Studies and Integrated Natural Resources Management",
      "Agricultural Bio-systems, Economics and Horticulture",
    ],
  },
  {
    school: "School of Health Sciences",
    departments: [
      "Department of Clinical Medicine and Optometry",
      "Department of Public Health",
      "Department of Nursing and Nutritional Sciences",
    ],
  },
  {
    school: "School of Science and Technology",
    departments: [
      "Biological Sciences",
      "Computing, Information Science and Knowledge Management",
      "Mathematics, Actuarial and Physical Sciences",
    ],
  },
]

export function UserProfileContent() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileData, setProfileData] = useState(mockUser)
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSchoolChange = (school: string) => {
    const selectedSchool = schoolsAndDepartments.find((s) => s.school === school)
    if (selectedSchool) {
      setDepartmentOptions(selectedSchool.departments)
      setProfileData((prev) => ({ ...prev, school, department: "" }))
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsEditing(false)
    setIsLoading(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  const handleChangePassword = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handleProfilePictureUpload = () => {
    toast({
      title: "Profile Picture Updated",
      description: "Your profile picture has been successfully updated.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready for download shortly.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your profile, security settings, and preferences</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          {isEditing ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-sky-600 hover:bg-sky-700">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-sky-600 hover:bg-sky-700">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture and Basic Info */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" onClick={handleProfilePictureUpload}>
                      <Camera className="mr-2 h-4 w-4" />
                      Change Picture
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Account Status</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {profileData.accountStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Role</span>
                    <Badge variant="outline" className="capitalize">
                      {profileData.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Member Since</span>
                    <span className="text-sm">{new Date(profileData.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Email Verified</span>
                    <Badge
                      className={profileData.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {profileData.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pfNumber">PF Number</Label>
                    <Input
                      id="pfNumber"
                      value={profileData.pfNumber}
                      disabled
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="campus">Campus *</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <Select
                        value={profileData.campus}
                        onValueChange={(value) => setProfileData((prev) => ({ ...prev, campus: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select campus" />
                        </SelectTrigger>
                        <SelectContent>
                          {campuses.map((campus) => (
                            <SelectItem key={campus} value={campus}>
                              {campus}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <Input
                        id="position"
                        value={profileData.position}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, position: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="e.g., Senior Lecturer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="school">School/Faculty *</Label>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <Select value={profileData.school} onValueChange={handleSchoolChange} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school/faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {schoolsAndDepartments.map((item) => (
                          <SelectItem key={item.school} value={item.school}>
                            {item.school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={profileData.department}
                    onValueChange={(value) => setProfileData((prev) => ({ ...prev, department: value }))}
                    disabled={!isEditing || departmentOptions.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="qualification">Highest Qualification</Label>
                  <Input
                    id="qualification"
                    value={profileData.qualification}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, qualification: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="e.g., PhD in Agricultural Economics"
                  />
                </div>

                <div>
                  <Label htmlFor="specialization">Area of Specialization</Label>
                  <Input
                    id="specialization"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, specialization: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="e.g., Sustainable Agriculture, Food Security"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                    placeholder="Brief description about yourself and your work..."
                  />
                </div>

                <div>
                  <Label htmlFor="researchInterests">Research Interests</Label>
                  <Textarea
                    id="researchInterests"
                    value={profileData.researchInterests}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, researchInterests: e.target.value }))}
                    disabled={!isEditing}
                    className="min-h-[80px]"
                    placeholder="List your research interests separated by commas..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Research Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Research Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileData.publications}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Publications
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {profileData.activeProjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                    <Activity className="h-4 w-4 mr-1" />
                    Active Projects
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {profileData.completedProjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                    <Award className="h-4 w-4 mr-1" />
                    Completed Projects
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    KShs. {(profileData.totalFunding / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Total Funding
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                  </p>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="w-full bg-sky-600 hover:bg-sky-700"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                  </div>
                  <Switch
                    checked={profileData.twoFactorEnabled}
                    onCheckedChange={(checked) => setProfileData((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Verification</div>
                    <div className="text-sm text-gray-500">Verify your email address for security</div>
                  </div>
                  <Badge
                    className={profileData.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {profileData.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <div className="font-medium mb-2">Login Sessions</div>
                  <div className="text-sm text-gray-500 mb-3">Manage your active login sessions</div>
                  <Button variant="outline" className="w-full">
                    View Active Sessions
                  </Button>
                </div>
                <Separator />
                <div>
                  <div className="font-medium mb-2">Account Recovery</div>
                  <div className="text-sm text-gray-500 mb-3">Download recovery codes for account access</div>
                  <Button variant="outline" className="w-full">
                    Generate Recovery Codes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={profileData.notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-500">Receive important alerts via SMS</div>
                  </div>
                  <Switch
                    checked={profileData.notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Application Updates</div>
                    <div className="text-sm text-gray-500">Get notified about application status changes</div>
                  </div>
                  <Switch
                    checked={profileData.notifications.applicationUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("applicationUpdates", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">System Alerts</div>
                    <div className="text-sm text-gray-500">Important system announcements and maintenance</div>
                  </div>
                  <Switch
                    checked={profileData.notifications.systemAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("systemAlerts", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-sm text-gray-500">Weekly summary of your activities and updates</div>
                  </div>
                  <Switch
                    checked={profileData.notifications.weeklyDigest}
                    onCheckedChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Marketing Emails</div>
                    <div className="text-sm text-gray-500">Promotional content and feature updates</div>
                  </div>
                  <Switch
                    checked={profileData.notifications.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Application Submitted</div>
                      <div className="text-xs text-gray-500">Agricultural Innovation Research - 2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Profile Updated</div>
                      <div className="text-xs text-gray-500">Research interests updated - 1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Document Uploaded</div>
                      <div className="text-xs text-gray-500">Research proposal document - 3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Review Completed</div>
                      <div className="text-xs text-gray-500">Peer review for climate study - 1 week ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Login</span>
                    <span className="text-sm font-medium">{new Date(profileData.lastLogin).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account Created</span>
                    <span className="text-sm font-medium">{new Date(profileData.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Profile Completion</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-15 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Data Usage</span>
                    <span className="text-sm font-medium">2.4 MB</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
