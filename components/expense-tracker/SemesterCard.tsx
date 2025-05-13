import React from 'react';
import { Semester } from '@/types/expense-tracker/expenseTracker.types';
import { format } from 'date-fns';
import { Calendar, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SemesterCardProps {
    semester: Semester;
}

export const SemesterCard = ({ semester }: SemesterCardProps) => {
    const router = useRouter();

    // Calculate duration in weeks
    const startDate = new Date(semester.startDate);
    const endDate = new Date(semester.endDate);
    const durationInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationInWeeks = Math.floor(durationInDays / 7);

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{semester.name}</CardTitle>
                        <CardDescription>
                            {semester.term} {semester.year}
                        </CardDescription>
                    </div>
                    {semester.isActive && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Active
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                {durationInWeeks} weeks ({durationInDays} days)
                            </span>
                        </div>
                    </div>
                </div>

                {semester._count && (
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-md border py-2">
                            <div className="text-2xl font-bold">{semester._count.expenses}</div>
                            <div className="text-xs text-muted-foreground">Expenses</div>
                        </div>
                        <div className="rounded-md border py-2">
                            <div className="text-2xl font-bold">{semester._count.budgets}</div>
                            <div className="text-xs text-muted-foreground">Budgets</div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/dashboard/expense-tracker/semesters/${semester.id}`)}
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
};
