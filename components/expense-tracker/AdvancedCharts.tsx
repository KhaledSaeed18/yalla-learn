"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon, BarChart3, TrendingUp, CreditCard } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    Line,
    LineChart,
    ComposedChart,
    Area,
} from "recharts";
import { CategorySummary } from "@/types/expense-tracker/analytics.types";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export function ChartCard({ title, subtitle, children, icon }: ChartCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    {subtitle && <CardDescription>{subtitle}</CardDescription>}
                </div>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent className="px-2 pt-0 pb-0">{children}</CardContent>
        </Card>
    );
}

// Colors for charts
const CATEGORY_COLORS = {
    HOUSING: "#8884d8",
    FOOD: "#82ca9d",
    TRANSPORTATION: "#ffc658",
    EDUCATION: "#ff8042",
    ENTERTAINMENT: "#0088FE",
    HEALTHCARE: "#00C49F",
    OTHER: "#FFBB28",
};

// Pie chart for category breakdown
interface CategoryChartProps {
    data: CategorySummary[];
}

export function CategoryPieChart({ data }: CategoryChartProps) {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a64d79", "#674ea7"];

    return (
        <ChartCard title="Expense Categories" icon={<PieChartIcon className="h-4 w-4" />}>
            <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total"
                            nameKey="category"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`$${value}`, "Amount"]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}

// Bar chart for expense income comparison
interface ExpenseIncomeChartProps {
    data: Array<{
        period: string;
        expenses: number;
        income: number;
        net: number;
    }>;
}

export function ExpenseIncomeBarChart({ data }: ExpenseIncomeChartProps) {
    return (
        <ChartCard title="Income vs. Expenses" subtitle="Monthly comparison" icon={<BarChart3 className="h-4 w-4" />}>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="#4ade80" />
                        <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                        <Bar dataKey="net" name="Net" fill="#60a5fa" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}

// Area chart for spending trend
interface SpendingTrendChartProps {
    data: Array<{
        date: string;
        amount: number;
    }>;
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
    return (
        <ChartCard title="Spending Trend" subtitle="Last 30 days" icon={<TrendingUp className="h-4 w-4" />}>
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}

// Stacked area chart for cumulative spending
interface CumulativeSpendingChartProps {
    data: Array<{
        date: string;
        housing: number;
        food: number;
        transportation: number;
        education: number;
        other: number;
    }>;
}

export function CumulativeSpendingChart({ data }: CumulativeSpendingChartProps) {
    return (
        <ChartCard title="Cumulative Spending" subtitle="By category" icon={<CreditCard className="h-4 w-4" />}>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="date" scale="band" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                        <Legend />
                        <Area type="monotone" dataKey="housing" stackId="1" fill={CATEGORY_COLORS.HOUSING} stroke={CATEGORY_COLORS.HOUSING} />
                        <Area type="monotone" dataKey="food" stackId="1" fill={CATEGORY_COLORS.FOOD} stroke={CATEGORY_COLORS.FOOD} />
                        <Area type="monotone" dataKey="transportation" stackId="1" fill={CATEGORY_COLORS.TRANSPORTATION} stroke={CATEGORY_COLORS.TRANSPORTATION} />
                        <Area type="monotone" dataKey="education" stackId="1" fill={CATEGORY_COLORS.EDUCATION} stroke={CATEGORY_COLORS.EDUCATION} />
                        <Area type="monotone" dataKey="other" stackId="1" fill={CATEGORY_COLORS.OTHER} stroke={CATEGORY_COLORS.OTHER} />
                        <Line type="monotone" dataKey="total" stroke="#ff7300" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}
