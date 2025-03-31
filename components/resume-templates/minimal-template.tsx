import type { ResumeData } from "@/lib/resume/resume-types"

interface MinimalTemplateProps {
  data: ResumeData
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  return (
    <div className="p-8 font-sans text-sm">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{data.personal.name || "Your Name"}</h1>
        {data.personal.title && <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{data.personal.title}</p>}

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          {data.personal.github && <span>{data.personal.github}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">About</h2>
          <p className="text-gray-700 dark:text-gray-400">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between mb-1">
                <h3 className="font-semibold">
                  {exp.position} • {exp.company}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              {exp.location && <p className="text-gray-600 dark:text-gray-400 mb-1">{exp.location}</p>}
              {exp.description && <p className="text-gray-700 dark:text-gray-400 mb-1">{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-400">
                  {exp.achievements.map((achievement, i) => achievement.trim() && <li key={i}>{achievement}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between mb-1">
                <h3 className="font-semibold">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-400">
                {edu.institution}
                {edu.location && `, ${edu.location}`}
              </p>
              {edu.gpa && <p className="text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</p>}
              {edu.highlights.length > 0 && (
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-400 mt-1">
                  {edu.highlights.map((highlight, i) => highlight.trim() && <li key={i}>{highlight}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((category, index) => (
              <div key={index}>
                {category.name && <h3 className="font-semibold text-gray-700 dark:text-gray-400">{category.name}</h3>}
                <p className="text-gray-700 dark:text-gray-400">
                  {category.skills
                    .filter((skill) => skill.name.trim() !== "")
                    .map((skill) => skill.name)
                    .join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between mb-1">
                <h3 className="font-semibold">{project.name}</h3>
                {project.url && (
                  <a href={project.url} className="text-gray-600 dark:text-gray-400">
                    {project.url}
                  </a>
                )}
              </div>
              {project.description && <p className="text-gray-700 dark:text-gray-400 mb-1">{project.description}</p>}
              {project.technologies.length > 0 && (
                <p className="text-gray-700 dark:text-gray-400 mb-1">
                  <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
                </p>
              )}
              {project.highlights.length > 0 && (
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-400">
                  {project.highlights.map((highlight, i) => highlight.trim() && <li key={i}>{highlight}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Certifications</h2>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-400">
            {data.certifications.map(
              (cert, index) =>
                cert.name && (
                  <li key={index}>
                    {cert.name}
                    {cert.issuer && `, ${cert.issuer}`}
                    {cert.date && ` (${cert.date})`}
                  </li>
                ),
            )}
          </ul>
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Languages</h2>
          <p className="text-gray-700 dark:text-gray-400">
            {data.languages
              .filter((lang) => lang.name.trim() !== "")
              .map((lang) => `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ""}`)
              .join(", ")}
          </p>
        </section>
      )}

      {/* Interests */}
      {data.interests.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Interests</h2>
          <p className="text-gray-700 dark:text-gray-400">{data.interests.join(", ")}</p>
        </section>
      )}
    </div>
  )
}

