import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      Welcome! This is the home page.
      <div className="">
        <Link href="/dashboard">
          <Button>
            <LayoutDashboard />  Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

