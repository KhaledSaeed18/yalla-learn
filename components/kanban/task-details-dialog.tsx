"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { formatDate } from "@/lib/kanban/utils"
import { KanbanTask, KanbanColumn, TaskPriority } from "@/types/kanban/kanban.types"

// Priority color mapping
const priorityColors: Record<TaskPriority, string> = {
  LOW: "#22c55e", // green-500
  MEDIUM: "#3b82f6", // blue-500
  HIGH: "#f97316", // orange-500
  URGENT: "#ef4444", // red-500
}

interface TaskDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: KanbanTask
  columns: KanbanColumn[]
  onDeleteTask: (taskId: string) => void
}

export default function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
  columns,
  onDeleteTask,
}: TaskDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Task Details</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDeleteTask(task.id)
                onOpenChange(false)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium mb-1">Priority</h4>
              <Badge
                variant="outline"
                className="text-sm"
                style={{ color: priorityColors[task.priority] }}
              >
                {task.priority}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge variant="secondary" className="text-sm">
                {columns.find((col) => col.id === task.columnId)?.title || "Unknown"}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Due Date</h4>
              <p className="text-sm">{task.dueDate ? formatDate(task.dueDate) : "No due date"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Created</h4>
              <p className="text-sm">{task.createdAt ? formatDate(task.createdAt) : "Unknown"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

