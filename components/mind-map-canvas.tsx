"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { ZoomIn, ZoomOut, MoveHorizontal, RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MindMapNode {
    text: string
    children?: MindMapNode[]
    x?: number
    y?: number
    width?: number
    height?: number
}

interface MindMapData {
    root: MindMapNode
}

interface MindMapCanvasProps {
    data: MindMapData
}

const NODE_HEIGHT = 40
const NODE_PADDING = 16
const LEVEL_GAP = 160
const SIBLING_GAP = 30
const NODE_BORDER_RADIUS = 8

export default function MindMapCanvas({ data }: MindMapCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [processedData, setProcessedData] = useState<MindMapNode | null>(null)
    const [hoveredNode, setHoveredNode] = useState<MindMapNode | null>(null)

    // Process the data to calculate positions
    useEffect(() => {
        if (!data?.root) return

        const root = { ...data.root }

        // Calculate node dimensions
        const calculateNodeDimensions = (node: MindMapNode) => {
            const ctx = document.createElement("canvas").getContext("2d")
            if (!ctx) return node

            ctx.font = "14px Inter, sans-serif"
            const textWidth = ctx.measureText(node.text).width

            node.width = Math.max(textWidth + NODE_PADDING * 2, 100)
            node.height = NODE_HEIGHT

            if (node.children) {
                node.children = node.children.map(calculateNodeDimensions)
            }

            return node
        }

        // Calculate node positions
        const calculateNodePositions = (
            node: MindMapNode,
            level: number,
            startY: number,
        ): { node: MindMapNode; height: number } => {
            if (!node.children || node.children.length === 0) {
                node.x = level * LEVEL_GAP
                node.y = startY
                return { node, height: NODE_HEIGHT }
            }

            let totalHeight = 0
            const processedChildren = []

            for (const child of node.children) {
                const { node: processedChild, height } = calculateNodePositions(child, level + 1, startY + totalHeight)
                processedChildren.push(processedChild)
                totalHeight += height + SIBLING_GAP
            }

            // Remove the last sibling gap
            totalHeight -= SIBLING_GAP

            // Position the parent node
            node.x = level * LEVEL_GAP
            node.y = startY + totalHeight / 2 - NODE_HEIGHT / 2
            node.children = processedChildren

            return { node, height: totalHeight }
        }

        const processedRoot = calculateNodeDimensions(root)
        const { node: positionedRoot } = calculateNodePositions(processedRoot, 0, 50)

        setProcessedData(positionedRoot)

        // Auto-center the mind map
        setOffset({ x: 0, y: 0 })
        setScale(0.9)
    }, [data])

    // Draw the mind map
    useEffect(() => {
        if (!canvasRef.current || !processedData) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        const container = containerRef.current
        if (container) {
            canvas.width = container.clientWidth * window.devicePixelRatio
            canvas.height = container.clientHeight * window.devicePixelRatio
            canvas.style.width = `${container.clientWidth}px`
            canvas.style.height = `${container.clientHeight}px`
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Apply transformations
        ctx.save()
        ctx.translate(canvas.width / (2 * window.devicePixelRatio) + offset.x, canvas.height / (3 * window.devicePixelRatio) + offset.y)
        ctx.scale(scale, scale)

        // Draw function for nodes and connections
        const drawNode = (node: MindMapNode) => {
            if (!ctx) return

            // Draw connections to children
            if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                    if (node.x !== undefined && node.y !== undefined && child.x !== undefined && child.y !== undefined) {
                        // Draw curve connection
                        const startX = node.x + (node.width || 0)
                        const startY = node.y + NODE_HEIGHT / 2
                        const endX = child.x
                        const endY = child.y + NODE_HEIGHT / 2
                        const controlX = startX + (endX - startX) / 2

                        ctx.beginPath()
                        ctx.moveTo(startX, startY)
                        ctx.bezierCurveTo(controlX, startY, controlX, endY, endX, endY)

                        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
                        gradient.addColorStop(0, node === processedData ? '#3b82f6' : '#94a3b8')
                        gradient.addColorStop(1, child === hoveredNode ? '#7c3aed' : '#94a3b8')

                        ctx.strokeStyle = gradient
                        ctx.lineWidth = node === processedData || child === hoveredNode || node === hoveredNode ? 3 : 2
                        ctx.stroke()
                    }

                    drawNode(child)
                }
            }

            // Draw node
            if (node.x !== undefined && node.y !== undefined) {
                // Node shadow
                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
                ctx.shadowBlur = 5
                ctx.shadowOffsetX = 2
                ctx.shadowOffsetY = 2

                // Node background
                let bgColor, borderColor, textColor

                if (node === hoveredNode) {
                    bgColor = '#7c3aed'
                    borderColor = '#6d28d9'
                    textColor = '#ffffff'
                } else if (node === processedData) {
                    bgColor = '#3b82f6'
                    borderColor = '#2563eb'
                    textColor = '#ffffff'
                } else {
                    bgColor = '#f8fafc'
                    borderColor = '#e2e8f0'
                    textColor = '#334155'
                }

                ctx.fillStyle = bgColor
                ctx.strokeStyle = borderColor
                ctx.lineWidth = 2

                // Draw rounded rectangle
                ctx.beginPath()
                ctx.roundRect(node.x, node.y, node.width || 100, NODE_HEIGHT, NODE_BORDER_RADIUS)
                ctx.fill()
                ctx.shadowColor = 'transparent'
                ctx.stroke()

                // Node text
                ctx.fillStyle = textColor
                ctx.font = "14px Inter, system-ui, sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"

                // Truncate text if too long
                const maxTextWidth = (node.width || 100) - NODE_PADDING * 2
                let nodeText = node.text
                let textWidth = ctx.measureText(nodeText).width

                if (textWidth > maxTextWidth) {
                    let ellipsis = '...'
                    let i = nodeText.length - 1
                    while (i > 0 && ctx.measureText(nodeText.slice(0, i) + ellipsis).width > maxTextWidth) {
                        i--
                    }
                    nodeText = nodeText.slice(0, i) + ellipsis
                }

                ctx.fillText(nodeText, node.x + (node.width || 100) / 2, node.y + NODE_HEIGHT / 2)
            }
        }

        drawNode(processedData)

        ctx.restore()
    }, [processedData, scale, offset, hoveredNode])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current || !containerRef.current) return

            canvasRef.current.width = containerRef.current.clientWidth * window.devicePixelRatio
            canvasRef.current.height = containerRef.current.clientHeight * window.devicePixelRatio
            canvasRef.current.style.width = `${containerRef.current.clientWidth}px`
            canvasRef.current.style.height = `${containerRef.current.clientHeight}px`
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Handle mouse events for dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return

        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y

        setOffset((prev) => ({
            x: prev.x + dx,
            y: prev.y + dy,
        }))

        setDragStart({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Find node under mouse cursor
    const handleMouseMoveForHover = (e: React.MouseEvent) => {
        if (isDragging || !processedData || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - (canvasRef.current.width / (2 * window.devicePixelRatio) + offset.x)) / scale
        const y = (e.clientY - rect.top - (canvasRef.current.height / (3 * window.devicePixelRatio) + offset.y)) / scale

        const isInNode = (node: MindMapNode): boolean => {
            if (node.x === undefined || node.y === undefined) return false

            return (
                x >= node.x &&
                x <= node.x + (node.width || 100) &&
                y >= node.y &&
                y <= node.y + NODE_HEIGHT
            )
        }

        const findHoveredNode = (node: MindMapNode): MindMapNode | null => {
            if (isInNode(node)) return node

            if (node.children) {
                for (const child of node.children) {
                    const found = findHoveredNode(child)
                    if (found) return found
                }
            }

            return null
        }

        const hoveredNode = findHoveredNode(processedData)
        setHoveredNode(hoveredNode)

        // Change cursor when over a node
        if (canvasRef.current) {
            canvasRef.current.style.cursor = hoveredNode ? 'pointer' : isDragging ? 'grabbing' : 'grab'
        }
    }

    // Handle zoom
    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.1, 2))
    }

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.5))
    }

    const handleResetView = () => {
        setScale(0.9)
        setOffset({ x: 0, y: 0 })
    }

    // Handle download
    const handleDownload = () => {
        if (!canvasRef.current) return

        // Create a temporary canvas with higher resolution
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (!tempCtx) return

        // Set the temporary canvas size
        tempCanvas.width = 1920
        tempCanvas.height = 1080

        // Draw the mind map to this canvas
        tempCtx.fillStyle = '#ffffff'
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

        // Apply transformations
        tempCtx.save()
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 3)
        tempCtx.scale(scale, scale)

        // Redraw on the high-resolution canvas (similar to the drawing code above)
        const drawNode = (node: MindMapNode) => {
            if (!tempCtx || !node) return

            // Draw connections to children
            if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                    if (node.x !== undefined && node.y !== undefined && child.x !== undefined && child.y !== undefined) {
                        // Draw curve connection
                        const startX = node.x + (node.width || 0)
                        const startY = node.y + NODE_HEIGHT / 2
                        const endX = child.x
                        const endY = child.y + NODE_HEIGHT / 2
                        const controlX = startX + (endX - startX) / 2

                        tempCtx.beginPath()
                        tempCtx.moveTo(startX, startY)
                        tempCtx.bezierCurveTo(controlX, startY, controlX, endY, endX, endY)

                        const gradient = tempCtx.createLinearGradient(startX, startY, endX, endY)
                        gradient.addColorStop(0, node === processedData ? '#3b82f6' : '#94a3b8')
                        gradient.addColorStop(1, '#94a3b8')

                        tempCtx.strokeStyle = gradient
                        tempCtx.lineWidth = node === processedData ? 3 : 2
                        tempCtx.stroke()
                    }

                    drawNode(child)
                }
            }

            // Draw node
            if (node.x !== undefined && node.y !== undefined) {
                // Node shadow
                tempCtx.shadowColor = 'rgba(0, 0, 0, 0.1)'
                tempCtx.shadowBlur = 5
                tempCtx.shadowOffsetX = 2
                tempCtx.shadowOffsetY = 2

                // Node background
                let bgColor, borderColor, textColor

                if (node === processedData) {
                    bgColor = '#3b82f6'
                    borderColor = '#2563eb'
                    textColor = '#ffffff'
                } else {
                    bgColor = '#f8fafc'
                    borderColor = '#e2e8f0'
                    textColor = '#334155'
                }

                tempCtx.fillStyle = bgColor
                tempCtx.strokeStyle = borderColor
                tempCtx.lineWidth = 2

                // Draw rounded rectangle
                tempCtx.beginPath()
                tempCtx.roundRect(node.x, node.y, node.width || 100, NODE_HEIGHT, NODE_BORDER_RADIUS)
                tempCtx.fill()
                tempCtx.shadowColor = 'transparent'
                tempCtx.stroke()

                // Node text
                tempCtx.fillStyle = textColor
                tempCtx.font = "14px Inter, system-ui, sans-serif"
                tempCtx.textAlign = "center"
                tempCtx.textBaseline = "middle"

                // Truncate text if too long
                const maxTextWidth = (node.width || 100) - NODE_PADDING * 2
                let nodeText = node.text
                let textWidth = tempCtx.measureText(nodeText).width

                if (textWidth > maxTextWidth) {
                    let ellipsis = '...'
                    let i = nodeText.length - 1
                    while (i > 0 && tempCtx.measureText(nodeText.slice(0, i) + ellipsis).width > maxTextWidth) {
                        i--
                    }
                    nodeText = nodeText.slice(0, i) + ellipsis
                }

                tempCtx.fillText(nodeText, node.x + (node.width || 100) / 2, node.y + NODE_HEIGHT / 2)
            }
        }

        if (processedData) {
            drawNode(processedData)
        }

        tempCtx.restore()

        // Convert to data URL and trigger download
        const dataUrl = tempCanvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = 'mindmap.png'
        link.href = dataUrl
        link.click()
    }

    return (
        <div className="relative w-full h-full" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className={`h-full w-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={(e) => {
                    handleMouseMove(e)
                    handleMouseMoveForHover(e)
                }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

            <div className="absolute bottom-4 right-4 flex gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" onClick={handleDownload}>
                                <Download className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download as PNG</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" onClick={handleZoomIn}>
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" onClick={handleZoomOut}>
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" onClick={handleResetView}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reset View</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/80 rounded-md px-3 py-1.5 backdrop-blur-sm border">
                <span className="font-medium">Tip:</span> Click and drag to move around, use buttons to zoom
            </div>
        </div>
    )
}
