"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react"

interface WorkPlanItem {
  activity: string
  timeInput: string
  facilities: string
  byWhom: string
  outcome: string
}

interface MethodologyFormProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function MethodologyForm({ formData, updateFormData, onNext, onPrevious }: MethodologyFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.researchDesign) newErrors.researchDesign = "Research design is required"
    if (!formData.ethicalConsiderations) newErrors.ethicalConsiderations = "Ethical considerations are required"

    // Check if at least one work plan item has an activity
    const hasWorkPlanActivity = formData.workPlan.some((item: WorkPlanItem) => item.activity.trim() !== "")
    if (!hasWorkPlanActivity) {
      newErrors.workPlan = "At least one work plan activity is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value })

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addWorkPlanItem = () => {
    updateFormData({
      workPlan: [...formData.workPlan, { activity: "", timeInput: "", facilities: "", byWhom: "", outcome: "" }],
    })

    // Clear work plan error if it exists
    if (errors.workPlan) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.workPlan
        return newErrors
      })
    }
  }

  const removeWorkPlanItem = (index: number) => {
    const updatedWorkPlan = [...formData.workPlan]
    updatedWorkPlan.splice(index, 1)
    updateFormData({ workPlan: updatedWorkPlan })
  }

  const updateWorkPlanItem = (index: number, field: keyof WorkPlanItem, value: string) => {
    const updatedWorkPlan = [...formData.workPlan]
    updatedWorkPlan[index] = {
      ...updatedWorkPlan[index],
      [field]: value,
    }
    updateFormData({ workPlan: updatedWorkPlan })

    // Clear work plan error if it exists
    if (errors.workPlan) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.workPlan
        return newErrors
      })
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="researchDesign" className="text-base">
            8. Research Design <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-2">
              (itemize how the research objectives will be achieved and indicators of research impact)
            </span>
          </Label>
          <Textarea
            id="researchDesign"
            value={formData.researchDesign}
            onChange={(e) => handleChange("researchDesign", e.target.value)}
            placeholder="Describe your research design and methodology"
            className={`min-h-[120px] ${errors.researchDesign ? "border-red-500" : ""}`}
          />
          {errors.researchDesign && <p className="text-sm text-red-500 mt-1">{errors.researchDesign}</p>}
        </div>

        <div>
          <Label htmlFor="ethicalConsiderations" className="text-base">
            9. Ethical Considerations <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-2">(maximum 150 words)</span>
          </Label>
          <Textarea
            id="ethicalConsiderations"
            value={formData.ethicalConsiderations}
            onChange={(e) => handleChange("ethicalConsiderations", e.target.value)}
            placeholder="Describe the ethical considerations for your research"
            className={`min-h-[120px] ${errors.ethicalConsiderations ? "border-red-500" : ""}`}
          />
          {errors.ethicalConsiderations && <p className="text-sm text-red-500 mt-1">{errors.ethicalConsiderations}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {formData.ethicalConsiderations.split(" ").filter(Boolean).length}/150 words
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <Label className="text-base">
              10. Work Plan on Four Months Basis <span className="text-red-500">*</span>
            </Label>
            <Button type="button" onClick={addWorkPlanItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>

          {errors.workPlan && <p className="text-sm text-red-500 mb-2">{errors.workPlan}</p>}

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Time Input</TableHead>
                  <TableHead>Facilities</TableHead>
                  <TableHead>By Whom</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.workPlan.map((item: WorkPlanItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.activity}
                        onChange={(e) => updateWorkPlanItem(index, "activity", e.target.value)}
                        placeholder="Activity"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.timeInput}
                        onChange={(e) => updateWorkPlanItem(index, "timeInput", e.target.value)}
                        placeholder="Time input"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.facilities}
                        onChange={(e) => updateWorkPlanItem(index, "facilities", e.target.value)}
                        placeholder="Facilities"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.byWhom}
                        onChange={(e) => updateWorkPlanItem(index, "byWhom", e.target.value)}
                        placeholder="By whom"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.outcome}
                        onChange={(e) => updateWorkPlanItem(index, "outcome", e.target.value)}
                        placeholder="Outcome"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkPlanItem(index)}
                        disabled={formData.workPlan.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-sky-600 hover:bg-sky-700">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
