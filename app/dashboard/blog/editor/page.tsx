"use client"

import { useState } from "react"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { Button } from "@/components/ui/button"

export default function Home() {
    const [content, setContent] = useState("")

    return (
        <main>
            <h1 className="text-3xl font-bold">Blog Editor</h1>

            <div className="grid gap-6 mt-4">
                <TipTapEditor content={content} onChange={setContent} className="w-full" />
                <div className="flex justify-end gap-4">
                    <Button>Save</Button>
                </div>
            </div>
        </main>
    )
}

