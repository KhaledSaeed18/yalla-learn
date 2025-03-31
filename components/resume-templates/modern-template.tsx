import type { ResumeData } from "@/lib/resume/resume-types"

interface ModernTemplateProps {
  data: ResumeData
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="p-8 font-sans text-sm">
      {/* Header with colored background */}
      <header className="bg-blue-100 dark:text-black  p-6 rounded-md mb-6">
        <h1 className="text-2xl font-bold mb-1">{data.personal.name || "Your Name"}</h1>
        {data.personal.title && <p className="text-lg mb-3 text-blue-700">{data.personal.title}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            {data.personal.email && <p>{data.personal.email}</p>}
            {data.personal.phone && <p>{data.personal.phone}</p>}
          </div>
          <div>
            {data.personal.location && <p>{data.personal.location}</p>}
            {data.personal.linkedin && <p>{data.personal.linkedin}</p>}
            {data.personal.github && <p>{data.personal.github}</p>}
            {data.personal.website && <p>{data.personal.website}</p>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Summary */}
          {data.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-700 mb-2">Professional Summary</h2>
              <p>{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-700 mb-3">Work Experience</h2>
              {data.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h3 className="font-bold text-base">{exp.position}</h3>
                    <p className="text-sm">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <p className="font-semibold mb-1">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                  {exp.description && <p className="mb-1">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc pl-5">
                      {exp.achievements.map((achievement, i) => achievement.trim() && <li key={i}>{achievement}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-700 mb-3">Projects</h2>
              {data.projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h3 className="font-bold text-base">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} className="text-blue-600 text-sm">
                        {project.url}
                      </a>
                    )}
                  </div>
                  {project.description && <p className="mb-1">{project.description}</p>}
                  {project.technologies.length > 0 && (
                    <p className="mb-1">
                      <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
                    </p>
                  )}
                  {project.highlights.length > 0 && (
                    <ul className="list-disc pl-5">
                      {project.highlights.map((highlight, i) => highlight.trim() && <li key={i}>{highlight}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        <div>
          {/* Education */}
          {data.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-700 mb-3">Education</h2>
              {data.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="font-semibold">{edu.institution}</p>
                  <p>{edu.location}</p>
                  <p>
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
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
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-700 mb-3">Skills</h2>
              {data.skills.map((category, index) => (
                <div key={index} className="mb-3">
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
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-700 mb-3">Certifications</h2>
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
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-700 mb-3">Languages</h2>
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
              <h2 className="text-lg font-bold text-blue-700 mb-3">Interests</h2>
              <p>{data.interests.join(", ")}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

