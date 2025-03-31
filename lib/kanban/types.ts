export interface Board {
  id: string
  title: string
  columns: Column[]
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
  boardId: string
  isDefault?: boolean // Flag to identify default columns
}

export type Priority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate?: string
  tags: string[]
  listId: string
  createdAt?: string
}

export const priorityColors: Record<Priority, string> = {
  low: "#22c55e", // green-500
  medium: "#3b82f6", // blue-500
  high: "#f97316", // orange-500
  urgent: "#ef4444", // red-500
}

