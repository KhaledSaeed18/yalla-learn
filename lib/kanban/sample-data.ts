import { v4 as uuidv4 } from "uuid"
import type { Board, Task } from "./types"

export function generateSampleData(): Board[] {
  const boardId = uuidv4()

  const todoId = uuidv4()
  const inProgressId = uuidv4()
  const doneId = uuidv4()

  const todoTasks: Task[] = [
    {
      id: uuidv4(),
      title: "Research competitors",
      description: "Analyze top 5 competitors in the market and identify their strengths and weaknesses.",
      priority: "high",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["research", "marketing"],
      listId: todoId,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Create wireframes for homepage",
      description: "Design initial wireframes for the new homepage layout.",
      priority: "medium",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["design", "ui"],
      listId: todoId,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Set up analytics",
      description: "Implement Google Analytics and set up custom events tracking.",
      priority: "low",
      tags: ["development", "analytics"],
      listId: todoId,
      createdAt: new Date().toISOString(),
    },
  ]

  const inProgressTasks: Task[] = [
    {
      id: uuidv4(),
      title: "Develop user authentication",
      description: "Implement login, registration, and password reset functionality.",
      priority: "high",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["development", "security"],
      listId: inProgressId,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      title: "Create content for blog",
      description: "Write 3 blog posts about upcoming features.",
      priority: "medium",
      tags: ["content", "marketing"],
      listId: inProgressId,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const doneTasks: Task[] = [
    {
      id: uuidv4(),
      title: "Define project scope",
      description: "Create project charter and define initial requirements.",
      priority: "urgent",
      tags: ["planning", "documentation"],
      listId: doneId,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      title: "Set up development environment",
      description: "Configure local development environment and CI/CD pipeline.",
      priority: "high",
      tags: ["development", "devops"],
      listId: doneId,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      title: "Create logo design",
      description: "Design company logo and prepare different formats.",
      priority: "medium",
      tags: ["design", "branding"],
      listId: doneId,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return [
    {
      id: boardId,
      title: "Project Alpha",
      columns: [
        {
          id: todoId,
          title: "To Do",
          tasks: todoTasks,
          boardId,
          isDefault: true, // Mark as default column
        },
        {
          id: inProgressId,
          title: "In Progress",
          tasks: inProgressTasks,
          boardId,
          isDefault: true, // Mark as default column
        },
        {
          id: doneId,
          title: "Done",
          tasks: doneTasks,
          boardId,
          isDefault: true, // Mark as default column
        },
      ],
    },
  ]
}

