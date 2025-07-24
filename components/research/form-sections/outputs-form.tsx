"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface OutputsFormProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function OutputsForm({ formData, updateFormData, onNext, onPrevious }: OutputsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.expectedOutputs) newErrors.expectedOutputs = "Expected outputs are required"
    if (!formData.dissemination) newErrors.dissemination = "Dissemination plan is required"

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
          <Label htmlFor="expectedOutputs" className="text-base">
            12. Expected Outputs <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="expectedOutputs"
            value={formData.expectedOutputs}
            onChange={(e) => handleChange("expectedOutputs", e.target.value)}
            placeholder="Describe the expected outputs of your research"
            className={`min-h-[120px] ${errors.expectedOutputs ? "border-red-500" : ""}`}
          />
          {errors.expectedOutputs && <p className="text-sm text-red-500 mt-1">{errors.expectedOutputs}</p>}
        </div>

        <div>
          <Label htmlFor="socioEconomicImpact" className="text-base">
            13. Socio-Economic Impact of Proposed Research (if applicable)
          </Label>
          <Textarea
            id="socioEconomicImpact"
            value={formData.socioEconomicImpact}
            onChange={(e) => handleChange("socioEconomicImpact", e.target.value)}
            placeholder="Describe the socio-economic impact of your research"
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="dissemination" className="text-base">
            14. Dissemination of Research Findings <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-2">(include the mechanisms to be used)</span>
          </Label>
          <Textarea
            id="dissemination"
            value={formData.dissemination}
            onChange={(e) => handleChange("dissemination", e.target.value)}
            placeholder="Describe how you will disseminate your research findings"
            className={`min-h-[120px] ${errors.dissemination ? "border-red-500" : ""}`}
          />
          {errors.dissemination && <p className="text-sm text-red-500 mt-1">{errors.dissemination}</p>}
        </div>

        <div>
          <Label htmlFor="publications" className="text-base">
            15. List of Relevant Publications
            <span className="text-sm text-gray-500 ml-2">
              (for the past five years and not more than five papers per researcher)
            </span>
          </Label>
          <Textarea
            id="publications"
            value={formData.publications}
            onChange={(e) => handleChange("publications", e.target.value)}
            placeholder="List relevant publications in the format: Author(s), (year), Title, Publisher, Volume, Pages"
            className="min-h-[120px]"
          />
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
