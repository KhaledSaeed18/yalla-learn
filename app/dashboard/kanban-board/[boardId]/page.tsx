import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"

export default function BoardPage({ params }: { params: { boardId: string } }) {
    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <KanbanBoard boardId={params.boardId} />
            </main>
        </RoleBasedRoute>
    )
}
