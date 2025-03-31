"use client"

import { FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyBoardsStateProps {
  onCreateBoard: () => void
}

export default function EmptyBoardsState({ onCreateBoard }: EmptyBoardsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
          <FolderPlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">No boards found</h2>
        <p className="text-muted-foreground mb-6">
          Create your first Kanban board to start organizing your tasks and projects.
        </p>
        <Button onClick={onCreateBoard}>Create New Board</Button>
      </div>
    </div>
  )
}

