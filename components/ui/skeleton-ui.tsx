import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonItem = ({ className = "h-4 w-full" }: { className?: string }) => {
    return <Skeleton className={className} />;
};

export const SkeletonButton = () => {
    return <Skeleton className="h-9 w-20 rounded-md" />;
};

export const SkeletonSelect = ({ width = "w-[140px]" }: { width?: string }) => {
    return <Skeleton className={`h-9 ${width} rounded-md`} />;
};

export const SkeletonBadge = () => {
    return <Skeleton className="h-5 w-16 rounded-full" />;
};

export const SkeletonInput = ({ width = "w-full" }: { width?: string }) => {
    return <Skeleton className={`h-9 ${width} rounded-md`} />;
};

/**
 * Creates a grid of skeleton items
 * @param columns - Number of columns (1-4)
 * @param rows - Number of rows
 * @param gap - Gap between items (in pixels or tailwind classes)
 * @param itemClassName - Class for each skeleton item
 */
export const SkeletonGrid = ({
    columns = 3,
    rows = 2,
    gap = "gap-6",
    itemClassName = "h-[200px]",
}: {
    columns?: 1 | 2 | 3 | 4;
    rows?: number;
    gap?: string;
    itemClassName?: string;
}) => {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={`grid ${gridCols[columns]} ${gap}`}>
            {Array.from({ length: rows * columns }).map((_, i) => (
                <Skeleton key={i} className={`${itemClassName} rounded-md`} />
            ))}
        </div>
    );
};
