import HeroSection from "@/components/about/HeroSection";
import QuoteSection from "@/components/about/QuoteSection";
import HistorySection from "@/components/about/HistorySection";
import ValuesSection from "@/components/about/ValuesSection";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <main className="flex flex-col">
        <HeroSection />
        <QuoteSection />
        <HistorySection />
        <ValuesSection />
      </main>
    </div>
  );
}
