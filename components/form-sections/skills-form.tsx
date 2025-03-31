"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SkillCategory } from "@/lib/resume/resume-types"

interface SkillsFormProps {
  data: SkillCategory[]
  updateData: (data: SkillCategory[]) => void
}

export default function SkillsForm({ data, updateData }: SkillsFormProps) {
  const [categories, setCategories] = useState<SkillCategory[]>(data)

  useEffect(() => {
    // Only update parent data when categories change and are different from props
    const hasChanged = JSON.stringify(categories) !== JSON.stringify(data)
    if (hasChanged) {
      updateData(categories)
    }
  }, [categories])

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: "",
        skills: [{ name: "", level: "Intermediate" }],
      },
    ])
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const moveCategory = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === categories.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newCategories = [...categories]
    ;[newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]]
    setCategories(newCategories)
  }

  const updateCategoryName = (index: number, name: string) => {
    const updatedCategories = [...categories]
    updatedCategories[index].name = name
    setCategories(updatedCategories)
  }

  const addSkill = (categoryIndex: number) => {
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].skills.push({ name: "", level: "Intermediate" })
    setCategories(updatedCategories)
  }

  const updateSkill = (categoryIndex: number, skillIndex: number, field: "name" | "level", value: string) => {
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].skills[skillIndex][field] = value
    setCategories(updatedCategories)
  }

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].skills = updatedCategories[categoryIndex].skills.filter((_, i) => i !== skillIndex)
    setCategories(updatedCategories)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button onClick={addCategory} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No skill categories added yet. Click "Add Category" to get started.
        </div>
      )}

      {categories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="relative">
          <CardContent className="pt-6">
            <div className="absolute right-4 top-4 flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveCategory(categoryIndex, "up")}
                disabled={categoryIndex === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveCategory(categoryIndex, "down")}
                disabled={categoryIndex === categories.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeCategory(categoryIndex)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`category-${categoryIndex}`}>Category Name</Label>
                <Input
                  id={`category-${categoryIndex}`}
                  value={category.name}
                  onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                  placeholder="Programming Languages, Tools, Soft Skills, etc."
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Skills</Label>
                  <Button variant="outline" size="sm" onClick={() => addSkill(categoryIndex)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>

                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(categoryIndex, skillIndex, "name", e.target.value)}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <Select
                      value={skill.level}
                      onValueChange={(value) => updateSkill(categoryIndex, skillIndex, "level", value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(categoryIndex, skillIndex)}
                      disabled={category.skills.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {categories.length > 0 && (
        <Button onClick={addCategory} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Category
        </Button>
      )}
    </div>
  )
}

