"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useResumeContext } from "@/lib/resume/resume-context"


export function ImportExportResume() {
    const { resumeData } = useResumeContext()

    const handleExport = () => {
        const dataStr = JSON.stringify(resumeData, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

        const exportName = `resume-${new Date().toISOString().slice(0, 10)}.json`
        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportName)
        linkElement.click()
    }


    return (
        <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="w-full md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
        </div>
    )
}

