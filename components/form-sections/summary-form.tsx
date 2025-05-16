"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SummaryFormProps {
  data: string
  updateData: (data: string) => void
}

export default function SummaryForm({ data, updateData }: SummaryFormProps) {
  const [summary, setSummary] = useState(data)

  useEffect(() => {
    if (summary !== data) {
      updateData(summary)
    }
  }, [summary])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Professional Summary</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Write a compelling summary that highlights your expertise and career goals</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={handleChange}
          placeholder="Experienced professional with a proven track record in..."
          className="min-h-[200px]"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Keep it concise (3-5 sentences)</li>
          <li>Highlight your most relevant skills and achievements</li>
          <li>Tailor it to the job you're applying for</li>
          <li>Include keywords from job descriptions to pass ATS screening</li>
        </ul>
      </div>
    </div>
  )
}

