import { AIToolsSection } from "@/components/shared/ai-tools-section";
import { ProductivityToolsSection } from "@/components/shared/productivity-tools-section";
import { MacbookScrollUi } from "@/components/shared/MacbookScrollUI";
import { BlogSection } from "@/components/shared/blog-section";
import { QASection } from "@/components/shared/qa-section";
import { ResumeBuilderSection } from "@/components/shared/resume-builder-section";
import { ExpenseTrackerSection } from "@/components/shared/expense-tracker-section";
import { KanbanBoardSection } from "@/components/shared/kanban-board-section";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SectionNavigation } from "@/components/shared/section-navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { MobileDeviceUI } from "@/components/shared/mobile-device-ui";
import { Sparkles, Brain, FileText, MessageSquare, FileCheck, Wallet, Trello, Smartphone, ShoppingBag } from "lucide-react";
// import { CardDemo } from "@/components/shared/CardDemo";

export default function Home() {
  const sections = [
    { id: "ai-tools", label: "AI Tools", icon: <Sparkles className="h-5 w-5" /> },
    { id: "productivity", label: "Productivity", icon: <Brain className="h-5 w-5" /> },
    { id: "resume", label: "Resume Builder", icon: <FileCheck className="h-5 w-5" /> },
    { id: "expense-tracker", label: "Expense Tracker", icon: <Wallet className="h-5 w-5" /> },
    { id: "kanban-board", label: "Kanban Board", icon: <Trello className="h-5 w-5" /> },
    { id: "blog", label: "Blog", icon: <FileText className="h-5 w-5" /> },
    { id: "qa", label: "Q&A", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  return (
    <>
      <MacbookScrollUi />
      {/* <CardDemo /> */}
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

        <section id="expense-tracker" className="scroll-mt-28 py-10">
          <SectionHeader
            title="Expense Tracker"
            description="Take control of your finances with smart budget management tools"
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
          <ExpenseTrackerSection />
        </section>

        <section id="kanban-board" className="scroll-mt-28 py-10">
          <SectionHeader
            title="Kanban Board"
            description="Organize tasks and boost productivity with visual project management"
            icon={<Trello className="h-6 w-6 text-primary" />}
          />
          <KanbanBoardSection />
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

        <section className="px-4 md:px-25">
          <MobileDeviceUI />
        </section>
        <ScrollToTop />
      </main>
    </>
  );
}

