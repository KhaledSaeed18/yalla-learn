"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface StudyPlanDay {
    day: number
    focus: string
    tasks: string[]
    tips: string
}

export default function StudyPlanPage() {
    const [subject, setSubject] = useState("")
    const [timeframe, setTimeframe] = useState("")
    const [difficulty, setDifficulty] = useState("")
    const [goals, setGoals] = useState("")
    const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGeneratePlan = async () => {
        if (!subject.trim() || !timeframe.trim() || !difficulty.trim() || !goals.trim()) {
            setError("Please fill in all fields.")
            setStudyPlan([])
            return
        }
        setLoading(true)
        setError(null)
        setStudyPlan([])
        try {
            const response = await fetch("/api/study-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, timeframe, difficulty, goals }),
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }
            const data: { studyPlan: StudyPlanDay[] } = await response.json()
            if (data.studyPlan && data.studyPlan.length > 0) {
                setStudyPlan(data.studyPlan)
            } else {
                setError("No valid study plan could be generated. Please check your input.")
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred"
            setError(`Failed to generate study plan: ${message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadPDF = () => {
        if (studyPlan.length === 0) return;

        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text(`Study Plan: ${subject}`, 14, 20);
        
        // Add metadata
        doc.setFontSize(12);
        doc.text(`Difficulty: ${difficulty}`, 14, 30);
        doc.text(`Duration: ${timeframe} days`, 14, 37);
        doc.text(`Goals: ${goals}`, 14, 44);
        
        // Add table with study plan data
        autoTable(doc, {
            startY: 55,
            head: [['Day', 'Focus', 'Tasks', 'Tips']],
            body: studyPlan.map(day => [
                day.day.toString(),
                day.focus,
                day.tasks.join('\n'),
                day.tips
            ]),
            styles: {
                fontSize: 10,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0]
            }
        });
        
        // Save the PDF
        doc.save(`${subject.replace(/\s+/g, '-').toLowerCase()}-study-plan.pdf`);
    };

    return (
        <div className="container mx-auto py-4 px-4">
            <Card className="w-full mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">AI Study Plan Generator</CardTitle>
                    <CardDescription>
                        Enter your subject, timeframe, difficulty, and learning goals to generate a personalized study plan.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="subject" className="block font-medium mb-1">Subject or Topic</label>
                            <Input id="subject" placeholder="e.g. Calculus" value={subject} onChange={e => setSubject(e.target.value)} disabled={loading} />
                        </div>
                        <div>
                            <label htmlFor="timeframe" className="block font-medium mb-1">Study Timeframe (days)</label>
                            <Input id="timeframe" type="number" min={1} placeholder="e.g. 14" value={timeframe} onChange={e => setTimeframe(e.target.value)} disabled={loading} />
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block font-medium mb-1">Difficulty Level</label>
                            <Select value={difficulty} onValueChange={setDifficulty} disabled={loading}>
                                <SelectTrigger id="difficulty" className="w-full">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="goals" className="block font-medium mb-1">Learning Goals</label>
                            <Input id="goals" placeholder="e.g. Master derivatives, understand integrals, solve real-world problems..." value={goals} onChange={e => setGoals(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                    <Button onClick={handleGeneratePlan} disabled={loading || !subject.trim() || !timeframe.trim() || !difficulty.trim() || !goals.trim()} className="w-full">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            "Generate Study Plan"
                        )}
                    </Button>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {studyPlan.length > 0 && (
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Generated Study Plan</h2>
                                <Button 
                                    onClick={handleDownloadPDF} 
                                    variant="outline" 
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download PDF
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm rounded-lg overflow-hidden">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Day</th>
                                            <th className="px-3 py-2 text-left">Focus</th>
                                            <th className="px-3 py-2 text-left">Tasks</th>
                                            <th className="px-3 py-2 text-left">Tips</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studyPlan.map((day) => (
                                            <tr key={day.day} className="border-b last:border-b-0">
                                                <td className="px-3 py-2 font-semibold">{day.day}</td>
                                                <td className="px-3 py-2">{day.focus}</td>
                                                <td className="px-3 py-2">
                                                    <ul className="list-disc pl-4">
                                                        {day.tasks.map((task, idx) => (
                                                            <li key={idx}>{task}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="px-3 py-2">{day.tips}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}