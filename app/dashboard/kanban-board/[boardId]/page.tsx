import KanbanBoard from "@/components/kanban/kanban-board"
import RoleBasedRoute from "@/components/RoleBasedRoute"

type Props = {
    params: {
        boardId: string
    }
}

export default function BoardPage({ params }: Props) {
    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <KanbanBoard boardId={params.boardId} />
            </main>
        </RoleBasedRoute>
    )
}
