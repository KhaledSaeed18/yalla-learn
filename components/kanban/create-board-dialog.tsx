"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Board } from "@/lib/kanban/types"

interface CreateBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBoard: (board: Board) => void
}

export default function CreateBoardDialog({ open, onOpenChange, onCreateBoard }: CreateBoardDialogProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const newBoard: Board = {
      id: uuidv4(),
      title: title.trim(),
      columns: [
        {
          id: uuidv4(),
          title: "To Do",
          tasks: [],
          boardId: "",
          isDefault: true, // Mark as default column
        },
        {
          id: uuidv4(),
          title: "In Progress",
          tasks: [],
          boardId: "",
          isDefault: true, // Mark as default column
        },
        {
          id: uuidv4(),
          title: "Done",
          tasks: [],
          boardId: "",
          isDefault: true, // Mark as default column
        },
      ],
    }

    // Set the boardId for each column
    newBoard.columns = newBoard.columns.map((column) => ({
      ...column,
      boardId: newBoard.id,
    }))

    onCreateBoard(newBoard)
    setTitle("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Board Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

