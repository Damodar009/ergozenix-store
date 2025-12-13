import { FC } from "react";
import { Sparkles } from "lucide-react";

const HeroSection: FC = () => (
  <section className="relative bg-secondary/30 dark:bg-gray-900 pt-16 pb-24 md:pt-24 md:pb-32 px-4 overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="flex flex-col gap-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Our Philosophy</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
          Designing for a <br />
          <span className="text-primary">Healthier You.</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
          Discover the story behind ErgoZenix and our passion for creating workspaces that adapt to you, not the other way around.
        </p>
      </div>
      <div className="relative group">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div
          className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01] bg-cover bg-center"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMyeTwdx6Y3OGe_4E7lNKCkKIdOhf9emyLnPp-P9ZM9E7CTag8PYnEiE-mX-DjbS6zOE5FPThqj1lbWKzrHUcjJwg0KYmt497XsqgpCGcjt32AnUdkN6LywbElqS1RqjaEUWNdA9tk8O0IG8WWjDT8XZDsIAj8t3gxeB5vcFICnm2pdDuCyZIu3F-CQ2sWfEujD4NOAbfqn7t7LSNbFocAdmUzak8TYSfAtHkkGWU-1552bljY6u9qbVG_8rHTmV8gf6ZOs0iJFYo2")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white/90 text-sm font-medium">Modern Ergonomics</p>
            <p className="text-white font-bold text-xl">The Workspace of Tomorrow</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
