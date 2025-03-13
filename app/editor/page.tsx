"use client"

import { useState } from "react"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
    const [content, setContent] = useState("")

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Editor</h1>
                <ModeToggle />
            </div>

            <div className="grid gap-6">
                <TipTapEditor content={content} onChange={setContent} className="w-full" />
                <div className="flex justify-end gap-4">
                    <Button>Save</Button>
                </div>
            </div>
        </main>
    )
}

