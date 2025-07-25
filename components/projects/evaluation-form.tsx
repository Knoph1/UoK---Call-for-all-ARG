"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EvaluationFormProps {
  project: any
}

export function EvaluationForm({ project }: EvaluationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    comment: "",
    score: "",
    attachmentPath: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${project.id}/evaluations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          score: formData.score ? Number.parseInt(formData.score) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Evaluation submitted successfully",
        })
        router.push(`/projects/${project.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit evaluation")
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="score">Score (1-10)</Label>
                <Select value={formData.score} onValueChange={(value) => setFormData({ ...formData, score: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score}/10 -{" "}
                        {score >= 9
                          ? "Excellent"
                          : score >= 7
                            ? "Good"
                            : score >= 5
                              ? "Satisfactory"
                              : score >= 3
                                ? "Needs Improvement"
                                : "Poor"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Evaluation Comments *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Provide detailed feedback on the project progress, achievements, challenges, and recommendations..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachmentPath">Attachment Path (Optional)</Label>
                <Input
                  id="attachmentPath"
                  value={formData.attachmentPath}
                  onChange={(e) => setFormData({ ...formData, attachmentPath: e.target.value })}
                  placeholder="Path to evaluation document or report"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Evaluation
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push(`/projects/${project.id}`)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Title</Label>
              <p className="text-sm">{project.proposal.researchTitle}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Researcher</Label>
              <p className="text-sm">{project.proposal.researcher.user.name}</p>
              <p className="text-xs text-muted-foreground">{project.proposal.researcher.department.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Supervisor</Label>
              <p className="text-sm">{project.supervisor.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant={project.status === "COMPLETED" ? "default" : "secondary"}>
                {project.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Progress</Label>
              <p className="text-sm">{project.overallProgress}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Previous Evaluations */}
        {project.evaluations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Evaluator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.evaluations.map((evaluation: any) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="text-sm">{new Date(evaluation.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {evaluation.score ? (
                          <Badge
                            variant={
                              evaluation.score >= 7 ? "default" : evaluation.score >= 5 ? "secondary" : "destructive"
                            }
                          >
                            {evaluation.score}/10
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{evaluation.evaluator.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
