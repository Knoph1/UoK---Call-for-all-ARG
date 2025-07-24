"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"

const researchThemes = [
  "Food Security",
  "Natural Resources",
  "Health & Nutrition",
  "Environmental Conservation",
  "Community Development",
  "Gender",
  "Education",
  "Human Resource Development",
  "Socio-Cultural Issues",
  "Entrepreneurship",
  "Legal Issues",
  "Natural Sciences",
  "Others",
]

const campuses = ["Main Campus", "Town Campus", "Kapkatet Campus"]

const schoolsAndDepartments = [
  {
    school: "School of Education, Arts and Social Sciences",
    departments: [
      "Curriculum Instruction and Educational Media",
      "Humanities and Social Sciences",
      "Linguistics, Literature & Communication",
    ],
  },
  {
    school: "School of Business and Economics",
    departments: ["Marketing, Management Science, Tourism & Hospitality", "Finance, Accounting & Economics"],
  },
  {
    school: "School of Agricultural Sciences and Natural Resources",
    departments: [
      "Agro-forestry, Environmental Studies and Integrated Natural Resources Management",
      "Agricultural Bio-systems, Economics and Horticulture",
    ],
  },
  {
    school: "School of Health Sciences",
    departments: [
      "Department of Clinical Medicine and Optometry",
      "Department of Public Health",
      "Department of Nursing and Nutritional Sciences",
    ],
  },
  {
    school: "School of Science and Technology",
    departments: [
      "Biological Sciences",
      "Computing, Information Science and Knowledge Management",
      "Mathematics, Actuarial and Physical Sciences",
    ],
  },
]

interface BasicDetailsFormProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
}

export function BasicDetailsForm({ formData, updateFormData, onNext }: BasicDetailsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title) newErrors.title = "Research title is required"
    if (!formData.theme) newErrors.theme = "Research theme is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (!formData.fundsRequested) newErrors.fundsRequested = "Requested funds amount is required"
    else if (isNaN(Number(formData.fundsRequested))) newErrors.fundsRequested = "Funds must be a number"
    if (!formData.campus) newErrors.campus = "Campus is required"
    if (!formData.school) newErrors.school = "School is required"
    if (!formData.department) newErrors.department = "Department is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    if (formData.school) {
      const selectedSchool = schoolsAndDepartments.find((s) => s.school === formData.school)
      if (selectedSchool) {
        setDepartmentOptions(selectedSchool.departments)
        // Reset department if school changes
        if (!selectedSchool.departments.includes(formData.department)) {
          updateFormData({ department: "" })
        }
      }
    } else {
      setDepartmentOptions([])
    }
  }, [formData.school, updateFormData, formData.department])

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
          <Label htmlFor="title" className="text-base">
            1. Research Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter the title of your research"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="theme" className="text-base">
            2. Theme of Application <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.theme} onValueChange={(value) => handleChange("theme", value)}>
            <SelectTrigger id="theme" className={errors.theme ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a research theme" />
            </SelectTrigger>
            <SelectContent>
              {researchThemes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.theme && <p className="text-sm text-red-500 mt-1">{errors.theme}</p>}
        </div>

        <div>
          <Label htmlFor="campus" className="text-base">
            Campus <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.campus} onValueChange={(value) => handleChange("campus", value)}>
            <SelectTrigger id="campus" className={errors.campus ? "border-red-500" : ""}>
              <SelectValue placeholder="Select campus" />
            </SelectTrigger>
            <SelectContent>
              {campuses.map((campus) => (
                <SelectItem key={campus} value={campus}>
                  {campus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.campus && <p className="text-sm text-red-500 mt-1">{errors.campus}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="school" className="text-base">
              School/Faculty <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.school} onValueChange={(value) => handleChange("school", value)}>
              <SelectTrigger id="school" className={errors.school ? "border-red-500" : ""}>
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent>
                {schoolsAndDepartments.map((item) => (
                  <SelectItem key={item.school} value={item.school}>
                    {item.school}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.school && <p className="text-sm text-red-500 mt-1">{errors.school}</p>}
          </div>
          <div>
            <Label htmlFor="department" className="text-base">
              Department <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleChange("department", value)}
              disabled={!formData.school}
            >
              <SelectTrigger id="department" className={errors.department ? "border-red-500" : ""}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fundsRequested" className="text-base">
              4a. Funds Requested (KShs.) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fundsRequested"
              value={formData.fundsRequested}
              onChange={(e) => handleChange("fundsRequested", e.target.value)}
              placeholder="Enter amount in KShs."
              className={errors.fundsRequested ? "border-red-500" : ""}
            />
            {errors.fundsRequested && <p className="text-sm text-red-500 mt-1">{errors.fundsRequested}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-base">
              4b. Expected Date of Commencement <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <Label htmlFor="endDate" className="text-base">
              4c. Expected Date of Termination <span className="text-red-500">*</span>
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} className="bg-sky-600 hover:bg-sky-700">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
