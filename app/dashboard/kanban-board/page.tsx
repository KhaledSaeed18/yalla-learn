"use client"

import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetBoards } from "@/hooks/kanban/useKanban"

export default function KanbanBoardHome() {
    const router = useRouter()
    const { data: boards, isLoading } = useGetBoards()

    useEffect(() => {
        // If boards are loaded and there's at least one board, redirect to the first board
        if (!isLoading && boards && boards.length > 0) {
            router.push(`/dashboard/kanban-board/${boards[0].id}`)
        }
    }, [boards, isLoading, router])

    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <KanbanBoard />
            </main>
        </RoleBasedRoute>
    )
}

