"use client"

import { useDrop } from "react-dnd"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TaskCard from "./task-card"
import type { Column, Task } from "@/lib/kanban/types"
import { useRef } from "react"

interface BoardColumnProps {
  column: Column
  onMoveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) => void
  onTaskClick: (task: Task) => void
  onAddTask: () => void
  onDeleteColumn: (columnId: string) => void
  filteredTasks: Task[]
  isFiltering: boolean
}

export default function BoardColumn({
  column,
  onMoveTask,
  onTaskClick,
  onAddTask,
  onDeleteColumn,
  filteredTasks,
  isFiltering,
}: BoardColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string; columnId: string }) => {
      if (item.columnId !== column.id) {
        onMoveTask(item.id, item.columnId, column.id)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  // Get tasks to display based on filtering
  const tasksToDisplay = isFiltering
    ? column.tasks.filter((task) => filteredTasks.some((ft) => ft.id === task.id))
    : column.tasks

  // Determine if column can be deleted
  const canDelete = !column.isDefault && tasksToDisplay.length === 0
  const deleteTooltip = column.isDefault
    ? "Default columns cannot be deleted"
    : tasksToDisplay.length > 0
      ? "Cannot delete column with tasks"
      : "Delete column"

  drop(ref)

  return (
    <div
      ref={ref}
      className={`flex-shrink-0 w-72 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col max-h-[calc(100vh-200px)] ${isOver ? "border-2 border-primary border-dashed" : ""
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">{column.title}</h3>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {tasksToDisplay.length}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
          {!column.isDefault && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
              onClick={() => onDeleteColumn(column.id)}
              disabled={tasksToDisplay.length > 0}
              title={deleteTooltip}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-grow space-y-2">
        {tasksToDisplay.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}

        {tasksToDisplay.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {isFiltering ? "No matching tasks" : "No tasks yet"}
          </div>
        )}
      </div>
    </div>
  )
}

