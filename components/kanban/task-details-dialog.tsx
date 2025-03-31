"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { cn, formatDate } from "@/lib/kanban/utils"
import { Badge } from "@/components/ui/badge"
import type { Task, Column, Priority } from "@/lib/kanban/types"

interface TaskDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  columns: Column[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  existingTags: string[]
}

export default function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
  columns,
  onUpdateTask,
  onDeleteTask,
  existingTags,
}: TaskDetailsDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined)
  const [tags, setTags] = useState<string[]>(task.tags)
  const [newTag, setNewTag] = useState("")
  const [listId, setListId] = useState(task.listId)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Reset form when task changes
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
    setTags(task.tags)
    setListId(task.listId)
    setIsEditing(false)
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const updatedTask: Task = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      tags,
      listId,
    }

    onUpdateTask(updatedTask)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSelectExistingTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{isEditing ? "Edit Task" : "Task Details"}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel Edit" : "Edit"}
              </Button>
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
            </div>
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "No due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={listId} onValueChange={setListId}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} disabled={!newTag.trim()}>
                    Add
                  </Button>
                </div>

                {existingTags.length > 0 && (
                  <div className="mt-2">
                    <Label className="text-xs">Existing Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {existingTags
                        .filter((tag) => !tags.includes(tag))
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => handleSelectExistingTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!title.trim()}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        ) : (
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
                  style={{
                    color:
                      task.priority === "low"
                        ? "green"
                        : task.priority === "medium"
                          ? "blue"
                          : task.priority === "high"
                            ? "orange"
                            : "red",
                  }}
                >
                  {task.priority}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <Badge variant="secondary" className="text-sm">
                  {columns.find((col) => col.id === task.listId)?.title || "Unknown"}
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

            <div>
              <h4 className="text-sm font-medium mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {task.tags.length > 0 ? (
                  task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags</p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

