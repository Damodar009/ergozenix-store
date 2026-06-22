"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { subscribeToNewsletter } from "@/services/newsletter-service"
import { ProductService } from "@/services/product-service"
import type { ProductWithDetails, ProductCard } from "@/models/product"
import { ValuePropCard } from "@/components/home/ValuePropCard"

export default function Home() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState("")
  const [editorsPick, setEditorsPick] = useState<any>(null)
  const [editorsPickProduct, setEditorsPickProduct] = useState<ProductWithDetails | null>(null)
  const [bestsellers, setBestsellers] = useState<ProductCard[]>([])
  const [loadingBestsellers, setLoadingBestsellers] = useState(true)

  useEffect(() => {
    async function fetchPick() {
      try {
        const data = await ProductService.getActiveEditorsPick()
        if (data) {
          setEditorsPick(data.editorsPick)
          setEditorsPickProduct(data.product)
        }
      } catch (err) {
        console.error("Failed to load active editor's pick:", err)
      }
    }

    async function fetchBestsellers() {
      try {
        const data = await ProductService.getBestsellers(4)
        setBestsellers(data || [])
      } catch (err) {
        console.error("Failed to load bestsellers:", err)
      } finally {
        setLoadingBestsellers(false)
      }
    }

    fetchPick()
    fetchBestsellers()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setMessage("")

    // Generate or retrieve a simple session ID
    const sessionId = typeof window !== 'undefined' ?
      (localStorage.getItem('session_id') || Math.random().toString(36).substring(2)) : 'anonymous'

    if (typeof window !== 'undefined' && !localStorage.getItem('session_id')) {
      localStorage.setItem('session_id', sessionId)
    }

    const result = await subscribeToNewsletter(email, sessionId)
    if (result.success) {
      setStatus('success')
      setMessage('Thanks for subscribing!')
      setEmail('')
    } else {
      setStatus('error')
      setMessage(result.error || 'Failed to subscribe')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full pb-[var(--ef-section-padding)]">
        {/* Header Section */}
        <header className="bg-card min-h-[921px] flex flex-col items-center justify-center pt-16">
          <div className="text-center px-[var(--ef-container-padding-x)] max-w-4xl mx-auto flex flex-col items-center gap-[var(--ef-stack-md)]">
            {/* <span className="font-label-caps text-label-caps text-primary tracking-[3px]">NEW ARRIVALS — SPRING 2025</span> */}
            <h1 className="font-display-hero text-display-hero text-foreground md:text-display-hero sm:text-display-hero-mobile">
              The desk you'll <br />
              <span className="italic font-normal">never want to leave.</span>
            </h1>
            <p className="font-body-main text-body-main text-muted-foreground max-w-[400px] mt-4">
              Redefining the relationship between human physiology and physical space through quiet, purposeful design.
            </p>
            <div className="flex gap-[var(--ef-stack-md)] mt-[var(--ef-stack-lg)]">
              <Link href="/shop"><Button size="ef">Shop Now</Button></Link>
              <Button variant="outline" size="ef">Learn More</Button>
            </div>
          </div>
          <div className="w-full mt-24 md:px-[var(--ef-container-padding-x)] px-0 max-w-[var(--ef-container-max)]">
            <div className="md:aspect-[21/9] aspect-[4/3] w-full bg-muted overflow-hidden md:rounded-[6px] rounded-none">
              <img alt="Minimalist Ergoform Desk" className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-1000" src="https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/horizental-1781379103725.jpg" />
            </div>
          </div>
        </header>

        {/* Category Strip */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--ef-gutter)]">
            <Link className="group block" href="/shop">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="aspect-square bg-secondary rounded-[6px] overflow-hidden mb-4 border border-border">
                    <img alt="Desks Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/desk-photo-1781421885235.mp4" />
                  </div>
                  <span className="font-label-caps text-label-caps text-foreground tracking-widest block text-center">DESKS</span>
                </CardContent>
              </Card>
            </Link>
            <Link className="group block" href="/shop">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="aspect-square bg-secondary rounded-[6px] overflow-hidden mb-4 border border-border relative">
                    <img alt="Chairs Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/chair-picture-1781357710445.jfif" />
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="font-label-caps text-[9px] uppercase tracking-wider bg-background/90 text-foreground border border-border hover:bg-background/90">Coming Soon</Badge>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-foreground tracking-widest block text-center">CHAIRS</span>
                </CardContent>
              </Card>
            </Link>

            <Link className="group block" href="/shop">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="aspect-square bg-secondary rounded-[6px] overflow-hidden mb-4 border border-border relative">
                    <img alt="Monitor Arms Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/monitor-arm-1781357868795.jfif" />
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="font-label-caps text-[9px] uppercase tracking-wider bg-background/90 text-foreground border border-border hover:bg-background/90">Coming Soon</Badge>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-foreground tracking-widest block text-center">MONITOR ARMS</span>
                </CardContent>
              </Card>
            </Link>
            <Link className="group block" href="/shop">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="aspect-square bg-secondary rounded-[6px] overflow-hidden mb-4 border border-border relative">
                    <img alt="Accessories Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/accessories-1781358271344.jfif" />
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="font-label-caps text-[9px] uppercase tracking-wider bg-background/90 text-foreground border border-border hover:bg-background/90">Coming Soon</Badge>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-foreground tracking-widest block text-center">ACCESSORIES</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline-section text-headline-section">Our bestsellers.</h2>
            <Link className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-80 transition-all" href="/shop">VIEW ALL PRODUCTS</Link>
          </div>
          {loadingBestsellers ? (
            <div className="text-center py-12 text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Loading bestsellers...
            </div>
          ) : bestsellers.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              No bestsellers found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--ef-gutter)]">
              {bestsellers.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col border-0 shadow-none bg-transparent rounded-none">
                  <Card className="border-0 shadow-none bg-transparent rounded-none flex-1 flex flex-col">
                    <CardContent className="p-0 flex-grow flex flex-col">
                      <div className="aspect-[3/4] bg-accent rounded-[6px] border border-border overflow-hidden mb-[var(--ef-stack-md)] relative">
                        {product.primary_image ? (
                          <img
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={product.primary_image}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/40">
                            <span className="material-symbols-outlined text-4xl text-muted-foreground">image</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="font-headline-card text-headline-card mb-1">{product.name}</CardTitle>
                      <p className="font-body-main text-muted-foreground">
                        {product.sale_price && product.sale_price < product.base_price ? (
                          <>
                            <span className="text-foreground font-semibold">Rs. {product.sale_price.toLocaleString()}</span>
                            <span className="line-through text-muted-foreground ml-2 text-xs">Rs. {product.base_price.toLocaleString()}</span>
                          </>
                        ) : (
                          <span>Rs. {product.base_price.toLocaleString()}</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Value Props */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto border-b border-border">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <ValuePropCard
              icon="schedule"
              title="DESIGNED FOR LONG HOURS"
              description="Engineered for endurance — every angle, curve, and adjustment designed to keep you at your best, hour after hour."
            />
            <ValuePropCard
              icon="shield"
              title="BUILT TO LAST"
              description="Premium-grade steel frames and an 18mm plywood surface — built to withstand the demands of daily use, year after year."
            />
            <ValuePropCard
              icon="local_shipping"
              title="DELIVERED ACROSS NEPAL"
              description="
We deliver to your doorstep across Nepal — our team on hand to set you up, zero hassle."
            />
          </div>
        </section>

        {/* Featured Product */}
        <section className="py-[var(--ef-section-padding)] bg-accent">
          <div className="max-w-[var(--ef-container-max)] mx-auto px-[var(--ef-container-padding-x)]">
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="p-0 grid md:grid-cols-2 gap-24 items-center">
                <div className="relative max-w-[420px] mx-auto w-full">
                  <div className="aspect-[4/5] bg-background rounded-[6px] overflow-hidden border border-border">
                    <img
                      alt={editorsPick?.custom_title || editorsPickProduct?.name || "The Double Motor Adjustable Desk"}
                      className="w-full h-full object-cover"
                      src={
                        (editorsPickProduct?.images && editorsPickProduct.images.find(img => img.is_primary)?.image_url) ||
                        (editorsPickProduct?.images && editorsPickProduct.images.length > 0 ? editorsPickProduct.images[0].image_url : null) ||
                        "https://lh3.googleusercontent.com/aida/ADBb0ugGYmQ5alfRqx7jAu0wb6YHgd-_osxbSMaI_mB2gWaOOh9yKwz9xOdDKCDUPd2qfQTiTnCLWCLUrvFRCxbXSLw64wIqu4wAgDzq7wK_-jmHk3Yra23Q7pGakE_DuIqp0hKRULU9_lhSPz0g80IXTMTvNez4lUvbzlIEdJSSQQnrssB3rliWgK1qCs3qg7GqvJ90QKlyngHF2t1frSjeeul16z6XtE8iGPVZr6Dby8fbPW5ru6PU3_XAn3SK"
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[var(--ef-stack-md)]">
                  <Badge variant="outline" className="w-fit font-label-caps text-muted-foreground tracking-[2px] border-border rounded-full">
                    {editorsPick?.badge_text || "EDITOR'S PICK"}
                  </Badge>
                  <CardTitle className="font-headline-section text-headline-section">
                    {editorsPick?.custom_title || editorsPickProduct?.name || "The Double Motor Adjustable Desk"}
                  </CardTitle>
                  <span className="text-xl font-body-main text-primary">
                    {editorsPickProduct ? `Rs ${editorsPickProduct.base_price.toLocaleString()}` : "Rs 30,800"}
                  </span>

                  {editorsPick?.description_1 ? (
                    <p className="font-body-main text-body-main text-muted-foreground mt-2">{editorsPick.description_1}</p>
                  ) : (
                    <p className="font-body-main text-body-main text-muted-foreground mt-2">Constructed with a robust 18mm plywood top, the Double Motor Adjustable Desk is engineered for durability and everyday resilience. The surface is smooth, stable, and built to handle the demands of a full working day — whether that's dual monitors, a laptop, or everything in between.</p>
                  )}

                  {editorsPick?.description_2 ? (
                    <p className="font-body-main text-body-main text-muted-foreground mt-2">{editorsPick.description_2}</p>
                  ) : (
                    <p className="font-body-main text-body-main text-muted-foreground mt-2">Driven by a dual motor system, the Double Motor Adjustable Desk lifts and adjusts with effortless precision, handling heavier loads without strain while keeping every transition whisper-quiet and shake-free.</p>
                  )}

                  <ul className="mt-4 border-t border-border pt-6 flex flex-col gap-3">
                    <li className="flex justify-between items-center border-b border-border pb-2">
                      <span className="font-label-caps text-label-caps">FRAME</span>
                      <span className="font-body-main text-body-main">{editorsPick?.frame_spec || "Forest Green Steel"}</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-border pb-2">
                      <span className="font-label-caps text-label-caps">SURFACE</span>
                      <span className="font-body-main text-body-main">{editorsPick?.surface_spec || "Solid European Oak"}</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-border pb-2">
                      <span className="font-label-caps text-label-caps">WARRANTY</span>
                      <span className="font-body-main text-body-main">{editorsPick?.warranty_spec || "10 Years"}</span>
                    </li>
                  </ul>

                  <Link href={editorsPickProduct ? `/products/${editorsPickProduct.slug}` : "/shop"} className="w-full">
                    <Button className="mt-8 w-full" size="ef">
                      {editorsPickProduct ? "View Details" : "Add to Cart"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-[var(--ef-section-padding)] bg-accent">
          <div className="max-w-[var(--ef-container-max)] mx-auto px-[var(--ef-container-padding-x)]">
            <Card className="text-center flex flex-col items-center bg-transparent border-0 shadow-none w-full">
              <CardHeader className="p-0 flex flex-col items-center w-full">
                <CardTitle className="font-headline-section text-headline-section mb-[var(--ef-stack-sm)]">Good things, straight to your inbox.</CardTitle>
                <p className="font-body-main text-body-main text-muted-foreground max-w-2xl mx-auto mb-[var(--ef-stack-lg)]">Join our community for early access to product launches, ergonomic tips, and curated design inspiration.</p>
              </CardHeader>
              <CardContent className="w-full p-0">
                <form className="flex flex-col sm:flex-row w-full max-w-lg mx-auto gap-4" onSubmit={handleSubscribe}>
                  <div className="flex-grow flex flex-col gap-2">
                    <Input
                      className="bg-card font-body-main h-[58px]"
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading' || status === 'success'}
                      required
                    />
                    {message && (
                      <p className={`text-sm text-left ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    size="ef"
                  >
                    {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
