import { GlowingEffectUI } from "@/components/shared/GlowingEffectUI";

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center h-full">
        <GlowingEffectUI />
      </div>
    </main>
  );
}

