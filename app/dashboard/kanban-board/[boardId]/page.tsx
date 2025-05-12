import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"

interface PageProps {
    params: {
        boardId: string
    }
    searchParams: Record<string, string | string[] | undefined>
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
