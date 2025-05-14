"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useGetQaTags, useCreateQaTag, useDeleteQaTag } from "@/hooks/qa/useQaTags";
import { qaTagSchema } from "@/lib/qa/validation";
import { QaTag } from "@/types/qa/qaTags.types";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tag, Plus, Trash2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type QaTagFormValues = z.infer<typeof qaTagSchema>

const QaTagsPage = () => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<QaTag | null>(null);

    const {
        data: tags = [],
        isLoading,
        isError,
        error,
        refetch
    } = useGetQaTags();

    const createTag = useCreateQaTag();
    const deleteTag = useDeleteQaTag();

    const createForm = useForm<QaTagFormValues>({
        resolver: zodResolver(qaTagSchema),
        defaultValues: {
            name: "",
        },
    });

    const onCreateSubmit = (data: QaTagFormValues) => {
        const newTag = {
            name: data.name,
        };

        createTag.mutate(newTag, {
            onSuccess: () => {
                createForm.reset();
                setCreateDialogOpen(false);
            }
        });
    };

    const onDeleteConfirm = () => {
        if (!selectedTag) return;

        deleteTag.mutate(selectedTag.id, {
            onSuccess: () => {
                setSelectedTag(null);
                setDeleteDialogOpen(false);
            }
        });
    };

    const handleDeleteClick = (tag: QaTag) => {
        setSelectedTag(tag);
        setDeleteDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const TableRowsSkeleton = () => {
        return Array(5).fill(0).map((_, index) => (
            <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
            </TableRow>
        ));
    };

    if (isError) {
        return (
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {(error as any)?.message || 'Failed to load tags. Please try again later.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <div className="container px-0 mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Q&A Tags Management</h1>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Create Tag
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Tag</DialogTitle>
                                <DialogDescription>
                                    Add a new tag for organizing questions in the Q&A system.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...createForm}>
                                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                    <FormField
                                        control={createForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tag Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter tag name (e.g., javascript, react, node-js)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={createTag.isPending}>
                                            {createTag.isPending ? "Creating..." : "Create Tag"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Tag</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete tag "{selectedTag?.name}"?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={onDeleteConfirm}
                                disabled={deleteTag.isPending}
                            >
                                {deleteTag.isPending ? "Deleting..." : "Delete Tag"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tag Name</TableHead>
                                <TableHead>Questions</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Updated At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRowsSkeleton />
                            ) : tags.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No tags found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tags.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell className="flex items-center mt-2">
                                            <Tag className="mr-2 h-4 w-4" />
                                            {tag.name}
                                        </TableCell>
                                        <TableCell>{tag.questionCount || 0}</TableCell>
                                        <TableCell>{formatDate(tag.createdAt)}</TableCell>
                                        <TableCell>{formatDate(tag.updatedAt)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteClick(tag)}
                                                disabled={!!(tag.questionCount && tag.questionCount > 0)}
                                                title={!!(tag.questionCount && tag.questionCount > 0) ? "Cannot delete tags with questions" : "Delete tag"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </RoleBasedRoute>
    );
};

export default QaTagsPage;
