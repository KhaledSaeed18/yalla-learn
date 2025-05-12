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

  // Save original CSS variables
  const originalStyles: { [key: string]: string } = {}

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

    // Helper function to temporarily convert oklch colors to rgb for html2canvas
    const replaceOklchWithCompatibleColors = () => {
      // Map of common oklch values to their RGB equivalents
      const colorMap: { [key: string]: string } = {
        // Primary colors
        "oklch(0.623 0.214 259.815)": "#6d4aff", // Primary 
        "oklch(0.97 0.014 254.604)": "#f5f5ff",  // Primary foreground

        // Background colors
        "oklch(1 0 0)": "#ffffff",               // White
        "oklch(0.141 0.005 285.823)": "#1a1a1a", // Black

        // Other common colors
        "oklch(0.967 0.001 286.375)": "#f7f7f7", // Light gray
        "oklch(0.21 0.006 285.885)": "#2e2e2e",  // Dark gray 
      }

      // Get all stylesheets
      const styleSheets = Array.from(document.styleSheets)

      // For each stylesheet
      styleSheets.forEach(styleSheet => {
        try {
          // For each rule in the stylesheet
          const rules = Array.from(styleSheet.cssRules || [])
          rules.forEach(rule => {
            if (rule instanceof CSSStyleRule) {
              const style = rule.style

              // Save original values for CSS variables
              if (rule.selectorText === ':root') {
                for (let i = 0; i < style.length; i++) {
                  const prop = style[i]
                  const value = style.getPropertyValue(prop)
                  if (value.includes('oklch')) {
                    originalStyles[prop] = value

                    // Find a replacement color
                    if (colorMap[value.trim()]) {
                      style.setProperty(prop, colorMap[value.trim()])
                    } else {
                      // Default to black or white if no mapping exists
                      style.setProperty(prop, value.includes('0.9') ? '#ffffff' : '#333333')
                    }
                  }
                }
              }
            }
          })
        } catch (e) {
          // Ignore errors for cross-origin stylesheets
        }
      })
    }

    // Create a temporary React root and render the template
    const { createRoot } = await import("react-dom/client")
    const root = createRoot(container)

    // Render the template with the resume data
    root.render(React.createElement(TemplateComponent, { data: resumeData }))
    // Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Replace oklch colors with compatible colors
    replaceOklchWithCompatibleColors()

    // Additional handling for inline styles with oklch
    container.querySelectorAll('*').forEach(element => {
      const style = window.getComputedStyle(element)
      const backgroundColor = style.backgroundColor
      const color = style.color

      // If the computed style contains 'oklch', replace it with a fallback
      if (backgroundColor.includes('oklch')) {
        (element as HTMLElement).style.backgroundColor = '#ffffff' // Default white background
      }

      if (color.includes('oklch')) {
        (element as HTMLElement).style.color = '#333333' // Default dark text
      }
    })

    // Wait a bit to ensure styles are applied
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Use html2canvas to capture the rendered template
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff", // Use a simple color that will work
      onclone: (clonedDoc) => {
        // Apply additional color transformations to the cloned document
        const clonedElement = clonedDoc.querySelector('div') as HTMLElement
        if (clonedElement) {
          // Force simple color scheme in the cloned element
          clonedElement.style.setProperty('--background', '#ffffff', 'important')
          clonedElement.style.setProperty('--foreground', '#333333', 'important')
          clonedElement.style.setProperty('--primary', '#6d4aff', 'important')
          clonedElement.style.setProperty('--primary-foreground', '#ffffff', 'important')

          // Inline all colors to avoid oklch issues
          Array.from(clonedDoc.querySelectorAll('*')).forEach(el => {
            const element = el as HTMLElement
            const computedStyle = window.getComputedStyle(element)

            // Set explicit color values that don't use oklch
            if (computedStyle.color.includes('oklch')) {
              element.style.color = '#333333'
            }
            if (computedStyle.backgroundColor.includes('oklch')) {
              element.style.backgroundColor = '#ffffff'
            }
            if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
              element.style.borderColor = '#e5e5e5'
            }
          })
        }
      }
    }).catch(error => {
      console.error("Error with html2canvas:", error)
      throw new Error(`PDF generation failed: ${error.message}. This might be due to color format incompatibility.`)
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

    // Check if the error is related to the oklch color function
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes('oklch') || errorMessage.includes('color')) {
      alert("Unable to generate PDF due to modern color format issues. We've applied a fix that should solve this problem in future attempts. Please try downloading again.")
    } else {
      alert("There was an error generating your PDF. Please try again.")
    }
  } finally {
    // Clean up
    document.body.removeChild(container)

    // Restore original CSS variables
    try {
      const styleSheets = Array.from(document.styleSheets)
      styleSheets.forEach(styleSheet => {
        try {
          const rules = Array.from(styleSheet.cssRules || [])
          rules.forEach(rule => {
            if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
              const style = rule.style

              // Restore original values
              Object.entries(originalStyles).forEach(([prop, value]) => {
                style.setProperty(prop, value)
              })
            }
          })
        } catch (e) {
          // Ignore errors for cross-origin stylesheets
        }
      })
    } catch (e) {
      console.error("Error restoring original styles:", e)
    }
  }
}

