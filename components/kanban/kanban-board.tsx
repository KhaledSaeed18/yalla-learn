"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, Filter, Search, BarChart4, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BoardColumn from "./board-column"
import CreateBoardDialog from "./create-board-dialog"
import CreateColumnDialog from "./create-column-dialog"
import TaskDetailsDialog from "./task-details-dialog"
import CreateTaskDialog from "./create-task-dialog"
import DeleteColumnDialog from "./delete-column-dialog"
import EmptyBoardsState from "./empty-boards-state"
import type { Board, Column, Task, Priority } from "@/lib/kanban/types"
import { generateSampleData } from "@/lib/kanban/sample-data"

export default function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>([])
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [filterTag, setFilterTag] = useState<string | "all">("all")
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [showCreateColumn, setShowCreateColumn] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([])
  const [showDeleteColumn, setShowDeleteColumn] = useState(false)
  const [columnToDelete, setColumnToDelete] = useState<Column | null>(null)
  const [showDeleteBoard, setShowDeleteBoard] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(true)

  // Load sample data on first render
  useEffect(() => {
    const sampleData = generateSampleData()
    setBoards(sampleData)
    setSelectedBoard(sampleData[0])

    // Extract all unique tags
    const tags = new Set<string>()
    sampleData.forEach((board) => {
      board.columns.forEach((column) => {
        column.tasks.forEach((task) => {
          task.tags.forEach((tag) => tags.add(tag))
        })
      })
    })
    setAllTags(Array.from(tags))
  }, [])

  const handleCreateBoard = (newBoard: Board) => {
    setBoards([...boards, newBoard])
    setSelectedBoard(newBoard)
    setShowCreateBoard(false)
  }

  const handleCreateColumn = (newColumn: Column) => {
    if (!selectedBoard) return

    const updatedBoard = {
      ...selectedBoard,
      columns: [...selectedBoard.columns, newColumn],
    }

    setBoards(boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board)))

    setSelectedBoard(updatedBoard)
    setShowCreateColumn(false)
  }

  const handleCreateTask = (newTask: Task) => {
    if (!selectedBoard || !selectedColumn) return

    // Add any new tags to the allTags list
    const newTags = newTask.tags.filter((tag) => !allTags.includes(tag))
    if (newTags.length > 0) {
      setAllTags([...allTags, ...newTags])
    }

    const updatedColumns = selectedBoard.columns.map((column) => {
      if (column.id === selectedColumn.id) {
        return {
          ...column,
          tasks: [...column.tasks, newTask],
        }
      }
      return column
    })

    const updatedBoard = {
      ...selectedBoard,
      columns: updatedColumns,
    }

    setBoards(boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board)))

    setSelectedBoard(updatedBoard)
    setShowCreateTask(false)
  }

  const handleMoveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    if (!selectedBoard) return

    let movedTask: Task | null = null

    // Find and remove the task from the source column
    const updatedColumns = selectedBoard.columns.map((column) => {
      if (column.id === sourceColumnId) {
        const taskIndex = column.tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          movedTask = column.tasks[taskIndex]
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }
        }
      }
      return column
    })

    if (!movedTask) return

    // Add the task to the target column
    const finalColumns = updatedColumns.map((column) => {
      if (column.id === targetColumnId && movedTask) {
        return {
          ...column,
          tasks: [...column.tasks, { ...movedTask, listId: targetColumnId }],
        }
      }
      return column
    })

    const updatedBoard = {
      ...selectedBoard,
      columns: finalColumns,
    }

    setBoards(boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board)))

    setSelectedBoard(updatedBoard)
  }

  const handleUpdateTask = (updatedTask: Task) => {
    if (!selectedBoard) return

    // Add any new tags to the allTags list
    const newTags = updatedTask.tags.filter((tag) => !allTags.includes(tag))
    if (newTags.length > 0) {
      setAllTags([...allTags, ...newTags])
    }

    const updatedColumns = selectedBoard.columns.map((column) => {
      if (column.id === updatedTask.listId) {
        return {
          ...column,
          tasks: column.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        }
      }
      return column
    })

    const updatedBoard = {
      ...selectedBoard,
      columns: updatedColumns,
    }

    setBoards(boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board)))

    setSelectedBoard(updatedBoard)
    setSelectedTask(null)
    setShowTaskDetails(false)
  }

  const handleDeleteTask = (taskId: string) => {
    if (!selectedBoard) return

    const updatedColumns = selectedBoard.columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    }))

    const updatedBoard = {
      ...selectedBoard,
      columns: updatedColumns,
    }

    setBoards(boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board)))

    setSelectedBoard(updatedBoard)
    setSelectedTask(null)
    setShowTaskDetails(false)
  }

  const getFilteredTasks = () => {
    if (!selectedBoard) return []

    const filteredTasks: Task[] = []

    selectedBoard.columns.forEach((column) => {
      column.tasks.forEach((task) => {
        // Apply filters
        const matchesSearch =
          searchQuery === "" ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesPriority = filterPriority === "all" || task.priority === filterPriority

        const matchesTag = filterTag === "all" || task.tags.includes(filterTag)

        if (matchesSearch && matchesPriority && matchesTag) {
          filteredTasks.push(task)
        }
      })
    })

    return filteredTasks
  }

  const getCompletionPercentage = () => {
    if (!selectedBoard) return 0

    let totalTasks = 0
    let completedTasks = 0

    selectedBoard.columns.forEach((column) => {
      totalTasks += column.tasks.length
      if (column.title.toLowerCase() === "done") {
        completedTasks += column.tasks.length
      }
    })

    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
  }

  const handleDeleteColumn = (columnId: string) => {
    if (!selectedBoard) return

    const column = selectedBoard.columns.find((col) => col.id === columnId)
    if (!column) return

    // Don't allow deletion of default columns
    if (column.isDefault) return

    // Only allow deletion of empty columns
    if (column.tasks.length > 0) return

    setColumnToDelete(column)
    setShowDeleteColumn(true)
  }

  const confirmDeleteColumn = (columnId: string) => {
    if (!selectedBoard) return

    const updatedColumns = selectedBoard.columns.filter((column) => column.id !== columnId)

    const updatedBoard = {
      ...selectedBoard,
      columns: updatedColumns,
    }

    setBoards(boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board)))

    setSelectedBoard(updatedBoard)
    setColumnToDelete(null)
  }

  // If there are no boards, show the empty state
  if (boards.length === 0) {
    return <EmptyBoardsState onCreateBoard={() => setShowCreateBoard(true)} />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={selectedBoard?.id || ""}
              onValueChange={(value) => {
                const board = boards.find((b) => b.id === value)
                if (board) {
                  setSelectedBoard(board)
                  // Reset filters when changing boards
                  setSearchQuery("")
                  setFilterPriority("all")
                  setFilterTag("all")
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setShowCreateBoard(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Board
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as Priority | "all")}>
                <SelectTrigger className="w-full md:w-[130px]">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTag} onValueChange={(value) => setFilterTag(value)}>
                <SelectTrigger className="w-full md:w-[130px]">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {selectedBoard && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{selectedBoard.title}</h1>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Completion: {getCompletionPercentage()}%</div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCreateColumn(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Column
                </Button>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-4">
              {selectedBoard.columns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  onMoveTask={handleMoveTask}
                  onTaskClick={(task) => {
                    setSelectedTask(task)
                    setShowTaskDetails(true)
                  }}
                  onAddTask={() => {
                    setSelectedColumn(column)
                    setShowCreateTask(true)
                  }}
                  onDeleteColumn={handleDeleteColumn}
                  filteredTasks={getFilteredTasks()}
                  isFiltering={searchQuery !== "" || filterPriority !== "all" || filterTag !== "all"}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showCreateBoard && (
        <CreateBoardDialog open={showCreateBoard} onOpenChange={setShowCreateBoard} onCreateBoard={handleCreateBoard} />
      )}

      {showCreateColumn && selectedBoard && (
        <CreateColumnDialog
          open={showCreateColumn}
          onOpenChange={setShowCreateColumn}
          onCreateColumn={handleCreateColumn}
          boardId={selectedBoard.id}
        />
      )}

      {showCreateTask && selectedColumn && (
        <CreateTaskDialog
          open={showCreateTask}
          onOpenChange={setShowCreateTask}
          onCreateTask={handleCreateTask}
          column={selectedColumn}
          existingTags={allTags}
        />
      )}

      {showTaskDetails && selectedTask && (
        <TaskDetailsDialog
          open={showTaskDetails}
          onOpenChange={setShowTaskDetails}
          task={selectedTask}
          columns={selectedBoard?.columns || []}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          existingTags={allTags}
        />
      )}

      {showDeleteColumn && columnToDelete && (
        <DeleteColumnDialog
          open={showDeleteColumn}
          onOpenChange={setShowDeleteColumn}
          column={columnToDelete}
          onConfirmDelete={confirmDeleteColumn}
        />
      )}
    </DndProvider>
  )
}

