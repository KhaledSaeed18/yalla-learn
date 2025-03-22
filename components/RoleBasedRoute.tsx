"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import LoadingSpinner from "./shared/LoadingSpinner"

type AllowedRoles = string[] | "all"

export default function RoleBasedRoute({
    children,
    allowedRoles = "all",
    fallbackPath = "/dashboard"
}: {
    children: React.ReactNode
    allowedRoles?: AllowedRoles
    fallbackPath?: string
}) {
    const router = useRouter()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/signin")
            return
        }

        if (
            user &&
            allowedRoles !== "all" &&
            !allowedRoles.includes(user.role)
        ) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, user, router, allowedRoles, fallbackPath])

    if (!isAuthenticated || (user && allowedRoles !== "all" && !allowedRoles.includes(user.role))) {
        return <LoadingSpinner containerClassName="h-full w-full flex-1" />
    }

    return <>{children}</>
}