"use client"

import { useState } from "react"
import { BarChart as BarChartIcon, CalendarDays, FileText, FilePenLine, FileCheck, Tag, Clock, ArrowUpRight, Download, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts"
import RoleBasedRoute from "@/components/RoleBasedRoute"
import { useGetAdminBlogStatistics } from "@/hooks/blog/useBlogs"

export default function BlogStatistics() {
    const [timeframe, setTimeframe] = useState("week")
    const { data: stats, isLoading, isError, error } = useGetAdminBlogStatistics()

    const postStatusData = stats ? [
        { name: "Published", value: stats.postsByStatus.published, color: "#22c55e" },
        { name: "Draft", value: stats.postsByStatus.draft, color: "#f59e0b" },
    ] : []

    const getActivityData = () => {
        if (!stats) return [];

        const days = timeframe === "week" ? 7 : 30;
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - days);

        const daysCounts: Record<string, number> = {};
        const dayNames = timeframe === "week"
            ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            : Array.from({ length: 30 }, (_, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() - 29 + i);
                return d.getDate().toString();
            });

        dayNames.forEach(day => {
            daysCounts[day] = 0;
        });

        stats.recentActivity.recentPosts.forEach(post => {
            const postDate = new Date(post.createdAt);
            if (postDate >= startDate) {
                const dayName = timeframe === "week"
                    ? dayNames[postDate.getDay()]
                    : postDate.getDate().toString();
                daysCounts[dayName] = (daysCounts[dayName] || 0) + 1;
            }
        });

        return timeframe === "week"
            ? dayNames.map(day => ({ name: day, value: daysCounts[day] }))
            : Object.keys(daysCounts).map(day => ({ name: day, value: daysCounts[day] }));
    };

    const getContentGrowthData = () => {
        if (!stats) return [];

        interface MonthlyData {
            [key: string]: { published: number, draft: number };
        }
        
        const monthlyData: MonthlyData = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        stats.recentActivity.recentPosts.forEach(post => {
            const postDate = new Date(post.createdAt);
            const monthName = monthNames[postDate.getMonth()];

            if (!monthlyData[monthName]) {
                monthlyData[monthName] = { published: 0, draft: 0 };
            }

            if (post.status === "PUBLISHED") {
                monthlyData[monthName].published += 1;
            } else {
                monthlyData[monthName].draft += 1;
            }
        });

        return monthNames
            .filter(month => monthlyData[month])
            .map(month => ({
                name: month,
                published: monthlyData[month].published,
                draft: monthlyData[month].draft
            }));
    };

    const activityData = stats ? getActivityData() : [];
    const contentGrowthData = stats ? getContentGrowthData() : [];


    const exportPDF = () => {
        if (!stats) return

        const doc = new jsPDF()

        doc.setFontSize(20)
        doc.text("Blog Statistics Report", 20, 20)
        doc.setFontSize(12)
        doc.text(`Generated on: ${format(new Date(), "MMMM d, yyyy, h:mm a")}`, 20, 30)

        doc.setFontSize(16)
        doc.text("Overview Statistics", 20, 45)

        const overviewData = [
            ["Total Posts", stats.totalPosts.toString()],
            ["Published Posts", stats.postsByStatus.published.toString()],
            ["Draft Posts", stats.postsByStatus.draft.toString()],
            ["Recent Activity (7 days)", stats.recentActivity.lastWeekPosts.toString()],
            ["Recent Activity (30 days)", stats.recentActivity.lastMonthPosts.toString()],
        ]

        let yPos = 50;

        autoTable(doc, {
            startY: yPos,
            head: [["Metric", "Value"]],
            body: overviewData,
            didDrawPage: (data) => {
                if (data.cursor) {
                    yPos = data.cursor.y;
                }
            }
        });

        doc.setFontSize(16)
        doc.text("Recent Posts", 20, yPos + 15)

        const recentPostsData = stats.recentActivity.recentPosts.map((post) => [
            post.title,
            post.status,
            format(new Date(post.createdAt), "MMM d, yyyy"),
        ])

        autoTable(doc, {
            startY: yPos + 20,
            head: [["Title", "Status", "Created Date"]],
            body: recentPostsData,
            didDrawPage: (data) => {
                if (data.cursor) {
                    yPos = data.cursor.y;
                }
            }
        })

        doc.setFontSize(16)
        doc.text("Top Authors", 20, yPos + 15)

        const authorsData = stats.topAuthors.map((author) => [author.name, author.postCount.toString()])

        autoTable(doc, {
            startY: yPos + 20,
            head: [["Author", "Post Count"]],
            body: authorsData,
            didDrawPage: (data) => {
                if (data.cursor) {
                    yPos = data.cursor.y;
                }
            }
        })

        doc.setFontSize(16)
        doc.text("Categories", 20, yPos + 15)

        const categoriesData = stats.categoriesDistribution.map((category) => [
            category.name,
            category.postCount.toString(),
            `${((category.postCount / stats.totalPosts) * 100).toFixed(0)}%`,
        ])

        autoTable(doc, {
            startY: yPos + 20,
            head: [["Category", "Post Count", "Percentage"]],
            body: categoriesData,
        })

        const currentDateTime = format(new Date(), "yyyy-MM-dd_HH-mm-ss")
        doc.save(`blog-statistics-report-${currentDateTime}.pdf`)
    }

    const renderPostStatusChart = () => (
        <ResponsiveContainer width="100%" height="100%">
            {stats ? (
                <PieChart>
                    <Pie
                        data={postStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {postStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} posts`, "Count"]} />
                    <Legend />
                </PieChart>
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <Skeleton className="w-[200px] h-[200px] rounded-full" />
                </div>
            )}
        </ResponsiveContainer>
    )

    const renderActivityChart = () => (
        <ResponsiveContainer width="100%" height="100%">
            {stats ? (
                <BarChart data={activityData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Posts" fill="#3b82f6" />
                </BarChart>
            ) : (
                <div className="flex flex-col space-y-2 w-full h-full justify-center">
                    <Skeleton className="w-full h-[30px]" />
                    <Skeleton className="w-full h-[180px]" />
                    <Skeleton className="w-full h-[30px]" />
                </div>
            )}
        </ResponsiveContainer>
    )


    const renderGrowthChart = () => (
        <ResponsiveContainer width="100%" height="100%">
            {stats ? (
                <BarChart data={contentGrowthData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="published" name="Published" fill="#22c55e" />
                    <Bar dataKey="draft" name="Draft" fill="#f59e0b" />
                </BarChart>
            ) : (
                <div className="flex flex-col space-y-2 w-full h-full justify-center">
                    <Skeleton className="w-full h-[30px]" />
                    <Skeleton className="w-full h-[180px]" />
                    <Skeleton className="w-full h-[30px]" />
                </div>
            )}
        </ResponsiveContainer>
    )

    // Show error state
    if (isError) {
        return (
            <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <div className="space-y-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Failed to load blog statistics. {error?.message || "Please try again later."}
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </RoleBasedRoute>
        )
    }

    return (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <main className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Blog Analytics</h1>
                        <p className="text-muted-foreground">Comprehensive statistics and insights about blog content</p>
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportPDF}
                            disabled={isLoading || !stats}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats?.totalPosts}</div>
                                    <p className="text-xs text-muted-foreground">All blog posts in the system</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                            <FileCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats?.postsByStatus.published}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats && ((stats.postsByStatus.published / stats.totalPosts) * 100).toFixed(1)}% of total posts
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                            <FilePenLine className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats?.postsByStatus.draft}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats && ((stats.postsByStatus.draft / stats.totalPosts) * 100).toFixed(1)}% of total posts
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats?.recentActivity.lastWeekPosts}</div>
                                    <p className="text-xs text-muted-foreground">Posts in the last 7 days</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="posts" className="w-full">
                            <div className="flex items-center justify-between">
                                <TabsList>
                                    <TabsTrigger className="cursor-pointer" value="posts">Post Status</TabsTrigger>
                                    <TabsTrigger className="cursor-pointer" value="activity">Activity</TabsTrigger>
                                    <TabsTrigger className="cursor-pointer" value="growth">Content Growth</TabsTrigger>
                                </TabsList>
                                <div className="space-x-2">
                                    <Button
                                        variant={timeframe === "week" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTimeframe("week")}
                                    >
                                        Week
                                    </Button>
                                    <Button
                                        variant={timeframe === "month" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTimeframe("month")}
                                    >
                                        Month
                                    </Button>
                                </div>
                            </div>
                            <TabsContent value="posts" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Post Status Distribution</CardTitle>
                                        <CardDescription>Breakdown of published vs draft posts</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px] w-full">
                                            {renderPostStatusChart()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="activity" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Weekly Post Activity</CardTitle>
                                        <CardDescription>Number of posts created per day</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px] w-full">
                                            {renderActivityChart()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="growth" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Content Growth Over Time</CardTitle>
                                        <CardDescription>Published and draft posts by month</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px] w-full">
                                            {renderGrowthChart()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Posts</CardTitle>
                                <CardDescription>Latest blog posts in the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, index) => (
                                            <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="space-y-2 w-full">
                                                    <Skeleton className="h-5 w-4/5" />
                                                    <Skeleton className="h-4 w-2/5" />
                                                </div>
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                            </div>
                                        ))
                                    ) : (
                                        stats?.recentActivity.recentPosts.map((post) => (
                                            <div key={post.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium">{post.title}</h4>
                                                        <Badge variant={post.status === "PUBLISHED" ? "default" : "outline"}>{post.status}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                                                    </div>
                                                </div>
                                                <Link href={`/blog/${post.slug}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href="/dashboard/blog/all" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        View All Posts
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column - Authors & Categories */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Authors</CardTitle>
                                <CardDescription>Authors with the most content</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {isLoading ? (
                                        Array(3).fill(0).map((_, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-24" />
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-8 w-16 rounded-md" />
                                            </div>
                                        ))
                                    ) : (
                                        stats?.topAuthors.map((author) => (
                                            <div key={author.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {author.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{author.name}</p>
                                                        <p className="text-sm text-muted-foreground">{author.postCount} posts</p>
                                                    </div>
                                                </div>
                                                <Link href={`/dashboard/authors/${author.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                                <CardDescription>Distribution of posts by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {isLoading ? (
                                        Array(4).fill(0).map((_, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-24" />
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-4 w-8 rounded-md" />
                                            </div>
                                        ))
                                    ) : (
                                        stats?.categoriesDistribution.map((category) => (
                                            <div key={category.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                        <Tag className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{category.name}</p>
                                                        <p className="text-sm text-muted-foreground">{category.postCount} posts</p>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {((category.postCount / stats.totalPosts) * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href="/dashboard/blog/categories" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        View All Categories
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Metrics</CardTitle>
                                <CardDescription>Other important blog statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {isLoading ? (
                                            <>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-8 w-16" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-8 w-16" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">Avg. Posts per User</p>
                                                    <p className="text-xl font-bold">{stats?.metadata.averagePostsPerUser}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">Posts without Categories</p>
                                                    <p className="text-xl font-bold">{stats?.metadata.postsWithoutCategories}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </RoleBasedRoute>
    )
}