import { Job } from '@/types/jobs/jobs.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
    job: Job;
    onView: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    isAdmin?: boolean;
}

export function JobCard({ job, onView, onEdit, onDelete, isAdmin = false }: JobCardProps) {
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

    // Function to render status badge colors
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-500';
            case 'CLOSED': return 'bg-red-500';
            case 'DRAFT': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                        <CardDescription className="mt-1">{job.company}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <Badge className={`${getJobTypeBadgeColor(job.type)}`}>
                            {job.type.replace('_', ' ')}
                        </Badge>
                        {isAdmin && (
                            <Badge className={`${getStatusBadgeColor(job.status)}`}>
                                {job.status}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                    </div>
                    {job.salary && (
                        <div className="flex items-center gap-1">
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
                <p className="line-clamp-2">{job.description}</p>

                {isAdmin && job.applications && (
                    <div className="mt-4">
                        <span className="text-sm font-medium">
                            {job.applications.length} Application{job.applications.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button onClick={() => onView(job.id)}>
                    View {isAdmin ? 'Details' : 'Job'}
                </Button>
                {isAdmin && onEdit && (
                    <Button variant="outline" onClick={() => onEdit(job.id)}>
                        Edit
                    </Button>
                )}
                {isAdmin && onDelete && (
                    <Button variant="destructive" onClick={() => onDelete(job.id)}>
                        Delete
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
