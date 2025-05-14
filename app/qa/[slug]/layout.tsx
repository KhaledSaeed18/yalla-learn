import type { Metadata } from "next";
import type { ReactNode } from "react";

export async function generateMetadata({ params }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const decodedSlug = decodeURIComponent(resolvedParams.slug.replace(/-/g, ' '));

    return {
        title: `Question - ${decodedSlug}`,
        description: "View question details and answers from the community",
    };
}

export default async function QaQuestionLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}) {
    // We don't need to use params in the layout itself, 
    // but we make it async to satisfy TypeScript requirements
    await params;

    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}