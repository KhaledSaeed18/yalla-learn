"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { useGetBlogPosts } from "@/hooks/blog/useBlogs"
import { useGetBlogCategories } from "@/hooks/blog/useBlogCategories"
import { BlogPost, BlogPostsQueryParams } from "@/types/blog/blog.types"
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Clock, Search, SlidersHorizontal, TagIcon, User, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"

export default function BlogPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Pagination state
    const [currentPage, setCurrentPage] = useState(() => {
        const page = searchParams.get("page")
        return page ? parseInt(page) : 1
    })
    const postsPerPage = 9

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "")
    const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
        const categoryId = searchParams.get("categoryId")
        return categoryId || "all"
    })
    const [sortBy, setSortBy] = useState<"title" | "createdAt" | "publishedAt">(() => {
        const sort = searchParams.get("sortBy")
        return (sort as any) || "publishedAt"
    })
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() =>
        (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    )
    const [filtersOpen, setFiltersOpen] = useState(false)

    // Query parameters for fetching data
    const [queryParams, setQueryParams] = useState<BlogPostsQueryParams>({
        page: currentPage,
        limit: postsPerPage,
        status: "PUBLISHED",
        sortBy: sortBy,
        sortOrder: sortOrder
    })

    // Fetch blog posts with current query parameters
    const {
        data: blogData,
        isLoading,
        isError,
        error
    } = useGetBlogPosts(queryParams)

    // Fetch categories for filter dropdown
    const { data: categories = [] } = useGetBlogCategories()

    // Update query parameters when filters change
    useEffect(() => {
        const updatedParams: BlogPostsQueryParams = {
            page: currentPage,
            limit: postsPerPage,
            status: "PUBLISHED",
            sortBy: sortBy,
            sortOrder: sortOrder
        }

        if (searchTerm) updatedParams.search = searchTerm
        if (selectedCategoryId && selectedCategoryId !== "all") updatedParams.categoryId = selectedCategoryId

        setQueryParams(updatedParams)

        // Update URL params for bookmarking/sharing
        updateUrlWithFilters()
    }, [currentPage, postsPerPage, searchTerm, selectedCategoryId, sortBy, sortOrder])

    // Reset to page 1 when filters change (except page changes)
    useEffect(() => {
        if (searchParams.get("page")) {
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete("page")
            router.push(`/blog?${newParams.toString()}`)
        }
    }, [searchTerm, selectedCategoryId, sortBy, sortOrder])

    // Update URL parameters
    const updateUrlWithFilters = () => {
        const params = new URLSearchParams()

        if (currentPage > 1) params.set("page", currentPage.toString())
        if (searchTerm) params.set("search", searchTerm)
        if (selectedCategoryId && selectedCategoryId !== "all") params.set("categoryId", selectedCategoryId)
        if (sortBy !== "publishedAt") params.set("sortBy", sortBy)
        if (sortOrder !== "desc") params.set("sortOrder", sortOrder)

        const queryString = params.toString()
        router.push(`/blog${queryString ? `?${queryString}` : ""}`, { scroll: false })
    }

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
    }

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("")
        setSelectedCategoryId("all") // Changed from empty string to "all"
        setSortBy("publishedAt")
        setSortOrder("desc")
        setCurrentPage(1)
    }

    // Change page
    const goToPage = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Handle error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="rounded-full bg-red-100 p-3 text-red-600">
                    <X className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Failed to load blog posts</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    {(error as Error)?.message || "An unexpected error occurred. Please try again later."}
                </p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearch} className="w-full md:w-auto flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search articles..."
                            className="pl-8 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>

                <div className="flex gap-2 w-full md:w-auto">
                    <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="flex gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Filters</span>
                                {(selectedCategoryId || sortBy !== "publishedAt" || sortOrder !== "desc") && (
                                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                                        <span>•</span>
                                    </Badge>
                                )}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle>Blog Filters</DrawerTitle>
                                    <DrawerDescription>
                                        Filter and sort blog posts to find what you're looking for.
                                    </DrawerDescription>
                                </DrawerHeader>

                                <div className="p-4 space-y-6">
                                    {/* Category filter */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={selectedCategoryId}
                                            onValueChange={setSelectedCategoryId}
                                        >
                                            <SelectTrigger id="category">
                                                <SelectValue placeholder="All categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All categories</SelectItem> {/* Changed from empty string to "all" */}
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sort by filter */}
                                    <div className="space-y-2">
                                        <Label htmlFor="sortBy">Sort by</Label>
                                        <Select
                                            value={sortBy}
                                            onValueChange={(value) => setSortBy(value as typeof sortBy)}
                                        >
                                            <SelectTrigger id="sortBy">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="publishedAt">Publish Date</SelectItem>
                                                <SelectItem value="createdAt">Created Date</SelectItem>
                                                <SelectItem value="title">Title</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sort order filter */}
                                    <div className="space-y-2">
                                        <Label htmlFor="sortOrder">Sort order</Label>
                                        <Select
                                            value={sortOrder}
                                            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                                        >
                                            <SelectTrigger id="sortOrder">
                                                <SelectValue placeholder="Sort order" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="desc">Descending</SelectItem>
                                                <SelectItem value="asc">Ascending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <DrawerFooter>
                                    <Button onClick={clearFilters} variant="outline">Reset Filters</Button>
                                    <DrawerClose asChild>
                                        <Button>Apply Filters</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    {(selectedCategoryId || searchTerm || sortBy !== "publishedAt" || sortOrder !== "desc") && (
                        <Button variant="ghost" onClick={clearFilters} className="flex gap-1" size="icon">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Active filters display */}
            {(selectedCategoryId !== "all" || searchTerm) && ( // Changed condition
                <div className="flex flex-wrap gap-2 items-center text-sm">
                    <span className="text-muted-foreground">Active filters:</span>

                    {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Search className="h-3 w-3" />
                            <span>{searchTerm}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-3 w-3 ml-1 p-0"
                                onClick={() => setSearchTerm("")}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {selectedCategoryId && selectedCategoryId !== "all" && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <TagIcon className="h-3 w-3" />
                            <span>
                                {categories.find(c => c.id === selectedCategoryId)?.name || "Category"}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-3 w-3 ml-1 p-0"
                                onClick={() => setSelectedCategoryId("all")} // Changed from empty string to "all"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: postsPerPage }).map((_, i) => (
                        <BlogPostCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && (!blogData?.posts || blogData.posts.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="rounded-full bg-muted p-3">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold">No blog posts found</h2>
                    <p className="text-muted-foreground max-w-md">
                        {searchTerm || selectedCategoryId
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Check back soon for new content!"}
                    </p>
                    {(searchTerm || selectedCategoryId) && (
                        <Button onClick={clearFilters} variant="outline">
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Blog Post Grid */}
            {!isLoading && blogData?.posts && blogData.posts.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogData.posts.map((post) => (
                            <BlogPostCard key={post.id} post={post} categories={categories} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {blogData.pagination && blogData.pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 pt-6">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center space-x-1">
                                {getPaginationRange(currentPage, blogData.pagination.totalPages).map((page, i) => (
                                    page === "..." ? (
                                        <span key={`ellipsis-${i}`} className="px-2">
                                            ...
                                        </span>
                                    ) : (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => goToPage(Number(page))}
                                            className="w-8 h-8"
                                        >
                                            {page}
                                        </Button>
                                    )
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === blogData.pagination.totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

// Blog post card component
function BlogPostCard({ post, categories }: { post: BlogPost, categories: any[] }) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <Card className="h-full overflow-hidden hover:border-primary/50 transition-all hover:shadow-md">
                {post.thumbnail && (
                    <div className="relative w-full h-48 overflow-hidden">
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}

                <CardHeader className={post.thumbnail ? "pt-4" : ""}>
                    <div className="space-y-1">
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {post.excerpt ||
                                post.content.replace(/<[^>]*>/g, '').substring(0, 100) +
                                (post.content.length > 100 ? '...' : '')}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {post.categories.slice(0, 3).map((category) => (
                            <Badge key={category.id} variant="secondary" className="font-normal text-xs">
                                {category.name}
                            </Badge>
                        ))}
                        {post.categories.length > 3 && (
                            <Badge variant="outline" className="font-normal text-xs">
                                +{post.categories.length - 3} more
                            </Badge>
                        )}

                    </div>
                </CardContent>

                <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex justify-between">
                    <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>{post.user.firstName} {post.user.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-3 w-3" />
                        <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{typeof post.readTime === 'number' ? `${post.readTime} min` : post.readTime}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}

// Skeleton loader for blog post cards
function BlogPostCardSkeleton() {
    return (
        <Card className="h-full overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardHeader>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
            </CardFooter>
        </Card>
    )
}

// Helper function to create pagination range with ellipses
function getPaginationRange(current: number, total: number) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current <= 3) {
        return [1, 2, 3, 4, 5, "...", total]
    }

    if (current >= total - 2) {
        return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
    }

    return [1, "...", current - 1, current, current + 1, "...", total]
}
