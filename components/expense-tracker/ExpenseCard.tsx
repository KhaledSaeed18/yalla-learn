import React from 'react';
import { format } from 'date-fns';
import { Expense, ExpenseCategoryType } from '@/types/expense-tracker/expenseTracker.types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Category color mapping
const categoryColors: Record<keyof typeof ExpenseCategoryType, string> = {
    HOUSING: 'bg-blue-500',
    FOOD: 'bg-orange-500',
    TRANSPORTATION: 'bg-purple-500',
    EDUCATION: 'bg-indigo-500',
    ENTERTAINMENT: 'bg-pink-500',
    HEALTHCARE: 'bg-green-500',
    CLOTHING: 'bg-yellow-500',
    UTILITIES: 'bg-cyan-500',
    SUBSCRIPTIONS: 'bg-rose-500',
    SAVINGS: 'bg-emerald-500',
    PERSONAL_CARE: 'bg-violet-500',
    GIFTS: 'bg-amber-500',
    TRAVEL: 'bg-sky-500',
    TECH: 'bg-fuchsia-500',
    INSURANCE: 'bg-lime-500',
    OTHER: 'bg-gray-500'
};

interface ExpenseCardProps {
    expense: Expense;
    onEdit?: (expense: Expense) => void;
    onDelete?: (id: string) => void;
}

export const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
    const router = useRouter();
    const date = new Date(expense.date);
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(parseFloat(expense.amount));

    const handleEdit = () => {
        if (onEdit) {
            onEdit(expense);
        } else {
            router.push(`/dashboard/expense-tracker/expenses/edit/${expense.id}`);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(expense.id);
        }
    };

    return (
        <Card className="h-full cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => router.push(`/dashboard/expense-tracker/expenses/${expense.id}`)}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Badge className={`${categoryColors[expense.category]} text-white`}>
                            {expense.category.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline">{expense.paymentMethod.replace(/_/g, ' ')}</Badge>
                    </div>
                    <span className="text-lg font-bold">{formattedAmount}</span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-3">
                    <p className="font-medium line-clamp-2">{expense.description}</p>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(date, 'PPP')}</span>
                        </div>
                        {expense.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{expense.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>{expense.paymentMethod.replace(/_/g, ' ')}</span>
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
