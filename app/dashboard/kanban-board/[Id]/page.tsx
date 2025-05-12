import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"

interface PageProps {
    params: {
        id: string
    }
}

export default function BoardPage({ params }: PageProps) {
    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <KanbanBoard boardId={params.id} />
            </main>
        </RoleBasedRoute>
    )
}
