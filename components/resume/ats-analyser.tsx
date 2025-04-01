"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle, FileSearch } from "lucide-react"
import { useResumeContext } from "@/lib/resume/resume-context"

export function ATSAnalyzer() {
    const { resumeData } = useResumeContext()
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResults, setAnalysisResults] = useState<null | {
        score: number
        strengths: string[]
        weaknesses: string[]
        suggestions: string[]
    }>(null)

    const analyzeResume = async () => {
        setIsAnalyzing(true)

        try {
            // In a real implementation, this would call an API
            // For now, we'll simulate a delay and return mock results
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Simple analysis logic based on resume content
            const hasKeywords =
                resumeData.summary.toLowerCase().includes("experience") || resumeData.summary.toLowerCase().includes("skills")

            const hasQuantifiableResults = resumeData.experience.some((exp) =>
                exp.achievements.some((a) => /\d+%|\d+ years|increased|improved|reduced/.test(a)),
            )

            const hasContactInfo = resumeData.personal.email.trim() !== "" && resumeData.personal.phone.trim() !== ""

            const hasSkills = resumeData.skills.length > 0 && resumeData.skills.some((cat) => cat.skills.length > 0)

            // Calculate score based on these factors
            let score = 0
            if (hasKeywords) score += 25
            if (hasQuantifiableResults) score += 25
            if (hasContactInfo) score += 25
            if (hasSkills) score += 25

            // Generate analysis results
            const strengths = []
            const weaknesses = []
            const suggestions = []

            if (hasKeywords) {
                strengths.push("Your resume includes relevant keywords that ATS systems look for.")
            } else {
                weaknesses.push("Your resume lacks important keywords that ATS systems scan for.")
                suggestions.push("Add industry-specific keywords and skills to your summary and experience sections.")
            }

            if (hasQuantifiableResults) {
                strengths.push("You've included quantifiable achievements, which significantly improves ATS ranking.")
            } else {
                weaknesses.push("Your experience lacks measurable achievements.")
                suggestions.push("Add specific metrics and numbers to your achievements (e.g., 'increased sales by 20%').")
            }

            if (hasContactInfo) {
                strengths.push("Your contact information is complete and easily parsable by ATS systems.")
            } else {
                weaknesses.push("Your contact information is incomplete.")
                suggestions.push("Ensure your email and phone number are included in the personal information section.")
            }

            if (hasSkills) {
                strengths.push("You've listed relevant skills that ATS systems can match to job requirements.")
            } else {
                weaknesses.push("Your skills section is incomplete or missing.")
                suggestions.push("Add a comprehensive list of skills relevant to your target positions.")
            }

            setAnalysisResults({
                score,
                strengths,
                weaknesses,
                suggestions,
            })
        } catch (error) {
            console.error("Error analyzing resume:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FileSearch className="h-4 w-4 mr-2" />
                    ATS Check
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>ATS Compatibility Analysis</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {!analysisResults && !isAnalyzing && (
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">
                                Analyze your resume for ATS (Applicant Tracking System) compatibility. This will check how well your
                                resume will perform when scanned by automated systems.
                            </p>
                            <Button onClick={analyzeResume} className="mx-auto">
                                Analyze Resume
                            </Button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="space-y-4 text-center">
                            <div className="animate-pulse">
                                <FileSearch className="h-12 w-12 mx-auto text-primary" />
                            </div>
                            <p>Analyzing your resume...</p>
                            <Progress value={45} className="w-full" />
                        </div>
                    )}

                    {analysisResults && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-2">ATS Score: {analysisResults.score}%</h3>
                                <Progress value={analysisResults.score} className="w-full h-3" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {analysisResults.score >= 80
                                        ? "Excellent! Your resume is well-optimized for ATS systems."
                                        : analysisResults.score >= 60
                                            ? "Good. Your resume should pass most ATS scans, but could use some improvements."
                                            : "Needs improvement. Your resume may struggle to pass ATS scans."}
                                </p>
                            </div>

                            {analysisResults.strengths.length > 0 && (
                                <div>
                                    <h4 className="font-semibold flex items-center text-green-600">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Strengths
                                    </h4>
                                    <ul className="mt-2 space-y-1 list-disc pl-5">
                                        {analysisResults.strengths.map((strength, i) => (
                                            <li key={i} className="text-sm">
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {analysisResults.weaknesses.length > 0 && (
                                <div>
                                    <h4 className="font-semibold flex items-center text-red-600">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Weaknesses
                                    </h4>
                                    <ul className="mt-2 space-y-1 list-disc pl-5">
                                        {analysisResults.weaknesses.map((weakness, i) => (
                                            <li key={i} className="text-sm">
                                                {weakness}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {analysisResults.suggestions.length > 0 && (
                                <div>
                                    <h4 className="font-semibold flex items-center text-amber-600">
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Suggestions
                                    </h4>
                                    <ul className="mt-2 space-y-1 list-disc pl-5">
                                        {analysisResults.suggestions.map((suggestion, i) => (
                                            <li key={i} className="text-sm">
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button onClick={analyzeResume} className="w-full">
                                Re-analyze Resume
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

