"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import type { WorkExperience } from "@/lib/resume/resume-types"
import { isValidDate } from "@/lib/resume/validation"
import { FormField } from "@/components/ui/form-field"

interface WorkExperienceFormProps {
  data: WorkExperience[]
  updateData: (data: WorkExperience[]) => void
}

export default function WorkExperienceForm({ data, updateData }: WorkExperienceFormProps) {
  const [experiences, setExperiences] = useState<WorkExperience[]>(data)
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    // Only update parent data when experiences change and are different from props
    const hasChanged = JSON.stringify(experiences) !== JSON.stringify(data)
    if (hasChanged) {
      updateData(experiences)
    }
  }, [experiences])

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: [""],
      },
    ])
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))

    // Remove errors for this experience
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const moveExperience = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === experiences.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newExperiences = [...experiences]
      ;[newExperiences[index], newExperiences[newIndex]] = [newExperiences[newIndex], newExperiences[index]]
    setExperiences(newExperiences)

    // Swap errors too
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
      default:
        return ""
    }
  }

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    }
    setExperiences(updatedExperiences)

    // Validate date fields
    if (field === "startDate" || field === "endDate") {
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

  const addAchievement = (experienceIndex: number) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[experienceIndex].achievements.push("")
    setExperiences(updatedExperiences)
  }

  const updateAchievement = (experienceIndex: number, achievementIndex: number, value: string) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[experienceIndex].achievements[achievementIndex] = value
    setExperiences(updatedExperiences)
  }

  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[experienceIndex].achievements = updatedExperiences[experienceIndex].achievements.filter(
      (_, i) => i !== achievementIndex,
    )
    setExperiences(updatedExperiences)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No work experience added yet. Click "Add Experience" to get started.
        </div>
      )}

      {experiences.map((experience, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6">
            <div className="absolute right-4 top-4 flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => moveExperience(index, "up")} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveExperience(index, "down")}
                disabled={index === experiences.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeExperience(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input
                  id={`company-${index}`}
                  value={experience.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`position-${index}`}>Position</Label>
                <Input
                  id={`position-${index}`}
                  value={experience.position}
                  onChange={(e) => updateExperience(index, "position", e.target.value)}
                  placeholder="Job Title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={experience.location}
                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <FormField
                id={`startDate-${index}`}
                label="Start Date"
                value={experience.startDate}
                onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                placeholder="MM/YYYY"
                error={errors[index]?.startDate}
              />

              <FormField
                id={`endDate-${index}`}
                label="End Date"
                value={experience.endDate}
                onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                placeholder="MM/YYYY or Present"
                error={errors[index]?.endDate}
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor={`description-${index}`}>Job Description</Label>
              <Textarea
                id={`description-${index}`}
                value={experience.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                placeholder="Describe your responsibilities and role"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Key Achievements</Label>
                <Button variant="outline" size="sm" onClick={() => addAchievement(index)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>

              {experience.achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex gap-2">
                  <Input
                    value={achievement}
                    onChange={(e) => updateAchievement(index, achievementIndex, e.target.value)}
                    placeholder="Describe a specific achievement or result"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAchievement(index, achievementIndex)}
                    disabled={experience.achievements.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {experiences.length > 0 && (
        <Button onClick={addExperience} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Experience
        </Button>
      )}
    </div>
  )
}

