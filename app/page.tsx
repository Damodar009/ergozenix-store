"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { subscribeToNewsletter } from "@/services/newsletter-service"
import { ProductService } from "@/services/product-service"
import type { ProductWithDetails } from "@/models/product"
import { ValuePropCard } from "@/components/home/ValuePropCard"

export default function Home() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState("")
  const [editorsPick, setEditorsPick] = useState<any>(null)
  const [editorsPickProduct, setEditorsPickProduct] = useState<ProductWithDetails | null>(null)

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
    fetchPick()
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
              <Button size="ef">Shop Now</Button>
              <Button variant="outline" size="ef">Learn More</Button>
            </div>
          </div>
          <div className="w-full mt-24 px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)]">
            <div className="aspect-[21/9] w-full bg-muted overflow-hidden rounded-[6px]">
              <img alt="Minimalist Ergoform Desk" className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCphfEOcaoQtafKckxjbd9QpKwG4LBR35d8sYgGie9yy_BdORxH1F3E-m6Z0YYrIiiwR77bcXwMMyjXewVzuqmwRjAIVhu-t56Kaw4LvqXFcWFsgGwsGBpAAiZbPmuaCQfAPLYFU_W_Z4e21GTyjSSUpBoRPZ9KCTr_lHSONoyXPvHnUIy3CDwe3eir8B1qfJzvWIu6Xt6apvUEp-e-380lIXVSJxWjk9I8utaom0s5Tg_SXKxaIVE0jGAqooK1tRWO8wNAeiWEQdLY" />
            </div>
          </div>
        </header>

        {/* Category Strip */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--ef-gutter)]">
            <Link className="group block" href="/shop">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="aspect-square bg-secondary rounded-[6px] overflow-hidden mb-4 border border-border relative">
                    <img alt="Chairs Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZxCqliJUYtBk9S5choLbDIP5izxZk5VIzfp82mwmE1LJIfrm2xnKzvVjF_oTxYhUrjAbCG7DIz4ADGz_wEMfmLIADAN5btQEiA8DwlYIn3lXPQDJB1tACYn8Ws3XrQSFLFcCgKHd40HCvs4Bsl-UcOiamyHf8Ifzmix1NwP4J-ictBQJ_XWfE2XzrAEJ5k8ZGJSk_rQsRQzjwXe3bTs9aKvhZxbb2awGTrsy9dIeP_7tlBlXfwzeowvTAVAN5u0MukjA2CNw6aIWj" />
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
                  <div className="aspect-square bg-secondary rounded-[6px] overflow-hidden mb-4 border border-border">
                    <img alt="Desks Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByQLjUpGmnL6iw7fz1SwStwjav6-LreAvr1JoheHQvK1uB8uxeVwm8ze9GeEcCYbnqp8idyf6sr9L_Awd64sUC3s5Q1qqwg-KC2Pi8bg_uoBfBB05Y0aVKJX8siJF-E6HjedmBs5F7YwDbiH-vcwpLxwmCH4E6VWwCZfgU7u-6tMyPnuuag7Ml-tV-IXr5yyiRNrGc4zjOB1NWkcrkOZC8RPQk5LZJLTdZgshQsAc3A4jYqSC7FLmv6DmABrz30ZacT4xIz1bfNItO" />
                  </div>
                  <span className="font-label-caps text-label-caps text-foreground tracking-widest block text-center">DESKS</span>
                </CardContent>
              </Card>
            </Link>
            <Link className="group block" href="/shop">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="aspect-square bg-secondary rounded-[6px] overflow-hidden mb-4 border border-border relative">
                    <img alt="Monitor Arms Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxhaY88vBzOLtR878hr9OUTNqNfd7MV6H_P17sbvCZkx9QgQZPkJIOmGLWE9lV8A7NRwELTqfkyIEprYIKUn7YOpaRsgaS17WjVePVsJw_XsaxsWq6c8XiVsW3Kgb9SYHpa7jRF3AOlJHRqOvQANd2hLqd7Moi2J5KJurzKu6UICXM-fEpdmLt53PAlAD4sH2BM0N5x8yTlaNoUcffFLuPhgUWnUN6pilN8157JfNfTcRUYGPue6Nx81Qgs8J9krCVIh6j3evy-GX1" />
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
                    <img alt="Accessories Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxK7ftBBYfYGvvtKWRiwlw45IbSv7NNuJs5nL9DbXCuHcTVq2Gk9CX86A5NcoLO87n0oWLLGQMXOlXkZqA2XufTyoPvFX8xUXDoM0cVGbbdFU_cUUQg3KHBQGfT2FwxTysBQ6GnIO3Cnl07jhgyVRDX4a0_L7ze9vb8Ppz8Or9Y92MgUlRdlkjw2x6VddH32GmDeGjkt3_3mmgk6uz6xKunASRSd6n_PvL80J-JSul_zeu2haGwt5vz_jmVMreFd0iRjB7RuOViQXS" />
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

        {/* Product Grid */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline-section text-headline-section">Our bestsellers.</h2>
            <Link className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-80 transition-all" href="/shop">VIEW ALL PRODUCTS</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--ef-gutter)]">
            <Card className="group flex flex-col border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-accent rounded-[6px] border border-border overflow-hidden mb-[var(--ef-stack-md)] relative">
                  <img alt="Task Light" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKP9xz1IzYyDEpITVxTHHp3fNDzLXzSJ_arXJjgdxp2V3pS0evh_7MuVyVTs0cEBxQR6_XDL8Dzj3dYDb0vuF6in0yGy_CKl1Z4VI2jcewtK4HRvCU1YxWqIwFf_to4f271K5K426s5zZTUe4LwtDpw2Aq99NGxFGMFZ2Fl82npJUmV97i6-zUBSBlmy_2LbiwMcz7oENo01s2o1AxdtpiUQwmwmqiLNQ47qcGEAFptgiiXTD8YGJaN9fLSztbWUOEvlODEi_zTuEA" />
                  <div className="absolute top-4 left-4">
                    <Badge className="font-label-caps text-[9px] uppercase hover:bg-primary">Top Rated</Badge>
                  </div>
                </div>
                <CardTitle className="font-headline-card text-headline-card mb-1">Norden Task Light</CardTitle>
                <p className="font-body-main text-muted-foreground">Rs 185</p>
              </CardContent>
            </Card>
            <Card className="group flex flex-col border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-accent rounded-[6px] border border-border overflow-hidden mb-[var(--ef-stack-md)]">
                  <img alt="Foundation Desk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjWgyGoHOFzMyvp1O26ktgFcsFsATVkgJgAr5KERnyLy1VN4dVUB4tClFoI-QvcOgvQ8EDsYqnxPokBCOiUMi-rYyxVT3pdNKJs_ZNzjWGgvpYFmZElfFE0m5BjyOENHTH81tZnXTIEcVjrzFwYQd-wOeXpTPTDieWD3LxPLvy3xyrCyMcXM7Ob_4J9eQxvmIR9TqUJByHoQWJh0QAS3yt6xOF1VVwiJyciz3EqzRlmUNtVMBo825ZcfwfjWjVFAJN6HL_4dOrBsqw" />
                </div>
                <CardTitle className="font-headline-card text-headline-card mb-1">Foundation Desk</CardTitle>
                <p className="font-body-main text-muted-foreground">Rs 30,800</p>
              </CardContent>
            </Card>
            <Card className="group flex flex-col border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-accent rounded-[6px] border border-border overflow-hidden mb-[var(--ef-stack-md)]">
                  <img alt="Keyboard Tray" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHbPgF6hmIXDiZCDhXov26oS5Lhh2YQllKdfQeDFpGjCj0Zqv41VyUjP1lrHFXNVZiPBjql0Mp4OSyYMuOD6du-Go0YT6ZgO6Y7m9U1kzWAsiHsAJPd0C21dvjq0-is2ttk3-NKjAoVB_66cK1u8t7k-TfLrpmZnXOiogW4BLOcCl7LRnZ_hPdp7zCidw3Io2jyUETW3aFcZ24dSH2aom5_YdhrOJ5AG-aFVsqkHv8PItLTfqoLWkcrIrfFDhXfB9VB_hcxN8eEC1E" />
                </div>
                <CardTitle className="font-headline-card text-headline-card mb-1">Axis Keyboard Tray</CardTitle>
                <p className="font-body-main text-muted-foreground">Rs 95</p>
              </CardContent>
            </Card>
            <Card className="group flex flex-col border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-accent rounded-[6px] border border-border overflow-hidden mb-[var(--ef-stack-md)]">
                  <img alt="Felt Desk Mat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK4urfpqHm83IPwCEv5AHpdHb-hWLXh4P9Vpgx3hJMb9wa8XC9ORX4KezmeLUL1kZhksWzRSaS58jsZ3pP6c1JY75WWeIjWiHs6l7amRbV_sgP-b8BM_Yqy8b33LpI9hhIQrI2IhPpTr4hklYWiLFDMXtliIH4IxyCsMaJJ9aYC3fcdzuku2Kh6t4dNffac9xG3vUTI4lvAG-TVj0N5o2VZ_K3Q2tBxe3huIe_ae8GCq8OX9-zZdc3TF1uTqJtZwQaaKlBYZGCLLeG" />
                </div>
                <CardTitle className="font-headline-card text-headline-card mb-1">Linear Felt Mat</CardTitle>
                <p className="font-body-main text-muted-foreground">Rs 65</p>
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
