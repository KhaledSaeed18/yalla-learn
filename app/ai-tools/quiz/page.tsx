"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, XCircle, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface QuizQuestion {
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
}

export default function QuizPage() {
    const [topic, setTopic] = useState("")
    const [numQuestions, setNumQuestions] = useState("5")
    const [difficulty, setDifficulty] = useState("")
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [quizStarted, setQuizStarted] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)

    const handleGenerateQuiz = async () => {
        if (!topic.trim() || !numQuestions || !difficulty) {
            setError("Please fill in all fields.")
            return
        }

        setLoading(true)
        setError(null)
        setQuizQuestions([])
        setQuizStarted(false)
        setCurrentQuestion(0)
        setSelectedAnswers([])
        setShowResults(false)
        setScore(0)

        try {
            const response = await fetch("/api/quiz/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    numQuestions: parseInt(numQuestions),
                    difficulty
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            const data: { quizQuestions: QuizQuestion[] } = await response.json()

            if (data.quizQuestions && data.quizQuestions.length > 0) {
                setQuizQuestions(data.quizQuestions)
                // Initialize selectedAnswers array with empty strings
                setSelectedAnswers(new Array(data.quizQuestions.length).fill(""))
            } else {
                setError("No valid quiz questions could be generated. Please check your input.")
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred"
            setError(`Failed to generate quiz: ${message}`)
        } finally {
            setLoading(false)
        }
    }

    const startQuiz = () => {
        setQuizStarted(true)
        setCurrentQuestion(0)
        setShowResults(false)
    }

    const handleAnswerSelect = (answer: string) => {
        const newAnswers = [...selectedAnswers]
        newAnswers[currentQuestion] = answer
        setSelectedAnswers(newAnswers)
    }

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            calculateScore()
            setShowResults(true)
        }
    }

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const calculateScore = () => {
        let newScore = 0
        quizQuestions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                newScore++
            }
        })
        setScore(newScore)
    }

    const resetQuiz = () => {
        setQuizStarted(false)
        setCurrentQuestion(0)
        setSelectedAnswers(new Array(quizQuestions.length).fill(""))
        setShowResults(false)
    }

    const getProgressPercentage = () => {
        const answered = selectedAnswers.filter(answer => answer !== "").length
        return (answered / quizQuestions.length) * 100
    }

    const handleDownloadPDF = () => {
        if (quizQuestions.length === 0) return;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text(`Quiz Results: ${topic}`, 14, 20);

        // Add metadata
        doc.setFontSize(12);
        doc.text(`Difficulty: ${difficulty}`, 14, 30);
        doc.text(`Score: ${score} out of ${quizQuestions.length} (${Math.round((score / quizQuestions.length) * 100)}%)`, 14, 37);

        // Add table with quiz data
        autoTable(doc, {
            startY: 45,
            head: [['Question', 'Your Answer', 'Correct Answer', 'Explanation']],
            body: quizQuestions.map((question, index) => [
                question.question,
                selectedAnswers[index] || "No answer",
                question.correctAnswer,
                question.explanation
            ]),
            styles: {
                fontSize: 10,
                cellPadding: 3,
                overflow: 'linebreak',
                cellWidth: 'wrap'
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0]
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 40 },
                2: { cellWidth: 40 },
                3: { cellWidth: 60 }
            }
        });

        // Save the PDF
        doc.save(`${topic.replace(/\s+/g, '-').toLowerCase()}-quiz-results.pdf`);
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <Card className="w-full mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">AI Quiz Generator</CardTitle>
                    <CardDescription>
                        Enter a topic, number of questions, and difficulty level to generate a customized quiz with AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!quizStarted && !showResults && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="topic" className="block font-medium mb-1">Topic or Subject</Label>
                                    <Input
                                        id="topic"
                                        placeholder="e.g. World History"
                                        value={topic}
                                        onChange={e => setTopic(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="numQuestions" className="block font-medium mb-1">Number of Questions</Label>
                                    <Select value={numQuestions} onValueChange={setNumQuestions} disabled={loading}>
                                        <SelectTrigger id="numQuestions" className="w-full">
                                            <SelectValue placeholder="Select number" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3 Questions</SelectItem>
                                            <SelectItem value="5">5 Questions</SelectItem>
                                            <SelectItem value="10">10 Questions</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="difficulty" className="block font-medium mb-1">Difficulty Level</Label>
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
                            </div>

                            <Button
                                onClick={handleGenerateQuiz}
                                disabled={loading || !topic.trim() || !numQuestions || !difficulty}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Quiz"
                                )}
                            </Button>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {quizQuestions.length > 0 && (
                                <Button onClick={startQuiz} className="w-full">
                                    Start Quiz
                                </Button>
                            )}
                        </div>
                    )}

                    {quizStarted && !showResults && quizQuestions.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">
                                    Question {currentQuestion + 1} of {quizQuestions.length}
                                </h3>
                                <div className="text-sm text-muted-foreground">
                                    Progress: {Math.round(getProgressPercentage())}%
                                </div>
                            </div>

                            <Progress value={getProgressPercentage()} className="h-2" />

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">{quizQuestions[currentQuestion].question}</h3>

                                <RadioGroup
                                    value={selectedAnswers[currentQuestion]}
                                    onValueChange={handleAnswerSelect}
                                    className="space-y-3"
                                >
                                    {quizQuestions[currentQuestion].options.map((option, index) => (
                                        <div key={index} className="flex items-start space-x-2">
                                            <RadioGroupItem
                                                value={option}
                                                id={`option-${index}`}
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor={`option-${index}`}
                                                className="cursor-pointer"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="flex justify-between mt-6">
                                <Button
                                    variant="outline"
                                    onClick={previousQuestion}
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={nextQuestion}
                                    disabled={!selectedAnswers[currentQuestion]}
                                >
                                    {currentQuestion < quizQuestions.length - 1 ? "Next" : "Finish Quiz"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {showResults && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-center flex-1">
                                    <h3 className="text-2xl font-bold mb-2">Quiz Results</h3>
                                    <p className="text-lg">
                                        You scored <span className="font-bold text-primary">{score}</span> out of <span className="font-bold">{quizQuestions.length}</span>
                                        ({Math.round((score / quizQuestions.length) * 100)}%)
                                    </p>
                                </div>
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

                            <Progress
                                value={(score / quizQuestions.length) * 100}
                                className={cn(
                                    "h-3",
                                    score / quizQuestions.length >= 0.7 ? "bg-green-100" :
                                        score / quizQuestions.length >= 0.4 ? "bg-yellow-100" : "bg-red-100"
                                )}
                            />

                            <div className="space-y-6 mt-6">
                                <h4 className="text-lg font-medium">Detailed Results:</h4>
                                {quizQuestions.map((question, index) => {
                                    const isCorrect = selectedAnswers[index] === question.correctAnswer;
                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "p-4 rounded-lg border",
                                                isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                            )}
                                        >
                                            <div className="flex items-start space-x-2">
                                                {isCorrect ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                                                )}
                                                <div className="space-y-2 flex-1">
                                                    <div className="font-medium">{question.question}</div>
                                                    <div>
                                                        <div className="text-sm">
                                                            <span className="font-medium">Your answer: </span>
                                                            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                                                {selectedAnswers[index] || "No answer selected"}
                                                            </span>
                                                        </div>
                                                        {!isCorrect && (
                                                            <div className="text-sm">
                                                                <span className="font-medium">Correct answer: </span>
                                                                <span className="text-green-600">{question.correctAnswer}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm p-2 rounded border">
                                                        <span className="font-medium">Explanation: </span>
                                                        {question.explanation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={resetQuiz}>
                                    Retake Quiz
                                </Button>
                                <Button onClick={() => {
                                    setQuizStarted(false)
                                    setShowResults(false)
                                }}>
                                    Create New Quiz
                                </Button>
                                <Button onClick={handleDownloadPDF}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Results as PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
