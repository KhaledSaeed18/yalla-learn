"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetActiveSemester, useGetSemesters } from '@/hooks/expense-tracker/useSemesters';
import { useGetExpenses } from '@/hooks/expense-tracker/useExpenses';
import { Loader2, BookOpen, Calendar, Pencil, PieChart, CreditCard, BarChart, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExpenseStats } from '@/components/expense-tracker/ExpenseStats';

const ExpenseTrackerDashboard = () => {
    const router = useRouter();
    const { data: activeSemester, isLoading: isLoadingActive } = useGetActiveSemester();
    const { data: semesters, isLoading: isLoadingSemesters } = useGetSemesters();

    // Get recent expenses for the active semester
    const { data: expensesData, isLoading: isLoadingExpenses } = useGetExpenses({
        limit: 5,
        semesterId: activeSemester?.id,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    // State for dashboard stats
    const [dashboardStats, setDashboardStats] = useState({
        totalExpenses: 0,
        avgExpenseAmount: 0,
        expenseCount: 0,
        topCategory: '',
        topCategoryPercentage: 0
    });

    // Calculate dashboard stats when expenses data changes
    useEffect(() => {
        if (expensesData?.expenses && expensesData.expenses.length > 0) {
            // Calculate total expenses
            const total = expensesData.expenses.reduce(
                (sum, expense) => sum + parseFloat(expense.amount),
                0
            );

            // Calculate average expense amount
            const avg = total / expensesData.expenses.length;

            // Find top category
            const categoryCount = expensesData.expenses.reduce((acc, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
                return acc;
            }, {} as Record<string, number>);

            const topCategory = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])[0];

            const topCategoryPercentage = (topCategory[1] / total) * 100;

            setDashboardStats({
                totalExpenses: total,
                avgExpenseAmount: avg,
                expenseCount: expensesData.expenses.length,
                topCategory: topCategory ? topCategory[0].replace(/_/g, ' ') : 'None',
                topCategoryPercentage: topCategoryPercentage
            });
        }
    }, [expensesData]);

    // Redirect to create semester if no semesters exist
    useEffect(() => {
        if (!isLoadingSemesters && semesters && semesters.length === 0) {
            router.push('/dashboard/expense-tracker/semesters');
        }
    }, [isLoadingSemesters, semesters, router]);

    if (isLoadingActive || isLoadingSemesters || isLoadingExpenses) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    // Format currency for display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Expense Tracker Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your expenses, budgets, and financial planning
                </p>
            </div>

            {activeSemester ? (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Active Semester
                        </CardTitle>
                        <CardDescription>Your current active semester for expense tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold">{activeSemester.name}</h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <Badge variant="outline">{activeSemester.term}</Badge>
                                    <span>{activeSemester.year}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => router.push(`/dashboard/expense-tracker/expenses?semesterId=${activeSemester.id}`)}>
                                    View Expenses
                                </Button>
                                <Button onClick={() => router.push(`/dashboard/expense-tracker/semesters/${activeSemester.id}`)}>
                                    Semester Details
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            No Active Semester
                        </CardTitle>
                        <CardDescription>You don't have an active semester set</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <p>Set an active semester to track your expenses more efficiently.</p>
                            <Button onClick={() => router.push('/dashboard/expense-tracker/semesters')}>
                                Manage Semesters
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats Section */}
            {activeSemester && expensesData?.expenses && expensesData.expenses.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="md:col-span-3">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        Total Expenses
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(dashboardStats.totalExpenses)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        For current active semester
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <BarChart className="h-4 w-4 text-muted-foreground" />
                                        Average Expense
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(dashboardStats.avgExpenseAmount)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Across {dashboardStats.expenseCount} expenses
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        Top Spending Category
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {dashboardStats.topCategory}
                                    </div>
                                    <div className="mt-2">
                                        <Progress value={dashboardStats.topCategoryPercentage} className="h-2" />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {Math.round(dashboardStats.topCategoryPercentage)}% of total spending
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Recent Expenses
                                    </CardTitle>
                                    <CardDescription>
                                        Your most recently added expenses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {expensesData.expenses.length > 0 ? (
                                        <div className="space-y-4">
                                            {expensesData.expenses.slice(0, 5).map((expense) => (
                                                <div key={expense.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                                    <div>
                                                        <div className="font-medium">{expense.description}</div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {expense.category.replace(/_/g, ' ')}
                                                            </Badge>
                                                            <span>
                                                                {new Date(expense.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="font-semibold">
                                                        {formatCurrency(parseFloat(expense.amount))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No expenses found for this semester.</p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => router.push('/dashboard/expense-tracker/expenses')}
                                    >
                                        View All Expenses
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <ExpenseStats
                            expenses={expensesData.expenses}
                            title="Expense Analytics"
                            description="Current semester statistics"
                        />
                    </div>
                </div>
            )}

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
                        {semesters && (
                            <div className="mt-2 text-sm text-muted-foreground">
                                {semesters.length} semesters created
                            </div>
                        )}
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
                        {expensesData?.pagination && (
                            <div className="mt-2 text-sm text-muted-foreground">
                                {expensesData.pagination.total} expenses recorded
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/expense-tracker/expenses')}
                            disabled={!activeSemester}
                        >
                            Manage Expenses
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pencil className="h-5 w-5" />
                            Budgets
                        </CardTitle>
                        <CardDescription>Plan your finances</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Create budget plans to help manage your finances during each semester.</p>
                        <div className="mt-2 text-xs italic text-muted-foreground">
                            Coming soon
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/expense-tracker/budgets')}
                            disabled={!activeSemester || true}
                        >
                            Manage Budgets
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Reports
                        </CardTitle>
                        <CardDescription>Analyze your spending</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Generate and view reports to analyze your spending patterns and budget adherence.</p>
                        <div className="mt-2 text-xs italic text-muted-foreground">
                            Coming soon
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/expense-tracker/reports')}
                            disabled={!activeSemester || true}
                        >
                            View Reports
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ExpenseTrackerDashboard;