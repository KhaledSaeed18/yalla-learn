"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import type { Education } from "@/lib/resume/resume-types"
import { isValidDate, isValidGpa } from "@/lib/resume/validation"
import { FormField } from "@/components/ui/form-field"

interface EducationFormProps {
  data: Education[]
  updateData: (data: Education[]) => void
}

export default function EducationForm({ data, updateData }: EducationFormProps) {
  const [educations, setEducations] = useState<Education[]>(data)
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    const hasChanged = JSON.stringify(educations) !== JSON.stringify(data)
    if (hasChanged) {
      updateData(educations)
    }
  }, [educations])

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        institution: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
        highlights: [],
      },
    ])
  }

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index))

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const moveEducation = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === educations.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newEducations = [...educations]
    ;[newEducations[index], newEducations[newIndex]] = [newEducations[newIndex], newEducations[index]]
    setEducations(newEducations)

    setErrors((prev) => {
      const newErrors = { ...prev }
      const tempErrors = newErrors[index]
      newErrors[index] = newErrors[newIndex] || {}
      newErrors[newIndex] = tempErrors || {}
      return newErrors
    })
  }

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "startDate":
      case "endDate":
        return !isValidDate(value) ? "Please use MM/YYYY format or 'Present'" : ""
      case "gpa":
        return !isValidGpa(value) ? "Please enter a valid GPA (e.g., 3.5 or 3.5/4.0)" : ""
      default:
        return ""
    }
  }

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updatedEducations = [...educations]
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value,
    }
    setEducations(updatedEducations)

    if (field === "startDate" || field === "endDate" || field === "gpa") {
      const error = validateField(field as string, value as string)
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          [field]: error,
        },
      }))
    }
  }

  const addHighlight = (educationIndex: number) => {
    const updatedEducations = [...educations]
    updatedEducations[educationIndex].highlights.push("")
    setEducations(updatedEducations)
  }

  const updateHighlight = (educationIndex: number, highlightIndex: number, value: string) => {
    const updatedEducations = [...educations]
    updatedEducations[educationIndex].highlights[highlightIndex] = value
    setEducations(updatedEducations)
  }

  const removeHighlight = (educationIndex: number, highlightIndex: number) => {
    const updatedEducations = [...educations]
    updatedEducations[educationIndex].highlights = updatedEducations[educationIndex].highlights.filter(
      (_, i) => i !== highlightIndex,
    )
    setEducations(updatedEducations)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {educations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No education added yet. Click "Add Education" to get started.
        </div>
      )}

      {educations.map((education, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6">
            <div className="absolute right-4 top-4 flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => moveEducation(index, "up")} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveEducation(index, "down")}
                disabled={index === educations.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeEducation(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={education.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  placeholder="University or School Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={education.location}
                  onChange={(e) => updateEducation(index, "location", e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  value={education.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`field-${index}`}>Field of Study</Label>
                <Input
                  id={`field-${index}`}
                  value={education.field}
                  onChange={(e) => updateEducation(index, "field", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormField
                id={`startDate-${index}`}
                label="Start Date"
                value={education.startDate}
                onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                placeholder="MM/YYYY"
                error={errors[index]?.startDate}
              />

              <FormField
                id={`endDate-${index}`}
                label="End Date"
                value={education.endDate}
                onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                placeholder="MM/YYYY or Present"
                error={errors[index]?.endDate}
              />

              <FormField
                id={`gpa-${index}`}
                label="GPA"
                value={education.gpa}
                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                placeholder="3.8/4.0"
                error={errors[index]?.gpa}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Highlights/Activities</Label>
                <Button variant="outline" size="sm" onClick={() => addHighlight(index)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </div>

              {education.highlights.map((highlight, highlightIndex) => (
                <div key={highlightIndex} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, highlightIndex, e.target.value)}
                    placeholder="Dean's List, Relevant Coursework, etc."
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeHighlight(index, highlightIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {educations.length > 0 && (
        <Button onClick={addEducation} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Education
        </Button>
      )}
    </div>
  )
}

