"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, PieChart, ResponsiveContainer, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CategorySummary } from "@/types/expense-tracker/analytics.types";

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a64d79", "#674ea7", "#3c78d8", "#6aa84f", "#f1c232", "#cc0000"];

interface ExpenseSummaryChartProps {
    categories: CategorySummary[];
    loading?: boolean;
}

export const ExpenseSummaryPieChart: React.FC<ExpenseSummaryChartProps> = ({ categories, loading = false }) => {
    // Format data for pie chart
    const data = categories.map((category, index) => ({
        name: category.category,
        value: category.total,
        percentage: category.percentage,
    }));

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Expenses by Category</CardTitle>
                    <CardDescription>Breakdown of your spending by category</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <Skeleton className="h-[300px] w-full rounded-md" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Breakdown of your spending by category</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[350px]">
                {data.length === 0 ? (
                    <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                        <p>No expense data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [typeof value === 'number' ? `$${value.toFixed(2)}` : `$${value}`, "Amount"]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

interface ExpenseIncomeChartProps {
    data: {
        period: string;
        expenses: number;
        income: number;
        net: number;
    }[];
    loading?: boolean;
}

export const ExpenseIncomeBarChart: React.FC<ExpenseIncomeChartProps> = ({ data, loading = false }) => {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Income vs. Expenses</CardTitle>
                    <CardDescription>Compare your income and expenses over time</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <Skeleton className="h-[300px] w-full rounded-md" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Income vs. Expenses</CardTitle>
                <CardDescription>Compare your income and expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[400px]">
                {data.length === 0 ? (
                    <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                        <p>No comparison data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, ""]} />
                            <Legend />
                            <Bar dataKey="income" name="Income" fill="#4ade80" />
                            <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                            <Bar dataKey="net" name="Net Savings" fill="#60a5fa" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    loading?: boolean;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    description,
    loading = false,
    icon,
    trend,
}) => {
    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    {icon && <div className="text-muted-foreground">{icon}</div>}
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-3/4 mb-1" />
                    {description && <Skeleton className="h-4 w-1/2" />}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
                {trend && (
                    <div className={`mt-1 text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                        {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
