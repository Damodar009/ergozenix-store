"use client"

import { Button } from "@/components/ui/button"

type HeroProps = {
  backgroundUrl: string
  title: string
  subtitle: string
}

export function Hero({ backgroundUrl, title, subtitle }: HeroProps) {
  return (
    <section className="@container" id="home">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url(${JSON.stringify(
              backgroundUrl,
            )})`,
          }}
        >
          <div className="flex flex-col gap-2 text-left max-w-2xl">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              {title}
            </h1>
            <h2 className="text-gray-200 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              {subtitle}
            </h2>
          </div>
          <Button className="h-10 px-4 @[480px]:h-12 @[480px]:px-5 text-sm font-bold @[480px]:text-base transition-transform duration-200 hover:scale-105 bg-primary text-primary-foreground">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  )
}


