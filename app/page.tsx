import { AIToolsSection } from "@/components/shared/ai-tools-section";
import { ProductivityToolsSection } from "@/components/shared/productivity-tools-section";
import { MacbookScrollUi } from "@/components/shared/MacbookScrollUI";
import { BlogSection } from "@/components/shared/blog-section";
import { QASection } from "@/components/shared/qa-section";
import { ResumeBuilderSection } from "@/components/shared/resume-builder-section";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SectionNavigation } from "@/components/shared/section-navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { Sparkles, Brain, FileText, MessageSquare, FileCheck } from "lucide-react";

export default function Home() {
  const sections = [
    { id: "ai-tools", label: "AI Tools", icon: <Sparkles className="h-5 w-5" /> },
    { id: "productivity", label: "Productivity", icon: <Brain className="h-5 w-5" /> },
    { id: "resume", label: "Resume Builder", icon: <FileCheck className="h-5 w-5" /> },
    { id: "blog", label: "Blog", icon: <FileText className="h-5 w-5" /> },
    { id: "qa", label: "Q&A", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  return (
    <>
      <MacbookScrollUi />
      <SectionNavigation sections={sections} />
      <main className="container mx-auto">
        <section id="ai-tools" className="scroll-mt-28 py-10">
          <SectionHeader
            title="AI Tools"
            description="Enhance your learning experience with our cutting-edge AI-powered tools"
            icon={<Sparkles className="h-6 w-6 text-primary" />}
          />
          <AIToolsSection />
        </section>

        <section id="productivity" className="scroll-mt-28 py-10">
          <SectionHeader
            title="Productivity Tools"
            description="Boost your efficiency and focus with our specialized productivity features"
            icon={<Brain className="h-6 w-6 text-primary" />}
          />
          <ProductivityToolsSection />
        </section>

        <section id="resume" className="scroll-mt-28 py-10">
          <SectionHeader
            title="Resume Builder"
            description="Create professional resumes that stand out with our customizable templates"
            icon={<FileCheck className="h-6 w-6 text-primary" />}
          />
          <ResumeBuilderSection />
        </section>

        <section id="blog" className="scroll-mt-28 py-10">
          <SectionHeader
            title="Blog"
            description="Explore our articles on learning strategies, career development, and more"
            icon={<FileText className="h-6 w-6 text-primary" />}
          />
          <BlogSection />
        </section>

        <section id="qa" className="scroll-mt-28 py-10">
          <SectionHeader
            title="Questions & Answers"
            description="Get help from our community of students and educators"
            icon={<MessageSquare className="h-6 w-6 text-primary" />}
          />
          <QASection />
        </section>
        <ScrollToTop />
      </main>
    </>
  );
}

