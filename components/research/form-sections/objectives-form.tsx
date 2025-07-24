"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface ObjectivesFormProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function ObjectivesForm({ formData, updateFormData, onNext, onPrevious }: ObjectivesFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.objectives) newErrors.objectives = "Research objectives are required"
    if (!formData.significance) newErrors.significance = "Significance and justification are required"

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

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="objectives" className="text-base">
            6a. Research Objectives <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-2">(clearly give the specific objectives of this research)</span>
          </Label>
          <Textarea
            id="objectives"
            value={formData.objectives}
            onChange={(e) => handleChange("objectives", e.target.value)}
            placeholder="Enter the specific objectives of your research"
            className={`min-h-[120px] ${errors.objectives ? "border-red-500" : ""}`}
          />
          {errors.objectives && <p className="text-sm text-red-500 mt-1">{errors.objectives}</p>}
        </div>

        <div>
          <Label htmlFor="researchQuestions" className="text-base">
            6b. Research Questions/Hypothesis (if applicable)
          </Label>
          <Textarea
            id="researchQuestions"
            value={formData.researchQuestions}
            onChange={(e) => handleChange("researchQuestions", e.target.value)}
            placeholder="Enter your research questions or hypothesis"
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="significance" className="text-base">
            7. Significance and Justification <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-2">(maximum 150 words)</span>
          </Label>
          <Textarea
            id="significance"
            value={formData.significance}
            onChange={(e) => handleChange("significance", e.target.value)}
            placeholder="Explain the significance and justification of your research"
            className={`min-h-[120px] ${errors.significance ? "border-red-500" : ""}`}
          />
          {errors.significance && <p className="text-sm text-red-500 mt-1">{errors.significance}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {formData.significance.split(" ").filter(Boolean).length}/150 words
          </p>
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
