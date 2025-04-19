import { GlowingEffectUI } from "@/components/shared/GlowingEffectUI";
import { MacbookScrollUi } from "@/components/shared/MacbookScrollUI";
import { ThreeDMarqueeUI } from "@/components/shared/ThreeDMarqueeUI";

export default function Home() {
  return (
    <>
      <MacbookScrollUi />
      <main className="container mx-auto p-4">
        <GlowingEffectUI />
        <ThreeDMarqueeUI />
      </main>
    </>
  );
}

