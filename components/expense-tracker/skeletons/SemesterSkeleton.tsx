import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const SemesterTableSkeleton = () => {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-medium">Name</TableHead>
                        <TableHead className="font-medium">Term & Year</TableHead>
                        <TableHead className="font-medium">Duration</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-5 w-[140px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export const SemesterGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-md border bg-card p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-6 w-[80px]" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
