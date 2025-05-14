import { AIToolsSection } from "@/components/shared/ai-tools-section";
import { ProductivityToolsSection } from "@/components/shared/productivity-tools-section";
import { MacbookScrollUi } from "@/components/shared/MacbookScrollUI";
import { BlogSection } from "@/components/shared/blog-section";
import { QASection } from "@/components/shared/qa-section";

export default function Home() {
  return (
    <>
      <MacbookScrollUi />
      <main className="container mx-auto p-4">
        <AIToolsSection />
        <ProductivityToolsSection />
        <BlogSection />
        <QASection />
      </main>
    </>
  );
}

