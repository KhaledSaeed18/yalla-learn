export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
}

export interface WorkExperience {
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa: string
  highlights: string[]
}

export interface Skill {
  name: string
  level: string
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface Certification {
  name: string
  issuer: string
  date: string
  url: string
}

export interface Project {
  name: string
  description: string
  url: string
  technologies: string[]
  highlights: string[]
}

export interface Language {
  name: string
  proficiency: string
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  experience: WorkExperience[]
  education: Education[]
  skills: SkillCategory[]
  certifications: Certification[]
  projects: Project[]
  languages: Language[]
  interests: string[]
}

export const initialResumeData: ResumeData = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  interests: [],
}

