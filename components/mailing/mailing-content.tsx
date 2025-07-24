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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Mail,
  Send,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for email campaigns
const emailCampaigns = [
  {
    id: "CAM001",
    name: "Application Deadline Reminder",
    subject: "Research Grant Application Deadline - 7 Days Left",
    recipients: 156,
    status: "Sent",
    sentDate: "2024-12-01",
    openRate: 78,
    clickRate: 23,
    template: "deadline-reminder",
  },
  {
    id: "CAM002",
    name: "Grant Award Notifications",
    subject: "Congratulations! Your Research Grant Application Has Been Approved",
    recipients: 23,
    status: "Sent",
    sentDate: "2024-11-28",
    openRate: 95,
    clickRate: 67,
    template: "award-notification",
  },
  {
    id: "CAM003",
    name: "Review Status Update",
    subject: "Update on Your Research Grant Application Review",
    recipients: 45,
    status: "Draft",
    sentDate: null,
    openRate: 0,
    clickRate: 0,
    template: "status-update",
  },
]

const emailTemplates = [
  {
    id: "TPL001",
    name: "Application Received",
    subject: "Your Research Grant Application Has Been Received",
    category: "Confirmation",
    lastUsed: "2024-12-05",
  },
  {
    id: "TPL002",
    name: "Review Complete",
    subject: "Review of Your Research Grant Application is Complete",
    category: "Status Update",
    lastUsed: "2024-12-03",
  },
  {
    id: "TPL003",
    name: "Funding Disbursement",
    subject: "Research Grant Funding Disbursement Notice",
    category: "Financial",
    lastUsed: "2024-11-30",
  },
  {
    id: "TPL004",
    name: "Project Milestone",
    subject: "Research Project Milestone Reminder",
    category: "Reminder",
    lastUsed: "2024-11-25",
  },
]

const recipientGroups = [
  { id: "GRP001", name: "All Applicants", count: 156, description: "All research grant applicants" },
  { id: "GRP002", name: "Approved Applicants", count: 89, description: "Applicants with approved grants" },
  { id: "GRP003", name: "Pending Review", count: 44, description: "Applications under review" },
  { id: "GRP004", name: "Committee Members", count: 12, description: "Review committee members" },
  { id: "GRP005", name: "Department Heads", count: 8, description: "Department heads and coordinators" },
]

export function MailingContent() {
  const [activeTab, setActiveTab] = useState("campaigns")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: "",
    scheduledDate: "",
    priority: "normal",
  })
  const [isComposing, setIsComposing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.content || selectedRecipients.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select recipients.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSending(false)

    toast({
      title: "Email Sent",
      description: `Email sent successfully to ${selectedRecipients.length} recipient groups.`,
    })

    // Reset form
    setEmailForm({
      subject: "",
      content: "",
      scheduledDate: "",
      priority: "normal",
    })
    setSelectedRecipients([])
    setIsComposing(false)
  }

  const handleScheduleEmail = () => {
    toast({
      title: "Email Scheduled",
      description: "Your email has been scheduled for delivery.",
    })
  }

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your email draft has been saved.",
    })
  }

  const handleRecipientToggle = (groupId: string) => {
    setSelectedRecipients((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const getTotalRecipients = () => {
    return recipientGroups
      .filter((group) => selectedRecipients.includes(group.id))
      .reduce((total, group) => total + group.count, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email & Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage email campaigns and notifications for research portal users
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
          <Button onClick={() => setIsComposing(true)} className="bg-sky-600 hover:bg-sky-700">
            <Plus className="mr-2 h-4 w-4" />
            Compose Email
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Campaigns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Open Rate</TableHead>
                      <TableHead>Click Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={campaign.subject}>
                            {campaign.subject}
                          </div>
                        </TableCell>
                        <TableCell>{campaign.recipients}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              campaign.status === "Sent"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {campaign.sentDate ? new Date(campaign.sentDate).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>{campaign.openRate}%</TableCell>
                        <TableCell>{campaign.clickRate}%</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
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

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Email Templates</h3>
            <Button className="bg-sky-600 hover:bg-sky-700">
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.subject}</p>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last used: {new Date(template.lastUsed).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setSelectedTemplate(template.id)}
                        className="bg-sky-600 hover:bg-sky-700"
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recipients Tab */}
        <TabsContent value="recipients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Recipient Groups</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recipientGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedRecipients.includes(group.id)}
                        onCheckedChange={() => handleRecipientToggle(group.id)}
                      />
                      <div>
                        <h4 className="font-medium">{group.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{group.count}</div>
                      <div className="text-sm text-gray-500">recipients</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedRecipients.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Selected Recipients:</span>
                    <span className="text-lg font-bold text-blue-600">{getTotalRecipients()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{emailCampaigns.length}</p>
                    <p className="text-sm text-gray-600">Total Campaigns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Send className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {emailCampaigns.reduce((sum, campaign) => sum + campaign.recipients, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Emails Sent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Eye className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        emailCampaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) /
                          emailCampaigns.filter((c) => c.status === "Sent").length,
                      )}
                      %
                    </p>
                    <p className="text-sm text-gray-600">Avg. Open Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        emailCampaigns.reduce((sum, campaign) => sum + campaign.clickRate, 0) /
                          emailCampaigns.filter((c) => c.status === "Sent").length,
                      )}
                      %
                    </p>
                    <p className="text-sm text-gray-600">Avg. Click Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emailCampaigns
                    .filter((c) => c.status === "Sent")
                    .map((campaign) => (
                      <div key={campaign.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{campaign.name}</span>
                          <span className="text-sm text-gray-500">{campaign.openRate}% open</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${campaign.openRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Application Deadline Reminder sent</p>
                      <p className="text-xs text-gray-500">156 recipients • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Review Status Update scheduled</p>
                      <p className="text-xs text-gray-500">45 recipients • Tomorrow 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Grant Award Notifications sent</p>
                      <p className="text-xs text-gray-500">23 recipients • 3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Compose Email Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Compose Email</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsComposing(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={emailForm.priority}
                    onValueChange={(value) => setEmailForm((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="template">Use Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Email Content *</Label>
                <Textarea
                  id="content"
                  value={emailForm.content}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your email content here..."
                  className="min-h-[200px]"
                />
              </div>

              <div>
                <Label>Recipients ({getTotalRecipients()} selected)</Label>
                <div className="mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {recipientGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={selectedRecipients.includes(group.id)}
                        onCheckedChange={() => handleRecipientToggle(group.id)}
                      />
                      <span className="text-sm">
                        {group.name} ({group.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="scheduledDate">Schedule for Later (Optional)</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={emailForm.scheduledDate}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSendEmail} disabled={isSending} className="bg-sky-600 hover:bg-sky-700">
                  <Send className="mr-2 h-4 w-4" />
                  {isSending ? "Sending..." : "Send Now"}
                </Button>
                <Button variant="outline" onClick={handleScheduleEmail}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button variant="outline" onClick={() => setIsComposing(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
