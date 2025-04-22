"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function AnimatedBeamUI() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden"
            ref={containerRef}
        >
            <div className="flex size-full flex-col items-stretch justify-between gap-10">
                <div className="flex flex-row justify-between">
                    <Circle ref={div1Ref}>
                        <Icons.user />
                    </Circle>
                    <Circle ref={div2Ref}>
                        <Icons.ai />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div2Ref}
                startYOffset={10}
                endYOffset={10}
                curvature={-20}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div2Ref}
                startYOffset={-10}
                endYOffset={-10}
                curvature={20}
                reverse
            />
        </div>
    );
}

const Icons = {
    ai: () => (
        <svg width="24" height="24" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.5 16C11.3369 13.8621 9.63793 12.1631 7.5 12C9.63793 11.8369 11.3369 10.1379 11.5 8C11.6631 10.1379 13.3621 11.8369 15.5 12C13.3621 12.1631 11.6631 13.8621 11.5 16V16Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.5 19C16.4128 18.3646 16.0239 17.1535 14.5 17C16.0239 16.8465 16.4128 15.6354 16.5 15C16.6535 16.5239 17.8646 16.9128 18.5 17C17.8646 17.0872 16.6535 17.4761 16.5 19Z" fill="#707070" />
            <path fillRule="evenodd" clipRule="evenodd" d="M16.5 19C16.4182 17.9311 15.5689 17.0818 14.5 17C15.5689 16.9182 16.4182 16.0689 16.5 15C16.5818 16.0689 17.4311 16.9182 18.5 17C17.4311 17.0818 16.5818 17.9311 16.5 19Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.5 5C16.6535 6.52394 17.8646 6.91282 18.5 7C17.8646 7.08719 16.6535 7.47606 16.5 9C16.4128 8.3646 16.0239 7.15348 14.5 7C16.0239 6.84652 16.4128 5.6354 16.5 5Z" fill="#707070" />
            <path fillRule="evenodd" clipRule="evenodd" d="M16.5 5C16.4182 6.06887 15.5689 6.91823 14.5 7C15.5689 7.08177 16.4182 7.93113 16.5 9C16.5818 7.93113 17.4311 7.08177 18.5 7C17.4311 6.91823 16.5818 6.06887 16.5 5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    user: () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
};
