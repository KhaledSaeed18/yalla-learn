"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import type { Certification } from "@/lib/resume/resume-types"
import { isValidDate, isValidUrl } from "@/lib/resume/validation"
import { FormField } from "@/components/ui/form-field"

interface CertificationsFormProps {
  data: Certification[]
  updateData: (data: Certification[]) => void
}

export default function CertificationsForm({ data, updateData }: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<Certification[]>(data)
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    const hasChanged = JSON.stringify(certifications) !== JSON.stringify(data)
    if (hasChanged) {
      updateData(certifications)
    }
  }, [certifications])

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: "",
        issuer: "",
        date: "",
        url: "",
      },
    ])
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const moveCertification = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === certifications.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newCertifications = [...certifications]
    ;[newCertifications[index], newCertifications[newIndex]] = [newCertifications[newIndex], newCertifications[index]]
    setCertifications(newCertifications)

    setErrors((prev) => {
      const newErrors = { ...prev }
      const tempErrors = newErrors[index]
      newErrors[index] = newErrors[newIndex] || {}
      newErrors[newIndex] = tempErrors || {}
      return newErrors
    })
  }

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "date":
        return !isValidDate(value) ? "Please use MM/YYYY format" : ""
      case "url":
        return !isValidUrl(value) ? "Please enter a valid URL" : ""
      default:
        return ""
    }
  }

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updatedCertifications = [...certifications]
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    }
    setCertifications(updatedCertifications)

    if (field === "date" || field === "url") {
      const error = validateField(field, value)
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          [field]: error,
        },
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Certifications & Awards</h2>
        <Button onClick={addCertification} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No certifications added yet. Click "Add Certification" to get started.
        </div>
      )}

      {certifications.map((certification, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6">
            <div className="absolute right-4 top-4 flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => moveCertification(index, "up")} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveCertification(index, "down")}
                disabled={index === certifications.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeCertification(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`cert-name-${index}`}>Certification Name</Label>
                <Input
                  id={`cert-name-${index}`}
                  value={certification.name}
                  onChange={(e) => updateCertification(index, "name", e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization</Label>
                <Input
                  id={`cert-issuer-${index}`}
                  value={certification.issuer}
                  onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id={`cert-date-${index}`}
                label="Date"
                value={certification.date}
                onChange={(e) => updateCertification(index, "date", e.target.value)}
                placeholder="MM/YYYY"
                error={errors[index]?.date}
              />

              <FormField
                id={`cert-url-${index}`}
                label="URL (Optional)"
                value={certification.url}
                onChange={(e) => updateCertification(index, "url", e.target.value)}
                placeholder="https://credential-url.com"
                error={errors[index]?.url}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {certifications.length > 0 && (
        <Button onClick={addCertification} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Certification
        </Button>
      )}
    </div>
  )
}

