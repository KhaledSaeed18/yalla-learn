"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { MoreHorizontal, PenLine, Trash2, FileText, Eye, EyeOff } from "lucide-react"
import { useGetUserBlogPosts, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/blog/useBlogs"
import { BlogPost, PostStatus } from "@/types/blog/blog.types"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export default function BlogListingPage() {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [postToToggleStatus, setPostToToggleStatus] = useState<{ id: string; newStatus: PostStatus } | null>(null)

    const { 
        data: blogData,
        isLoading,
        isError,
        error,
        refetch
    } = useGetUserBlogPosts()

    const updateBlogPost = useUpdateBlogPost()
    const deleteBlogPost = useDeleteBlogPost()

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
                }
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
            updateBlogPost.mutate({
                id: postToToggleStatus.id,
                postData: { status: postToToggleStatus.newStatus }
            }, {
                onSuccess: () => {
                    setPostToToggleStatus(null)
                    setStatusDialogOpen(false)
                }
            })
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    }

    const getBlogPosts = () => {
        return blogData?.posts || []
    }

    // Skeleton loading component
    const BlogPostsSkeleton = () => {
        return Array(3).fill(0).map((_, index) => (
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

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <BlogPostsSkeleton />
                </div>
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {getBlogPosts().map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
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
                                            <DropdownMenuItem 
                                                onClick={() => handleStatusToggle(post)}
                                                disabled={updateBlogPost.isPending}
                                            >
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
                            <CardContent>
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
                            ) : "Delete"}
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
                            ) : (
                                postToToggleStatus?.newStatus === "PUBLISHED" ? "Publish" : "Set as Draft"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}