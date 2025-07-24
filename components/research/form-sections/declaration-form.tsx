"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeclarationFormProps {
  formData: any
  updateFormData: (data: any) => void
  onSubmit: () => void
  onPrevious: () => void
  isSubmitting: boolean
}

export function DeclarationForm({
  formData,
  updateFormData,
  onSubmit,
  onPrevious,
  isSubmitting,
}: DeclarationFormProps) {
  const [error, setError] = useState<string | null>(null)

  const handleDeclarationChange = (checked: boolean) => {
    updateFormData({ declaration: checked })
    if (checked && error) {
      setError(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.declaration) {
      setError("You must agree to the declaration to submit your application")
      return
    }

    onSubmit()
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-6">
        <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <AlertDescription>
            <strong>DECLARATION</strong>
            <br />
            By submitting this application, I declare that:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All information provided in this application is true and accurate to the best of my knowledge</li>
              <li>I understand that any false information may result in the rejection of my application</li>
              <li>I agree to comply with all university research policies and ethical guidelines</li>
              <li>I will use the research funds solely for the purposes outlined in this application</li>
              <li>I will submit progress reports and final reports as required by the university</li>
              <li>I will acknowledge the University of Kabianga in any publications resulting from this research</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox id="declaration" checked={formData.declaration} onCheckedChange={handleDeclarationChange} />
            <Label htmlFor="declaration" className="text-sm leading-relaxed cursor-pointer">
              I have read and agree to the above declaration. I understand that this application will be reviewed by the
              research committee and that approval is not guaranteed.
            </Label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-medium mb-2">Application Summary</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Research Title:</strong> {formData.title || "Not provided"}
            </p>
            <p>
              <strong>Theme:</strong> {formData.theme || "Not selected"}
            </p>
            <p>
              <strong>Campus:</strong> {formData.campus || "Not selected"}
            </p>
            <p>
              <strong>School:</strong> {formData.school || "Not selected"}
            </p>
            <p>
              <strong>Department:</strong> {formData.department || "Not selected"}
            </p>
            <p>
              <strong>Funds Requested:</strong> KShs.{" "}
              {formData.fundsRequested ? Number(formData.fundsRequested).toLocaleString() : "0"}
            </p>
            <p>
              <strong>Duration:</strong> {formData.startDate} to {formData.endDate}
            </p>
            <p>
              <strong>Collaborators:</strong> {formData.collaborators.filter((c: any) => c.name).length} researcher(s)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.declaration}
          className="bg-sky-600 hover:bg-sky-700"
        >
          <Check className="mr-2 h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  )
}
