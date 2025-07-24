"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react"

interface Collaborator {
  name: string
  position: string
  institution: string
  researchArea: string
  experience: string
}

interface CollaboratorsFormProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function CollaboratorsForm({ formData, updateFormData, onNext, onPrevious }: CollaboratorsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    // Collaborators are optional, so we just validate that if any are provided, they have complete information
    const newErrors: Record<string, string> = {}

    formData.collaborators.forEach((collaborator: Collaborator, index: number) => {
      if (collaborator.name && !collaborator.position) {
        newErrors[`position-${index}`] = "Position is required"
      }
      if (collaborator.name && !collaborator.institution) {
        newErrors[`institution-${index}`] = "Institution is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const addCollaborator = () => {
    updateFormData({
      collaborators: [
        ...formData.collaborators,
        { name: "", position: "", institution: "", researchArea: "", experience: "" },
      ],
    })
  }

  const removeCollaborator = (index: number) => {
    const updatedCollaborators = [...formData.collaborators]
    updatedCollaborators.splice(index, 1)
    updateFormData({ collaborators: updatedCollaborators })
  }

  const updateCollaborator = (index: number, field: keyof Collaborator, value: string) => {
    const updatedCollaborators = [...formData.collaborators]
    updatedCollaborators[index] = {
      ...updatedCollaborators[index],
      [field]: value,
    }
    updateFormData({ collaborators: updatedCollaborators })

    // Clear error when field is updated
    const errorKey = `${field}-${index}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-base font-medium">5. Collaborating Researcher(s)</Label>
          <Button type="button" onClick={addCollaborator} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Collaborator
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position & Institution</TableHead>
                <TableHead>Research Area</TableHead>
                <TableHead>Relevant Experience</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.collaborators.map((collaborator: Collaborator, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={collaborator.name}
                      onChange={(e) => updateCollaborator(index, "name", e.target.value)}
                      placeholder="Full name"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Input
                        value={collaborator.position}
                        onChange={(e) => updateCollaborator(index, "position", e.target.value)}
                        placeholder="Position"
                        className={errors[`position-${index}`] ? "border-red-500" : ""}
                      />
                      {errors[`position-${index}`] && (
                        <p className="text-xs text-red-500">{errors[`position-${index}`]}</p>
                      )}
                      <Input
                        value={collaborator.institution}
                        onChange={(e) => updateCollaborator(index, "institution", e.target.value)}
                        placeholder="Institution"
                        className={errors[`institution-${index}`] ? "border-red-500" : ""}
                      />
                      {errors[`institution-${index}`] && (
                        <p className="text-xs text-red-500">{errors[`institution-${index}`]}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={collaborator.researchArea}
                      onChange={(e) => updateCollaborator(index, "researchArea", e.target.value)}
                      placeholder="Research area"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={collaborator.experience}
                      onChange={(e) => updateCollaborator(index, "experience", e.target.value)}
                      placeholder="Relevant experience"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCollaborator(index)}
                      disabled={formData.collaborators.length === 1}
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
