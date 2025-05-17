'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetApplicationById } from '@/hooks/jobs/useJobApplications';
import { ApplicationStatus } from '@/types/jobs/jobApplications.types';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, ArrowLeft, ExternalLink, FileText, MessageSquare } from 'lucide-react';
import { use } from 'react';

export default function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const applicationId = unwrappedParams.id;

    // Fetch application details
    const { data: application, isLoading, error } = useGetApplicationById(applicationId);

    // Handle back navigation
    const handleBack = useCallback(() => {
        router.push('/dashboard/jobs/applications');
    }, [router]);

    // Function to render status badge with appropriate color
    const getStatusBadgeColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500';
            case 'UNDER_REVIEW':
                return 'bg-blue-500';
            case 'SHORTLISTED':
                return 'bg-purple-500';
            case 'ACCEPTED':
                return 'bg-green-500';
            case 'REJECTED':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Handle view job details
    const handleViewJob = () => {
        if (application?.job?.id) {
            router.push(`/dashboard/jobs/${application.job.id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="space-y-6">
                <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Applications
                </Button>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <p className="text-lg text-muted-foreground">Application not found or error loading details.</p>
                        <Button onClick={handleBack} className="mt-4">
                            Return to Applications
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Applications
                </Button>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
                {/* Left column: Application details */}
                <div className="md:col-span-12 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle>Application Details</CardTitle>
                                <Badge
                                    className={`${getStatusBadgeColor(application.status)} text-white px-3 py-1`}
                                >
                                    {application.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold">Applied For</h3>
                                <div className="flex items-center mt-2">
                                    <div>
                                        <p className="text-lg font-semibold">{application.job?.title}</p>
                                        <p className="text-sm text-muted-foreground">{application.job?.company}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-4 flex items-center gap-2"
                                    onClick={handleViewJob}
                                >
                                    <ExternalLink className="h-4 w-4" /> View Job Details
                                </Button>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
                                {application.coverLetter ? (
                                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                                        {application.coverLetter}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground italic">No cover letter provided</p>
                                )}
                            </div>

                            {application.resume && (
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-3">Resume</h3>
                                    <Button className="flex items-center gap-2" variant="outline">
                                        <FileText className="h-4 w-4" />
                                        Download Resume
                                    </Button>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">
                                        Application Date: {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                                    </p>
                                    {application.updatedAt !== application.createdAt && (
                                        <p className="text-sm text-muted-foreground">
                                            Last Updated: {formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
