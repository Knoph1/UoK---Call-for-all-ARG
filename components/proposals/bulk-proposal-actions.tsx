"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface BulkProposalActionsProps {
  proposals: any[]
}

export function BulkProposalActions({ proposals }: BulkProposalActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedProposals, setSelectedProposals] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")
  const [bulkComment, setBulkComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProposals(proposals.map((p) => p.id))
    } else {
      setSelectedProposals([])
    }
  }

  const handleSelectProposal = (proposalId: string, checked: boolean) => {
    if (checked) {
      setSelectedProposals([...selectedProposals, proposalId])
    } else {
      setSelectedProposals(selectedProposals.filter((id) => id !== proposalId))
    }
  }

  const handleBulkAction = async () => {
    if (selectedProposals.length === 0 || !bulkAction) {
      toast({
        title: "Error",
        description: "Please select proposals and an action",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/proposals/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalIds: selectedProposals,
          action: bulkAction,
          comment: bulkComment,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: `${result.updated} proposals updated successfully`,
        })
        router.refresh()
        setSelectedProposals([])
        setBulkAction("")
        setBulkComment("")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to perform bulk action")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[status as keyof typeof colors]}>{status.replace("_", " ")}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Action</Label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve Selected</SelectItem>
                  <SelectItem value="reject">Reject Selected</SelectItem>
                  <SelectItem value="under_review">Move to Under Review</SelectItem>
                  <SelectItem value="add_comment">Add Comment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Comment (Optional)</Label>
              <Textarea
                value={bulkComment}
                onChange={(e) => setBulkComment(e.target.value)}
                placeholder="Add a comment for all selected proposals..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedProposals.length} of {proposals.length} proposals selected
            </p>
            <Button onClick={handleBulkAction} disabled={isLoading || selectedProposals.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply to {selectedProposals.length} Proposals
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Proposals Available for Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={selectedProposals.length === proposals.length} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Researcher</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProposals.includes(proposal.id)}
                      onCheckedChange={(checked) => handleSelectProposal(proposal.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium truncate">{proposal.researchTitle}</p>
                      <p className="text-sm text-muted-foreground">{proposal.grantOpening.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{proposal.researcher.user.name}</TableCell>
                  <TableCell>{proposal.researcher.department.name}</TableCell>
                  <TableCell>{proposal.theme.name}</TableCell>
                  <TableCell>${proposal.requestedAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                  <TableCell>{new Date(proposal.submissionDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
