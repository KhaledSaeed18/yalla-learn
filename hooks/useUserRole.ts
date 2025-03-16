import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export function useUserRole() {
    const { user } = useSelector((state: RootState) => state.auth)

    return {
        role: user?.role || "",
        isAdmin: user?.role === "ADMIN",
        isUser: user?.role === "USER",
        hasRole: (role: string) => user?.role === role,
        hasAnyRole: (roles: string[]) => user ? roles.includes(user.role) : false
    }
}