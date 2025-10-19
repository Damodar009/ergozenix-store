import { FC } from "react";
import { Button } from "../ui/button";

const CTASection: FC = () => (
  <div className="px-4 md:px-10 py-16 bg-primary/10 dark:bg-primary/20 rounded-xl my-10 mx-4 md:mx-10">
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-gray-800 dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em] mb-4">
        Ready to transform your workspace?
      </h2>
      <p className="text-base font-normal leading-relaxed mb-6">
        Explore our collection of ergonomic solutions and start your journey to a more comfortable and productive workday.
      </p>
      <Button className="h-12 px-5 mx-auto">Learn More About Ergonomics</Button>
    </div>
  </div>
);

export default CTASection;
