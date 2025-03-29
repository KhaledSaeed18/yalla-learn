"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FileText, Eye, EyeOff, Trash2, Plus, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import RoleBasedRoute from "@/components/RoleBasedRoute"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { useGetBlogPosts, useAdminDeleteBlogPost } from "@/hooks/blog/useBlogs"
import { useGetBlogCategories } from "@/hooks/blog/useBlogCategories"
import { BlogPost, BlogPostsQueryParams, PostStatus } from "@/types/blog/blog.types"

const BlogsAdminPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

    // Page state
    const [currentPage, setCurrentPage] = useState(() => {
        const page = searchParams.get("page")
        return page ? parseInt(page) : 1
    })
    const postsPerPage = 10

    // Filter states
    const [queryParams, setQueryParams] = useState<BlogPostsQueryParams>({
        page: currentPage,
        limit: postsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    const [filterStatus, setFilterStatus] = useState<PostStatus | "">(() => {
        const status = searchParams.get("status")
        return status as PostStatus || ""
    })

    const [selectedCategoryId, setSelectedCategoryId] = useState(() =>
        searchParams.get("categoryId") || ""
    )

    const [sortBy, setSortBy] = useState<"title" | "createdAt" | "publishedAt" | "updatedAt">(() => {
        const sort = searchParams.get("sortBy")
        return (sort as any) || "createdAt"
    })

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() =>
        (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    )

    const [showFilters, setShowFilters] = useState(false)

    // Get blog categories for filter
    const { data: categories, isLoading: categoriesLoading } = useGetBlogCategories()

    // Update query parameters when filters change
    useEffect(() => {
        const updatedParams: BlogPostsQueryParams = {
            page: currentPage,
            limit: postsPerPage,
        }

        if (filterStatus) updatedParams.status = filterStatus
        if (selectedCategoryId) updatedParams.categoryId = selectedCategoryId
        updatedParams.sortBy = sortBy
        updatedParams.sortOrder = sortOrder

        setQueryParams(updatedParams)
    }, [currentPage, postsPerPage, filterStatus, selectedCategoryId, sortBy, sortOrder])

    useEffect(() => {
        setCurrentPage(1)
    }, [filterStatus, selectedCategoryId, sortBy, sortOrder])

    const {
        data: blogData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching
    } = useGetBlogPosts(queryParams)

    const deletePost = useAdminDeleteBlogPost()

    const updateUrlWithFilters = () => {
        const params = new URLSearchParams()

        if (currentPage > 1) params.set("page", currentPage.toString())
        if (filterStatus) params.set("status", filterStatus)
        if (selectedCategoryId) params.set("categoryId", selectedCategoryId)
        if (sortBy !== "createdAt") params.set("sortBy", sortBy)
        if (sortOrder !== "desc") params.set("sortOrder", sortOrder)

        const queryString = params.toString()
        const url = queryString ? `?${queryString}` : window.location.pathname

        router.replace(url, { scroll: false })
    }

    useEffect(() => {
        updateUrlWithFilters()
    }, [currentPage, filterStatus, selectedCategoryId, sortBy, sortOrder])

    const clearFilters = () => {
        setFilterStatus("")
        setSelectedCategoryId("")
        setSortBy("createdAt")
        setSortOrder("desc")
        setShowFilters(false)
        setCurrentPage(1)
    }

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
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleViewPost = (post: BlogPost) => {
        window.open(`/blog/${post.slug}`, '_blank')
    }

    const FilterUI = () => (
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
                            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value === "all" ? "" : value as PostStatus)}>
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
                            <Select value={selectedCategoryId || "all"} onValueChange={(value) => setSelectedCategoryId(value === "all" ? "" : value)}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
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

            <Button onClick={() => router.push('/dashboard/blog/editor')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Post
            </Button>
        </div>
    )

    const ActiveFiltersDisplay = () => {
        const hasFilters = filterStatus || selectedCategoryId || sortBy !== "createdAt" || sortOrder !== "desc"

        if (!hasFilters) return null

        return (
            <div className="flex flex-wrap gap-2 mb-4 mt-2">
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

    const TableRowsSkeleton = () => {
        return Array(10).fill(0).map((_, index) => (
            <TableRow key={`skeleton-row-${index}`}>
                <TableCell>
                    <Skeleton className="h-5 w-8" />
                </TableCell>
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
                    disabled={currentPage === 1 || isLoading || isFetching}
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
                    disabled={currentPage === 1 || isLoading || isFetching}
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
                    disabled={currentPage >= totalPages || isLoading || isFetching}
                    title="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages || isLoading || isFetching}
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
                    <FilterUI />
                </div>

                <ActiveFiltersDisplay />

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
                                                <TableHead className="w-[5%]">#</TableHead>
                                                <TableHead className="w-[25%]">Title</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Author</TableHead>
                                                <TableHead className="w-[10%]">Status</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Created</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Published</TableHead>
                                                <TableHead className="text-right w-[15%]">Actions</TableHead>
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
                                <h2 className="mt-6 text-xl font-semibold">No blog posts found</h2>
                                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                    {(filterStatus || selectedCategoryId || sortBy !== "createdAt" || sortOrder !== "desc")
                                        ? "Try changing your filters to see more results."
                                        : "Create your first blog post to get started."
                                    }
                                </p>
                                {(filterStatus || selectedCategoryId || sortBy !== "createdAt" || sortOrder !== "desc") ? (
                                    <Button onClick={clearFilters} variant="outline" className="mt-4">
                                        Clear filters
                                    </Button>
                                ) : (
                                    <Button onClick={() => router.push('/dashboard/blog/editor')} className="mt-6">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create blog post
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full">
                                <div className="min-w-full rounded-md border">
                                    <Table className="w-full table-auto">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[5%]">#</TableHead>
                                                <TableHead className="w-[25%]">Title</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Author</TableHead>
                                                <TableHead className="w-[10%]">Status</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Created</TableHead>
                                                <TableHead className="w-[15%] hidden md:table-cell">Published</TableHead>
                                                <TableHead className="text-right w-[15%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className={isFetching ? "opacity-60" : ""}>
                                            {blogData.posts.map((post, index) => (
                                                <TableRow key={post.id}>
                                                    <TableCell className="font-medium">
                                                        {(currentPage - 1) * postsPerPage + index + 1}
                                                    </TableCell>
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

                {/* Loading indicator */}
                {isFetching && !isLoading && (
                    <div className="fixed bottom-4 right-4 bg-background border rounded-full shadow-lg p-3 z-50">
                        <LoadingSpinner size={24} />
                    </div>
                )}
            </main>
        </RoleBasedRoute>
    )
}

export default BlogsAdminPage