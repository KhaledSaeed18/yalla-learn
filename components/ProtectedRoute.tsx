"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import LoadingSpinner from "./shared/LoadingSpinner"

export default function ProtectedRoute({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/signin")
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return <LoadingSpinner fullScreen />
    }

    return <>{children}</>
}