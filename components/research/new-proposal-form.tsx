"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BasicDetailsForm } from "@/components/research/form-sections/basic-details-form"
import { CollaboratorsForm } from "@/components/research/form-sections/collaborators-form"
import { ObjectivesForm } from "@/components/research/form-sections/objectives-form"
import { MethodologyForm } from "@/components/research/form-sections/methodology-form"
import { BudgetForm } from "@/components/research/form-sections/budget-form"
import { OutputsForm } from "@/components/research/form-sections/outputs-form"
import { DeclarationForm } from "@/components/research/form-sections/declaration-form"
import { Check, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tabs = [
  { id: "basic-details", label: "Basic Details" },
  { id: "collaborators", label: "Collaborators" },
  { id: "objectives", label: "Objectives" },
  { id: "methodology", label: "Methodology" },
  { id: "budget", label: "Budget" },
  { id: "outputs", label: "Outputs" },
  { id: "declaration", label: "Declaration" },
]

export function NewProposalForm() {
  const [activeTab, setActiveTab] = useState("basic-details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Details
    title: "",
    theme: "",
    campus: "",
    school: "",
    department: "",
    startDate: "",
    endDate: "",
    fundsRequested: "",

    // Collaborators
    collaborators: [{ name: "", position: "", institution: "", researchArea: "", experience: "" }],

    // Objectives
    objectives: "",
    researchQuestions: "",
    significance: "",

    // Methodology
    researchDesign: "",
    ethicalConsiderations: "",
    workPlan: [{ activity: "", timeInput: "", facilities: "", byWhom: "", outcome: "" }],

    // Budget
    equipment: [{ item: "", quantity: "", unitPrice: "", total: "" }],
    consumables: [{ item: "", quantity: "", unitPrice: "", total: "" }],
    travel: "",
    personnel: "",

    // Outputs
    expectedOutputs: "",
    socioEconomicImpact: "",
    dissemination: "",
    publications: "",

    // Declaration
    declaration: false,
  })

  const router = useRouter()
  const { toast } = useToast()

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }))
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const moveToNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const moveToPreviousTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your research proposal has been saved as a draft.",
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Validate budget 60-40 threshold
    const totalEquipment = formData.equipment.reduce((sum, item) => sum + Number(item.total || 0), 0)
    const totalConsumables = formData.consumables.reduce((sum, item) => sum + Number(item.total || 0), 0)
    const totalTravel = Number(formData.travel || 0)
    const totalPersonnel = Number(formData.personnel || 0)

    const totalBudget = totalEquipment + totalConsumables + totalTravel + totalPersonnel
    const equipmentPercentage = (totalEquipment / totalBudget) * 100
    const otherExpensesPercentage = 100 - equipmentPercentage

    if (equipmentPercentage < 60 || otherExpensesPercentage > 40) {
      toast({
        title: "Budget Threshold Error",
        description:
          "Your budget must allocate at least 60% to Equipment and Facilities and no more than 40% to Other expenses.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Proposal Submitted",
        description: "Your research proposal has been submitted successfully.",
      })
      router.push("/dashboard/applications")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Research Proposal</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete all sections to submit your research grant application
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-sky-600 hover:bg-sky-700">
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Grant Application Form</CardTitle>
          <CardDescription>Form Ref: UoK/F/DIR/RLE/001 - Please complete all required fields</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-7">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="basic-details">
              <BasicDetailsForm
                formData={formData}
                updateFormData={(data) => updateFormData("basic-details", data)}
                onNext={moveToNextTab}
              />
            </TabsContent>

            <TabsContent value="collaborators">
              <CollaboratorsForm
                formData={formData}
                updateFormData={(data) => updateFormData("collaborators", data)}
                onNext={moveToNextTab}
                onPrevious={moveToPreviousTab}
              />
            </TabsContent>

            <TabsContent value="objectives">
              <ObjectivesForm
                formData={formData}
                updateFormData={(data) => updateFormData("objectives", data)}
                onNext={moveToNextTab}
                onPrevious={moveToPreviousTab}
              />
            </TabsContent>

            <TabsContent value="methodology">
              <MethodologyForm
                formData={formData}
                updateFormData={(data) => updateFormData("methodology", data)}
                onNext={moveToNextTab}
                onPrevious={moveToPreviousTab}
              />
            </TabsContent>

            <TabsContent value="budget">
              <BudgetForm
                formData={formData}
                updateFormData={(data) => updateFormData("budget", data)}
                onNext={moveToNextTab}
                onPrevious={moveToPreviousTab}
              />
            </TabsContent>

            <TabsContent value="outputs">
              <OutputsForm
                formData={formData}
                updateFormData={(data) => updateFormData("outputs", data)}
                onNext={moveToNextTab}
                onPrevious={moveToPreviousTab}
              />
            </TabsContent>

            <TabsContent value="declaration">
              <DeclarationForm
                formData={formData}
                updateFormData={(data) => updateFormData("declaration", data)}
                onSubmit={handleSubmit}
                onPrevious={moveToPreviousTab}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
