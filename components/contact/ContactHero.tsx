"use client"

export function ContactHero({ 
  title, 
  subtitle, 
  backgroundImage 
}: {
  title: string
  subtitle: string
  backgroundImage: string
}) {
  return (
    <div className="relative">
      <div 
        className="flex min-h-[380px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4" 
        aria-label="Abstract wavy lines pattern" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(17, 180, 212, 0.1) 0%, rgba(16, 31, 34, 0.4) 100%), url("${backgroundImage}")` 
        }}
      >
        <div className="flex flex-col gap-2 text-center text-white">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
            {title}
          </h1>
          <p className="text-base font-normal leading-normal md:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
