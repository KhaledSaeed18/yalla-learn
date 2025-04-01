"use client"

import { useDrag } from "react-dnd"
import { Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type Task, priorityColors } from "@/lib/kanban/types"
import { formatDate } from "@/lib/kanban/utils"
import { useRef } from "react"

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, columnId: task.listId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })
  drag(ref)

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`cursor-grab bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""
        }`}
      style={{ borderLeft: `4px solid ${priorityColors[task.priority]}` }}
    >
      <h4 className="font-medium text-sm mb-1">{task.title}</h4>

      {task.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>}

      <div className="flex flex-wrap gap-1 mb-2">
        {task.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {task.dueDate && (
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}

        <Badge variant="outline" className="text-xs" style={{ color: priorityColors[task.priority] }}>
          {task.priority}
        </Badge>
      </div>
    </div>
  )
}

