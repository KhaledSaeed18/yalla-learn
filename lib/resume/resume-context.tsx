"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { ResumeData } from "./resume-types"
import { initialResumeData } from "./resume-types"

type ResumeContextType = {
  resumeData: ResumeData
  updateResumeSection: <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => void
  activeTemplate: string
  setActiveTemplate: (template: string) => void
  isFormEmpty: boolean
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    // Try to load from localStorage on initial render (client-side only)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resumeData")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse saved resume data:", e)
        }
      }
    }
    return initialResumeData
  })

  const [activeTemplate, setActiveTemplate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTemplate") || "professional"
    }
    return "professional"
  })

  // Calculate if form is empty
  const isFormEmpty = React.useMemo(() => {
    // Check if personal info has any data
    const hasPersonalInfo = Object.values(resumeData.personal).some((value) => value.trim() !== "")

    // Check if summary has data
    const hasSummary = resumeData.summary.trim() !== ""

    // Check if there are any experiences with data
    const hasExperience =
      resumeData.experience.length > 0 &&
      resumeData.experience.some(
        (exp) => exp.company.trim() !== "" || exp.position.trim() !== "" || exp.description.trim() !== "",
      )

    // Check if there are any education entries with data
    const hasEducation =
      resumeData.education.length > 0 &&
      resumeData.education.some((edu) => edu.institution.trim() !== "" || edu.degree.trim() !== "")

    // Check if there are any skills with data
    const hasSkills =
      resumeData.skills.length > 0 &&
      resumeData.skills.some(
        (category) => category.name.trim() !== "" || category.skills.some((skill) => skill.name.trim() !== ""),
      )

    // Return true if none of the sections have data
    return !hasPersonalInfo && !hasSummary && !hasExperience && !hasEducation && !hasSkills
  }, [resumeData])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
  }, [resumeData])

  useEffect(() => {
    localStorage.setItem("activeTemplate", activeTemplate)
  }, [activeTemplate])

  const updateResumeSection = <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => {
    setResumeData((prev) => {
      // Only update if the data has actually changed
      if (JSON.stringify(prev[section]) === JSON.stringify(data)) {
        return prev
      }
      return {
        ...prev,
        [section]: data,
      }
    })
  }

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateResumeSection,
        activeTemplate,
        setActiveTemplate,
        isFormEmpty,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResumeContext() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error("useResumeContext must be used within a ResumeProvider")
  }
  return context
}

