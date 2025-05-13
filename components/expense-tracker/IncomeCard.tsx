import React from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Calendar, PiggyBank, Trash2, Edit, DollarSign } from 'lucide-react';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Income } from '@/types/expense-tracker/income.types';

interface IncomeCardProps {
    income: Income;
    onEdit?: (income: Income) => void;
    onDelete?: (id: string) => void;
}

export const IncomeCard = ({ income, onEdit, onDelete }: IncomeCardProps) => {
    const router = useRouter();
    const date = parseISO(income.date);
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(income.amount);

    const handleEdit = () => {
        if (onEdit) {
            onEdit(income);
        } else {
            router.push(`/dashboard/expense-tracker/income/edit/${income.id}`);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(income.id);
        }
    };

    return (
        <Card className="h-full transition-all">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Badge className={income.recurring ? "bg-green-500 text-white" : "bg-emerald-500 text-white"}>
                            {income.recurring ? "Recurring" : "One-time"}
                        </Badge>
                    </div>
                    <span className="text-lg font-bold">{formattedAmount}</span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-3">
                    <p className="font-medium line-clamp-2">{income.source}</p>
                    {income.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{income.description}</p>
                    )}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(date, 'PPP')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PiggyBank className="h-4 w-4" />
                            <span>{income.recurring ? "Recurring Income" : "One-time Income"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Income</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                    <Button variant="outline" onClick={handleEdit} className="flex-1">
                        Edit
                    </Button>
                    {onDelete && (
                        <Button variant="outline" onClick={handleDelete} className="flex-1 text-destructive hover:text-destructive">
                            Delete
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};
