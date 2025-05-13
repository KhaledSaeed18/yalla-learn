"use client"

import { useState } from 'react';
import { useGetUserStatistics } from '@/hooks/user/useUsers';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, ShieldCheck, User, RefreshCw } from 'lucide-react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const UserStatisticsPage = () => {

    const {
        data: statistics,
        isLoading,
        isError,
        refetch
    } = useGetUserStatistics();

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Prepare data for role distribution pie chart
    const roleDistributionData = statistics ? [
        { name: 'Admin Users', value: statistics.adminUsers },
        { name: 'Regular Users', value: statistics.regularUsers },
    ] : [];

    // Prepare data for verification status pie chart
    const verificationData = statistics ? [
        { name: 'Verified', value: statistics.verifiedUsers },
        { name: 'Unverified', value: statistics.unverifiedUsers },
    ] : [];

    // Custom label for pie chart
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius * 0.8; // Reduced from 1.1 to prevent overflow
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={COLORS[index % COLORS.length]}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${name} (${value})`}
            </text>
        );
    };

    if (isError) {
        return (
            <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <div className="container mx-auto p-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Error</CardTitle>
                                <CardDescription>
                                    Failed to load user statistics. Please try again.
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => refetch()}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                    </Card>
                </div>
            </RoleBasedRoute>
        );
    }

    return (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Statistics</h1>
                        <p className="text-muted-foreground">
                            Overview of user data and platform activity
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="growth">User Growth</TabsTrigger>
                        <TabsTrigger value="distribution">User Distribution</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Total Users Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Users
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-[100px]" />
                                    ) : (
                                        <div className="text-2xl font-bold">
                                            {formatNumber(statistics?.totalUsers || 0)}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Total registered users
                                    </p>
                                </CardContent>
                            </Card>

                            {/* New Users Today Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        New Today
                                    </CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-[60px]" />
                                    ) : (
                                        <div className="text-2xl font-bold">
                                            {formatNumber(statistics?.newUsersToday || 0)}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        New users registered today
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Verified Users Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Verified Users
                                    </CardTitle>
                                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-[80px]" />
                                    ) : (
                                        <div className="text-2xl font-bold">
                                            {formatNumber(statistics?.verifiedUsers || 0)}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                ({statistics ? Math.round((statistics.verifiedUsers / statistics.totalUsers) * 100) : 0}%)
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Users with verified accounts
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Admin Users Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Admin Users
                                    </CardTitle>
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-[60px]" />
                                    ) : (
                                        <div className="text-2xl font-bold">
                                            {formatNumber(statistics?.adminUsers || 0)}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                ({statistics ? Math.round((statistics.adminUsers / statistics.totalUsers) * 100) : 0}%)
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Users with administrator privileges
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* User Growth Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Growth Over Time</CardTitle>
                                <CardDescription>
                                    New users registered per month
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[620px] overflow-hidden pt-4">
                                {isLoading ? (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Skeleton className="h-[500px] w-full" />
                                    </div>
                                ) : (
                                    <ChartContainer
                                        config={{
                                            users: { color: "#2563eb" }
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={statistics?.usersByMonth || []}
                                                margin={{
                                                    top: 5,
                                                    right: 20,
                                                    left: 10,
                                                    bottom: 25,
                                                }}
                                            >
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <ChartTooltip
                                                    content={({ active, payload, label }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                                Month
                                                                            </span>
                                                                            <span className="font-bold text-sm">
                                                                                {label}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                                New Users
                                                                            </span>
                                                                            <span className="font-bold text-sm">
                                                                                {payload[0].value}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill="var(--color-users)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="growth" className="space-y-4">
                        {/* Detailed Monthly User Growth */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly User Growth</CardTitle>
                                <CardDescription>
                                    Detailed view of user registrations per month
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[620px] overflow-hidden pt-4">
                                {isLoading ? (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Skeleton className="h-[500px] w-full" />
                                    </div>
                                ) : (
                                    <ChartContainer
                                        config={{
                                            users: { color: "#2563eb" }
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={statistics?.usersByMonth || []}
                                                margin={{
                                                    top: 5,
                                                    right: 20,
                                                    left: 10,
                                                    bottom: 25,
                                                }}
                                            >
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <ChartTooltip
                                                    content={({ active, payload, label }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                                Month
                                                                            </span>
                                                                            <span className="font-bold text-sm">
                                                                                {label}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                                New Users
                                                                            </span>
                                                                            <span className="font-bold text-sm">
                                                                                {payload[0].value}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill="var(--color-users)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="distribution" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* User Roles Distribution Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Roles Distribution</CardTitle>
                                    <CardDescription>
                                        Distribution of users by role type
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px] pt-4">
                                    {isLoading ? (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Skeleton className="h-[250px] w-full" />
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                <Pie
                                                    data={roleDistributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false} // Changed to false to prevent label lines from overflowing
                                                    label={renderCustomizedLabel}
                                                    outerRadius={70} // Reduced from 80 to prevent overflow
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {roleDistributionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value, name) => [value, name]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Verification Status Distribution Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Verification Status</CardTitle>
                                    <CardDescription>
                                        Distribution of verified vs unverified users
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px] pt-4">
                                    {isLoading ? (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Skeleton className="h-[250px] w-full" />
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                <Pie
                                                    data={verificationData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false} // Changed to false to prevent label lines from overflowing
                                                    label={renderCustomizedLabel}
                                                    outerRadius={70} // Reduced from 80 to prevent overflow
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {verificationData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value, name) => [value, name]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleBasedRoute>
    );
};

export default UserStatisticsPage;