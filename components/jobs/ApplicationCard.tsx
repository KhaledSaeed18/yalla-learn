import { JobApplication, ApplicationStatus } from '@/types/jobs/jobApplications.types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Briefcase, Calendar, Link } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationCardProps {
    application: JobApplication;
    onView: (id: string) => void;
    onUpdateStatus?: (id: string, status: ApplicationStatus) => void;
    isAdmin?: boolean;
}

export function ApplicationCard({ application, onView, onUpdateStatus, isAdmin = false }: ApplicationCardProps) {
    // Function to render badge colors based on application status
    const getStatusBadgeColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500';
            case 'UNDER_REVIEW': return 'bg-blue-500';
            case 'SHORTLISTED': return 'bg-purple-500';
            case 'ACCEPTED': return 'bg-green-500';
            case 'REJECTED': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    // Statuses that can be set by admin
    const availableStatuses: { status: ApplicationStatus; label: string }[] = [
        { status: 'PENDING', label: 'Pending' },
        { status: 'UNDER_REVIEW', label: 'Under Review' },
        { status: 'SHORTLISTED', label: 'Shortlisted' },
        { status: 'ACCEPTED', label: 'Accepted' },
        { status: 'REJECTED', label: 'Rejected' },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">
                            {application.job?.title || 'Job Application'}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">
                            {application.job?.company || 'Unknown Company'}
                        </div>
                    </div>
                    <Badge className={getStatusBadgeColor(application.status)}>
                        {application.status.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start space-x-4">
                    {isAdmin && application.applicant && (
                        <Avatar>
                            <AvatarImage src={application.applicant.avatar || undefined} />
                            <AvatarFallback>
                                {`${application.applicant.firstName[0]}${application.applicant.lastName[0]}`}
                            </AvatarFallback>
                        </Avatar>
                    )}

                    <div className="space-y-2">
                        {isAdmin && application.applicant && (
                            <div>
                                <div className="font-medium">
                                    {application.applicant.firstName} {application.applicant.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {application.applicant.email}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}</span>
                            </div>

                            {application.job && (
                                <div className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{application.job.type.replace('_', ' ')}</span>
                                </div>
                            )}

                            {application.resume && (
                                <div className="flex items-center gap-1">
                                    <Link className="h-4 w-4" />
                                    <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View Resume
                                    </a>
                                </div>
                            )}
                        </div>

                        {application.coverLetter && (
                            <div className="mt-4">
                                <div className="text-sm font-medium">Cover Letter:</div>
                                <div className="text-sm line-clamp-3">{application.coverLetter}</div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
                <Button onClick={() => onView(application.id)}>View Details</Button>

                {isAdmin && onUpdateStatus && (
                    <div className="flex flex-wrap gap-2">
                        {availableStatuses.map((statusOption) => (
                            <Button
                                key={statusOption.status}
                                variant={statusOption.status === application.status ? "default" : "outline"}
                                size="sm"
                                onClick={() => onUpdateStatus(application.id, statusOption.status)}
                                disabled={statusOption.status === application.status}
                            >
                                {statusOption.label}
                            </Button>
                        ))}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
