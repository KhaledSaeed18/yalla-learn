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
  resetResumeData: () => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
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

  const isFormEmpty = React.useMemo(() => {
    const hasPersonalInfo = Object.values(resumeData.personal).some((value) => value.trim() !== "")

    const hasSummary = resumeData.summary.trim() !== ""

    const hasExperience =
      resumeData.experience.length > 0 &&
      resumeData.experience.some(
        (exp) => exp.company.trim() !== "" || exp.position.trim() !== "" || exp.description.trim() !== "",
      )

    const hasEducation =
      resumeData.education.length > 0 &&
      resumeData.education.some((edu) => edu.institution.trim() !== "" || edu.degree.trim() !== "")

    const hasSkills =
      resumeData.skills.length > 0 &&
      resumeData.skills.some(
        (category) => category.name.trim() !== "" || category.skills.some((skill) => skill.name.trim() !== ""),
      )

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
      if (JSON.stringify(prev[section]) === JSON.stringify(data)) {
        return prev
      }
      return {
        ...prev,
        [section]: data,
      }
    })
  }

  const resetResumeData = () => {
    setResumeData(initialResumeData);
    window.location.reload();
  }

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateResumeSection,
        activeTemplate,
        setActiveTemplate,
        isFormEmpty,
        resetResumeData
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

