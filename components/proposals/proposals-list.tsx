"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Eye, Edit, FileText, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Proposal {
  id: string
  researchTitle: string
  requestedAmount: number
  approvedAmount: number | null
  status: string
  priority: string
  submissionDate: Date
  reviewDate: Date | null
  approvalDate: Date | null
  grantOpening: {
    name: string
    financialYear: {
      label: string
    }
  }
  theme: {
    name: string
  }
  researcher: {
    user: {
      name: string
    }
    department: {
      name: string
    }
  }
}

interface ProposalsListProps {
  proposals: Proposal[]
  userRole: string
}

export function ProposalsList({ proposals, userRole }: ProposalsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.researchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.researcher.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
    const matchesPriority = priorityFilter === "all" || proposal.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { variant: "outline" as const, icon: Clock, color: "text-blue-600" },
      RECEIVED: { variant: "secondary" as const, icon: FileText, color: "text-gray-600" },
      UNDER_REVIEW: { variant: "default" as const, icon: Clock, color: "text-yellow-600" },
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

  const handleStatusChange = async (proposalId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Proposal status updated successfully",
        })
        router.refresh()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update proposal status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="RECEIVED">Received</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Proposals ({filteredProposals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                {userRole !== "RESEARCHER" && <TableHead>Researcher</TableHead>}
                <TableHead>Theme</TableHead>
                <TableHead>Grant Opening</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{proposal.researchTitle}</div>
                      <div className="text-sm text-muted-foreground">{proposal.grantOpening.financialYear.label}</div>
                    </div>
                  </TableCell>
                  {userRole !== "RESEARCHER" && (
                    <TableCell>
                      <div>
                        <div className="font-medium">{proposal.researcher.user.name}</div>
                        <div className="text-sm text-muted-foreground">{proposal.researcher.department.name}</div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{proposal.theme.name}</TableCell>
                  <TableCell>{proposal.grantOpening.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>${proposal.requestedAmount.toLocaleString()}</div>
                      {proposal.approvedAmount && (
                        <div className="text-green-600">${proposal.approvedAmount.toLocaleString()} approved</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                  <TableCell>{getPriorityBadge(proposal.priority)}</TableCell>
                  <TableCell>{new Date(proposal.submissionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/proposals/${proposal.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {(userRole === "ADMIN" || userRole === "SUPERVISOR") &&
                          ["SUBMITTED", "UNDER_REVIEW"].includes(proposal.status) && (
                            <DropdownMenuItem asChild>
                              <Link href={`/proposals/${proposal.id}/review`}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Review
                              </Link>
                            </DropdownMenuItem>
                          )}
                        {userRole === "RESEARCHER" && proposal.status === "SUBMITTED" && (
                          <DropdownMenuItem asChild>
                            <Link href={`/proposals/${proposal.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                          <>
                            {proposal.status === "SUBMITTED" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(proposal.id, "UNDER_REVIEW")}>
                                Start Review
                              </DropdownMenuItem>
                            )}
                            {proposal.status === "UNDER_REVIEW" && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(proposal.id, "APPROVED")}>
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(proposal.id, "REJECTED")}>
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
