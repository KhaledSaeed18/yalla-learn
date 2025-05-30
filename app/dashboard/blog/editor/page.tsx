"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { blogPostSchema, type BlogPostFormValues } from "@/lib/blog/validation"
import { Checkbox } from "@/components/ui/checkbox"
import { useGetBlogCategories } from "@/hooks/blog/useBlogCategories"
import { useCreateBlogPost, useGetBlogPost, useUpdateBlogPost } from "@/hooks/blog/useBlogs"
import { toast } from "sonner"

export default function BlogEditor() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const postId = searchParams.get("id")
    const isEditMode = !!postId

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [commandOpen, setCommandOpen] = useState(false)
    const [isAutoReadTime, setIsAutoReadTime] = useState(true)
    const [isLoading, setIsLoading] = useState(isEditMode)

    const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useGetBlogCategories()
    const { data: blogPost, isLoading: isLoadingBlogPost } = useGetBlogPost(postId || "")
    const createBlogPost = useCreateBlogPost()
    const updateBlogPost = useUpdateBlogPost()

    const form = useForm<BlogPostFormValues>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            thumbnail: "",
            status: "DRAFT",
            readTime: 0,
            categories: [],
        },
        mode: "onChange",
        reValidateMode: "onChange"
    })

    const { watch, setValue, reset } = form

    const content = watch("content")

    useEffect(() => {
        if (categoriesError) {
            toast.error("Failed to load categories. Please try refreshing the page.")
        }
    }, [categoriesError])

    useEffect(() => {
        if (isEditMode && blogPost) {
            reset({
                title: blogPost.title || "",
                slug: blogPost.slug || "",
                content: blogPost.content || "",
                excerpt: blogPost.excerpt || "",
                thumbnail: blogPost.thumbnail || "",
                status: blogPost.status || "DRAFT",
                readTime: typeof blogPost.readTime === 'string' ? parseInt(blogPost.readTime, 10) : (blogPost.readTime || 0),
                categories: blogPost.categories?.map(cat => cat.id) || [],
            })

            const categoryIds = blogPost.categories?.map(cat => cat.id) || []
            setSelectedCategories(categoryIds)
            setIsAutoReadTime(false)
            setIsLoading(false)
        }
    }, [blogPost, isEditMode, reset])

    useEffect(() => {
        setIsLoading(isEditMode && isLoadingBlogPost)
    }, [isEditMode, isLoadingBlogPost])

    function handleEditorChange(newContent: string) {
        form.setValue("content", newContent, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: false
        })
    }

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const title = e.target.value
        setValue("title", title)

        if (!isEditMode || !blogPost?.slug || blogPost?.status === "DRAFT") {
            if (title) {
                const slug = title
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\s]/gi, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+$/, "")
                setValue("slug", slug, { shouldValidate: true })
            } else {
                setValue("slug", "", { shouldValidate: true })
            }
        }
    }

    useEffect(() => {
        if (isAutoReadTime && content) {
            const wordCount = content.trim().split(/\s+/).length;
            const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 225));
            setValue("readTime", estimatedReadTime, {
                shouldValidate: false,
                shouldDirty: true
            });
        }
    }, [content, isAutoReadTime, setValue]);

    function onSubmit(data: BlogPostFormValues) {
        const { categories, ...restData } = data;

        const postData = {
            ...restData,
            categoryIds: categories,
            readTime: data.readTime || 1,
        };

        if (isEditMode && postId) {
            updateBlogPost.mutate(
                {
                    id: postId,
                    postData
                },
                {
                    onSuccess: () => {
                        router.push('/dashboard/blog');
                    }
                }
            );
        } else {
            createBlogPost.mutate(postData, {
                onSuccess: () => {
                    router.push('/dashboard/blog');
                }
            });
        }
    }

    const isSubmitting = createBlogPost.isPending || updateBlogPost.isPending;
    const pageTitle = isEditMode ? "Edit Blog Post" : "Create New Blog Post";
    const buttonText = isEditMode
        ? (isSubmitting ? "Updating..." : "Update")
        : (watch("status") === "PUBLISHED"
            ? (isSubmitting ? "Publishing..." : "Publish")
            : (isSubmitting ? "Saving..." : "Save as Draft"));

    if (isLoading) {
        return (
            <main className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-lg">Loading blog post...</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <h1 className="text-3xl font-bold pb-6">{pageTitle}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Enter the main details of your blog post</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter blog title"
                                                        {...field}
                                                        onChange={handleTitleChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Auto-generated from title"
                                                        {...field}
                                                        disabled={isEditMode && !!blogPost?.slug}
                                                        className={cn("bg-muted/50", {
                                                            "cursor-not-allowed": isEditMode && !!blogPost?.slug
                                                        })}
                                                    />
                                                </FormControl>
                                                {isEditMode && !!blogPost?.slug && (
                                                    <FormDescription>Slug cannot be changed for published posts</FormDescription>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="excerpt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Excerpt</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Brief summary of your post (optional)"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>Maximum 300 characters</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Blog post content</CardTitle>
                                    <CardDescription>Write your blog post content</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Content *</FormLabel>
                                                <FormControl>
                                                    <TipTapEditor
                                                        content={content}
                                                        onChange={handleEditorChange}
                                                        className="w-full"
                                                        maxHeight="700px"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Categories & Media</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="categories"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Categories *</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        {isLoadingCategories ? (
                                                            <div className="flex items-center justify-center py-4">
                                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                                            </div>
                                                        ) : (
                                                            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                                                        Select categories
                                                                        <span className="ml-2 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
                                                                            {selectedCategories.length}
                                                                        </span>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-full p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search categories..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>No category found.</CommandEmpty>
                                                                            <CommandGroup>
                                                                                {categories?.map((category) => (
                                                                                    <CommandItem
                                                                                        key={category.id}
                                                                                        value={category.name}
                                                                                        onSelect={() => {
                                                                                            const isSelected = selectedCategories.includes(category.id)
                                                                                            const newSelectedCategories = isSelected
                                                                                                ? selectedCategories.filter((id) => id !== category.id)
                                                                                                : [...selectedCategories, category.id]
                                                                                            setSelectedCategories(newSelectedCategories)
                                                                                            setValue("categories", newSelectedCategories, {
                                                                                                shouldValidate: true,
                                                                                            })
                                                                                        }}
                                                                                    >
                                                                                        {category.name}
                                                                                        <span
                                                                                            className={cn(
                                                                                                "ml-auto",
                                                                                                selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0",
                                                                                            )}
                                                                                        >
                                                                                            ✓
                                                                                        </span>
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {selectedCategories.map((id) => {
                                                        const category = categories?.find((c) => c.id === id)
                                                        return category ? (
                                                            <Badge key={id} variant="secondary">
                                                                {category.name}
                                                            </Badge>
                                                        ) : null
                                                    })}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="thumbnail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thumbnail Image</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        <Input placeholder="Image URL or upload (optional)" {...field} />
                                                        <Button type="button" size="icon" variant="outline">
                                                            <ImageIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Enter an image URL or upload an image</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Publishing</CardTitle>
                                    <CardDescription>Configure publishing settings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="readTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Read Time (minutes)</FormLabel>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="auto-read-time"
                                                            checked={isAutoReadTime}
                                                            onCheckedChange={(checked) => setIsAutoReadTime(checked === true)}
                                                            disabled={isEditMode}
                                                        />
                                                        <label
                                                            htmlFor="auto-read-time"
                                                            className={cn(
                                                                "text-sm font-medium leading-none cursor-pointer",
                                                                isEditMode && "opacity-50"
                                                            )}
                                                        >
                                                            Auto-calculate
                                                        </label>
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder={isAutoReadTime ? "Auto-calculated from content" : "Estimated reading time (optional)"}
                                                        {...field}
                                                        disabled={isAutoReadTime}
                                                        className={isAutoReadTime ? "bg-muted/50" : ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value === "" ? undefined : Number(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {isAutoReadTime ? "Automatically calculated based on content length" : "Enter manual estimate"}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-center">
                                <Button
                                    size='lg'
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {buttonText}
                                        </>
                                    ) : (
                                        buttonText
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </main>
    )
}