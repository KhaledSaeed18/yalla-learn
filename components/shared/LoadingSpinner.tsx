import { Loader2, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    centered?: boolean;
    fullScreen?: boolean;
    size?: string | number;
    spinnerClassName?: string;
    containerClassName?: string;
    iconProps?: LucideProps;
}

export default function LoadingSpinner({
    centered = true,
    fullScreen = false,
    size = "35px",
    spinnerClassName,
    containerClassName,
    iconProps,
    ...props
}: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                "flex",
                centered && "items-center justify-center",
                fullScreen && "h-screen w-screen",
                containerClassName
            )}
            {...props}
        >
            <Loader2
                className={cn(
                    "animate-spin",
                    spinnerClassName
                )}
                style={{
                    width: typeof size === 'number' ? `${size}px` : size,
                    height: typeof size === 'number' ? `${size}px` : size
                }}
                {...iconProps}
            />
        </div>
    );
}