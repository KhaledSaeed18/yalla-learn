// Validation utility functions

// Email validation
export const isValidEmail = (email: string): boolean => {
  if (!email) return true // Allow empty email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// URL validation
export const isValidUrl = (url: string): boolean => {
  if (!url) return true // Allow empty URL
  try {
    // Check if it's a valid URL format
    const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/
    return urlRegex.test(url)
  } catch (e) {
    return false
  }
}

// Phone validation - Fixed the regex issue
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true // Allow empty phone
  // Accept various phone formats with optional country codes, parentheses, spaces, dashes
  const phoneRegex = /^(\+?\d{1,3}[- ]?)?(\d{3}|$$\d{3}$$)[- ]?\d{3}[- ]?\d{4}$/
  return phoneRegex.test(phone)
}

// Date validation (MM/YYYY format)
export const isValidDate = (date: string): boolean => {
  if (!date) return true // Allow empty date
  if (date.toLowerCase() === "present") return true // Allow "Present" as a valid date

  // Check MM/YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/
  if (!dateRegex.test(date)) return false

  // Extract month and year
  const [month, year] = date.split("/").map(Number)

  // Validate year is reasonable (between 1900 and current year + 10)
  const currentYear = new Date().getFullYear()
  if (year < 1900 || year > currentYear + 10) return false

  return true
}

// GPA validation
export const isValidGpa = (gpa: string): boolean => {
  if (!gpa) return true // Allow empty GPA

  // Check for formats like "3.5", "3.5/4.0", "3.5 / 4.0"
  const gpaRegex = /^(\d+(\.\d+)?)(\/\s*\d+(\.\d+)?)?$/
  return gpaRegex.test(gpa)
}

