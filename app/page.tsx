import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      Welcome! This is the home page.
      <div className="flex flex-col justify-center items-center mt-2 space-y-2">
        <Link href="/dashboard">
          <Button>
            <LayoutDashboard />  Go to Dashboard
          </Button>
        </Link>
        <Link href="/auth/signin">
          <Button>
            <LogIn />  Signin
          </Button>
        </Link>
      </div>
    </div>
  );
}

