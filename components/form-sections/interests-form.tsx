"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface InterestsFormProps {
  data: string[]
  updateData: (data: string[]) => void
}

export default function InterestsForm({ data, updateData }: InterestsFormProps) {
  const [interests, setInterests] = useState<string[]>(data.length ? data : [""])

  useEffect(() => {
    const filteredInterests = interests.filter((interest) => interest.trim() !== "")
    const hasChanged = JSON.stringify(filteredInterests) !== JSON.stringify(data)

    if (hasChanged) {
      updateData(filteredInterests)
    }
  }, [interests])

  const addInterest = () => {
    setInterests([...interests, ""])
  }

  const updateInterest = (index: number, value: string) => {
    const updatedInterests = [...interests]
    updatedInterests[index] = value
    setInterests(updatedInterests)
  }

  const removeInterest = (index: number) => {
    if (interests.length <= 1) {
      setInterests([""])
    } else {
      setInterests(interests.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hobbies & Interests</h2>
        <Button onClick={addInterest} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Interest
        </Button>
      </div>

      <div className="space-y-4">
        <Label>List your hobbies and interests (optional)</Label>

        {interests.map((interest, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={interest}
              onChange={(e) => updateInterest(index, e.target.value)}
              placeholder="Reading, Photography, Hiking, etc."
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeInterest(index)}
              disabled={interests.length <= 1 && interest === ""}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={addInterest} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Another Interest
      </Button>
    </div>
  )
}

