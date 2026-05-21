import { Truck, RefreshCcw, ShieldCheck } from "lucide-react"

export function TrustSection() {
    return (
        <section className="bg-secondary/30 py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3 text-center">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold">Free Shipping</p>
                            <p className="text-sm text-muted-foreground">On all orders over $100</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <RefreshCcw className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold">Easy Returns</p>
                            <p className="text-sm text-muted-foreground">30-day money-back guarantee</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold">Secure Checkout</p>
                            <p className="text-sm text-muted-foreground">256-bit encrypted transactions</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
