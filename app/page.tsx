import { AIToolsSection } from "@/components/shared/ai-tools-section";
import { FeaturesSectionUI } from "@/components/shared/FeaturesSectionUI";
import { GlowingEffectUI } from "@/components/shared/GlowingEffectUI";
import { MacbookScrollUi } from "@/components/shared/MacbookScrollUI";

export default function Home() {
  return (
    <>
      <MacbookScrollUi />
      <main className="container mx-auto p-4">
        {/* <GlowingEffectUI />
        <FeaturesSectionUI /> */}
        <AIToolsSection />
      </main>
    </>
  );
}

