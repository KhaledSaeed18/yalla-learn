"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, ImageIcon } from "lucide-react"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { blogPostSchema, type BlogPostFormValues } from "@/lib/blog/validation"

// Mock data for categories - in a real app, you would fetch this from your API
const categories = [
    { id: "1", name: "Technology", slug: "technology" },
    { id: "2", name: "Design", slug: "design" },
    { id: "3", name: "Business", slug: "business" },
    { id: "4", name: "Marketing", slug: "marketing" },
]

export default function CreateBlogPost() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [commandOpen, setCommandOpen] = useState(false)

    const form = useForm<BlogPostFormValues>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            thumbnail: "",
            status: "DRAFT",
            readTime: undefined,
            publishedAt: null,
            categories: [],
        },
    })

    const { watch, setValue } = form

    // Watch content to update the form value when the editor changes
    const content = watch("content")

    function handleEditorChange(newContent: string) {
        setValue("content", newContent, { shouldValidate: true })
    }

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const title = e.target.value
        setValue("title", title)

        // Auto-generate slug from title
        if (title) {
            const slug = title
                .toLowerCase()
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "-")
            setValue("slug", slug, { shouldValidate: true })
        }
    }

    function onSubmit(data: BlogPostFormValues) {
        console.log("Form submitted:", data)
        // Here you would typically send the data to your API
        // For example: await createBlogPost(data)
    }

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>

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
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter blog title" {...field} onChange={handleTitleChange} />
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
                                                    <Input placeholder="enter-slug-here" {...field} />
                                                </FormControl>
                                                <FormDescription>The URL-friendly version of the title</FormDescription>
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
                                    <CardTitle>Content</CardTitle>
                                    <CardDescription>Write your blog post content</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={() => (
                                            <FormItem>
                                                <FormControl>
                                                    <TipTapEditor
                                                        content={content}
                                                        onChange={handleEditorChange}
                                                        className="min-h-[400px] border rounded-md p-4"
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
                                        name="publishedAt"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Publish Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground",
                                                                )}
                                                            >
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value || undefined}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>Leave empty to use the current date when publishing</FormDescription>
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
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Estimated reading time"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

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
                                                <FormLabel>Categories</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
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
                                                                            {categories.map((category) => (
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
                                                    </div>
                                                </FormControl>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {selectedCategories.map((id) => {
                                                        const category = categories.find((c) => c.id === id)
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
                                                        <Input placeholder="Image URL or upload" {...field} />
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

                            <div className="flex justify-end gap-4">
                                <Button variant="outline" type="button">
                                    Save as Draft
                                </Button>
                                <Button type="submit">Publish</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

