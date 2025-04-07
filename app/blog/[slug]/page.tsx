"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { useGetBlogPost } from "@/hooks/blog/useBlogs"
import { CalendarIcon, ClockIcon, CopyIcon, FacebookIcon, LinkedinIcon, ShareIcon, TagIcon, TwitterIcon, UserIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Head from "next/head"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export default function BlogPostPage() {
    const params = useParams<{ slug: string }>()
    const { data: post, isLoading, isError, error } = useGetBlogPost(params.slug)
    const [mounted, setMounted] = useState(false)
    const [pageUrl, setPageUrl] = useState("")

    useEffect(() => {
        setMounted(true)
        if (typeof window !== 'undefined') {
            setPageUrl(window.location.href)
        }
    }, [])

    useEffect(() => {
        if (mounted && !isLoading && !post) {
            notFound()
        }
    }, [mounted, isLoading, post])

    useEffect(() => {
        if (post) {
            document.title = `${post.title} | Blog`

            let descriptionMeta = document.querySelector('meta[name="description"]')
            let ogTitleMeta = document.querySelector('meta[property="og:title"]')
            let ogDescriptionMeta = document.querySelector('meta[property="og:description"]')
            let ogImageMeta = document.querySelector('meta[property="og:image"]')

            if (!descriptionMeta) {
                descriptionMeta = document.createElement('meta')
                descriptionMeta.setAttribute('name', 'description')
                document.head.appendChild(descriptionMeta)
            }

            if (!ogTitleMeta) {
                ogTitleMeta = document.createElement('meta')
                ogTitleMeta.setAttribute('property', 'og:title')
                document.head.appendChild(ogTitleMeta)
            }

            if (!ogDescriptionMeta) {
                ogDescriptionMeta = document.createElement('meta')
                ogDescriptionMeta.setAttribute('property', 'og:description')
                document.head.appendChild(ogDescriptionMeta)
            }

            if (!ogImageMeta) {
                ogImageMeta = document.createElement('meta')
                ogImageMeta.setAttribute('property', 'og:image')
                document.head.appendChild(ogImageMeta)
            }

            descriptionMeta.setAttribute('content', post.excerpt || `Read ${post.title} by ${post.user.firstName} ${post.user.lastName}`)
            ogTitleMeta.setAttribute('content', post.title)
            ogDescriptionMeta.setAttribute('content', post.excerpt || `Article by ${post.user.firstName} ${post.user.lastName}`)

            if (post.thumbnail) {
                ogImageMeta.setAttribute('content', post.thumbnail)
            }
        }
    }, [post])

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            toast('URL copied to clipboard!', {
                description: "You can now share it manually.",
            });
        } catch (error) {
            console.error("Error copying text:", error);
            toast('Failed to copy URL.', {
                description: "Please try again or copy manually.",
            });
        }
    };

    const shareToSocial = (platform: string) => {
        if (!post) return;

        const title = encodeURIComponent(post.title);
        const url = encodeURIComponent(pageUrl);
        const text = encodeURIComponent(post.excerpt || `Article by ${post.user.firstName} ${post.user.lastName}`);

        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    const handleShare = async () => {
        if (!post) return;

        const shareData = {
            title: post.title,
            text: post.excerpt || `Article by ${post.user.firstName} ${post.user.lastName}`,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(window.location.href);
                toast('URL copied to clipboard!', {
                    description: "You can now share it manually.",
                });
            }
        } catch (error) {
            console.error("Error sharing content:", error);
            toast('Failed to share content.', {
                description: "Please try again or copy the link manually.",
            });
        }
    };

    if (isLoading) {
        return <BlogPostSkeleton />
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <h1 className="text-2xl font-bold text-red-500">Error Loading Blog Post</h1>
                <p className="text-muted-foreground">{(error as Error)?.message || "An unexpected error occurred"}</p>
                <Button asChild>
                    <Link href="/blog">Return to Blog</Link>
                </Button>
            </div>
        )
    }

    if (!post) {
        return null
    }

    return (
        <>
            <Head>
                <title>{post.title} | Blog</title>
                <meta name="description" content={post.excerpt || `Read ${post.title} by ${post.user.firstName} ${post.user.lastName}`} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || `Article by ${post.user.firstName} ${post.user.lastName}`} />
                {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.publishedAt || post.createdAt} />
                <meta property="article:author" content={`${post.user.firstName} ${post.user.lastName}`} />
                {post.categories.map(category => (
                    <meta key={category.id} property="article:tag" content={category.name} />
                ))}
            </Head>

            <article className="flex flex-col space-y-8">
                {/* Status badge for drafts */}
                {post.status === "DRAFT" && (
                    <div className="w-full flex justify-center mb-2">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 text-sm">
                            Draft - Not Published
                        </Badge>
                    </div>
                )}

                {/* Header with Share Button */}
                <div className="space-y-4">
                    <div className="flex justify-end mb-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <ShareIcon className="h-4 w-4" />
                                    Share
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4">
                                <h3 className="font-semibold mb-2">Share this article</h3>
                                <div className="flex space-x-2 mb-4">
                                    <Input
                                        value={pageUrl}
                                        readOnly
                                        className="text-xs"
                                        onClick={(e) => e.currentTarget.select()}
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleCopyLink}
                                        title="Copy link"
                                    >
                                        <CopyIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex justify-center space-x-4">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => shareToSocial('twitter')}
                                        title="Share on Twitter"
                                    >
                                        <TwitterIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => shareToSocial('facebook')}
                                        title="Share on Facebook"
                                    >
                                        <FacebookIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => shareToSocial('linkedin')}
                                        title="Share on LinkedIn"
                                    >
                                        <LinkedinIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
                        {post.title}
                    </h1>

                    {/* Meta information */}
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <UserIcon className="mr-1 h-4 w-4" />
                            <span>{post.user.firstName} {post.user.lastName}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            <time dateTime={post.publishedAt || post.createdAt}>
                                {format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}
                            </time>
                        </div>
                        <div className="flex items-center">
                            <ClockIcon className="mr-1 h-4 w-4" />
                            <span>{typeof post.readTime === 'number' ? `${post.readTime} min read` : post.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Featured image */}
                {post.thumbnail && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-md">
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Categories */}
                {post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {post.categories.map(category => (
                            <Badge key={category.id} variant="secondary" className="px-3 py-1">
                                <TagIcon className="h-3 w-3 mr-1" />
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Excerpt */}
                {post.excerpt && (
                    <div className="prose prose-lg max-w-none text-center italic text-muted-foreground">
                        {post.excerpt}
                    </div>
                )}

                <Separator />

                {/* Main content */}
                <div
                    className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Author section */}
                <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Avatar className="h-16 w-16">
                            {post.user.avatar ? (
                                <AvatarImage src={post.user.avatar} alt={`${post.user.firstName} ${post.user.lastName}`} />
                            ) : (
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user.firstName} ${post.user.lastName}`} alt={`${post.user.firstName} ${post.user.lastName}`} />
                            )}
                            <AvatarFallback>{post.user.firstName[0]}{post.user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg font-medium">About {post.user.firstName} {post.user.lastName}</h3>
                            {post.user.bio && (
                                <p className="text-sm mt-1">
                                    {post.user.bio}
                                </p>
                            )}
                            {post.user.location && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="inline-flex items-center">
                                        {post.user.location}
                                    </span>
                                </p>
                            )}
                            {!post.user.bio && !post.user.location && (
                                <p className="text-muted-foreground">
                                    Author of this article
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                    <Button variant="outline" asChild>
                        <Link href="/blog">
                            ← Back to all articles
                        </Link>
                    </Button>
                </div>
            </article>
        </>
    )
}

function BlogPostSkeleton() {
    return (
        <div className="flex flex-col space-y-8 animate-pulse">
            <div className="space-y-4">
                <Skeleton className="h-14 w-3/4 mx-auto" />
                <div className="flex justify-center items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            <Skeleton className="w-full aspect-video rounded-lg" />

            <div className="flex flex-wrap gap-2 justify-center">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <Skeleton className="h-20 w-full" />

            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
            </div>
        </div>
    )
}
