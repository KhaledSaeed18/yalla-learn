"use client"

import type { ResumeData } from "@/lib/resume/resume-types"
import ProfessionalTemplate from "../resume-templates/professional-template"
import ModernTemplate from "../resume-templates/modern-template"
import MinimalTemplate from "../resume-templates/minimal-template"
import CreativeTemplate from "../resume-templates/creative-template"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useResumeContext } from "@/lib/resume/resume-context"

interface ResumePreviewProps {
  data?: ResumeData
  template?: string
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const { resumeData, activeTemplate } = useResumeContext()
  const isMobile = useMediaQuery("(max-width: 767px)")

  const previewData = data || resumeData
  const previewTemplate = template || activeTemplate

  const renderTemplate = () => {
    switch (previewTemplate) {
      case "professional":
        return <ProfessionalTemplate data={previewData} />
      case "modern":
        return <ModernTemplate data={previewData} />
      case "minimal":
        return <MinimalTemplate data={previewData} />
      case "creative":
        return <CreativeTemplate data={previewData} />
      default:
        return <ProfessionalTemplate data={previewData} />
    }
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div
        className={`w-full mx-auto ${isMobile ? "scale-[0.85] origin-top" : "max-w-[800px]"}`}
        style={{
          minHeight: isMobile ? "500px" : "auto",
          transformOrigin: "top center",
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  )
}

