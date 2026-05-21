import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight } from "lucide-react"

export function CompleteSetup() {
    const setupItems = [
        "Adjustable Desk",
        "Ergonomic Chair",
        "Monitor Stand",
        "Desk Pad",
        "Cable Management"
    ]

    return (
        <section className="py-20 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted order-last lg:order-first">
                        <img
                            src="/complete-setup.jpg"
                            alt="Complete ergonomic setup"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                                Build Your Perfect Ergonomic Setup
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                All five essential pieces work together to create an optimal workspace that supports your health and productivity throughout the day.
                            </p>
                        </div>
                        <ul className="space-y-3">
                            {setupItems.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-foreground">
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button size="lg" className="group">
                            Shop the Full Setup
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
