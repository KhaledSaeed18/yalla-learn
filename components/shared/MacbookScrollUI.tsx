import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import Link from "next/link";
import { Badge } from "lucide-react";

export function MacbookScrollUi() {
    return (
        <div className="overflow-hidden w-full">
            <MacbookScroll
                title={
                    <span>
                        Yalla Learn
                    </span>
                }
                badge={
                    <Link href={'/'}>
                        <Badge className="w-6 h-6" />
                    </Link>
                }
                src={`https://plus.unsplash.com/premium_photo-1676637656166-cb7b3a43b81a?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                showGradient={false}
            />
        </div>
    );
}
