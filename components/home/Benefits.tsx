import { Activity, Zap, Shield, Heart } from "lucide-react"

export function Benefits() {
    const benefits = [
        {
            title: "Better Posture",
            description: "Our ergonomic designs naturally align your spine, reducing strain on your neck and back during long work sessions.",
            icon: Activity
        },
        {
            title: "Increased Productivity",
            description: "Stay focused and energized for longer periods with a workspace that adapts to your body's needs.",
            icon: Zap
        },
        {
            title: "Pain Relief",
            description: "Alleviate common desk-job ailments like carpal tunnel and lower back pain with proper support.",
            icon: Heart
        },
        {
            title: "Premium Quality",
            description: "Built with durable, high-quality materials to ensure your setup lasts for years of daily use.",
            icon: Shield
        }
    ]

    return (
        <section className="bg-secondary/30 py-20 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Why Ergonomic?</h2>
                    <p className="text-muted-foreground text-lg">Health, comfort, and productivity in perfect harmony</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon
                        return (
                            <div key={index} className="rounded-xl border border-border bg-card p-6 space-y-4">
                                <Icon className="h-8 w-8 text-foreground" />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
