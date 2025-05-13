import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, ExpenseCategoryType } from '@/types/expense-tracker/expenseTracker.types';
import { PieChart, BarChart, Layers } from 'lucide-react';

interface ExpenseStatsProps {
    expenses: Expense[];
    title?: string;
    description?: string;
}

export const ExpenseStats = ({
    expenses,
    title = "Expense Statistics",
    description = "Overview of your expense distribution"
}: ExpenseStatsProps) => {

    // Calculate total expenses
    const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

    // Calculate amount by category
    const categoryAmounts = expenses.reduce((result, expense) => {
        const category = expense.category;
        const amount = parseFloat(expense.amount);

        result[category] = (result[category] || 0) + amount;
        return result;
    }, {} as Record<string, number>);

    // Calculate amount by payment method
    const paymentMethodAmounts = expenses.reduce((result, expense) => {
        const method = expense.paymentMethod;
        const amount = parseFloat(expense.amount);

        result[method] = (result[method] || 0) + amount;
        return result;
    }, {} as Record<string, number>);

    // Format currency for display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Get top categories (sorted by amount)
    const topCategories = Object.entries(categoryAmounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg border p-3">
                    <p className="text-xs font-medium text-muted-foreground">Total Expenses</p>
                    <h3 className="mt-1 text-2xl font-bold">{formatCurrency(totalAmount)}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Across {expenses.length} expense entries</p>
                </div>

                {topCategories.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex gap-1 items-center mb-2">
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                            Top Spending Categories
                        </h4>
                        <div className="space-y-1">
                            {topCategories.map(([category, amount]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-sm">{category.replace(/_/g, ' ')}</span>
                                    </div>
                                    <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {Object.keys(paymentMethodAmounts).length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex gap-1 items-center mb-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            Payment Methods
                        </h4>
                        <div className="space-y-1">
                            {Object.entries(paymentMethodAmounts)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 3)
                                .map(([method, amount]) => (
                                    <div key={method} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-secondary" />
                                            <span className="text-sm">{method.replace(/_/g, ' ')}</span>
                                        </div>
                                        <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
