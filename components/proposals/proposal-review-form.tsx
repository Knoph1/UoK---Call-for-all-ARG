"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle, MessageSquare, Star } from "lucide-react"
import { ProposalDetails } from "./proposal-details"

interface ProposalReviewFormProps {
  proposal: any
  reviewerId: string
}

export function ProposalReviewForm({ proposal, reviewerId }: ProposalReviewFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("review")

  const [reviewData, setReviewData] = useState({
    status: proposal.status,
    approvedAmount: proposal.approvedAmount || proposal.requestedAmount,
    comment: "",
    score: 5,
    rejectionReason: "",
    recommendations: "",
    budgetJustification: "",
    timelineComments: "",
    methodologyComments: "",
  })

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/proposals/${proposal.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewData,
          reviewerId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review submitted successfully",
        })
        router.push(`/proposals/${proposal.id}`)
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit review")
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

  const handleQuickAction = async (action: "approve" | "reject") => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/proposals/${proposal.id}/quick-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reviewerId,
          comment: reviewData.comment,
          approvedAmount: action === "approve" ? reviewData.approvedAmount : null,
          rejectionReason: action === "reject" ? reviewData.rejectionReason : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Proposal ${action}d successfully`,
        })
        router.push("/proposals")
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${action} proposal`)
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

  const totalBudget = proposal.budgetItems.reduce((sum: number, item: any) => sum + item.cost, 0)

  return (
    <div className="space-y-6">
      {/* Review Status Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Review: {proposal.researchTitle}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                By {proposal.researcher.user.name} • {proposal.researcher.department.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={proposal.status === "APPROVED" ? "default" : "outline"}>
                {proposal.status.replace("_", " ")}
              </Badge>
              <Badge variant="secondary">${proposal.requestedAmount.toLocaleString()} requested</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposal">Proposal Details</TabsTrigger>
          <TabsTrigger value="review">Review Form</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
        </TabsList>

        <TabsContent value="proposal">
          <ProposalDetails proposal={proposal} userRole="ADMIN" />
        </TabsContent>

        <TabsContent value="review">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => handleQuickAction("approve")}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Quick Approve
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleQuickAction("reject")}
                    disabled={isLoading}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Quick Reject
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Quick actions will use the comments below and immediately update the proposal status.
                </p>
              </CardContent>
            </Card>

            {/* Detailed Review Form */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Review Decision</Label>
                    <Select
                      value={reviewData.status}
                      onValueChange={(value) => setReviewData({ ...reviewData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNDER_REVIEW">Keep Under Review</SelectItem>
                        <SelectItem value="APPROVED">Approve</SelectItem>
                        <SelectItem value="REJECTED">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score">Overall Score (1-10)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="score"
                        type="number"
                        min="1"
                        max="10"
                        value={reviewData.score}
                        onChange={(e) => setReviewData({ ...reviewData, score: Number.parseInt(e.target.value) })}
                      />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < reviewData.score / 2 ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {reviewData.status === "APPROVED" && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Approval Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="approvedAmount">Approved Amount ($)</Label>
                        <Input
                          id="approvedAmount"
                          type="number"
                          value={reviewData.approvedAmount}
                          onChange={(e) =>
                            setReviewData({ ...reviewData, approvedAmount: Number.parseFloat(e.target.value) })
                          }
                          max={proposal.requestedAmount}
                        />
                        <p className="text-sm text-muted-foreground">
                          Requested: ${proposal.requestedAmount.toLocaleString()} | Budget Total: $
                          {totalBudget.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budgetJustification">Budget Justification</Label>
                        <Textarea
                          id="budgetJustification"
                          value={reviewData.budgetJustification}
                          onChange={(e) => setReviewData({ ...reviewData, budgetJustification: e.target.value })}
                          placeholder="Explain any budget adjustments..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {reviewData.status === "REJECTED" && (
                  <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800">Rejection Details</h4>
                    <div className="space-y-2">
                      <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                      <Textarea
                        id="rejectionReason"
                        value={reviewData.rejectionReason}
                        onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                        placeholder="Provide detailed reasons for rejection..."
                        rows={4}
                        required={reviewData.status === "REJECTED"}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Detailed Comments</h4>

                  <div className="space-y-2">
                    <Label htmlFor="comment">General Comments *</Label>
                    <Textarea
                      id="comment"
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      placeholder="Provide your overall assessment..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="methodologyComments">Methodology Comments</Label>
                      <Textarea
                        id="methodologyComments"
                        value={reviewData.methodologyComments}
                        onChange={(e) => setReviewData({ ...reviewData, methodologyComments: e.target.value })}
                        placeholder="Comments on research methodology..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timelineComments">Timeline Comments</Label>
                      <Textarea
                        id="timelineComments"
                        value={reviewData.timelineComments}
                        onChange={(e) => setReviewData({ ...reviewData, timelineComments: e.target.value })}
                        placeholder="Comments on project timeline..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendations">Recommendations</Label>
                    <Textarea
                      id="recommendations"
                      value={reviewData.recommendations}
                      onChange={(e) => setReviewData({ ...reviewData, recommendations: e.target.value })}
                      placeholder="Suggestions for improvement or next steps..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push(`/proposals/${proposal.id}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent>
              {proposal.evaluations.length > 0 ? (
                <div className="space-y-4">
                  {proposal.evaluations.map((evaluation: any) => (
                    <div key={evaluation.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{evaluation.evaluator.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(evaluation.date).toLocaleDateString()}
                          </p>
                        </div>
                        {evaluation.score && <Badge variant="outline">Score: {evaluation.score}/10</Badge>}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{evaluation.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
