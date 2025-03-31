"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import type { Project } from "@/lib/resume/resume-types"
import { isValidUrl } from "@/lib/resume/validation"
import { FormField } from "@/components/ui/form-field"

interface ProjectsFormProps {
  data: Project[]
  updateData: (data: Project[]) => void
}

export default function ProjectsForm({ data, updateData }: ProjectsFormProps) {
  const [projects, setProjects] = useState<Project[]>(data)
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    // Only update parent data when projects change and are different from props
    const hasChanged = JSON.stringify(projects) !== JSON.stringify(data)
    if (hasChanged) {
      updateData(projects)
    }
  }, [projects])

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        url: "",
        technologies: [],
        highlights: [""],
      },
    ])
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))

    // Remove errors for this project
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const moveProject = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === projects.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newProjects = [...projects]
    ;[newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]]
    setProjects(newProjects)

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
      case "url":
        return !isValidUrl(value) ? "Please enter a valid URL" : ""
      default:
        return ""
    }
  }

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }
    setProjects(updatedProjects)

    // Validate URL field
    if (field === "url") {
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

  const updateTechnologies = (index: number, value: string) => {
    const technologies = value
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech !== "")
    updateProject(index, "technologies", technologies)
  }

  const addHighlight = (projectIndex: number) => {
    const updatedProjects = [...projects]
    updatedProjects[projectIndex].highlights.push("")
    setProjects(updatedProjects)
  }

  const updateHighlight = (projectIndex: number, highlightIndex: number, value: string) => {
    const updatedProjects = [...projects]
    updatedProjects[projectIndex].highlights[highlightIndex] = value
    setProjects(updatedProjects)
  }

  const removeHighlight = (projectIndex: number, highlightIndex: number) => {
    const updatedProjects = [...projects]
    updatedProjects[projectIndex].highlights = updatedProjects[projectIndex].highlights.filter(
      (_, i) => i !== highlightIndex,
    )
    setProjects(updatedProjects)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button onClick={addProject} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No projects added yet. Click "Add Project" to get started.
        </div>
      )}

      {projects.map((project, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6">
            <div className="absolute right-4 top-4 flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => moveProject(index, "up")} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveProject(index, "down")}
                disabled={index === projects.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeProject(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                <Input
                  id={`project-name-${index}`}
                  value={project.name}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  placeholder="E-commerce Platform"
                />
              </div>

              <FormField
                id={`project-url-${index}`}
                label="URL (Optional)"
                value={project.url}
                onChange={(e) => updateProject(index, "url", e.target.value)}
                placeholder="https://github.com/username/project"
                error={errors[index]?.url}
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                placeholder="Brief description of the project"
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor={`project-technologies-${index}`}>Technologies Used</Label>
              <Input
                id={`project-technologies-${index}`}
                value={project.technologies.join(", ")}
                onChange={(e) => updateTechnologies(index, e.target.value)}
                placeholder="React, Node.js, MongoDB (comma separated)"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Key Highlights</Label>
                <Button variant="outline" size="sm" onClick={() => addHighlight(index)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </div>

              {project.highlights.map((highlight, highlightIndex) => (
                <div key={highlightIndex} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, highlightIndex, e.target.value)}
                    placeholder="Describe a key feature or achievement"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHighlight(index, highlightIndex)}
                    disabled={project.highlights.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {projects.length > 0 && (
        <Button onClick={addProject} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Project
        </Button>
      )}
    </div>
  )
}

