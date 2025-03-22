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
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name is required and must be at least 2 characters")
        .max(50, "Category name cannot exceed 50 characters"),

    slug: z
        .string()
        .trim()
        .min(2, "Slug is required and must be at least 2 characters")
        .max(100, "Slug cannot exceed 100 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),

    description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional().nullable(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    createdAt: string
    updatedAt: string
}

const mockCategories: Category[] = [
    {
        id: "cm8e8z7k80002vkhcs549m6sr",
        name: "Technology",
        slug: "technology",
        description: "Articles about the latest tech trends, software development, and digital innovations.",
        createdAt: "2025-03-18T08:44:34.952Z",
        updatedAt: "2025-03-18T08:44:34.952Z",
    },
    {
        id: "cm8e8z7k80003vkhcs549m6sr",
        name: "Business",
        slug: "business",
        description: "Content related to entrepreneurship, management, and business strategies.",
        createdAt: "2025-03-18T09:15:22.123Z",
        updatedAt: "2025-03-18T09:15:22.123Z",
    },
    {
        id: "cm8e8z7k80004vkhcs549m6sr",
        name: "Design",
        slug: "design",
        description: "Exploring UI/UX, graphic design, and creative processes.",
        createdAt: "2025-03-18T10:30:45.789Z",
        updatedAt: "2025-03-18T10:30:45.789Z",
    },
]

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>(mockCategories)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

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
        const newCategory: Category = {
            id: `cm${Date.now()}`,
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        setCategories([...categories, newCategory])
        setCreateDialogOpen(false)
        createForm.reset()

        toast.success("Category created", {
            description: `${data.name} has been successfully created.`,
        })
    }

    const onUpdateSubmit = (data: CategoryFormValues) => {
        if (!selectedCategory) return

        const updatedCategories = categories.map((category) => {
            if (category.id === selectedCategory.id) {
                return {
                    ...category,
                    name: data.name,
                    slug: data.slug,
                    description: data.description || null,
                    updatedAt: new Date().toISOString(),
                }
            }
            return category
        })

        setCategories(updatedCategories)
        setUpdateDialogOpen(false)
        setSelectedCategory(null)

        toast.success("Category updated", {
            description: `${data.name} has been successfully updated.`,
        })
    }

    const onDeleteConfirm = () => {
        if (!selectedCategory) return

        const filteredCategories = categories.filter((category) => category.id !== selectedCategory.id)

        setCategories(filteredCategories)
        setDeleteDialogOpen(false)

        toast.success("Category deleted", {
            description: `${selectedCategory.name} has been successfully deleted.`,
        })

        setSelectedCategory(null)
    }

    const handleUpdateClick = (category: Category) => {
        setSelectedCategory(category)
        updateForm.reset({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
        })
        setUpdateDialogOpen(true)
    }

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category)
        setDeleteDialogOpen(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
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
                    {categories.length === 0 ? (
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
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead className="hidden md:table-cell">Description</TableHead>
                                        <TableHead className="hidden md:table-cell">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{category.slug}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-xs truncate">
                                                {category.description || "—"}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{formatDate(category.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleUpdateClick(category)}>
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteClick(category)}
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
                                            <Input {...field} placeholder="e.g. technology" />
                                        </FormControl>
                                        <FormDescription>
                                            The URL-friendly version of the name. Auto-generated but can be edited.
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
                                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Category</Button>
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
                                            <Input {...field} placeholder="e.g. technology" />
                                        </FormControl>
                                        <FormDescription>The URL-friendly version of the name.</FormDescription>
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
                                <Button type="button" variant="outline" onClick={() => setUpdateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Update Category</Button>
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
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}

export default CategoriesPage

