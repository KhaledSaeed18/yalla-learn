import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, DollarSign, CalendarClock, AlertTriangle, FileText } from 'lucide-react';
import { PaymentSchedule } from '@/types/expense-tracker/expenseTracker.types';

// Payment type color mapping
const paymentTypeColors: Record<string, string> = {
    TUITION: 'bg-blue-500',
    HOUSING: 'bg-purple-500',
    MEAL_PLAN: 'bg-orange-500',
    BOOKS: 'bg-indigo-500',
    LAB_FEES: 'bg-cyan-500',
    ACTIVITY_FEES: 'bg-pink-500',
    TECHNOLOGY_FEES: 'bg-fuchsia-500',
    INSURANCE: 'bg-green-500',
    PARKING: 'bg-amber-500',
    OTHER: 'bg-gray-500'
};

interface PaymentScheduleCardProps {
    paymentSchedule: PaymentSchedule;
    onEdit?: (paymentSchedule: PaymentSchedule) => void;
    onDelete?: (id: string) => void;
}

export const PaymentScheduleCard = ({
    paymentSchedule,
    onEdit,
    onDelete
}: PaymentScheduleCardProps) => {
    const router = useRouter();
    const dueDate = new Date(paymentSchedule.dueDate);
    const paidDate = paymentSchedule.paidDate ? new Date(paymentSchedule.paidDate) : null;
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(parseFloat(paymentSchedule.amount.toString()));

    // Calculate if payment is overdue
    const isOverdue = !paymentSchedule.isPaid && new Date() > dueDate;
    // Calculate if payment is upcoming (within next 7 days)
    const isUpcoming = !paymentSchedule.isPaid &&
        new Date() <= dueDate &&
        dueDate <= new Date(new Date().setDate(new Date().getDate() + 7));

    const handleEdit = () => {
        if (onEdit) {
            onEdit(paymentSchedule);
        } else {
            router.push(`/dashboard/expense-tracker/payment-schedules/edit/${paymentSchedule.id}`);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(paymentSchedule.id);
        }
    };

    return (
        <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Badge className={`${paymentTypeColors[paymentSchedule.paymentType]} text-white`}>
                            {paymentSchedule.paymentType.replace('_', ' ')}
                        </Badge>
                        {paymentSchedule.isPaid ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3" /> Paid
                            </Badge>
                        ) : isOverdue ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <AlertTriangle className="mr-1 h-3 w-3" /> Overdue
                            </Badge>
                        ) : isUpcoming ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <Clock className="mr-1 h-3 w-3" /> Upcoming
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <CalendarClock className="mr-1 h-3 w-3" /> Scheduled
                            </Badge>
                        )}
                    </div>
                    <span className="text-lg font-bold">{formattedAmount}</span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-3">
                    <p className="font-medium line-clamp-2">{paymentSchedule.name}</p>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(dueDate, 'MMM d, yyyy')}</span>
                        </div>
                        {paymentSchedule.isPaid && paidDate && (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Paid: {format(paidDate, 'MMM d, yyyy')}</span>
                            </div>
                        )}
                        {paymentSchedule.notes && (
                            <div className="flex items-center gap-2 mt-2">
                                <FileText className="h-4 w-4" />
                                <span className="line-clamp-2">{paymentSchedule.notes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                    <Button variant="outline" onClick={handleEdit} className="flex-1">
                        Edit
                    </Button>
                    {onDelete && (
                        <Button variant="outline" onClick={handleDelete} className="flex-1">
                            Delete
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};
