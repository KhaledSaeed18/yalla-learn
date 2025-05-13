"use client"

import { useState } from "react"
import { Trash2, MessageCircle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import RoleBasedRoute from "@/components/RoleBasedRoute"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { useGetContactForms, useGetContactForm, useDeleteContactForm } from "@/hooks/support/useSupport"
import { ContactForm } from "@/types/support/support.types"

const SupportPage = () => {
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

    const {
        data: messages = [],
        isLoading,
        isError,
        error,
        refetch
    } = useGetContactForms()

    const {
        data: messageDetail,
        isLoading: isDetailLoading,
    } = useGetContactForm(selectedMessageId || "")

    const deleteMessage = useDeleteContactForm()

    const handleViewMessage = (id: string) => {
        setSelectedMessageId(id)
        setViewDialogOpen(true)
    }

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation() // Prevent row click
        setSelectedMessageId(id)
        setDeleteDialogOpen(true)
    }

    const onDeleteConfirm = () => {
        if (!selectedMessageId) return

        deleteMessage.mutate(selectedMessageId, {
            onSuccess: () => {
                setDeleteDialogOpen(false)
                setSelectedMessageId(null)
            }
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const TableRowsSkeleton = () => {
        return Array(5).fill(0).map((_, index) => (
            <TableRow key={`skeleton-row-${index}`}>
                <TableCell className="font-medium">
                    <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end">
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </TableCell>
            </TableRow>
        ))
    }

    if (isError) {
        return (
            <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <main>
                    <div className="flex justify-between items-center pb-6">
                        <h1 className="text-3xl font-bold">Support Messages</h1>
                    </div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
                                <h2 className="text-lg font-semibold">Error loading messages</h2>
                                <p>{(error as any)?.message || "Failed to load support messages. Please try again."}</p>
                                <Button onClick={() => refetch()} className="mt-2">
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </RoleBasedRoute>
        )
    }

    return (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <main>
                <div className="flex justify-between items-center pb-6">
                    <h1 className="text-3xl font-bold">Support Messages</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Messages</CardTitle>
                        <CardDescription>Manage support requests and inquiries from users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="overflow-auto w-full">
                                <div className="min-w-full rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[20%]">Name</TableHead>
                                                <TableHead className="w-[25%]">Email</TableHead>
                                                <TableHead className="w-[30%]">Subject</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Date</TableHead>
                                                <TableHead className="text-right w-[10%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRowsSkeleton />
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Inbox className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h2 className="mt-6 text-xl font-semibold">No messages yet</h2>
                                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                    When users submit support requests, they will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full">
                                <div className="min-w-full rounded-md border">
                                    <Table className="w-full table-auto">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[20%]">Name</TableHead>
                                                <TableHead className="w-[25%]">Email</TableHead>
                                                <TableHead className="w-[30%]">Subject</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Date</TableHead>
                                                <TableHead className="text-right w-[10%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {messages.map((message: ContactForm) => (
                                                <TableRow
                                                    key={message.id}
                                                    onClick={() => handleViewMessage(message.id)}
                                                    className="cursor-pointer"
                                                >
                                                    <TableCell className="font-medium">{message.name}</TableCell>
                                                    <TableCell>{message.email}</TableCell>
                                                    <TableCell className="truncate max-w-xs">{message.subject}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{formatDate(message.createdAt)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={(e) => handleDeleteClick(e, message.id)}
                                                                disabled={deleteMessage.isPending}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete</span>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* View Message Dialog */}
                <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Message Details</DialogTitle>
                            <DialogDescription>
                                Support request from {messageDetail?.name}
                            </DialogDescription>
                        </DialogHeader>
                        {isDetailLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : messageDetail ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">From</p>
                                        <p className="text-base">{messageDetail.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p className="text-base">{messageDetail.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                    <p className="text-base font-medium">{messageDetail.subject}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                                    <p className="text-base">{formatDate(messageDetail.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Message</p>
                                    <div className="mt-1 p-4 bg-muted rounded-md">
                                        <p className="whitespace-pre-wrap">{messageDetail.message}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-4">
                                Message not found or has been deleted.
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="destructive"
                                onClick={(e) => {
                                    setViewDialogOpen(false);
                                    if (messageDetail) {
                                        handleDeleteClick(e as any, messageDetail.id);
                                    }
                                }}
                                className="mr-auto"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                            <Button onClick={() => setViewDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Message Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete this support message. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteMessage.isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onDeleteConfirm}
                                className="bg-destructive text-white hover:bg-destructive/90"
                                disabled={deleteMessage.isPending}
                            >
                                {deleteMessage.isPending ? (
                                    <>
                                        <LoadingSpinner size={16} spinnerClassName="mr-2" />
                                        Deleting...
                                    </>
                                ) : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </RoleBasedRoute>
    )
}

export default SupportPage
