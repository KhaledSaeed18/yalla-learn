import { AIToolsSection } from "@/components/shared/ai-tools-section";
import { ProductivityToolsSection } from "@/components/shared/productivity-tools-section";
import { MacbookScrollUi } from "@/components/shared/MacbookScrollUI";

export default function Home() {
  return (
    <>
      <MacbookScrollUi />
      <main className="container mx-auto p-4">
        <AIToolsSection />
        <ProductivityToolsSection />
      </main>
    </>
  );
}

