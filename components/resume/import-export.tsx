"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Upload, AlertCircle } from "lucide-react"
import { useResumeContext } from "@/lib/resume/resume-context"
import type { ResumeData } from "@/lib/resume/resume-types"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ImportExportResume() {
    const { resumeData, updateResumeSection } = useResumeContext()
    const [importError, setImportError] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleExport = () => {
        // Create a JSON file for download
        const dataStr = JSON.stringify(resumeData, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

        // Create a download link and trigger it
        const exportName = `resume-${new Date().toISOString().slice(0, 10)}.json`
        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportName)
        linkElement.click()
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImportError(null)
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string
                const importedData = JSON.parse(content) as ResumeData

                // Validate the imported data structure
                if (!importedData.personal || !Array.isArray(importedData.experience)) {
                    throw new Error("Invalid resume data format")
                }

                // Update all sections with the imported data
                Object.keys(importedData).forEach((key) => {
                    updateResumeSection(key as keyof ResumeData, importedData[key as keyof ResumeData])
                })

                setIsDialogOpen(false)
            } catch (error) {
                console.error("Import error:", error)
                setImportError("Failed to import resume data. Please ensure the file is a valid resume JSON export.")
            }
        }

        reader.readAsText(file)
    }

    return (
        <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="w-full md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Resume Data</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Upload a previously exported resume JSON file to restore your data. This will replace your current resume
                            information.
                        </p>

                        {importError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{importError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-center">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">JSON file only</p>
                                </div>
                                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                            </label>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

