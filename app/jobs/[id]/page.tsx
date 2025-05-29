'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetJobDetails } from '@/hooks/jobs/useJobs';
import { useApplyForJob } from '@/hooks/jobs/useJobApplications';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calendar, MapPin, Briefcase, Building, Clock, ArrowLeft, DollarSign } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetJobDetails(id as string);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    const applyMutation = useApplyForJob();

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Error Loading Job</h1>
                <p className="text-muted-foreground mb-6">
                    There was a problem loading this job. It may have been removed or is no longer active.
                </p>
                <Button asChild>
                    <Link href="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs</Link>
                </Button>
            </div>
        );
    }

    const job = data;

    // Check if deadline has passed
    const isDeadlinePassed = job?.deadline ? new Date(job.deadline) < new Date() : false;
    // Check if job is not active
    const isClosed = job.status !== 'ACTIVE';
    // Check if user already applied
    const hasApplied = user && job.applications?.some(app => app.applicantId === user.id);

    // Function to render badge colors based on job type
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

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!job) return;

        try {
            await applyMutation.mutateAsync({
                jobId: job.id,
                applicationData: {
                    jobId: job.id,
                    coverLetter: coverLetter || null,
                    resume: resumeUrl || null
                }
            });

            toast("Application submitted successfully");

            setShowApplicationForm(false);
        } catch (error) {
            toast("Error submitting application", {
                description: "An error occurred while submitting your application.",
            });
        }
    };

    const renderApplicationButton = () => {
        if (!isAuthenticated) {
            return (
                <Button asChild>
                    <Link href={`/auth/signin?redirect=/jobs/${job.id}`}>
                        Sign in to Apply
                    </Link>
                </Button>
            );
        }

        if (hasApplied) {
            return <Button disabled>Already Applied</Button>;
        }

        if (isClosed) {
            return <Button disabled>Job Closed</Button>;
        }

        if (isDeadlinePassed) {
            return <Button disabled>Application Deadline Passed</Button>;
        }

        if (job.applicationUrl) {
            return (
                <Button asChild>
                    <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                        Apply Externally
                    </a>
                </Button>
            );
        }

        return (
            <Button onClick={() => setShowApplicationForm(!showApplicationForm)}>
                {showApplicationForm ? 'Cancel' : 'Apply Now'}
            </Button>
        );
    };

    return (
        <div className="container px-4 mx-auto py-12">
            <Button variant="outline" className="mb-6" asChild>
                <Link href="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs</Link>
            </Button>

            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
                            <div className="flex items-center mt-2 text-lg">
                                <Building className="mr-2 h-5 w-5" />
                                <span>{job.company}</span>
                            </div>
                        </div>
                        <Badge className={`${getJobTypeBadgeColor(job.type)}`}>
                            {job.type.replace('_', ' ')}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium">{job.salary}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        {job.deadline && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Apply by {new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-3">Job Description</h3>
                        <div className="whitespace-pre-line">{job.description}</div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                        <div className="whitespace-pre-line">{job.requirements}</div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={job.user.avatar || undefined} />
                            <AvatarFallback>{`${job.user.firstName[0]}${job.user.lastName[0]}`}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">Posted by {job.user.firstName} {job.user.lastName}</p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <div className="w-full">
                        {renderApplicationButton()}

                        {showApplicationForm && (
                            <form onSubmit={handleApply} className="mt-6 space-y-4">
                                <div>
                                    <Label htmlFor="cover-letter">Cover Letter</Label>
                                    <Textarea
                                        id="cover-letter"
                                        placeholder="Why are you a good fit for this role?"
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        className="mt-1"
                                        rows={6}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="resume">Resume URL (optional)</Label>
                                    <Input
                                        id="resume"
                                        placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                                        value={resumeUrl}
                                        onChange={(e) => setResumeUrl(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                <Button type="submit" disabled={applyMutation.isPending}>
                                    {applyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit Application
                                </Button>
                            </form>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
