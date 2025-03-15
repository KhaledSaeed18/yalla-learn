"use client"

import type React from "react"
import { Suspense, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { DashboardHeader } from "@/components/dashboard/Header"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Loader2 } from "lucide-react"

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
        return <div className="flex h-screen w-screen items-center justify-center">
            <Loader2 className="size-10 animate-spin" />
        </div>
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex flex-1 overflow-hidden">
                <DashboardSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <DashboardHeader />
                    <Suspense fallback={<div className="p-3">Loading...</div>}>
                        <main className="flex-1 p-3">
                            {children}
                        </main>
                    </Suspense>
                </div>
            </div>
        </SidebarProvider>
    )
}

