"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, CircleX, AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BoardColumn from "./board-column"
import CreateBoardDialog from "./create-board-dialog"
import CreateColumnDialog from "./create-column-dialog"
import TaskDetailsDialog from "./task-details-dialog"
import CreateTaskDialog from "./create-task-dialog"
import DeleteColumnDialog from "./delete-column-dialog"
import { useGetBoards, useGetBoard, useCreateBoard, useDeleteBoard, useCreateColumn, useDeleteColumn, useCreateTask, useDeleteTask } from "@/hooks/kanban/useKanban"
import { Skeleton } from "@/components/ui/skeleton"
import { KanbanTask, TaskPriority } from "@/types/kanban/kanban.types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function KanbanBoard() {
  // Router for URL handling
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for UI controls
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [showCreateColumn, setShowCreateColumn] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showDeleteColumn, setShowDeleteColumn] = useState(false)
  const [showDeleteBoard, setShowDeleteBoard] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string>("")
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "ALL">("ALL")

  // React Query hooks
  const { data: boards, isLoading: isBoardsLoading, error: boardsError } = useGetBoards()
  const {
    data: activeBoard,
    isLoading: isBoardLoading,
    error: boardError
  } = useGetBoard(selectedBoardId)

  const createBoardMutation = useCreateBoard()
  const deleteBoardMutation = useDeleteBoard()
  const createColumnMutation = useCreateColumn()
  const deleteColumnMutation = useDeleteColumn()
  const createTaskMutation = useCreateTask()
  const deleteTaskMutation = useDeleteTask()

  // Initialize selected board from URL
  useEffect(() => {
    const boardId = searchParams.get('board')
    if (boardId && boards) {
      const board = boards.find(b => b.id === boardId)
      if (board) {
        setSelectedBoardId(boardId)
      }
    }
  }, [searchParams, boards])

  // Update URL when board changes
  useEffect(() => {
    if (selectedBoardId && boards) {
      const board = boards.find(b => b.id === selectedBoardId)
      if (board) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('board', selectedBoardId)
        router.push(`/dashboard/kanban-board?${params.toString()}`)
      }
    }
  }, [selectedBoardId, boards, router, searchParams])

  // Helper to find the selected column
  const selectedColumn = activeBoard?.columns.find(column => column.id === selectedColumnId) || null

  // Helper to find the selected task
  const selectedTask = selectedColumn?.tasks.find(task => task.id === selectedTaskId) || null

  // Function to handle creating a new board
  const handleCreateBoard = (title: string) => {
    createBoardMutation.mutate(
      { title },
      {
        onSuccess: (response) => {
          // Select the newly created board
          const newBoardId = response.data.board.id
          setSelectedBoardId(newBoardId)
          setShowCreateBoard(false)

          // Update URL with new board
          const params = new URLSearchParams(searchParams.toString())
          params.set('board', newBoardId)
          router.push(`/dashboard/kanban-board?${params.toString()}`)
        }
      }
    )
  }

  // Function to handle deleting a board
  const handleDeleteBoard = () => {
    if (!selectedBoardId) return

    deleteBoardMutation.mutate(selectedBoardId, {
      onSuccess: () => {
        setSelectedBoardId("")
        setShowDeleteBoard(false)

        // Clear the board param from URL
        const params = new URLSearchParams(searchParams.toString())
        params.delete('board')
        router.push(`/dashboard/kanban-board${params.toString() ? `?${params.toString()}` : ''}`)
      }
    })
  }

  // Function to handle creating a new column
  const handleCreateColumn = (title: string, isDefault: boolean = false) => {
    if (!selectedBoardId) return

    createColumnMutation.mutate(
      {
        boardId: selectedBoardId,
        columnData: {
          title,
          isDefault
        }
      },
      {
        onSuccess: () => {
          setShowCreateColumn(false)
        }
      }
    )
  }

  // Function to handle creating a new task
  const handleCreateTask = (title: string, description: string | null, priority: TaskPriority, dueDate: string | null) => {
    if (!selectedBoardId || !selectedColumnId) return

    createTaskMutation.mutate(
      {
        columnId: selectedColumnId,
        taskData: {
          title,
          description,
          priority,
          dueDate
        },
        boardId: selectedBoardId
      },
      {
        onSuccess: () => {
          setShowCreateTask(false)
        }
      }
    )
  }

  // Function to handle moving a task between columns
  const handleMoveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    // This would need a backend API endpoint to move tasks
    // For now, we'll implement a simple client-side solution
    console.log("Moving task", taskId, "from", sourceColumnId, "to", targetColumnId)
  }

  // Function to handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    if (!selectedBoardId) return

    deleteTaskMutation.mutate(
      {
        id: taskId,
        boardId: selectedBoardId
      },
      {
        onSuccess: () => {
          setSelectedTaskId("")
          setShowTaskDetails(false)
        }
      }
    )
  }

  // Function to handle deleting a column
  const handleDeleteColumn = (columnId: string) => {
    if (!selectedBoardId) return

    const column = activeBoard?.columns.find(col => col.id === columnId)
    if (!column) return

    if (column.isDefault) return  // Cannot delete default columns
    if (column.tasks.length > 0) return  // Cannot delete columns with tasks

    setSelectedColumnId(columnId)
    setShowDeleteColumn(true)
  }

  // Function to confirm column deletion
  const confirmDeleteColumn = (columnId: string) => {
    if (!selectedBoardId) return

    deleteColumnMutation.mutate(
      {
        columnId,
        boardId: selectedBoardId
      },
      {
        onSuccess: () => {
          setSelectedColumnId("")
          setShowDeleteColumn(false)
        }
      }
    )
  }

  // Function to get filtered tasks
  const getFilteredTasks = () => {
    if (!activeBoard) return []

    let filteredTasks: KanbanTask[] = []

    activeBoard.columns.forEach((column) => {
      column.tasks.forEach((task) => {
        const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority
        if (matchesPriority) {
          filteredTasks.push(task)
        }
      })
    })

    return filteredTasks
  }

  // Render loading state
  if (isBoardsLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <Skeleton className="h-[500px] w-[300px] flex-shrink-0" />
          <Skeleton className="h-[500px] w-[300px] flex-shrink-0" />
          <Skeleton className="h-[500px] w-[300px] flex-shrink-0" />
        </div>
      </div>
    )
  }

  // Render error state
  if (boardsError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load Kanban boards. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  // Render empty state
  if (!boards || boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <CircleX className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Boards Found</h2>
        <p className="text-muted-foreground mb-6">Get started by creating your first board.</p>
        <Button onClick={() => setShowCreateBoard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>

        {/* Create board dialog */}
        {showCreateBoard && (
          <CreateBoardDialog
            open={showCreateBoard}
            onOpenChange={setShowCreateBoard}
            onCreateBoard={handleCreateBoard}
          />
        )}
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={selectedBoardId}
              onValueChange={(value) => {
                setSelectedBoardId(value)
                setFilterPriority("ALL")

                // Find board title for URL
                const selectedBoard = boards.find(board => board.id === value)
                if (selectedBoard) {
                  const params = new URLSearchParams(searchParams.toString())
                  params.set('board', value)
                  router.push(`/dashboard/kanban-board?${params.toString()}`)
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

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select
              value={filterPriority}
              onValueChange={(value) => setFilterPriority(value as TaskPriority | "ALL")}
            >
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isBoardLoading && (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            <Skeleton className="h-[500px] w-[300px] flex-shrink-0" />
            <Skeleton className="h-[500px] w-[300px] flex-shrink-0" />
            <Skeleton className="h-[500px] w-[300px] flex-shrink-0" />
          </div>
        )}

        {boardError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load board details. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {activeBoard && !isBoardLoading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{activeBoard.title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateColumn(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Column
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteBoard(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Board
                </Button>
              </div>
            </div>

            {activeBoard.columns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">No Columns Yet</h3>
                <p className="text-muted-foreground mb-4">Create columns to organize your tasks</p>
                <Button onClick={() => setShowCreateColumn(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Column
                </Button>
              </div>
            ) : (
              <div className="flex overflow-x-auto pb-4 gap-4">
                {activeBoard.columns.map((column) => (
                  <BoardColumn
                    key={column.id}
                    column={column}
                    onMoveTask={handleMoveTask}
                    onTaskClick={(task) => {
                      setSelectedTaskId(task.id)
                      setSelectedColumnId(column.id)
                      setShowTaskDetails(true)
                    }}
                    onAddTask={() => {
                      setSelectedColumnId(column.id)
                      setShowCreateTask(true)
                    }}
                    onDeleteColumn={handleDeleteColumn}
                    filteredTasks={getFilteredTasks()}
                    isFiltering={filterPriority !== "ALL"}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      {showCreateBoard && (
        <CreateBoardDialog
          open={showCreateBoard}
          onOpenChange={setShowCreateBoard}
          onCreateBoard={handleCreateBoard}
        />
      )}

      {showCreateColumn && selectedBoardId && (
        <CreateColumnDialog
          open={showCreateColumn}
          onOpenChange={setShowCreateColumn}
          onCreateColumn={handleCreateColumn}
          boardId={selectedBoardId}
        />
      )}

      {showCreateTask && selectedColumnId && (
        <CreateTaskDialog
          open={showCreateTask}
          onOpenChange={setShowCreateTask}
          onCreateTask={handleCreateTask}
          column={selectedColumn!}
        />
      )}

      {showTaskDetails && selectedTask && (
        <TaskDetailsDialog
          open={showTaskDetails}
          onOpenChange={setShowTaskDetails}
          task={selectedTask}
          columns={activeBoard?.columns || []}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {showDeleteColumn && selectedColumnId && (
        <DeleteColumnDialog
          open={showDeleteColumn}
          onOpenChange={setShowDeleteColumn}
          column={selectedColumn!}
          onConfirmDelete={confirmDeleteColumn}
        />
      )}

      {/* Delete Board Dialog */}
      <AlertDialog open={showDeleteBoard} onOpenChange={setShowDeleteBoard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this board? This action cannot be undone and all
              columns and tasks within this board will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteBoard}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndProvider>
  )
}

