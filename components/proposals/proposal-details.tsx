"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Users,
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface ProposalDetailsProps {
  proposal: any
  userRole: string
}

export function ProposalDetails({ proposal, userRole }: ProposalDetailsProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { variant: "outline" as const, icon: Clock, color: "text-blue-600" },
      RECEIVED: { variant: "secondary" as const, icon: FileText, color: "text-gray-600" },
      UNDER_REVIEW: { variant: "default" as const, icon: AlertCircle, color: "text-yellow-600" },
      APPROVED: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      REJECTED: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SUBMITTED
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-blue-100 text-blue-800",
      HIGH: "bg-orange-100 text-orange-800",
      URGENT: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[priority as keyof typeof colors]}>{priority}</Badge>
  }

  const totalBudget = proposal.budgetItems.reduce((sum: number, item: any) => sum + item.cost, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{proposal.researchTitle}</h1>
            {getStatusBadge(proposal.status)}
            {getPriorityBadge(proposal.priority)}
          </div>
          <p className="text-muted-foreground">
            Submitted by {proposal.researcher.user.name} • {proposal.researcher.department.name}
          </p>
        </div>
        <div className="flex gap-2">
          {userRole === "RESEARCHER" && proposal.status === "SUBMITTED" && (
            <Button asChild>
              <Link href={`/proposals/${proposal.id}/edit`}>Edit Proposal</Link>
            </Button>
          )}
          {proposal.project && (
            <Button asChild variant="outline">
              <Link href={`/projects/${proposal.project.id}`}>View Project</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Requested Amount</p>
                <p className="text-2xl font-bold">${proposal.requestedAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {proposal.approvedAmount && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Approved Amount</p>
                  <p className="text-2xl font-bold text-green-600">${proposal.approvedAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Submitted</p>
                <p className="text-lg font-semibold">{new Date(proposal.submissionDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-lg font-semibold">{proposal.theme.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Research Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{proposal.objectives}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Grant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">{proposal.grantOpening.name}</p>
                  <p className="text-sm text-muted-foreground">{proposal.grantOpening.financialYear.label}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium">Budget Ceiling</p>
                  <p className="text-sm">${proposal.grantOpening.budgetCeiling.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{proposal.methodology}</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{proposal.timeline}</p>
              </CardContent>
            </Card>

            {proposal.researchDesignItems.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Research Design Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {proposal.researchDesignItems.map((item: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Principal Investigator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{proposal.researcher.user.name}</p>
                  <p className="text-sm text-muted-foreground">{proposal.researcher.user.email}</p>
                  <p className="text-sm">{proposal.researcher.department.name}</p>
                  <p className="text-sm">Employee: {proposal.researcher.employeeNumber}</p>
                </div>
              </CardContent>
            </Card>

            {proposal.coInvestigators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Co-Investigators ({proposal.coInvestigators.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proposal.coInvestigators.map((coInv: any) => (
                        <TableRow key={coInv.id}>
                          <TableCell className="font-medium">{coInv.name}</TableCell>
                          <TableCell>{coInv.email}</TableCell>
                          <TableCell>{coInv.phone || "-"}</TableCell>
                          <TableCell>{coInv.role || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {proposal.publications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Related Publications ({proposal.publications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {proposal.publications.map((pub: any) => (
                      <div key={pub.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium">{pub.title}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {pub.journal && <p>Journal: {pub.journal}</p>}
                          {pub.year && <p>Year: {pub.year}</p>}
                          {pub.doi && <p>DOI: {pub.doi}</p>}
                          {pub.link && (
                            <p>
                              <a
                                href={pub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Publication
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Breakdown
                </span>
                <span className="text-lg font-bold">Total: ${totalBudget.toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proposal.budgetItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposal.budgetItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell>${item.cost.toLocaleString()}</TableCell>
                        <TableCell>{item.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">${totalBudget.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No budget items specified</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Work Plan Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proposal.workplanItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposal.workplanItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.activity}</TableCell>
                        <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No work plan activities specified</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Supporting Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proposal.attachments.length > 0 ? (
                <div className="space-y-2">
                  {proposal.attachments.map((attachment: any) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{attachment.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {attachment.fileType} • {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={attachment.filePath} download>
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No attachments uploaded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
