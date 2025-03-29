"use client"

import { useState } from "react"
import { BarChart, CalendarDays, FileText, FilePenLine, FileCheck, Tag, Clock, ArrowUpRight, Download } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, XAxis, YAxis, Bar } from "recharts"

// Mock data based on the provided API response
const blogStatistics = {
    status: "success",
    statusCode: 200,
    message: "Blog statistics retrieved successfully",
    data: {
        statistics: {
            totalPosts: 11,
            postsByStatus: {
                published: 3,
                draft: 8,
            },
            topAuthors: [
                {
                    id: "cm81usda50000vkt4l3gdslib",
                    name: "Khaled Saeed",
                    postCount: 11,
                },
            ],
            categoriesDistribution: [
                {
                    id: "cm8kkcnzc0004vkygnkeqrr07",
                    name: "Technology",
                    postCount: 11,
                },
            ],
            recentActivity: {
                lastWeekPosts: 11,
                lastMonthPosts: 11,
                recentPosts: [
                    {
                        id: "cm8upm4y0000pvk0krn7pjb6t",
                        title: "Title 100 updated",
                        slug: "title-100",
                        status: "DRAFT",
                        createdAt: "2025-03-29T21:14:37.320Z",
                        updatedAt: "2025-03-29T21:32:03.520Z",
                        user: {
                            firstName: "Khaled",
                            lastName: "Saeed",
                        },
                    },
                    {
                        id: "cm8uiou8r000lvk0kgv5rx07v",
                        title: "Title11",
                        slug: "title11",
                        status: "DRAFT",
                        createdAt: "2025-03-29T18:00:46.108Z",
                        updatedAt: "2025-03-29T18:00:46.108Z",
                        user: {
                            firstName: "Khaled",
                            lastName: "Saeed",
                        },
                    },
                    {
                        id: "cm8uinuve000jvk0kkuyx24vu",
                        title: "Title10",
                        slug: "title10",
                        status: "DRAFT",
                        createdAt: "2025-03-29T18:00:00.267Z",
                        updatedAt: "2025-03-29T18:00:00.267Z",
                        user: {
                            firstName: "Khaled",
                            lastName: "Saeed",
                        },
                    },
                    {
                        id: "cm8uinkww000hvk0ktt3jowm4",
                        title: "Title9",
                        slug: "title9",
                        status: "DRAFT",
                        createdAt: "2025-03-29T17:59:47.360Z",
                        updatedAt: "2025-03-29T17:59:47.360Z",
                        user: {
                            firstName: "Khaled",
                            lastName: "Saeed",
                        },
                    },
                    {
                        id: "cm8uin9vg000fvk0kw5ba9wo9",
                        title: "Title8",
                        slug: "title8",
                        status: "DRAFT",
                        createdAt: "2025-03-29T17:59:33.052Z",
                        updatedAt: "2025-03-29T17:59:33.052Z",
                        user: {
                            firstName: "Khaled",
                            lastName: "Saeed",
                        },
                    },
                ],
            },
            metadata: {
                postsWithoutCategories: 0,
                averagePostsPerUser: 11,
            },
        },
    },
}

const postStatusData = [
    { name: "Published", value: blogStatistics.data.statistics.postsByStatus.published, color: "#22c55e" },
    { name: "Draft", value: blogStatistics.data.statistics.postsByStatus.draft, color: "#f59e0b" },
]

const weeklyActivityData = [
    { name: "Mon", value: 2 },
    { name: "Tue", value: 3 },
    { name: "Wed", value: 1 },
    { name: "Thu", value: 2 },
    { name: "Fri", value: 1 },
    { name: "Sat", value: 1 },
    { name: "Sun", value: 1 },
]

const contentGrowthData = [
    { name: "Jan", published: 1, draft: 2 },
    { name: "Feb", published: 1, draft: 3 },
    { name: "Mar", published: 1, draft: 3 },
]

export default function BlogStatistics() {
    const [timeframe, setTimeframe] = useState("week")
    const stats = blogStatistics.data.statistics

    const exportPDF = () => {
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

        autoTable(doc, {
            startY: 50,
            head: [["Metric", "Value"]],
            body: overviewData,
        })

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Analytics</h1>
                    <p className="text-muted-foreground">Comprehensive statistics and insights about blog content</p>
                </div>
                <div>
                    <Button variant="outline" size="sm" onClick={exportPDF}>
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
                        <div className="text-2xl font-bold">{stats.totalPosts}</div>
                        <p className="text-xs text-muted-foreground">All blog posts in the system</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.postsByStatus.published}</div>
                        <p className="text-xs text-muted-foreground">
                            {((stats.postsByStatus.published / stats.totalPosts) * 100).toFixed(1)}% of total posts
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <FilePenLine className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.postsByStatus.draft}</div>
                        <p className="text-xs text-muted-foreground">
                            {((stats.postsByStatus.draft / stats.totalPosts) * 100).toFixed(1)}% of total posts
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recentActivity.lastWeekPosts}</div>
                        <p className="text-xs text-muted-foreground">Posts in the last 7 days</p>
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
                                <TabsTrigger value="posts">Post Status</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                                <TabsTrigger value="growth">Content Growth</TabsTrigger>
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
                                        <ResponsiveContainer width="100%" height="100%">
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
                                        </ResponsiveContainer>
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
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={weeklyActivityData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value" name="Posts" fill="#3b82f6" />
                                            </BarChart>
                                        </ResponsiveContainer>
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
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={contentGrowthData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="published" name="Published" fill="#22c55e" />
                                                <Bar dataKey="draft" name="Draft" fill="#f59e0b" />
                                            </BarChart>
                                        </ResponsiveContainer>
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
                                {stats.recentActivity.recentPosts.map((post) => (
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
                                ))}
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
                                {stats.topAuthors.map((author) => (
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
                                ))}
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
                                {stats.categoriesDistribution.map((category) => (
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
                                ))}
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
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Avg. Posts per User</p>
                                        <p className="text-xl font-bold">{stats.metadata.averagePostsPerUser}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Posts without Categories</p>
                                        <p className="text-xl font-bold">{stats.metadata.postsWithoutCategories}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

