'use client';

import { useGetJobStatistics } from '@/hooks/jobs/useJobs';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Briefcase, FilePlus2, Users } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetUserApplications } from '@/hooks/jobs/useJobApplications';
import { ApplicationCard } from '@/components/jobs/ApplicationCard';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobsDashboardPage() {
    const { isAdmin } = useUserRole();
    const router = useRouter();

    // For admin: Get job statistics
    const { data: statsData, isLoading: isLoadingStats } = useGetJobStatistics();

    // For regular user: Get recent applications
    const { data: applicationsData, isLoading: isLoadingApplications } = useGetUserApplications({
        limit: 3,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const handleViewApplication = (id: string) => {
        router.push(`/dashboard/jobs/applications/${id}`);
    };

    return (
        <div className="space-y-6">
            {isAdmin ? (
                // Admin Dashboard
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoadingStats ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : (
                                    <div className="text-2xl font-bold">
                                        {statsData?.totalJobs || 0}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                                <FilePlus2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoadingStats ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : (
                                    <div className="text-2xl font-bold">
                                        {statsData?.jobsByStatus?.active || 0}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoadingStats ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : (
                                    <div className="text-2xl font-bold">
                                        {statsData?.applications?.total || 0}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="jobsByStatus" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="jobsByStatus">Jobs by Status</TabsTrigger>
                            <TabsTrigger value="jobsByType">Jobs by Type</TabsTrigger>
                            <TabsTrigger value="applicationsByStatus">Applications by Status</TabsTrigger>
                        </TabsList>

                        <TabsContent value="jobsByStatus" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jobs by Status</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    {isLoadingStats ? (
                                        <Skeleton className="h-[200px] w-full" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RechartsBarChart
                                                data={statsData ? [
                                                    { name: 'Active', value: statsData.jobsByStatus.active },
                                                    { name: 'Closed', value: statsData.jobsByStatus.closed },
                                                    { name: 'Draft', value: statsData.jobsByStatus.draft }
                                                ] : []}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#8884d8" />
                                            </RechartsBarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="jobsByType" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jobs by Type</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    {isLoadingStats ? (
                                        <Skeleton className="h-[200px] w-full" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RechartsBarChart
                                                data={statsData?.jobTypeDistribution?.map(item => ({
                                                    name: item.type.replace('_', ' '),
                                                    value: item.count
                                                })) || []}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#82ca9d" />
                                            </RechartsBarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="applicationsByStatus" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Applications by Status</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    {isLoadingStats ? (
                                        <Skeleton className="h-[200px] w-full" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RechartsBarChart
                                                data={statsData?.applications?.statusDistribution?.map(item => ({
                                                    name: item.status.replace('_', ' '),
                                                    value: item.count
                                                })) || []}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#ffc658" />
                                            </RechartsBarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end">
                        <Button onClick={() => router.push('/dashboard/jobs/create')}>
                            Create New Job
                        </Button>
                    </div>
                </>
            ) : (
                // User Dashboard
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingApplications ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                    </div>
                                ) : applicationsData?.applications.length === 0 ? (
                                    <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {applicationsData?.applications.map((application) => (
                                            <ApplicationCard
                                                key={application.id}
                                                application={application}
                                                onView={handleViewApplication}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <Button onClick={() => router.push('/jobs')}>
                                    Browse Available Jobs
                                </Button>
                                <Button onClick={() => router.push('/dashboard/jobs/applications')} variant="outline">
                                    View All Applications
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
