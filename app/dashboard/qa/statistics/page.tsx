"use client"

import { useGetAdminQaStatistics } from "@/hooks/qa/useQa";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CircleUser, MessageSquare, TagIcon, Clock, CheckCircle, HelpCircle } from "lucide-react";

const QaStatisticsPage = () => {
    const { data: statistics, isLoading, isError, error } = useGetAdminQaStatistics();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isError) {
        return (
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {(error as any)?.message || 'Failed to load Q&A statistics. Please try again later.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <div className="container px-0 mx-auto">
                <h1 className="text-2xl font-bold tracking-tight mb-6">Q&A System Statistics</h1>

                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array(4).fill(0).map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        <Skeleton className="h-4 w-28" />
                                    </CardTitle>
                                    <Skeleton className="h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-6 w-12 mb-2" />
                                    <Skeleton className="h-4 w-36" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="users">User Activity</TabsTrigger>
                            <TabsTrigger value="tags">Tag Distribution</TabsTrigger>
                            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Questions
                                        </CardTitle>
                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {statistics?.totalCounts?.questions || 0}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {statistics?.questionsByStatus?.open || 0} open / {statistics?.questionsByStatus?.closed || 0} closed
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Answers
                                        </CardTitle>
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {statistics?.totalCounts?.answers || 0}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {statistics?.metrics?.averageAnswersPerQuestion?.toFixed(1) || 0} avg answers per question
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Tags
                                        </CardTitle>
                                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {statistics?.totalCounts?.tags || 0}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Recent Activity
                                        </CardTitle>
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {(statistics?.recentActivity?.lastWeekQuestions || 0) + (statistics?.recentActivity?.lastWeekAnswers || 0)}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            items in the last week
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Question Status Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center">
                                                        <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                                                        <span>Open Questions</span>
                                                    </div>
                                                    <span>{statistics?.questionsByStatus?.open || 0}</span>
                                                </div>
                                                <Progress
                                                    value={
                                                        statistics?.totalCounts?.questions
                                                            ? (statistics?.questionsByStatus?.open / statistics?.totalCounts?.questions) * 100
                                                            : 0
                                                    }
                                                    className="h-2 bg-muted"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center">
                                                        <div className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
                                                        <span>Closed Questions</span>
                                                    </div>
                                                    <span>{statistics?.questionsByStatus?.closed || 0}</span>
                                                </div>
                                                <Progress
                                                    value={
                                                        statistics?.totalCounts?.questions
                                                            ? (statistics?.questionsByStatus?.closed / statistics?.totalCounts?.questions) * 100
                                                            : 0
                                                    }
                                                    className="h-2 bg-muted"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Metrics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Questions without answers:</span>
                                                <span className="font-medium">{statistics?.metrics?.questionsWithoutAnswers || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Average answers per question:</span>
                                                <span className="font-medium">{statistics?.metrics?.averageAnswersPerQuestion?.toFixed(1) || 0}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="users" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Contributors</CardTitle>
                                    <CardDescription>Users with the most questions and answers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {statistics?.userActivity?.topContributors?.map((contributor, index) => (
                                            <div key={contributor.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                                        <CircleUser className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{contributor.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {contributor.questionCount} questions, {contributor.answerCount} answers
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-sm">#{index + 1}</span>
                                                </div>
                                            </div>
                                        ))}

                                        {(!statistics?.userActivity?.topContributors || statistics.userActivity.topContributors.length === 0) && (
                                            <p className="text-center text-muted-foreground text-sm">No user activity data available</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="tags" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tag Distribution</CardTitle>
                                    <CardDescription>Most popular tags by question count</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {statistics?.tagDistribution?.map((tag) => (
                                            <div key={tag.id} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center">
                                                        <TagIcon className="mr-2 h-4 w-4" />
                                                        <span>{tag.name}</span>
                                                    </div>
                                                    <span>{tag.questionCount}</span>
                                                </div>
                                                <Progress
                                                    value={
                                                        statistics?.totalCounts?.questions
                                                            ? (tag.questionCount / statistics?.totalCounts?.questions) * 100
                                                            : 0
                                                    }
                                                    className="h-2 bg-muted"
                                                />
                                            </div>
                                        ))}

                                        {(!statistics?.tagDistribution || statistics.tagDistribution.length === 0) && (
                                            <p className="text-center text-muted-foreground text-sm">No tag distribution data available</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="recent" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest questions and answers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {statistics?.recentActivity?.recentItems?.map((item) => (
                                            <div key={item.id} className="flex items-start space-x-4">
                                                <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${item.type === 'QUESTION' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                                    {item.type === 'QUESTION' ? (
                                                        <HelpCircle className="h-3.5 w-3.5 text-blue-700" />
                                                    ) : (
                                                        <CheckCircle className="h-3.5 w-3.5 text-green-700" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium flex items-center">
                                                        {item.user.firstName} {item.user.lastName}
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            {item.type === 'QUESTION' ? 'asked a question' : 'posted an answer'}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm line-clamp-1">
                                                        {item.title || item.content}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(item.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {(!statistics?.recentActivity?.recentItems || statistics.recentActivity.recentItems.length === 0) && (
                                            <p className="text-center text-muted-foreground text-sm">No recent activity available</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </RoleBasedRoute>
    );
};

export default QaStatisticsPage;
