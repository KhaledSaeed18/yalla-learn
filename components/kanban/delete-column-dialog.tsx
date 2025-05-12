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
import { KanbanColumn } from "@/types/kanban/kanban.types"

interface DeleteColumnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: KanbanColumn
  onConfirmDelete: (columnId: string) => void
}

export default function DeleteColumnDialog({ open, onOpenChange, column, onConfirmDelete }: DeleteColumnDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Custom Column</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the custom column "{column.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirmDelete(column.id)
              onOpenChange(false)
            }}
          >
            Delete Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

