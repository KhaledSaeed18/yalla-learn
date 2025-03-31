"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Save } from "lucide-react"
import PersonalInfoForm from "../form-sections/personal-info-form"
import SummaryForm from "../form-sections/summary-form"
import WorkExperienceForm from "../form-sections/work-experience-form"
import EducationForm from "../form-sections/education-form"
import SkillsForm from "../form-sections/skills-form"
import CertificationsForm from "../form-sections/certifications-form"
import ProjectsForm from "../form-sections/projects-form"
import LanguagesForm from "../form-sections/languages-form"
import InterestsForm from "../form-sections/interests-form"
import ResumePreview from "./resume-preview"
import TemplateSelector from "./template-selector"
import { useResumeContext } from "@/lib/resume/resume-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { generatePDF } from "@/lib/resume/pdf-generator"

export default function ResumeBuilder() {
  // Use the context instead of local state
  const { resumeData, updateResumeSection, activeTemplate, setActiveTemplate, isFormEmpty } = useResumeContext()

  const [previewCollapsed, setPreviewCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isSmallScreen = useMediaQuery("(max-width: 639px)")

  // Reset preview collapsed state when screen size changes
  useEffect(() => {
    setPreviewCollapsed(false)
  }, [isMobile])

  const handleDownloadPDF = async () => {
    await generatePDF(resumeData, activeTemplate)
  }

  const handleSaveResume = () => {
    // Log the data to console
    console.log("Resume Data:", JSON.stringify(resumeData, null, 2))

    // Show a toast notification

    // In a real application, you would save to a database or file here
    // For now, we're just using localStorage which is already handled by the context
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Form Section */}
      <div className="w-full rounded-lg shadow-md p-6">
        <Tabs defaultValue="personal" className="w-full">
          {/* Fixed TabsList for better responsive behavior */}
          <div className="mb-4 overflow-x-auto">
            <TabsList className="inline-flex w-auto min-w-full">
              <TabsTrigger value="personal" className="flex-1 min-w-[100px]">
                Personal
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex-1 min-w-[100px]">
                Summary
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex-1 min-w-[100px]">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="flex-1 min-w-[100px]">
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex-1 min-w-[100px]">
                Skills
              </TabsTrigger>
              <TabsTrigger value="more" className="flex-1 min-w-[100px]">
                More
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="personal">
            <PersonalInfoForm data={resumeData.personal} updateData={(data) => updateResumeSection("personal", data)} />
          </TabsContent>

          <TabsContent value="summary">
            <SummaryForm data={resumeData.summary} updateData={(data) => updateResumeSection("summary", data)} />
          </TabsContent>

          <TabsContent value="experience">
            <WorkExperienceForm
              data={resumeData.experience}
              updateData={(data) => updateResumeSection("experience", data)}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationForm data={resumeData.education} updateData={(data) => updateResumeSection("education", data)} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsForm data={resumeData.skills} updateData={(data) => updateResumeSection("skills", data)} />
          </TabsContent>

          <TabsContent value="more">
            <Tabs defaultValue="certifications">
              {/* Fixed nested TabsList for better responsive behavior */}
              <div className="mb-4 overflow-x-auto">
                <TabsList className="inline-flex w-auto min-w-full">
                  <TabsTrigger value="certifications" className="flex-1 min-w-[120px]">
                    Certifications
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex-1 min-w-[80px]">
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="languages" className="flex-1 min-w-[100px]">
                    Languages
                  </TabsTrigger>
                  <TabsTrigger value="interests" className="flex-1 min-w-[80px]">
                    Interests
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="certifications">
                <CertificationsForm
                  data={resumeData.certifications}
                  updateData={(data) => updateResumeSection("certifications", data)}
                />
              </TabsContent>

              <TabsContent value="projects">
                <ProjectsForm data={resumeData.projects} updateData={(data) => updateResumeSection("projects", data)} />
              </TabsContent>

              <TabsContent value="languages">
                <LanguagesForm
                  data={resumeData.languages}
                  updateData={(data) => updateResumeSection("languages", data)}
                />
              </TabsContent>

              <TabsContent value="interests">
                <InterestsForm
                  data={resumeData.interests}
                  updateData={(data) => updateResumeSection("interests", data)}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Section */}
      <div className="w-full rounded-lg shadow-md overflow-hidden transition-all duration-300">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-xl font-semibold">Resume Preview</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={handleSaveResume}
                size="sm"
                className="flex items-center justify-center"
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleDownloadPDF}
                size="sm"
                className="flex items-center justify-center"
                disabled={isFormEmpty}
                title={isFormEmpty ? "Please fill out the form before downloading" : "Download your resume as PDF"}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          <TemplateSelector activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />

          <div
            className={`mt-4 border rounded-md transition-all duration-300 ease-in-out overflow-hidden hidden lg:block ${isMobile && previewCollapsed ? "max-h-0 p-0 opacity-0 border-0" : "max-h-[2000px] p-4 opacity-100"
              }`}
          >
            <div className="transform-gpu">
              <ResumePreview data={resumeData} template={activeTemplate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

