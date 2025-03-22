"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Folder, Plus, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import RoleBasedRoute from "@/components/RoleBasedRoute"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { useGetBlogCategories, useCreateBlogCategory, useUpdateBlogCategory, useDeleteBlogCategory } from "@/hooks/blog/useBlogCategories"
import { BlogCategory, CreateCategoryRequest } from "@/types/blog/blogCategories.types"
import { categorySchema } from "@/lib/blog/validation"

type CategoryFormValues = z.infer<typeof categorySchema>

const CategoriesPage = () => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)

    const {
        data: categories = [],
        isLoading,
        isError,
        error,
        refetch
    } = useGetBlogCategories()

    const createCategory = useCreateBlogCategory()
    const updateCategory = useUpdateBlogCategory()
    const deleteCategory = useDeleteBlogCategory()

    const createForm = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
    })

    const updateForm = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
    })

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, form: any) => {
        const name = e.target.value
        form.setValue("name", name)

        if (name) {
            const slug = name
                .trim()
                .toLowerCase()
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "-")
                .replace(/-+$/, "")
            form.setValue("slug", slug, { shouldValidate: true })
        } else {
            form.setValue("slug", "", { shouldValidate: true })
        }
    }

    const onCreateSubmit = (data: CategoryFormValues) => {
        const newCategory: CreateCategoryRequest = {
            name: data.name,
            slug: data.slug,
            description: data.description || null,
        }

        createCategory.mutate(newCategory, {
            onSuccess: () => {
                setCreateDialogOpen(false)
                createForm.reset()
            }
        })
    }

    const onUpdateSubmit = (data: CategoryFormValues) => {
        if (!selectedCategory) return

        const updatedCategory = {
            name: data.name,
            slug: data.slug,
            description: data.description || null,
        }

        updateCategory.mutate(
            {
                id: selectedCategory.id,
                categoryData: updatedCategory
            },
            {
                onSuccess: () => {
                    setUpdateDialogOpen(false)
                    setSelectedCategory(null)
                }
            }
        )
    }

    const onDeleteConfirm = () => {
        if (!selectedCategory) return

        deleteCategory.mutate(selectedCategory.id, {
            onSuccess: () => {
                setDeleteDialogOpen(false)
                setSelectedCategory(null)
            }
        })
    }

    const handleUpdateClick = (category: BlogCategory) => {
        setSelectedCategory(category)
        updateForm.reset({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
        })
        setUpdateDialogOpen(true)
    }

    const handleDeleteClick = (category: BlogCategory) => {
        setSelectedCategory(category)
        setDeleteDialogOpen(true)
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
                <TableCell>
                    <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
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
                        <h1 className="text-3xl font-bold">Blog Categories</h1>
                    </div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
                                <h2 className="text-lg font-semibold">Error loading categories</h2>
                                <p>{(error as any)?.message || "Failed to load categories. Please try again."}</p>
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
                    <h1 className="text-3xl font-bold">Blog Categories</h1>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                        <CardDescription>Manage your blog categories. Create, edit, or delete categories as needed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="overflow-auto w-full">
                                <div className="min-w-full rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[15%]">Name</TableHead>
                                                <TableHead className="w-[12%]">Slug</TableHead>
                                                <TableHead className="w-[48%]">Description</TableHead>
                                                <TableHead className="w-[15%]">Created</TableHead>
                                                <TableHead className="text-right w-[10%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRowsSkeleton />
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Folder className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h2 className="mt-6 text-xl font-semibold">No categories yet</h2>
                                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                    Create categories to organize blog posts.
                                </p>
                                <Button onClick={() => setCreateDialogOpen(true)} className="mt-6">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create category
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-auto w-full">
                                <div className="min-w-full rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[15%]">Name</TableHead>
                                                <TableHead className="w-[12%]">Slug</TableHead>
                                                <TableHead className="w-[48%]">Description</TableHead>
                                                <TableHead className="w-[15%]">Created</TableHead>
                                                <TableHead className="text-right w-[10%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map((category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell className="font-medium">{category.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{category.slug}</Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs">
                                                        {category.description ? (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="truncate">{category.description}</div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="break-words">{category.description}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="">{formatDate(category.createdAt)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleUpdateClick(category)}
                                                                disabled={updateCategory.isPending}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => handleDeleteClick(category)}
                                                                disabled={deleteCategory.isPending}
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

                {/* Create Category Dialog */}
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>Add a new category to organize your blog posts.</DialogDescription>
                        </DialogHeader>
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                <FormField
                                    control={createForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => handleNameChange(e, createForm)}
                                                    placeholder="e.g. Technology"
                                                />
                                            </FormControl>
                                            <FormDescription>The display name of your category.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled placeholder="e.g. technology" />
                                            </FormControl>
                                            <FormDescription>
                                                The auto generated URL-friendly version of the name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    placeholder="Describe what this category is about..."
                                                    className="resize-none"
                                                />
                                            </FormControl>
                                            <FormDescription>Optional. Helps explain what this category contains.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCreateDialogOpen(false)}
                                        disabled={createCategory.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createCategory.isPending}
                                    >
                                        {createCategory.isPending ? (
                                            <>
                                                <LoadingSpinner size={16} spinnerClassName="mr-2" />
                                                Creating...
                                            </>
                                        ) : "Create Category"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Update Category Dialog */}
                <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Update the details of this category.</DialogDescription>
                        </DialogHeader>
                        <Form {...updateForm}>
                            <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
                                <FormField
                                    control={updateForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => handleNameChange(e, updateForm)}
                                                    placeholder="e.g. Technology"
                                                />
                                            </FormControl>
                                            <FormDescription>The display name of your category.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled placeholder="e.g. technology" />
                                            </FormControl>
                                            <FormDescription>The auto generated URL-friendly version of the name.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    placeholder="Describe what this category is about..."
                                                    className="resize-none"
                                                />
                                            </FormControl>
                                            <FormDescription>Optional. Helps explain what this category contains.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setUpdateDialogOpen(false)}
                                        disabled={updateCategory.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updateCategory.isPending}
                                    >
                                        {updateCategory.isPending ? (
                                            <>
                                                <LoadingSpinner size={16} spinnerClassName="mr-2" />
                                                Updating...
                                            </>
                                        ) : "Update Category"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Delete Category Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the category "{selectedCategory?.name}". This action cannot be undone and may
                                affect blog posts associated with this category.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteCategory.isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onDeleteConfirm}
                                className="bg-destructive text-white hover:bg-destructive/90"
                                disabled={deleteCategory.isPending}
                            >
                                {deleteCategory.isPending ? (
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

export default CategoriesPage