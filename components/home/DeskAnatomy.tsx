"use client"

import { Layers, Zap, Cpu, Shield } from "lucide-react"

interface FeatureSpecification {
  label: string
  value: string
}

interface Feature {
  id: number
  title: string
  description: string
  image: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  specs: FeatureSpecification[]
}

const DESK_FEATURES: Feature[] = [
  {
    id: 1,
    title: "Premium 18mm Tabletop",
    description: "Double-refined premium plywood core with a sustainable wood veneer, built to handle heavy setups without any sag.",
    image: "https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/plywood-1782213186849.jpg",
    icon: Layers,
    specs: [
      { label: "Core Material", value: "Double-Refined Plywood" },
      { label: "Thickness", value: "18 mm" },
      { label: "Surface Finish", value: "Sustainable Wood Veneer" },
      { label: "Load Rating", value: "High-load (up to 120kg)" },
    ],
  },
  {
    id: 2,
    title: "Silent Dual Motors",
    description: "Whisper-quiet dual-motor lift system providing smooth height adjustments at 38mm/s with built-in anti-collision safety.",
    image: "https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/desk-frame2-1782214472780.png",
    icon: Zap,
    specs: [
      { label: "Motor Count", value: "Dual Premium Motors" },
      { label: "Noise Level", value: "< 42 dB (Whisper-Quiet)" },
      { label: "Lift Speed", value: "38 mm/s" },
      { label: "Safety System", value: "Gyroscopic Anti-Collision" },
    ],
  },
  {
    id: 3,
    title: "Smart Control Handset",
    description: "Programmable digital handset featuring 3 memory height presets and a real-time digital height display.",
    image: "https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/controller-image-edited-1782216198817.png",
    icon: Cpu,
    specs: [
      { label: "Memory Presets", value: "3 Memory Presets" },
      { label: "Height Display", value: "LED Digital Readout" },
      { label: "Charging Ports", value: "Integrated USB-A Fast Port" },
      { label: "Child Protection", value: "One-Touch Safety Lock" },
    ],
  },
  {
    id: 4,
    title: "Heavy Steel Frame",
    description: "Industrial-grade powder-coated steel legs, engineered for maximum stability even at full height extension.",
    image: "https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/desk-frame2-1782214472780.png",
    icon: Shield,
    specs: [
      { label: "Frame Material", value: "Powder-Coated Steel" },
      { label: "Column Stages", value: "3-Stage Columns" },
      { label: "Height Range", value: "620 mm - 1270 mm" },
      { label: "Max Load Capacity", value: "150 kg Static Weight" },
    ],
  },
]

export function DeskAnatomy() {
  return (
    <section className="py-[var(--ef-section-padding)] bg-background">

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto px-[var(--ef-container-padding-x)] space-y-3 mb-16">
        <span className="font-label-caps text-label-caps text-primary tracking-[3px] block">
          ENGINEERED PERFECTION
        </span>
        <h2 className="font-headline-section text-headline-section text-foreground leading-tight">
          Anatomy of the ErgoZenix Desk
        </h2>
        <p className="font-body-main text-body-main text-muted-foreground">
          Explore the premium materials, engineering details, and precise specifications that set the ErgoZenix standing desk apart.
        </p>
      </div>

      {/* Full-width Stack of Banners */}
      <div className="flex flex-col w-full border-t border-border">
        {DESK_FEATURES.map((feature, idx) => {
          const IconComponent = feature.icon
          const isEven = idx % 2 === 0

          return (
            <div
              key={feature.id}
              className="relative overflow-hidden w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center group border-b border-border bg-neutral-950"
            >
              {/* Background Cover Image */}
              <img
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out origin-center select-none pointer-events-none group-hover:scale-105"
                src={feature.image}
              />

              {/* Faded Editorial Overlay: Responsive Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 transition-opacity duration-300 ${isEven
                  ? "md:bg-gradient-to-r md:from-black/90 md:via-black/40 md:to-transparent"
                  : "md:bg-gradient-to-l md:from-black/90 md:via-black/40 md:to-transparent"
                  }`}
              />

              {/* Centered Content Container */}
              <div
                className={`relative z-20 w-full max-w-[var(--ef-container-max)] mx-auto px-[var(--ef-container-padding-x)] flex ${isEven ? "justify-start" : "md:justify-end justify-start"
                  }`}
              >
                {/* Inner Text Block */}
                <div className="w-full md:max-w-lg lg:max-w-xl text-left flex flex-col gap-5 text-white py-12 md:py-20">
                  {/* Meta details & Icon */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 backdrop-blur-md text-primary border border-primary/30 p-2">
                      <IconComponent size={20} />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-primary font-bold">
                      0{idx + 1} // {feature.title.split(" ").slice(-1)[0]}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-3">
                    <h3 className="font-headline-card text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {feature.title}
                    </h3>
                    <p className="font-body-main text-sm md:text-base leading-relaxed text-zinc-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Specs Divider Line */}
                  <div className="w-full h-[1px] bg-white/10 my-1" />

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {feature.specs.map((spec, specIdx) => (
                      <div key={specIdx} className="flex flex-col text-left gap-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                          {spec.label}
                        </span>
                        <span className="text-xs sm:text-sm text-white font-bold font-mono">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
