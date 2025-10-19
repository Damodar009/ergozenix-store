import { FC } from "react";
import { Button } from "../ui/button";

const HeroSection: FC = () => (
  <div className="px-4 md:px-10 py-10">
    <div
      className="relative flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-4 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMyeTwdx6Y3OGe_4E7lNKCkKIdOhf9emyLnPp-P9ZM9E7CTag8PYnEiE-mX-DjbS6zOE5FPThqj1lbWKzrHUcjJwg0KYmt497XsqgpCGcjt32AnUdkN6LywbElqS1RqjaEUWNdA9tk8O0IG8WWjDT8XZDsIAj8t3gxeB5vcFICnm2pdDuCyZIu3F-CQ2sWfEujD4NOAbfqn7t7LSNbFocAdmUzak8TYSfAtHkkGWU-1552bljY6u9qbVG_8rHTmV8gf6ZOs0iJFYo2")`,
      }}
    >
      <div className="flex flex-col gap-4 max-w-2xl">
        <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
          Designing for a Healthier You.
        </h1>
        <h2 className="text-white text-base md:text-lg font-normal leading-normal">
          Discover the story behind ErgoFlex and our passion for creating healthier workspaces.
        </h2>
      </div>
      <Button className="h-12 px-5 mt-4">Shop Our Products</Button>
    </div>
  </div>
);

export default HeroSection;
