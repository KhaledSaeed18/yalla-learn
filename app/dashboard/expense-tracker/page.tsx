"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetExpenses } from "@/hooks/expense-tracker/useExpenses"
import { useGetIncomes } from "@/hooks/expense-tracker/useIncomes"
import { useGetBudgets } from "@/hooks/expense-tracker/useBudgets"
import { useGetActiveSemester } from "@/hooks/expense-tracker/useSemesters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, CreditCard, DollarSign, PiggyBank, Target } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

export default function ExpenseTrackerDashboardPage() {
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0)
    const [budgetStatus, setBudgetStatus] = useState<'under' | 'close' | 'over'>('under')

    const { data: activeSemester, isLoading: isLoadingSemester } = useGetActiveSemester()
    const { data: expenses, isLoading: isLoadingExpenses } = useGetExpenses({ limit: 5, sort: 'date:desc' })
    const { data: incomes, isLoading: isLoadingIncomes } = useGetIncomes({ limit: 5, sort: 'date:desc' })
    const { data: budgets, isLoading: isLoadingBudgets } = useGetBudgets()

    useEffect(() => {
        if (expenses?.data?.expenses && incomes?.data?.incomes) {
            // Calculate total income
            const incomeSum = incomes.data.incomes.reduce((sum, income) => sum + income.amount, 0)
            setTotalIncome(incomeSum)

            // Calculate total expenses
            const expenseSum = expenses.data.expenses.reduce((sum, expense) => sum + expense.amount, 0)
            setTotalExpenses(expenseSum)

            // Calculate balance
            setTotalBalance(incomeSum - expenseSum)

            // Determine budget status
            if (budgets?.length) {
                const budgetTotal = budgets.reduce((sum, budget) => sum + budget.amount, 0)
                const budgetPercentage = expenseSum / budgetTotal

                if (budgetPercentage > 1) {
                    setBudgetStatus('over')
                } else if (budgetPercentage > 0.8) {
                    setBudgetStatus('close')
                } else {
                    setBudgetStatus('under')
                }
            }
        }
    }, [expenses, incomes, budgets])

    const isLoading = isLoadingExpenses || isLoadingIncomes || isLoadingBudgets || isLoadingSemester

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
                {activeSemester && (
                    <p className="text-muted-foreground">
                        Current Semester: {activeSemester.name} ({format(new Date(activeSemester.startDate), "MMM d, yyyy")} - {format(new Date(activeSemester.endDate), "MMM d, yyyy")})
                    </p>
                )}
            </div>

            {!activeSemester && (
                <Alert>
                    <AlertTitle>No active semester</AlertTitle>
                    <AlertDescription>
                        Please create or set an active semester to better track your expenses.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                        <p className="text-xs text-muted-foreground">
                            For {activeSemester ? activeSemester.name : "current period"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                        <p className="text-xs text-muted-foreground">
                            For {activeSemester ? activeSemester.name : "current period"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                        <p className="text-xs text-muted-foreground">
                            For {activeSemester ? activeSemester.name : "current period"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${budgetStatus === 'over' ? 'text-destructive' :
                                budgetStatus === 'close' ? 'text-amber-500' :
                                    'text-emerald-500'
                            }`}>
                            {budgetStatus === 'over' ? 'Over Budget' :
                                budgetStatus === 'close' ? 'Near Limit' :
                                    'Under Budget'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Based on your current budgets
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="recent-expenses" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="recent-expenses">Recent Expenses</TabsTrigger>
                    <TabsTrigger value="recent-income">Recent Income</TabsTrigger>
                    <TabsTrigger value="budget-overview">Budget Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="recent-expenses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Expenses</CardTitle>
                            <CardDescription>Your latest 5 expenses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {expenses?.data?.expenses?.length ? (
                                <div className="space-y-2">
                                    {expenses.data.expenses.map((expense) => (
                                        <div key={expense.id} className="flex items-center justify-between p-2 border rounded">
                                            <div>
                                                <p className="font-medium">{expense.description || 'No description'}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(expense.date), "MMM d, yyyy")} • {expense.category?.name || 'Uncategorized'}
                                                </p>
                                            </div>
                                            <div className="font-semibold text-destructive">
                                                {formatCurrency(expense.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    No expenses recorded yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="recent-income" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Income</CardTitle>
                            <CardDescription>Your latest 5 income entries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {incomes?.data?.incomes?.length ? (
                                <div className="space-y-2">
                                    {incomes.data.incomes.map((income) => (
                                        <div key={income.id} className="flex items-center justify-between p-2 border rounded">
                                            <div>
                                                <p className="font-medium">{income.description || 'No description'}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(income.date), "MMM d, yyyy")} • {income.source || 'Unspecified source'}
                                                </p>
                                            </div>
                                            <div className="font-semibold text-emerald-500">
                                                {formatCurrency(income.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    No income recorded yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="budget-overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Overview</CardTitle>
                            <CardDescription>Your current budget allocation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {budgets?.length ? (
                                <div className="space-y-4">
                                    {budgets.map((budget) => {
                                        const allocated = budget.amount;
                                        const spent = expenses?.data?.expenses?.filter(
                                            e => e.category?.id === budget.categoryId
                                        ).reduce((sum, expense) => sum + expense.amount, 0) || 0;
                                        const percentage = Math.min(100, Math.round((spent / allocated) * 100));

                                        return (
                                            <div key={budget.id} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <p className="font-medium">{budget.category?.name || 'Uncategorized'}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatCurrency(spent)} of {formatCurrency(allocated)}
                                                        </p>
                                                    </div>
                                                    <span className={`text-sm font-semibold ${percentage >= 100 ? 'text-destructive' :
                                                            percentage >= 80 ? 'text-amber-500' :
                                                                'text-emerald-500'
                                                        }`}>
                                                        {percentage}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${percentage >= 100 ? 'bg-destructive' :
                                                                percentage >= 80 ? 'bg-amber-500' :
                                                                    'bg-emerald-500'
                                                            }`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    No budgets created yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
