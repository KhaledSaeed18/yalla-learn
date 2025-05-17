'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useGetJobDetails, useDeleteJob } from '@/hooks/jobs/useJobs';
import { useGetJobApplications, useGetApplicationById, useUpdateApplicationStatus } from '@/hooks/jobs/useJobApplications';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, ArrowLeft, MapPin, Calendar, Clock, Edit, Trash, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ApplicationStatus } from '@/types/jobs/jobApplications.types';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const jobId = unwrappedParams.id;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

    // Fetch job details
    const { data: job, isLoading, error } = useGetJobDetails(jobId);

    // Fetch job applications
    const { data: applicationsData, isLoading: isLoadingApplications } = useGetJobApplications(jobId);

    // Fetch selected application details when ID is available
    const { data: applicationDetails, isLoading: isLoadingApplicationDetails } =
        useGetApplicationById(selectedApplicationId || '');

    const deleteJobMutation = useDeleteJob();
    const updateApplicationStatusMutation = useUpdateApplicationStatus();

    // Function to handle delete operation
    const handleDeleteJob = async () => {
        try {
            await deleteJobMutation.mutateAsync(jobId);
            toast.success("Job deleted successfully");
            router.push('/dashboard/jobs/listings');
        } catch (error) {
            toast.error("Error deleting job", {
                description: "An error occurred while deleting the job listing.",
            });
        }
    };

    // Function to handle application status update
    const handleUpdateStatus = async (status: ApplicationStatus) => {
        if (!selectedApplicationId) return;

        try {
            await updateApplicationStatusMutation.mutateAsync({
                id: selectedApplicationId,
                statusData: { status }
            });
        } catch (error) {
            toast.error("Failed to update application status");
        }
    };

    // Function to view application details
    const handleViewApplication = (applicationId: string) => {
        setSelectedApplicationId(applicationId);
        setIsApplicationModalOpen(true);
    };

    // Function to get job type badge color
    const getJobTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'FULL_TIME': return 'bg-blue-500';
            case 'PART_TIME': return 'bg-green-500';
            case 'CONTRACT': return 'bg-amber-500';
            case 'INTERNSHIP': return 'bg-purple-500';
            case 'REMOTE': return 'bg-teal-500';
            default: return 'bg-gray-500';
        }
    };

    // Function to get job status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-500';
            case 'CLOSED': return 'bg-red-500';
            case 'DRAFT': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-2xl font-bold mb-4">Job not found</h1>
                <Button onClick={() => router.push('/dashboard/jobs/listings')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Button variant="outline" onClick={() => router.push('/dashboard/jobs/listings')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Button>
                <div className="flex gap-2">
                    <Button onClick={() => router.push(`/dashboard/jobs/${jobId}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Job
                    </Button>
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Job
                    </Button>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
                            <CardDescription className="mt-1 text-lg">{job.company}</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 items-start sm:items-end">
                            <Badge className={`${getJobTypeBadgeColor(job.type)}`}>
                                {job.type.replace('_', ' ')}
                            </Badge>
                            <Badge className={`${getStatusBadgeColor(job.status)}`}>
                                {job.status}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{job.salary}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>
                        {job.deadline && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <Tabs defaultValue="description">
                        <TabsList>
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="requirements">Requirements</TabsTrigger>
                            <TabsTrigger value="applications">
                                Applications ({applicationsData?.applications?.length || 0})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="mt-4">
                            <div className="whitespace-pre-line">{job.description}</div>
                        </TabsContent>
                        <TabsContent value="requirements" className="mt-4">
                            <div className="whitespace-pre-line">{job.requirements}</div>
                        </TabsContent>
                        <TabsContent value="applications" className="mt-4">
                            {isLoadingApplications ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : applicationsData?.applications && applicationsData.applications.length > 0 ? (
                                <div className="space-y-4">
                                    {applicationsData.applications.map((application) => (
                                        <Card key={application.id}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        {application.applicant && (
                                                            <>
                                                                <div className="font-medium">{`${application.applicant.firstName} ${application.applicant.lastName}`}</div>
                                                                <span className="text-muted-foreground text-sm">{application.applicant.email}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <Badge>{application.status}</Badge>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() => handleViewApplication(application.id)}
                                                >
                                                    View Application
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No applications received yet.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                        Last updated: {new Date(job.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                        Posted by: {job.user.firstName} {job.user.lastName}
                    </div>
                </CardFooter>
            </Card>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the job listing and all associated applications.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteJob}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteJobMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                    </DialogHeader>

                    {isLoadingApplicationDetails ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : applicationDetails ? (
                        <div className="space-y-6">
                            <div className="flex flex-wrap justify-between items-center">
                                {applicationDetails.applicant && (
                                    <div className="font-medium text-lg">
                                        {applicationDetails.applicant.firstName} {applicationDetails.applicant.lastName}
                                    </div>
                                )}
                                <Badge className="text-sm">{applicationDetails.status}</Badge>
                            </div>

                            <div className="space-y-4">
                                {applicationDetails.applicant && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Contact Information</p>
                                        <p>{applicationDetails.applicant.email}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-muted-foreground">Application Date</p>
                                    <p>{new Date(applicationDetails.createdAt).toLocaleDateString()}</p>
                                </div>

                                {applicationDetails.coverLetter && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Cover Letter</p>
                                        <div className="p-3 bg-muted rounded-md mt-1 whitespace-pre-line max-h-60 overflow-y-auto text-sm">
                                            {applicationDetails.coverLetter}
                                        </div>
                                    </div>
                                )}

                                {applicationDetails.resume && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Resume</p>
                                        {applicationDetails.resume}
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-muted-foreground">Update Status</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <Button
                                            size="sm"
                                            variant={applicationDetails.status === 'PENDING' ? 'default' : 'outline'}
                                            onClick={() => handleUpdateStatus('PENDING')}
                                            disabled={updateApplicationStatusMutation.isPending}
                                        >
                                            Pending
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={applicationDetails.status === 'UNDER_REVIEW' ? 'default' : 'outline'}
                                            onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                                            disabled={updateApplicationStatusMutation.isPending}
                                        >
                                            Under Review
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={applicationDetails.status === 'SHORTLISTED' ? 'default' : 'outline'}
                                            onClick={() => handleUpdateStatus('SHORTLISTED')}
                                            disabled={updateApplicationStatusMutation.isPending}
                                        >
                                            Shortlist
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={applicationDetails.status === 'ACCEPTED' ? 'default' : 'outline'}
                                            className={applicationDetails.status === 'ACCEPTED' ? 'bg-green-600 hover:bg-green-700' : ''}
                                            onClick={() => handleUpdateStatus('ACCEPTED')}
                                            disabled={updateApplicationStatusMutation.isPending}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={applicationDetails.status === 'REJECTED' ? 'default' : 'outline'}
                                            className={applicationDetails.status === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' : ''}
                                            onClick={() => handleUpdateStatus('REJECTED')}
                                            disabled={updateApplicationStatusMutation.isPending}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>No application details available.</div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApplicationModalOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
