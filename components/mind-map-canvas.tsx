"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { ZoomIn, ZoomOut, MoveHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

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
const LEVEL_GAP = 120
const SIBLING_GAP = 20
const NODE_BORDER_RADIUS = 8

export default function MindMapCanvas({ data }: MindMapCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [processedData, setProcessedData] = useState<MindMapNode | null>(null)

    // Process the data to calculate positions
    useEffect(() => {
        if (!data?.root) return

        const root = { ...data.root }

        // Calculate node dimensions
        const calculateNodeDimensions = (node: MindMapNode) => {
            const ctx = document.createElement("canvas").getContext("2d")
            if (!ctx) return node

            ctx.font = "14px Arial"
            const textWidth = ctx.measureText(node.text).width

            node.width = textWidth + NODE_PADDING * 2
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
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Apply transformations
        ctx.save()
        ctx.translate(canvas.width / 2 + offset.x, canvas.height / 3 + offset.y)
        ctx.scale(scale, scale)

        // Draw function for nodes and connections
        const drawNode = (node: MindMapNode) => {
            if (!ctx) return

            // Draw connections to children
            if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                    if (node.x !== undefined && node.y !== undefined && child.x !== undefined && child.y !== undefined) {
                        ctx.beginPath()
                        ctx.moveTo(node.x + (node.width || 0), node.y + NODE_HEIGHT / 2)
                        ctx.lineTo(child.x, child.y + NODE_HEIGHT / 2)
                        ctx.strokeStyle = "#aaa"
                        ctx.lineWidth = 2
                        ctx.stroke()
                    }

                    drawNode(child)
                }
            }

            // Draw node
            if (node.x !== undefined && node.y !== undefined) {
                // Node background
                ctx.fillStyle = node === processedData ? "#3b82f6" : "#f3f4f6"
                ctx.strokeStyle = node === processedData ? "#2563eb" : "#d1d5db"
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.roundRect(node.x, node.y, node.width || 100, NODE_HEIGHT, NODE_BORDER_RADIUS)
                ctx.fill()
                ctx.stroke()

                // Node text
                ctx.fillStyle = node === processedData ? "#ffffff" : "#000000"
                ctx.font = "14px Arial"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(node.text, node.x + (node.width || 100) / 2, node.y + NODE_HEIGHT / 2)
            }
        }

        drawNode(processedData)

        ctx.restore()
    }, [processedData, scale, offset])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current || !containerRef.current) return

            canvasRef.current.width = containerRef.current.clientWidth
            canvasRef.current.height = containerRef.current.clientHeight
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

    // Handle zoom
    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.1, 2))
    }

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.5))
    }

    const handleResetView = () => {
        setScale(1)
        setOffset({ x: 0, y: 0 })
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className={`h-full w-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

            <div className="absolute bottom-4 right-4 flex gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleResetView} title="Reset View">
                    <MoveHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
