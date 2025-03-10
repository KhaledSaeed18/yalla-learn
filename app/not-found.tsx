'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotFound() {
    const router = useRouter();
    const [isDashboardPath, setIsDashboardPath] = useState(false);
    const [message, setMessage] = useState("Sorry, we couldn't find the page you're looking for. The page might have been moved or deleted.");
    const [buttonText, setButtonText] = useState("Return to Home");
    const [buttonHref, setButtonHref] = useState("/");

    useEffect(() => {
        const isInDashboard = window.location.pathname.startsWith('/dashboard');
        setIsDashboardPath(isInDashboard);

        if (isInDashboard) {
            setMessage("Sorry, we couldn't find the dashboard page you're looking for. The page might have been moved or deleted.");
            setButtonText("Return to Dashboard");
            setButtonHref("/dashboard");
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <AlertCircle className="h-20 w-20 text-destructive" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>

                <p className="text-muted-foreground">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Button onClick={() => router.back()} variant="outline">
                        Go Back
                    </Button>

                    <Button asChild>
                        <Link href={buttonHref}>
                            {buttonText}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}