"use client"

import type { ResumeData } from "./resume-types"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import React from "react"

export const generatePDF = async (resumeData: ResumeData, template: string) => {
  // Create a temporary container to render the resume
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "-9999px"
  container.style.width = "800px" // Fixed width for PDF

  // Add the container to the body
  document.body.appendChild(container)

  try {
    // Import the correct template component based on the template name
    let TemplateComponent

    switch (template) {
      case "professional":
        const { default: ProfessionalTemplate } = await import("../../components/resume-templates/professional-template")
        TemplateComponent = ProfessionalTemplate
        break
      case "modern":
        const { default: ModernTemplate } = await import("../../components/resume-templates/modern-template")
        TemplateComponent = ModernTemplate
        break
      case "minimal":
        const { default: MinimalTemplate } = await import("../../components/resume-templates/minimal-template")
        TemplateComponent = MinimalTemplate
        break
      case "creative":
        const { default: CreativeTemplate } = await import("../../components/resume-templates/creative-template")
        TemplateComponent = CreativeTemplate
        break
      default:
        const { default: DefaultTemplate } = await import("../../components/resume-templates/professional-template")
        TemplateComponent = DefaultTemplate
    }

    // Create a temporary React root and render the template
    const { createRoot } = await import("react-dom/client")
    const root = createRoot(container)

    // Render the template with the resume data
    root.render(React.createElement(TemplateComponent, { data: resumeData }))
    // Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Use html2canvas to capture the rendered template
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Calculate the PDF dimensions (A4 size)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const canvasRatio = canvas.height / canvas.width
    const imgWidth = pdfWidth
    const imgHeight = pdfWidth * canvasRatio

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    // If the resume is longer than one page, add additional pages
    if (imgHeight > pdfHeight) {
      let remainingHeight = imgHeight
      let currentPosition = 0

      while (remainingHeight > pdfHeight) {
        currentPosition += pdfHeight
        remainingHeight -= pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, -currentPosition, imgWidth, imgHeight)
      }
    }

    // Save the PDF
    pdf.save(`${resumeData.personal.name || "resume"}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("There was an error generating your PDF. Please try again.")
  } finally {
    // Clean up
    document.body.removeChild(container)
  }
}

