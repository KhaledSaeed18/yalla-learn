"use client"

import { Suspense } from "react"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "next/navigation"
import { BarChart, CreditCard, PiggyBank, Target, Calendar, Clock } from "lucide-react"

export default function ExpenseTrackerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()

    // Determine current tab based on the URL path
    const currentTab = pathname.split('/').pop()
    const isRootPath = pathname === '/dashboard/expense-tracker'

    const handleTabChange = (value: string) => {
        if (value === 'dashboard') {
            router.push('/dashboard/expense-tracker')
        } else {
            router.push(`/dashboard/expense-tracker/${value}`)
        }
    }

    return (
        <div className="flex flex-col space-y-6">
            <Tabs
                defaultValue={isRootPath ? 'dashboard' : currentTab}
                className="space-y-6"
                onValueChange={handleTabChange}
            >
                <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b">
                    <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        <TabsTrigger value="dashboard" className="flex gap-2 items-center">
                            <BarChart className="h-4 w-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </TabsTrigger>
                        <TabsTrigger value="expenses" className="flex gap-2 items-center">
                            <CreditCard className="h-4 w-4" />
                            <span className="hidden sm:inline">Expenses</span>
                        </TabsTrigger>
                        <TabsTrigger value="income" className="flex gap-2 items-center">
                            <PiggyBank className="h-4 w-4" />
                            <span className="hidden sm:inline">Income</span>
                        </TabsTrigger>
                        <TabsTrigger value="budgets" className="flex gap-2 items-center">
                            <Target className="h-4 w-4" />
                            <span className="hidden sm:inline">Budgets</span>
                        </TabsTrigger>
                        <TabsTrigger value="semesters" className="flex gap-2 items-center">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline">Semesters</span>
                        </TabsTrigger>
                        <TabsTrigger value="payment-schedules" className="flex gap-2 items-center">
                            <Clock className="h-4 w-4" />
                            <span className="hidden sm:inline">Schedules</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value={isRootPath ? 'dashboard' : currentTab || ''} className="m-0">
                    <Suspense fallback={<LoadingSpinner />}>
                        {children}
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}
