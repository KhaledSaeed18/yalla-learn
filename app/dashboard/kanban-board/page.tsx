"use client"

import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"

export default function KanbanBoardHome() {
    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <KanbanBoard />
            </main>
        </RoleBasedRoute>
    )
}

