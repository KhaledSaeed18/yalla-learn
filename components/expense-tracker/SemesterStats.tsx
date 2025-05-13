import React from 'react';
import { Semester } from '@/types/expense-tracker/expenseTracker.types';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SemesterStatsProps {
    semester: Semester;
}

export const SemesterStats = ({ semester }: SemesterStatsProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Statistics
                </CardTitle>
                <CardDescription>Expense data and budget information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Total Expenses</p>
                        <h3 className="mt-1 text-2xl font-bold">{semester._count?.expenses || 0}</h3>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Budget Plans</p>
                        <h3 className="mt-1 text-2xl font-bold">{semester._count?.budgets || 0}</h3>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Payment Schedules</p>
                        <h3 className="mt-1 text-2xl font-bold">{semester._count?.paymentSchedules || 0}</h3>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Status</p>
                        <h3 className="mt-1 text-lg font-bold">
                            {semester.isActive ? (
                                <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                            ) : (
                                <Badge variant="outline">Inactive</Badge>
                            )}
                        </h3>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
