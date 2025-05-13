"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BookOpen,
    CreditCard,
    DollarSign,
    Wallet,
    BarChart3,
    PieChart,
    CalendarRange,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ListChecks,
    Pencil
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

// Import analytics hooks and components
import { useGetDashboardStats, useGetExpenseSummary, useGetExpenseIncomeComparison } from '@/hooks/expense-tracker/useAnalytics';
import { useGetSemesters } from '@/hooks/expense-tracker/useSemesters';
import {
    ExpenseSummaryPieChart,
    ExpenseIncomeBarChart,
    StatsCard
} from '@/components/expense-tracker/AnalyticsCharts';
import {
    DateRangePicker,
    SemesterFilter,
    GroupByFilter
} from '@/components/expense-tracker/DateRangePicker';
import {
    ExpenseSummaryPeriod,
    GroupByOption
} from '@/types/expense-tracker/analytics.types';

const ExpenseTrackerDashboard = () => {
    const router = useRouter();

    // State for filter controls
    const [period, setPeriod] = useState<ExpenseSummaryPeriod>('this-month');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string | undefined>(undefined);
    const [groupBy, setGroupBy] = useState<GroupByOption>('month');

    // Reset dates when period changes
    useEffect(() => {
        if (period !== 'custom') {
            setStartDate(undefined);
            setEndDate(undefined);
        }
    }, [period]);

    // Get semesters for filter dropdown
    const { data: semesters = [] } = useGetSemesters();

    // Prepare query parameters
    const getDashboardStatsParams = {
        period,
        ...(period === 'custom' && startDate && { startDate: format(startDate, 'yyyy-MM-dd') }),
        ...(period === 'custom' && endDate && { endDate: format(endDate, 'yyyy-MM-dd') }),
        ...(selectedSemesterId && { semesterId: selectedSemesterId })
    };

    // Fetch dashboard statistics
    const {
        data: dashboardStats,
        isLoading: isDashboardStatsLoading
    } = useGetDashboardStats(getDashboardStatsParams);

    // Prepare expense summary params
    const expenseSummaryParams = {
        ...(period === 'custom' && startDate && { startDate: format(startDate, 'yyyy-MM-dd') }),
        ...(period === 'custom' && endDate && { endDate: format(endDate, 'yyyy-MM-dd') }),
        ...(selectedSemesterId && { semesterId: selectedSemesterId })
    };

    // Fetch expense summary for pie chart
    const {
        data: expenseSummaryData,
        isLoading: isExpenseSummaryLoading
    } = useGetExpenseSummary(expenseSummaryParams);

    // Prepare expense-income comparison params
    const expenseIncomeParams = {
        ...(period === 'custom' && startDate && { startDate: format(startDate, 'yyyy-MM-dd') }),
        ...(period === 'custom' && endDate && { endDate: format(endDate, 'yyyy-MM-dd') }),
        groupBy,
        ...(selectedSemesterId && { semesterId: selectedSemesterId })
    };

    // Fetch expense-income comparison for bar chart
    const {
        data: expenseIncomeData,
        isLoading: isExpenseIncomeLoading
    } = useGetExpenseIncomeComparison(expenseIncomeParams);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Expense Tracker Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your expenses, budgets, and financial planning
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <DateRangePicker
                        period={period}
                        startDate={startDate}
                        endDate={endDate}
                        onPeriodChange={setPeriod}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />

                    <SemesterFilter
                        semesters={semesters.map(s => ({ id: s.id, name: s.name }))}
                        selectedSemesterId={selectedSemesterId}
                        onSelect={setSelectedSemesterId}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Income"
                    value={dashboardStats?.summary?.totalIncome ?
                        `$${dashboardStats.summary.totalIncome.toFixed(2)}` :
                        "$0.00"}
                    description={`For ${period.replace('-', ' ')}`}
                    loading={isDashboardStatsLoading}
                    icon={<DollarSign className="h-4 w-4" />}
                />

                <StatsCard
                    title="Total Expenses"
                    value={dashboardStats?.summary?.totalExpenses ?
                        `$${dashboardStats.summary.totalExpenses.toFixed(2)}` :
                        "$0.00"}
                    description={`For ${period.replace('-', ' ')}`}
                    loading={isDashboardStatsLoading}
                    icon={<Wallet className="h-4 w-4" />}
                />

                <StatsCard
                    title="Net Savings"
                    value={dashboardStats?.summary?.netSavings ?
                        `$${dashboardStats.summary.netSavings.toFixed(2)}` :
                        "$0.00"}
                    description={dashboardStats?.summary?.netSavings && dashboardStats?.summary?.netSavings > 0 ?
                        "You're saving money!" :
                        "Try to reduce expenses"}
                    loading={isDashboardStatsLoading}
                    icon={dashboardStats?.summary?.netSavings && dashboardStats?.summary?.netSavings > 0 ?
                        <ArrowUpRight className="h-4 w-4 text-green-500" /> :
                        <ArrowDownRight className="h-4 w-4 text-red-500" />}
                />

                <StatsCard
                    title="Savings Rate"
                    value={dashboardStats?.summary?.savingsRate ?
                        `${dashboardStats.summary.savingsRate.toFixed(1)}%` :
                        "0%"}
                    description="Of your total income"
                    loading={isDashboardStatsLoading}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
            </div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="detail">Detailed Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ExpenseSummaryPieChart
                            categories={expenseSummaryData?.categories || []}
                            loading={isExpenseSummaryLoading}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle>Key Insights</CardTitle>
                                <CardDescription>Important metrics for this period</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-4">
                                    <div className="flex justify-between">
                                        <dt className="font-medium">Daily Average Spending:</dt>
                                        <dd className="text-right">
                                            {isDashboardStatsLoading ? (
                                                <Skeleton className="h-5 w-20" />
                                            ) : (
                                                `$${dashboardStats?.insights?.avgDailyExpense?.toFixed(2) || "0.00"}`
                                            )}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between">
                                        <dt className="font-medium">Top Spending Category:</dt>
                                        <dd className="text-right">
                                            {isDashboardStatsLoading ? (
                                                <Skeleton className="h-5 w-28" />
                                            ) : (
                                                dashboardStats?.insights?.topCategory?.category || "None"
                                            )}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between">
                                        <dt className="font-medium">Upcoming Payments:</dt>
                                        <dd className="text-right">
                                            {isDashboardStatsLoading ? (
                                                <Skeleton className="h-5 w-24" />
                                            ) : (
                                                `${dashboardStats?.insights?.upcomingPaymentsCount || 0} ($${dashboardStats?.insights?.upcomingPaymentsTotal?.toFixed(2) || "0.00"})`
                                            )}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between">
                                        <dt className="font-medium">Overdue Payments:</dt>
                                        <dd className="text-right text-red-500">
                                            {isDashboardStatsLoading ? (
                                                <Skeleton className="h-5 w-24" />
                                            ) : (
                                                `${dashboardStats?.insights?.overduePaymentsCount || 0} ($${dashboardStats?.insights?.overduePaymentsTotal?.toFixed(2) || "0.00"})`
                                            )}
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="detail" className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <GroupByFilter
                            value={groupBy}
                            onChange={(value) => setGroupBy(value as GroupByOption)}
                        />
                    </div>

                    <ExpenseIncomeBarChart
                        data={expenseIncomeData?.comparison || []}
                        loading={isExpenseIncomeLoading}
                    />
                </TabsContent>
            </Tabs>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Semesters
                        </CardTitle>
                        <CardDescription>Manage your academic terms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Create and manage semesters to organize your expenses by academic periods.</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/expense-tracker/semesters')}
                        >
                            Manage Semesters
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Expenses
                        </CardTitle>
                        <CardDescription>Track your spending</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Record and categorize your expenses to keep track of your spending habits.</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/expense-tracker/expenses')}
                        >
                            Manage Expenses
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Income
                        </CardTitle>
                        <CardDescription>Track your earnings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Record and manage your income from various sources to better track your finances.</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/expense-tracker/income')}
                        >
                            Manage Income
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarRange className="h-5 w-5" />
                            Payment Schedule
                        </CardTitle>
                        <CardDescription>Plan future payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Schedule and track upcoming payments to stay organized and avoid late fees.</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/expense-tracker/payment-schedules')}
                        >
                            Manage Schedules
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ExpenseTrackerDashboard;