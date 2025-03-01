import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col space-y-4 items-center justify-center h-dvh">
      <h1 className="text-4xl font-bold">
        Next.js Project
      </h1>
      <Button>
        Click me
      </Button>
    </div>
  );
}
