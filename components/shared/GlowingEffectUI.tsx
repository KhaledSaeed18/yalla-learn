"use client";

import { BookOpen, FileText, Kanban, LifeBuoy, Lightbulb } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function GlowingEffectUI() {
    return (
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
            <GridItem
                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                icon={<BookOpen className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Student Blogs"
                description="Share your academic journey, insights and research with the community."
            />

            <GridItem
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={<Lightbulb className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="AI Study Tools"
                description="Leverage AI-powered tools to enhance your learning experience and boost productivity."
            />

            <GridItem
                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                icon={<FileText className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Resume Builder"
                description="Create professional resumes tailored to your academic achievements and career goals."
            />

            <GridItem
                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                icon={<LifeBuoy className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Q&A Forum"
                description="Connect with peers, ask questions, and collaborate on solutions to academic challenges."
            />

            <GridItem
                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                icon={<Kanban className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Kanban Task Management"
                description="Organize your academic projects and assignments with intuitive kanban boards."
            />
        </ul>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={`cursor-pointer min-h-[14rem] list-none ${area}`}>
            <div className="relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-600 p-2 ">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black dark:text-white">
                                {title}
                            </h3>
                            <h2
                                className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] md:text-base/[1.375rem]  text-black dark:text-neutral-400"
                            >
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
