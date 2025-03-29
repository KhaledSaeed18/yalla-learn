"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Eye, EyeOff, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RoleBasedRoute from "@/components/RoleBasedRoute"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { useGetBlogPosts, useAdminDeleteBlogPost } from "@/hooks/blog/useBlogs"
import { BlogPost, BlogPostsQueryParams } from "@/types/blog/blog.types"

const BlogsAdminPage = () => {
    const router = useRouter()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 10

    const [queryParams, setQueryParams] = useState<BlogPostsQueryParams>({
        page: currentPage,
        limit: postsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    const {
        data: blogData,
        isLoading,
        isError,
        error,
        refetch
    } = useGetBlogPosts(queryParams)

    const deletePost = useAdminDeleteBlogPost()

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        setQueryParams(prev => ({
            ...prev,
            page: newPage
        }))
    }

    const handleDeleteClick = (post: BlogPost) => {
        setSelectedPost(post)
        setDeleteDialogOpen(true)
    }

    const onDeleteConfirm = () => {
        if (!selectedPost) return

        deletePost.mutate(selectedPost.id, {
            onSuccess: () => {
                setDeleteDialogOpen(false)
                setSelectedPost(null)

                if (blogData?.posts.length === 1 && currentPage > 1) {
                    handlePageChange(currentPage - 1)
                }
            }
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const handleViewPost = (post: BlogPost) => {
        window.open(`/blog/${post.slug}`, '_blank')
    }

    const TableRowsSkeleton = () => {
        return Array(5).fill(0).map((_, index) => (
            <TableRow key={`skeleton-row-${index}`}>
                <TableCell>
                    <Skeleton className="h-5 w-full max-w-[180px]" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-24" />
                    </div>
                </TableCell>
                <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
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

    const Pagination = () => {
        const totalItems = blogData?.pagination?.total || 0
        const totalPages = Math.ceil(totalItems / postsPerPage)

        if (totalPages <= 1) return null

        return (
            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || isLoading}
                    title="First page"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-4" />
                    <span className="sr-only">First page</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    title="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                </Button>

                <div className="flex items-center justify-center">
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    title="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages || isLoading}
                    title="Last page"
                >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-4" />
                    <span className="sr-only">Last page</span>
                </Button>
            </div>
        )
    }

    if (isError) {
        return (
            <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <main>
                    <div className="flex justify-between items-center pb-6">
                        <h1 className="text-3xl font-bold">All Blog Posts</h1>
                    </div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
                                <h2 className="text-lg font-semibold">Error loading blog posts</h2>
                                <p>{(error as any)?.message || "Failed to load blog posts. Please try again."}</p>
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
                    <h1 className="text-3xl font-bold">All Blog Posts</h1>
                    <Button onClick={() => router.push('/dashboard/blog/editor')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Post
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Blog Posts</CardTitle>
                        <CardDescription>
                            Manage all blog posts. View or delete blog posts as needed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="overflow-auto w-full">
                                <div className="min-w-full rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[25%]">Title</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Author</TableHead>
                                                <TableHead className="w-[10%]">Status</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Created</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Published</TableHead>
                                                <TableHead className="text-right w-[20%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRowsSkeleton />
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : !blogData || blogData.posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <FileText className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h2 className="mt-6 text-xl font-semibold">No blog posts yet</h2>
                                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                    Create your first blog post to get started.
                                </p>
                                <Button onClick={() => router.push('/dashboard/blog/editor')} className="mt-6">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create blog post
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full">
                                <div className="min-w-full rounded-md border">
                                    <Table className="w-full table-auto">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[25%]">Title</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Author</TableHead>
                                                <TableHead className="w-[10%]">Status</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Created</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Published</TableHead>
                                                <TableHead className="text-right w-[20%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {blogData.posts.map((post) => (
                                                <TableRow key={post.id}>
                                                    <TableCell className="font-medium">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="truncate max-w-[250px]">{post.title}</div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{post.title}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <div className="flex flex-col">
                                                            <span>{post.user.firstName} {post.user.lastName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={post.status === 'PUBLISHED' ? 'secondary' : 'default'}>
                                                            {post.status === 'PUBLISHED' ? (
                                                                <Eye className="w-3 h-3 mr-1" />
                                                            ) : (
                                                                <EyeOff className="w-3 h-3 mr-1" />
                                                            )}
                                                            {post.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">{formatDate(post.createdAt)}</TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewPost(post)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                <span className="sr-only">View</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => handleDeleteClick(post)}
                                                                disabled={deletePost.isPending}
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
                                    <Pagination />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Blog Post Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the blog post "{selectedPost?.title}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deletePost.isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onDeleteConfirm}
                                className="bg-destructive text-white hover:bg-destructive/90"
                                disabled={deletePost.isPending}
                            >
                                {deletePost.isPending ? (
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

export default BlogsAdminPage