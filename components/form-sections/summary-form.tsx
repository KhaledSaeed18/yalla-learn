"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"

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

  const generateAISummary = () => {
    const aiSuggestions = [
      "Results-driven software engineer with 5+ years of experience developing scalable web applications. Proficient in JavaScript, React, and Node.js with a strong focus on code quality and performance optimization.",
      "Detail-oriented UX/UI designer with expertise in creating intuitive user experiences across multiple platforms. Skilled in user research, wireframing, and prototyping with a passion for accessibility and inclusive design.",
      "Strategic marketing professional with a proven track record of developing and executing successful campaigns that drive growth and engagement. Experienced in digital marketing, content strategy, and analytics.",
    ]

    setSummary(aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Professional Summary</h2>
        <Button variant="outline" size="sm" onClick={generateAISummary}>
          <Wand2 className="h-4 w-4 mr-2" />
          AI Suggest
        </Button>
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

