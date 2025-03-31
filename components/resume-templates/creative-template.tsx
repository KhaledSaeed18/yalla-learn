import type { ResumeData } from "@/lib/resume/resume-types"

interface CreativeTemplateProps {
  data: ResumeData
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  return (
    <div className="font-sans text-sm">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Sidebar */}
        <div className="bg-purple-100 dark:text-black p-6 md:min-h-screen">
          <div className="sticky top-0">
            <header className="mb-8">
              <h1 className="text-2xl font-bold mb-1">{data.personal.name || "Your Name"}</h1>
              {data.personal.title && <p className="text-lg text-purple-700 mb-4">{data.personal.title}</p>}

              <div className="space-y-1 text-sm">
                {data.personal.email && <p>{data.personal.email}</p>}
                {data.personal.phone && <p>{data.personal.phone}</p>}
                {data.personal.location && <p>{data.personal.location}</p>}
                {data.personal.linkedin && <p>{data.personal.linkedin}</p>}
                {data.personal.github && <p>{data.personal.github}</p>}
                {data.personal.website && <p>{data.personal.website}</p>}
              </div>
            </header>

            {/* Skills */}
            {data.skills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-purple-700 mb-3 border-b border-purple-200 pb-1">Skills</h2>
                {data.skills.map((category, index) => (
                  <div key={index} className="mb-3">
                    {category.name && <h3 className="font-bold">{category.name}</h3>}
                    <ul className="space-y-1">
                      {category.skills.map(
                        (skill, i) =>
                          skill.name && (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              {skill.name}{" "}
                              {skill.level && <span className="text-xs text-purple-600 ml-1">({skill.level})</span>}
                            </li>
                          ),
                      )}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-purple-700 mb-3 border-b border-purple-200 pb-1">Languages</h2>
                <ul className="space-y-1">
                  {data.languages.map(
                    (lang, index) =>
                      lang.name && (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          {lang.name}{" "}
                          {lang.proficiency && (
                            <span className="text-xs text-purple-600 ml-1">({lang.proficiency})</span>
                          )}
                        </li>
                      ),
                  )}
                </ul>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-purple-700 mb-3 border-b border-purple-200 pb-1">
                  Certifications
                </h2>
                <ul className="space-y-1">
                  {data.certifications.map(
                    (cert, index) =>
                      cert.name && (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-1.5"></span>
                          <div>
                            <span className="font-semibold">{cert.name}</span>
                            {cert.issuer && <div className="text-sm">{cert.issuer}</div>}
                            {cert.date && <div className="text-xs text-purple-600">{cert.date}</div>}
                          </div>
                        </li>
                      ),
                  )}
                </ul>
              </section>
            )}

            {/* Interests */}
            {data.interests.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-purple-700 mb-3 border-b border-purple-200 pb-1">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {data.interests.map(
                    (interest, index) =>
                      interest && (
                        <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {interest}
                        </span>
                      ),
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:col-span-2">
          {/* Summary */}
          {data.summary && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-3 border-b border-gray-200 pb-1">About Me</h2>
              <p>{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-4 border-b border-gray-200 pb-1">Work Experience</h2>
              {data.experience.map((exp, index) => (
                <div
                  key={index}
                  className="mb-6 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-purple-200"
                >
                  <div className="absolute w-3 h-3 bg-purple-500 rounded-full left-[-4px] top-1.5"></div>
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h3 className="font-bold text-base">{exp.position}</h3>
                    <p className="text-sm text-purple-700">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <p className="font-semibold mb-1">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                  {exp.description && <p className="mb-2 text-gray-700">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.map(
                        (achievement, i) =>
                          achievement.trim() && (
                            <li key={i} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-1.5"></span>
                              <span>{achievement}</span>
                            </li>
                          ),
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-4 border-b border-gray-200 pb-1">Education</h2>
              {data.education.map((edu, index) => (
                <div
                  key={index}
                  className="mb-6 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-purple-200"
                >
                  <div className="absolute w-3 h-3 bg-purple-500 rounded-full left-[-4px] top-1.5"></div>
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h3 className="font-bold">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-sm text-purple-700">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  <p className="font-semibold mb-1">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </p>
                  {edu.gpa && <p className="text-sm mb-1">GPA: {edu.gpa}</p>}
                  {edu.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {edu.highlights.map(
                        (highlight, i) =>
                          highlight.trim() && (
                            <li key={i} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-1.5"></span>
                              <span>{highlight}</span>
                            </li>
                          ),
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-purple-700 mb-4 border-b border-gray-200 pb-1">Projects</h2>
              {data.projects.map((project, index) => (
                <div key={index} className="mb-6">
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h3 className="font-bold text-base">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} className="text-purple-600 text-sm">
                        {project.url}
                      </a>
                    )}
                  </div>
                  {project.description && <p className="mb-2 text-gray-700">{project.description}</p>}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {project.highlights.map(
                        (highlight, i) =>
                          highlight.trim() && (
                            <li key={i} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-1.5"></span>
                              <span>{highlight}</span>
                            </li>
                          ),
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

