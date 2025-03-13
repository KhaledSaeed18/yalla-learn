"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, LinkIcon, ImageIcon, Code, Heading1, Heading2, Heading3, FileText } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

interface TipTapEditorProps {
    content: string
    onChange: (content: string) => void
    className?: string
    placeholder?: string
    maxHeight?: string
}

export function TipTapEditor({
    content,
    onChange,
    className,
    placeholder = "Write something amazing...",
    maxHeight = "500px",
}: TipTapEditorProps) {
    const [linkUrl, setLinkUrl] = useState<string>("")
    const [linkDialogOpen, setLinkDialogOpen] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false)
    const [wordCount, setWordCount] = useState<number>(0)
    const [charCount, setCharCount] = useState<number>(0)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline underline-offset-4",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-md max-w-full h-auto my-4",
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const newContent = editor.getHTML()
            onChange(newContent)
            const text = editor.getText()
            setCharCount(text.length)
            setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none max-w-none",
                spellcheck: "true",
            },
        },
    })

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!editor) return

            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault()
                if (editor.isActive("link")) {
                    editor.chain().focus().unsetLink().run()
                } else {
                    setLinkDialogOpen(true)
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [editor])

    const addLink = useCallback(() => {
        if (!editor || !linkUrl) return

        const url = linkUrl.match(/^https?:\/\//) ? linkUrl : `https://${linkUrl}`

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()

        setLinkUrl("")
        setLinkDialogOpen(false)
    }, [editor, linkUrl])

    const addImage = useCallback(() => {
        if (!editor || !imageUrl) return

        editor.chain().focus().setImage({ src: imageUrl, alt: "Image" }).run()

        setImageUrl("")
        setImageDialogOpen(false)
    }, [editor, imageUrl])

    const removeLink = useCallback(() => {
        if (!editor) return

        editor.chain().focus().unsetLink().run()
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className={cn("flex flex-col border rounded-lg overflow-hidden bg-card", className)}>
            <TooltipProvider delayDuration={300}>
                <div className="flex flex-wrap items-center gap-0.5 p-1 border-b bg-muted/40">
                    <div className="flex items-center border-r pr-1 mr-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("bold") ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    aria-label="Bold"
                                >
                                    <Bold className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("italic") ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    aria-label="Italic"
                                >
                                    <Italic className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center border-r pr-1 mr-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    aria-label="Heading 1"
                                >
                                    <Heading1 className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Heading 1</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    aria-label="Heading 2"
                                >
                                    <Heading2 className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Heading 2</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    aria-label="Heading 3"
                                >
                                    <Heading3 className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Heading 3</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center border-r pr-1 mr-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    aria-label="Bullet List"
                                >
                                    <List className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Bullet List</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    aria-label="Ordered List"
                                >
                                    <ListOrdered className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ordered List</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center border-r pr-1 mr-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    aria-label="Blockquote"
                                >
                                    <Quote className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Blockquote</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                    aria-label="Code Block"
                                >
                                    <Code className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Code Block</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center border-r pr-1 mr-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={editor.isActive("link") ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => {
                                        if (editor.isActive("link")) {
                                            removeLink()
                                        } else {
                                            setLinkDialogOpen(true)
                                        }
                                    }}
                                    aria-label={editor.isActive("link") ? "Remove Link" : "Add Link"}
                                >
                                    <LinkIcon className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{editor.isActive("link") ? "Remove Link (Ctrl+K)" : "Add Link (Ctrl+K)"}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setImageDialogOpen(true)} aria-label="Add Image">
                                    <ImageIcon className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add Image</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().undo().run()}
                                    disabled={!editor.can().undo()}
                                    aria-label="Undo"
                                >
                                    <Undo className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().redo().run()}
                                    disabled={!editor.can().redo()}
                                    aria-label="Redo"
                                >
                                    <Redo className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </TooltipProvider>

            <div className="relative overflow-auto" style={{ maxHeight }}>
                <EditorContent editor={editor} className="p-4 min-h-[200px]" />
            </div>

            <div className="flex justify-between items-center px-3 py-1.5 text-xs text-muted-foreground border-t bg-muted/20">
                <div className="flex items-center gap-1">
                    <FileText className="size-3.5" />
                    <span>{wordCount} words</span>
                </div>
                <div>{charCount} characters</div>
            </div>

            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Link</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Input
                            id="link-url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="col-span-3"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    addLink()
                                }
                            }}
                        />
                        <p className="text-sm text-muted-foreground">
                            {"Enter the URL of the link. If you don't include http:// or https://, https:// will be added automatically."}
                        </p>
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={addLink}>
                            Save Link
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Image</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Input
                            id="image-url"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="col-span-3"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    addImage()
                                }
                            }}
                        />
                        <p className="text-sm text-muted-foreground">Enter the URL of the image you want to insert.</p>
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button type="button" variant="outline" onClick={() => setImageDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={addImage}>
                            Insert Image
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

