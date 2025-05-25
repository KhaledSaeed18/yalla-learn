import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Info - Yalla Learn",
    description: "Information and links about Yalla Learn platform and repositories",
};

export default function InfoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
