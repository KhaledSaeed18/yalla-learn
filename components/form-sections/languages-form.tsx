"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Language } from "@/lib/resume/resume-types"

interface LanguagesFormProps {
  data: Language[]
  updateData: (data: Language[]) => void
}

export default function LanguagesForm({ data, updateData }: LanguagesFormProps) {
  const [languages, setLanguages] = useState<Language[]>(data)

  useEffect(() => {
    // Only update parent data when languages change and are different from props
    const hasChanged = JSON.stringify(languages) !== JSON.stringify(data)
    if (hasChanged) {
      updateData(languages)
    }
  }, [languages])

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        name: "",
        proficiency: "Intermediate",
      },
    ])
  }

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  const moveLanguage = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === languages.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newLanguages = [...languages]
    ;[newLanguages[index], newLanguages[newIndex]] = [newLanguages[newIndex], newLanguages[index]]
    setLanguages(newLanguages)
  }

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const updatedLanguages = [...languages]
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value,
    }
    setLanguages(updatedLanguages)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Languages</h2>
        <Button onClick={addLanguage} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      {languages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No languages added yet. Click "Add Language" to get started.
        </div>
      )}

      {languages.map((language, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6">
            <div className="absolute right-4 top-4 flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => moveLanguage(index, "up")} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveLanguage(index, "down")}
                disabled={index === languages.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeLanguage(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`language-name-${index}`}>Language</Label>
                <Input
                  id={`language-name-${index}`}
                  value={language.name}
                  onChange={(e) => updateLanguage(index, "name", e.target.value)}
                  placeholder="English, Spanish, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`language-proficiency-${index}`}>Proficiency</Label>
                <Select
                  value={language.proficiency}
                  onValueChange={(value) => updateLanguage(index, "proficiency", value)}
                >
                  <SelectTrigger id={`language-proficiency-${index}`}>
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="Limited Working">Limited Working</SelectItem>
                    <SelectItem value="Professional Working">Professional Working</SelectItem>
                    <SelectItem value="Full Professional">Full Professional</SelectItem>
                    <SelectItem value="Native/Bilingual">Native/Bilingual</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Fluent">Fluent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {languages.length > 0 && (
        <Button onClick={addLanguage} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Language
        </Button>
      )}
    </div>
  )
}

