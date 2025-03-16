"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { MoreHorizontal, PenLine, Trash2, FileText, Eye, EyeOff } from "lucide-react"

const initialBlogPosts = [
    {
        id: "1",
        title: "Getting Started with Next.js",
        excerpt: "Learn how to build modern web applications with Next.js and React.",
        date: "March 10, 2025",
        status: "Published",
    },
    {
        id: "2",
        title: "Mastering TypeScript",
        excerpt: "Discover the power of TypeScript and how it can improve your development workflow.",
        date: "March 8, 2025",
        status: "Published",
    },
    {
        id: "3",
        title: "UI Component Libraries",
        excerpt: "A comparison of popular UI component libraries for React applications.",
        date: "March 5, 2025",
        status: "Draft",
    },
    {
        id: "4",
        title: "State Management in 2025",
        excerpt: "Modern approaches to state management in React applications.",
        date: "March 1, 2025",
        status: "Published",
    },
]

export default function BlogListingPage() {
    const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [postToToggleStatus, setPostToToggleStatus] = useState<{ id: string; newStatus: string } | null>(null)

    const handleDeleteClick = (postId: string) => {
        setPostToDelete(postId)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (postToDelete) {
            setBlogPosts(blogPosts.filter((post) => post.id !== postToDelete))
            setPostToDelete(null)
        }
        setDeleteDialogOpen(false)
    }

    const handleStatusToggle = (postId: string) => {
        const post = blogPosts.find((post) => post.id === postId)
        if (post) {
            const newStatus = post.status === "Published" ? "Draft" : "Published"
            setPostToToggleStatus({ id: postId, newStatus })
            setStatusDialogOpen(true)
        }
    }

    const confirmStatusChange = () => {
        if (postToToggleStatus) {
            setBlogPosts(
                blogPosts.map((post) =>
                    post.id === postToToggleStatus.id ? { ...post, status: postToToggleStatus.newStatus } : post,
                ),
            )
            setPostToToggleStatus(null)
        }
        setStatusDialogOpen(false)
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

            {blogPosts.length === 0 ? (
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
                    {blogPosts.map((post) => (
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
                                            <DropdownMenuItem onClick={() => handleStatusToggle(post.id)}>
                                                {post.status === "Published" ? (
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
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardDescription className="flex justify-between text-sm text-muted-foreground">
                                    <span>{post.date}</span>
                                    <span className={post.status === "Draft" ? "text-amber-500" : "text-emerald-500"}>{post.status}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{post.excerpt}</p>
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
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Status Change Confirmation Dialog */}
            <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {postToToggleStatus?.newStatus === "Published" ? "Publish this post?" : "Change to draft status?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {postToToggleStatus?.newStatus === "Published"
                                ? "This will make the post visible to all readers."
                                : "This will hide the post from readers until you publish it again."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmStatusChange}
                            className={
                                postToToggleStatus?.newStatus === "Published"
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-amber-600 text-white hover:bg-amber-700"
                            }
                        >
                            {postToToggleStatus?.newStatus === "Published" ? "Publish" : "Set as Draft"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}

