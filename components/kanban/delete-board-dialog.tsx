"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { Board } from "@/lib/kanban/types"

interface DeleteBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  board: Board | null
  onConfirmDelete: (boardId: string) => void
}

export default function DeleteBoardDialog({ open, onOpenChange, board, onConfirmDelete }: DeleteBoardDialogProps) {
  if (!board) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Board
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the board "{board.title}"? This action will permanently delete all columns
            and tasks within this board and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm text-amber-800 dark:text-amber-200 mt-2">
          <p className="font-medium">This will delete:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>{board.columns.length} columns</li>
            <li>{board.columns.reduce((count, column) => count + column.tasks.length, 0)} tasks</li>
            <li>All associated tags and metadata</li>
          </ul>
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirmDelete(board.id)
              onOpenChange(false)
            }}
          >
            Delete Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

