import { FC } from "react";

interface FeatureSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureSection: FC<FeatureSectionProps> = ({ icon: Icon, title, description }) => (
  <div className="px-4 md:px-10 py-12 text-center">
    <div className="flex flex-col items-center gap-4">
      <Icon className="text-primary h-12 w-12" />
      <h2 className="text-foreground text-3xl font-bold leading-tight tracking-[-0.015em]">
        {title}
      </h2>
      <p className="text-base font-normal leading-relaxed max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  </div>
);

export default FeatureSection;
