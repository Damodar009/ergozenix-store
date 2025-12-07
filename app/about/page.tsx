
import { Globe } from "lucide-react";
import FeatureSection from "@/components/about/FeatureSection";
import HeroSection from "@/components/about/HeroSection";
import HistorySection from "@/components/about/HistorySection";
import TeamPhotoSection from "@/components/about/TeamPhotoSection";
import CTASection from "@/components/about/CTASection";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="flex flex-col max-w-5xl mx-auto">
        <HeroSection />

        <div className="px-4 md:px-10 py-12 text-center">
          <h2 className="text-foreground text-3xl font-bold leading-tight tracking-[-0.015em] mb-4">
            Our Mission
          </h2>
          <p className="text-base font-normal leading-relaxed max-w-3xl mx-auto">
            At ErgoFlex, our mission is to enhance the <strong>well-being</strong> of individuals by creating innovative and thoughtfully designed <strong>ergonomic solutions</strong>. We believe that a healthy and comfortable workspace is not a luxury, but a necessity for productivity, creativity, and overall happiness.
          </p>
        </div>

        <HistorySection />

        <FeatureSection
          icon={Globe}
          title="Sustainable by Design"
          description="We are committed to minimizing our environmental impact. Our products are designed with sustainability in mind, using eco-friendly materials, responsible manufacturing processes, and recyclable packaging wherever possible."
        />

        <TeamPhotoSection />

        <CTASection />
      </main>
    </div>
  );
}
