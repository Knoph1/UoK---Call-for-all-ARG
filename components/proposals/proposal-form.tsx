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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import { CoInvestigatorForm } from "./co-investigator-form"
import { PublicationForm } from "./publication-form"
import { BudgetItemForm } from "./budget-item-form"
import { WorkplanItemForm } from "./workplan-item-form"
import { ResearchDesignForm } from "./research-design-form"

interface Researcher {
  id: string
  user: {
    name: string
    email: string
  }
  department: {
    name: string
  }
  employeeNumber: string
  designation: string | null
  phone: string | null
}

interface GrantOpening {
  id: string
  name: string
  budgetCeiling: number
  financialYear: {
    label: string
  }
}

interface Theme {
  id: string
  name: string
  description: string | null
}

interface ProposalFormProps {
  researcher: Researcher
  grantOpenings: GrantOpening[]
  themes: Theme[]
  proposal?: any // For editing existing proposals
}

export function ProposalForm({ researcher, grantOpenings, themes, proposal }: ProposalFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const [formData, setFormData] = useState({
    grantOpeningId: proposal?.grantOpeningId || "",
    themeId: proposal?.themeId || "",
    researchTitle: proposal?.researchTitle || "",
    objectives: proposal?.objectives || "",
    methodology: proposal?.methodology || "",
    timeline: proposal?.timeline || "",
    requestedAmount: proposal?.requestedAmount || "",
    priority: proposal?.priority || "MEDIUM",
  })

  const [coInvestigators, setCoInvestigators] = useState(proposal?.coInvestigators || [])
  const [publications, setPublications] = useState(proposal?.publications || [])
  const [budgetItems, setBudgetItems] = useState(proposal?.budgetItems || [])
  const [workplanItems, setWorkplanItems] = useState(proposal?.workplanItems || [])
  const [researchDesignItems, setResearchDesignItems] = useState(proposal?.researchDesignItems || [])
  const [attachments, setAttachments] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create FormData for file uploads
      const submitData = new FormData()

      // Add basic form data
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })

      // Add complex data as JSON
      submitData.append("coInvestigators", JSON.stringify(coInvestigators))
      submitData.append("publications", JSON.stringify(publications))
      submitData.append("budgetItems", JSON.stringify(budgetItems))
      submitData.append("workplanItems", JSON.stringify(workplanItems))
      submitData.append("researchDesignItems", JSON.stringify(researchDesignItems))

      // Add file attachments
      attachments.forEach((file, index) => {
        submitData.append(`attachment_${index}`, file)
      })

      const url = proposal ? `/api/proposals/${proposal.id}` : "/api/proposals"
      const method = proposal ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: submitData,
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: `Proposal ${proposal ? "updated" : "submitted"} successfully`,
        })
        router.push(`/proposals/${result.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit proposal")
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const isFormValid = () => {
    return (
      formData.grantOpeningId &&
      formData.themeId &&
      formData.researchTitle &&
      formData.objectives &&
      formData.methodology &&
      formData.timeline &&
      formData.requestedAmount
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Research Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Researcher Info (Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label>Principal Investigator</Label>
                  <p className="font-medium">{researcher.user.name}</p>
                  <p className="text-sm text-muted-foreground">{researcher.user.email}</p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="font-medium">{researcher.department.name}</p>
                  <p className="text-sm text-muted-foreground">Employee: {researcher.employeeNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grantOpeningId">Grant Opening *</Label>
                  <Select
                    value={formData.grantOpeningId}
                    onValueChange={(value) => setFormData({ ...formData, grantOpeningId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grant opening" />
                    </SelectTrigger>
                    <SelectContent>
                      {grantOpenings.map((grant) => (
                        <SelectItem key={grant.id} value={grant.id}>
                          <div>
                            <div>{grant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {grant.financialYear.label} - Budget: ${grant.budgetCeiling.toLocaleString()}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="themeId">Research Theme *</Label>
                  <Select
                    value={formData.themeId}
                    onValueChange={(value) => setFormData({ ...formData, themeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select research theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div>
                            <div>{theme.name}</div>
                            {theme.description && (
                              <div className="text-sm text-muted-foreground">{theme.description}</div>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="researchTitle">Research Title *</Label>
                <Input
                  id="researchTitle"
                  value={formData.researchTitle}
                  onChange={(e) => setFormData({ ...formData, researchTitle: e.target.value })}
                  placeholder="Enter your research title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestedAmount">Requested Amount ($) *</Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Research Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">Research Objectives *</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  placeholder="Describe your research objectives..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="methodology">Methodology *</Label>
                <Textarea
                  id="methodology"
                  value={formData.methodology}
                  onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                  placeholder="Describe your research methodology..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline *</Label>
                <Textarea
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="Describe your project timeline..."
                  rows={3}
                  required
                />
              </div>

              <ResearchDesignForm items={researchDesignItems} onChange={setResearchDesignItems} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Research Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CoInvestigatorForm coInvestigators={coInvestigators} onChange={setCoInvestigators} />
              <PublicationForm publications={publications} onChange={setPublications} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetItemForm budgetItems={budgetItems} onChange={setBudgetItems} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Work Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkplanItemForm workplanItems={workplanItems} onChange={setWorkplanItems} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attachments">Upload Files</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, Word, Excel, PowerPoint (Max 10MB per file)
                </p>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files:</Label>
                  <div className="space-y-1">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/proposals")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !isFormValid()}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {proposal ? "Update" : "Submit"} Proposal
        </Button>
      </div>
    </form>
  )
}
