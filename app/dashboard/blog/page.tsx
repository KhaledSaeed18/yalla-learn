"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { MoreHorizontal, PenLine, Trash2, FileText, Eye, EyeOff, ArrowLeft, ArrowRight, X, SlidersHorizontal } from "lucide-react"
import { useGetUserBlogPosts, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/blog/useBlogs"
import type { BlogPost, BlogPostsQueryParams, PostStatus } from "@/types/blog/blog.types"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Badge } from "@/components/ui/badge"
import { useGetBlogCategories } from "@/hooks/blog/useBlogCategories"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function BlogListingPage() {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [postToToggleStatus, setPostToToggleStatus] = useState<{ id: string; newStatus: PostStatus } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 9

    // Filter states
    const [filterParams, setFilterParams] = useState<BlogPostsQueryParams>({
        page: currentPage,
        limit: postsPerPage,
    })
    const [filterStatus, setFilterStatus] = useState<PostStatus | "">("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const [sortBy, setSortBy] = useState<"title" | "createdAt" | "publishedAt" | "updatedAt">("createdAt")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [showFilters, setShowFilters] = useState(false)

    const { data: categories, isLoading: categoriesLoading } = useGetBlogCategories()

    useEffect(() => {
        const updatedParams: BlogPostsQueryParams = {
            page: currentPage,
            limit: postsPerPage,
        }

        if (filterStatus) updatedParams.status = filterStatus
        if (selectedCategoryId) updatedParams.categoryId = selectedCategoryId
        updatedParams.sortBy = sortBy
        updatedParams.sortOrder = sortOrder

        setFilterParams(updatedParams)
    }, [currentPage, postsPerPage, filterStatus, selectedCategoryId, sortBy, sortOrder])

    useEffect(() => {
        setCurrentPage(1)
    }, [filterStatus, selectedCategoryId, sortBy, sortOrder])

    const { data: blogData, isLoading, isError, error, refetch, isFetching } = useGetUserBlogPosts(filterParams)

    const updateBlogPost = useUpdateBlogPost()
    const deleteBlogPost = useDeleteBlogPost()

    const clearFilters = () => {
        setFilterStatus("")
        setSelectedCategoryId("")
        setSortBy("createdAt")
        setSortOrder("desc")
        setShowFilters(false)
    }

    const handleDeleteClick = (postId: string) => {
        setPostToDelete(postId)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (postToDelete) {
            deleteBlogPost.mutate(postToDelete, {
                onSuccess: () => {
                    setPostToDelete(null)
                    setDeleteDialogOpen(false)
                },
            })
        }
    }

    const handleStatusToggle = (post: BlogPost) => {
        const newStatus: PostStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
        setPostToToggleStatus({ id: post.id, newStatus })
        setStatusDialogOpen(true)
    }

    const confirmStatusChange = () => {
        if (postToToggleStatus) {
            updateBlogPost.mutate(
                {
                    id: postToToggleStatus.id,
                    postData: { status: postToToggleStatus.newStatus },
                },
                {
                    onSuccess: () => {
                        setPostToToggleStatus(null)
                        setStatusDialogOpen(false)
                    },
                },
            )
        }
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

    const getBlogPosts = () => {
        return blogData?.posts || []
    }

    function Pagination() {
        const totalPages = blogData?.pagination?.totalPages || 1

        if (totalPages <= 1) return null

        if (isFetching) {
            return (
                <div className="flex justify-center items-center mt-8 gap-2">
                    <Skeleton className="h-10 w-24" />
                    <div className="flex items-center gap-1 px-2">
                        {Array.from({ length: 3 }, (_, i) => (
                            <Skeleton key={i} className="w-10 h-10 rounded-md" />
                        ))}
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
            )
        }

        return (
            <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="size-9"
                >
                    <ArrowLeft />
                </Button>

                <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i + 1}
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            size="sm"
                            className="size-9"
                            onClick={() => setCurrentPage(i + 1)}
                            disabled={isFetching}
                        >
                            {i + 1}
                        </Button>
                    )).slice(
                        Math.max(0, Math.min(currentPage - 3, totalPages - 4)),
                        Math.max(4, Math.min(currentPage + 2, totalPages)),
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <span className="mx-1">...</span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-9"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={isFetching}
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}
                </div>

                <Button
                    variant="outline"
                    className="size-9"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isFetching}
                >
                    <ArrowRight />
                </Button>
            </div>
        )
    }

    const FilterUI = () => (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex gap-2">
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                            {(filterStatus || selectedCategoryId || sortBy !== "createdAt" || sortOrder !== "desc") && (
                                <Badge variant="secondary" className="ml-1 hidden sm:flex h-5 px-1">
                                    {
                                        [
                                            filterStatus && "1",
                                            selectedCategoryId && "1",
                                            (sortBy !== "createdAt" || sortOrder !== "desc") && "1",
                                        ].filter(Boolean).length
                                    }
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] sm:w-[350px]" align="end">
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Filter Posts</h4>
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                                    Reset
                                </Button>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as PostStatus | "")}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriesLoading ? (
                                            <SelectItem value="loading" disabled>
                                                Loading categories...
                                            </SelectItem>
                                        ) : (
                                            <ScrollArea className="h-[180px]">
                                                {categories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </ScrollArea>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="grid gap-2">
                                <Label htmlFor="sortBy">Sort By</Label>
                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                                        <SelectTrigger id="sortBy" className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="title">Title</SelectItem>
                                            <SelectItem value="createdAt">Created Date</SelectItem>
                                            <SelectItem value="updatedAt">Updated Date</SelectItem>
                                            <SelectItem value="publishedAt">Published Date</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                                        <SelectTrigger id="sortOrder">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">Ascending</SelectItem>
                                            <SelectItem value="desc">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Link href="/dashboard/blog/editor">
                    <Button>
                        <PenLine className="mr-2 h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>
        </div>
    )

    const BlogPostsSkeleton = () => {
        return Array(9)
            .fill(0)
            .map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-6 w-[70%]" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                        <CardDescription className="flex justify-between text-sm text-muted-foreground">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-9 w-full rounded-md" />
                    </CardFooter>
                </Card>
            ))
    }

    const ActiveFiltersDisplay = () => {
        const hasFilters =
            filterStatus || selectedCategoryId || sortBy !== "createdAt" || sortOrder !== "desc"

        if (!hasFilters) return null

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {filterStatus && (
                    <Badge variant="secondary" className="flex items-center gap-1 py-1">
                        Status: {filterStatus === "PUBLISHED" ? "Published" : "Draft"}
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setFilterStatus("")}>
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}

                {selectedCategoryId && (
                    <Badge variant="secondary" className="flex items-center gap-1 py-1">
                        Category: {categories?.find((c) => c.id === selectedCategoryId)?.name || "Selected"}
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setSelectedCategoryId("")}>
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}

                {(sortBy !== "createdAt" || sortOrder !== "desc") && (
                    <Badge variant="secondary" className="flex items-center gap-1 py-1">
                        Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 p-0"
                            onClick={() => {
                                setSortBy("createdAt")
                                setSortOrder("desc")
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}

                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                        Clear all
                    </Button>
                )}
            </div>
        )
    }

    if (isError) {
        return (
            <main>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Blog Posts</h1>
                    <Link href="/dashboard/blog/editor">
                        <Button>
                            <PenLine className="mr-2 h-4 w-4" />
                            New Post
                        </Button>
                    </Link>
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
        )
    }

    return (
        <main className="mb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <FilterUI />
            </div>

            <ActiveFiltersDisplay />

            {isLoading ? (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <BlogPostsSkeleton />
                    </div>
                    <div className="mt-8">
                        <Pagination />
                    </div>
                </>
            ) : getBlogPosts().length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold">No blog posts yet</h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        You haven't created any blog posts. Start creating content by clicking the button below.
                    </p>
                    <Link href="/dashboard/blog/editor" className="mt-6">
                        <Button>
                            <PenLine className="mr-2 h-4 w-4" />
                            Create your first post
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-70" : ""}`}>
                        {getBlogPosts().map((post) => (
                            <Card key={post.id} className="overflow-hidden">
                                <CardHeader className="pb-1">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{post.title}</CardTitle>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleStatusToggle(post)} disabled={updateBlogPost.isPending}>
                                                    {post.status === "PUBLISHED" ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" />
                                                            Set as Draft
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Publish
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDeleteClick(post.id)}
                                                    disabled={deleteBlogPost.isPending}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardDescription className="flex justify-between text-sm text-muted-foreground">
                                        <span>{formatDate(post.createdAt)}</span>
                                        <span className={post.status === "DRAFT" ? "text-amber-500" : "text-emerald-500"}>
                                            {post.status === "DRAFT" ? "Draft" : "Published"}
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Badge variant="outline" className="text-sm">
                                        {post.slug || "No Slug available"}
                                    </Badge>
                                    <p className="text-sm">{post.excerpt || "No excerpt available"}</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/dashboard/blog/editor?id=${post.id}`} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            View & Edit
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {isFetching && (
                        <div className="fixed bottom-4 right-4 bg-background border rounded-full shadow-lg p-3 z-50">
                            <LoadingSpinner size={24} />
                        </div>
                    )}

                    <Pagination />
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the blog post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteBlogPost.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-white hover:bg-destructive/90"
                            disabled={deleteBlogPost.isPending}
                        >
                            {deleteBlogPost.isPending ? (
                                <>
                                    <LoadingSpinner size={16} spinnerClassName="mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Status Change Confirmation Dialog */}
            <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {postToToggleStatus?.newStatus === "PUBLISHED" ? "Publish this post?" : "Change to draft status?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {postToToggleStatus?.newStatus === "PUBLISHED"
                                ? "This will make the post visible to all readers."
                                : "This will hide the post from readers until you publish it again."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={updateBlogPost.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmStatusChange}
                            disabled={updateBlogPost.isPending}
                            className={
                                postToToggleStatus?.newStatus === "PUBLISHED"
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-amber-600 text-white hover:bg-amber-700"
                            }
                        >
                            {updateBlogPost.isPending ? (
                                <>
                                    <LoadingSpinner size={16} spinnerClassName="mr-2" />
                                    {postToToggleStatus?.newStatus === "PUBLISHED" ? "Publishing..." : "Setting as Draft..."}
                                </>
                            ) : postToToggleStatus?.newStatus === "PUBLISHED" ? (
                                "Publish"
                            ) : (
                                "Set as Draft"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}

