import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"

interface PageProps {
    params: {
        Id: string
    }
}

export default function BoardPage({ params }: PageProps) {
    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <KanbanBoard boardId={params.Id} />
            </main>
        </RoleBasedRoute>
    )
}
