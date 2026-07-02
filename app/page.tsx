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
import { DeskAnatomy } from "@/components/home/DeskAnatomy"

export default function Home() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState("")
  const [bestsellers, setBestsellers] = useState<ProductCard[]>([])
  const [loadingBestsellers, setLoadingBestsellers] = useState(true)

  useEffect(() => {
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
        {/* ─── Hero ─── */}
        <header className="relative min-h-[90vh] flex flex-col overflow-hidden" style={{ backgroundColor: '#1a1a17' }}>
          {/* Background image with dark overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/horizental-1781379103725.jpg"
              alt=""
              className="w-full h-full object-cover"
              style={{ opacity: 0.28 }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(20,20,16,0.95) 0%, rgba(20,20,16,0.65) 50%, rgba(20,20,16,0.15) 100%)' }} />
          </div>
          {/* Main content */}
          <div className="relative z-10 flex-1 flex items-center px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto w-full py-24">
            <div className="max-w-[520px] flex flex-col gap-6">
              <span className="font-label-caps text-[11px] tracking-[3px] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Engineered for Wellbeing
              </span>
              <h1 className="font-display-hero text-display-hero leading-[1.05]" style={{ color: '#ffffff' }}>
                Stand Up.<br />Work Better.
              </h1>
              <p className="font-body-main text-[16px] max-w-[400px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
                Transform your workspace with precision-engineered standing desks. Reduce pain, boost productivity, and revolutionize how you work.
              </p>
              <div className="flex gap-4 flex-wrap mt-2">
                <Link href="/shop">
                  <button
                    className="font-label-caps tracking-[2px] text-[11px] flex items-center gap-2 px-7 py-4 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#ffffff', color: '#1c1c19', border: 'none', cursor: 'pointer' }}
                  >
                    Explore Desks
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', lineHeight: 1 }}>arrow_forward</span>
                  </button>
                </Link>
                <button
                  className="font-label-caps tracking-[2px] text-[11px] px-7 py-4 bg-transparent transition-colors hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.32)', color: '#ffffff', cursor: 'pointer' }}
                  onClick={() => document.getElementById('health-benefits')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Benefits
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="relative z-10 border-t backdrop-blur-sm" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="max-w-[var(--ef-container-max)] mx-auto px-[var(--ef-container-padding-x)] py-5 grid grid-cols-3">
              {[
                { value: "46%", label: "Productivity Boost" },
                { value: "120kg", label: "Max Capacity" },
                { value: "1yr", label: "Warranty" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-0.5 px-4"
                  style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
                >
                  <span className="font-display-hero text-[28px] md:text-[36px] leading-none" style={{ color: '#ffffff' }}>
                    {stat.value}
                  </span>
                  <span className="font-label-caps text-[10px] tracking-[2px] uppercase" style={{ color: 'rgba(255,255,255,0.42)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
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

        {/* ─── Health Benefits ─── */}
        <section id="health-benefits" className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto border-t border-border">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text */}
            <div className="flex flex-col gap-8">
              <div>
                <span className="font-label-caps text-[11px] tracking-[3px] text-primary uppercase block mb-3">
                  Health Benefits
                </span>
                <h2 className="font-headline-section text-headline-section text-foreground">
                  Why Standing Desks Matter
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                {[
                  {
                    title: "Reduce Back Pain",
                    body: "Studies show that standing desks can reduce chronic back and neck pain by up to 54%.",
                  },
                  {
                    title: "Boost Energy & Mood",
                    body: "Standing promotes better circulation and reduces fatigue throughout the day.",
                  },
                  {
                    title: "Increase Productivity",
                    body: "Users report 46% higher productivity when alternating between sitting and standing.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-1 shrink-0 rounded-full bg-primary mt-1" />
                    <div>
                      <p className="font-label-caps text-[13px] tracking-[1px] text-foreground font-semibold mb-1">
                        {item.title}
                      </p>
                      <p className="font-body-main text-[14px] text-muted-foreground leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/shop">
                <Button size="ef" variant="outline">
                  Explore Our Desks
                </Button>
              </Link>
            </div>

            {/* Right: Photo */}
            <div className="rounded-lg overflow-hidden border border-border aspect-[4/3] bg-muted">
              <img
                src="https://tdwhzskyljlypfffrghe.supabase.co/storage/v1/object/public/products/health-benefits-standing-desk.png"
                alt="Professional working comfortably at a standing desk"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Desk Anatomy Features Explorer */}
        <DeskAnatomy />

        {/* Value Props */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto border-t border-border">
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
