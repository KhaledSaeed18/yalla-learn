"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { PersonalInfo } from "@/lib/resume/resume-types"
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/resume/validation"
import { FormField } from "@/components/ui/form-field"
import { useSelector } from "react-redux"

interface PersonalInfoFormProps {
  data: PersonalInfo
  updateData: (data: PersonalInfo) => void
}

export default function PersonalInfoForm({ data, updateData }: PersonalInfoFormProps) {

  const user = useSelector((state: any) => state.auth.user)
  const firstName = user?.firstName || ""
  const lastName = user?.lastName || ""
  const fullName = `${firstName} ${lastName}`
  const email = user?.email || ""

  const [formData, setFormData] = useState<PersonalInfo>({
    ...data,
    name: data.name || fullName,
    email: data.email || email
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(data)
    if (hasChanged) {
      updateData(formData)
    }
  }, [formData])

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        return !isValidEmail(value) ? "Please enter a valid email address" : ""
      case "phone":
        return !isValidPhone(value) ? "Please enter a valid phone number" : ""
      case "website":
      case "linkedin":
      case "github":
        return !isValidUrl(value) ? "Please enter a valid URL" : ""
      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
        />

        <FormField
          id="title"
          label="Professional Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Software Engineer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
          error={errors.email}
        />

        <FormField
          id="phone"
          label="Phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(123) 456-7890"
          error={errors.phone}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
          placeholder="New York, NY"
        />

        <FormField
          id="website"
          label="Website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://johndoe.com"
          error={errors.website}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="linkedin"
          label="LinkedIn"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="linkedin.com/in/johndoe"
          error={errors.linkedin}
        />

        <FormField
          id="github"
          label="GitHub"
          value={formData.github}
          onChange={handleChange}
          placeholder="github.com/johndoe"
          error={errors.github}
        />
      </div>
    </div>
  )
}

