import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"

type PageProps = {
    params: {
        boardId: string
    }
}

export default function BoardPage({ params }: PageProps) {
    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <KanbanBoard boardId={params.boardId} />
            </main>
        </RoleBasedRoute>
    )
}
