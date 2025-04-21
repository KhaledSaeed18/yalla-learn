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
                showGradient={false}
            />
        </div>
    );
}
