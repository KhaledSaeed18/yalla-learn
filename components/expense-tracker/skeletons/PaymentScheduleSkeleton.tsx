import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const PaymentScheduleCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-[160px]" />
                        <Skeleton className="h-7 w-[120px]" />
                    </div>
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-5 w-[90px]" />
                    <div className="flex gap-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const PaymentSchedulesGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <PaymentScheduleCardSkeleton key={index} />
            ))}
        </div>
    );
};
