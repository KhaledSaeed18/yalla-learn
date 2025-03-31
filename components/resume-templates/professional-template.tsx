import type { ResumeData } from "@/lib/resume/resume-types"

interface ProfessionalTemplateProps {
  data: ResumeData
}

export default function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  return (
    <div className="p-8 font-sans text-sm">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-1">{data.personal.name || "Your Name"}</h1>
        {data.personal.title && <p className="text-lg mb-2">{data.personal.title}</p>}

        <div className="flex flex-wrap justify-center gap-x-4 text-sm">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 text-sm mt-1">
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          {data.personal.github && <span>{data.personal.github}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Professional Summary</h2>
          <p>{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Work Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="font-semibold">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p>{exp.location}</p>
                  <p>
                    {exp.startDate} - {exp.endDate}
                  </p>
                </div>
              </div>
              {exp.description && <p className="mt-1">{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul className="list-disc pl-5 mt-1">
                  {exp.achievements.map((achievement, i) => achievement.trim() && <li key={i}>{achievement}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="font-semibold">{edu.institution}</p>
                </div>
                <div className="text-right">
                  <p>{edu.location}</p>
                  <p>
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
              {edu.highlights.length > 0 && (
                <ul className="list-disc pl-5 mt-1">
                  {edu.highlights.map((highlight, i) => highlight.trim() && <li key={i}>{highlight}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((category, index) => (
              <div key={index}>
                {category.name && <h3 className="font-bold">{category.name}</h3>}
                <ul className="list-disc pl-5">
                  {category.skills.map(
                    (skill, i) =>
                      skill.name && (
                        <li key={i}>
                          {skill.name} {skill.level && `(${skill.level})`}
                        </li>
                      ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-bold">{project.name}</h3>
                {project.url && (
                  <a href={project.url} className="text-blue-600 underline">
                    {project.url}
                  </a>
                )}
              </div>
              {project.description && <p className="mt-1">{project.description}</p>}
              {project.technologies.length > 0 && (
                <p className="mt-1">
                  <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
                </p>
              )}
              {project.highlights.length > 0 && (
                <ul className="list-disc pl-5 mt-1">
                  {project.highlights.map((highlight, i) => highlight.trim() && <li key={i}>{highlight}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Certifications & Awards</h2>
          <ul className="list-disc pl-5">
            {data.certifications.map(
              (cert, index) =>
                cert.name && (
                  <li key={index}>
                    <span className="font-semibold">{cert.name}</span>
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
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Languages</h2>
          <ul className="list-disc pl-5">
            {data.languages.map(
              (lang, index) =>
                lang.name && (
                  <li key={index}>
                    {lang.name} {lang.proficiency && `(${lang.proficiency})`}
                  </li>
                ),
            )}
          </ul>
        </section>
      )}

      {/* Interests */}
      {data.interests.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Interests</h2>
          <p>{data.interests.join(", ")}</p>
        </section>
      )}
    </div>
  )
}

