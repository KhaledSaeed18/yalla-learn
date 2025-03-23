"use client"

import type React from "react"
import { Suspense, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { DashboardHeader } from "@/components/dashboard/Header"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export default function DashboardLayout({
    children,
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

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex flex-1 overflow-x-hidden">
                <DashboardSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                    <DashboardHeader />
                    <Suspense fallback={<LoadingSpinner fullScreen />}>
                        <main className="flex-1 p-3 overflow-x-hidden">
                            {children}
                        </main>
                    </Suspense>
                </div>
            </div>
        </SidebarProvider>
    )
}

