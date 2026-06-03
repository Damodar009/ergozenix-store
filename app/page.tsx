"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeToNewsletter } from "@/services/newsletter-service"

export default function Home() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState("")

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
        <header className="bg-[var(--ef-surface-container-lowest)] min-h-[921px] flex flex-col items-center justify-center pt-16">
          <div className="text-center px-[var(--ef-container-padding-x)] max-w-4xl mx-auto flex flex-col items-center gap-[var(--ef-stack-md)]">
            <span className="font-label-caps text-label-caps text-[var(--ef-primary)] tracking-[3px]">NEW ARRIVALS — SPRING 2025</span>
            <h1 className="font-display-hero text-display-hero text-[var(--ef-on-surface)] md:text-display-hero sm:text-display-hero-mobile">
              The desk you'll <br />
              <span className="italic font-normal">never want to leave.</span>
            </h1>
            <p className="font-body-main text-body-main text-[var(--ef-on-surface-variant)] max-w-[400px] mt-4">
              Redefining the relationship between human physiology and physical space through quiet, purposeful design.
            </p>
            <div className="flex gap-[var(--ef-stack-md)] mt-[var(--ef-stack-lg)]">
              <Button className="bg-[var(--ef-primary)] text-[var(--ef-on-primary)] px-8 py-3 rounded-[4px] font-label-caps text-[13px] uppercase tracking-wider hover:opacity-90 transition-all h-auto">Shop Now</Button>
              <Button variant="outline" className="border border-[var(--ef-outline-variant)] text-[var(--ef-on-surface)] bg-transparent px-8 py-3 rounded-[4px] font-label-caps text-[13px] uppercase tracking-wider hover:bg-[var(--ef-surface-container)] transition-all h-auto">Learn More</Button>
            </div>
          </div>
          <div className="w-full mt-24 px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)]">
            <div className="aspect-[21/9] w-full bg-[var(--ef-surface-container)] overflow-hidden rounded-[6px]">
              <img alt="Minimalist Ergoform Desk" className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCphfEOcaoQtafKckxjbd9QpKwG4LBR35d8sYgGie9yy_BdORxH1F3E-m6Z0YYrIiiwR77bcXwMMyjXewVzuqmwRjAIVhu-t56Kaw4LvqXFcWFsgGwsGBpAAiZbPmuaCQfAPLYFU_W_Z4e21GTyjSSUpBoRPZ9KCTr_lHSONoyXPvHnUIy3CDwe3eir8B1qfJzvWIu6Xt6apvUEp-e-380lIXVSJxWjk9I8utaom0s5Tg_SXKxaIVE0jGAqooK1tRWO8wNAeiWEQdLY" />
            </div>
          </div>
        </header>

        {/* Category Strip */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--ef-gutter)]">
            <Link className="group block" href="/shop">
              <div className="aspect-square bg-[var(--ef-surface-container-high)] rounded-[6px] overflow-hidden mb-4 border border-[var(--ef-outline-variant)]">
                <img alt="Chairs Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZxCqliJUYtBk9S5choLbDIP5izxZk5VIzfp82mwmE1LJIfrm2xnKzvVjF_oTxYhUrjAbCG7DIz4ADGz_wEMfmLIADAN5btQEiA8DwlYIn3lXPQDJB1tACYn8Ws3XrQSFLFcCgKHd40HCvs4Bsl-UcOiamyHf8Ifzmix1NwP4J-ictBQJ_XWfE2XzrAEJ5k8ZGJSk_rQsRQzjwXe3bTs9aKvhZxbb2awGTrsy9dIeP_7tlBlXfwzeowvTAVAN5u0MukjA2CNw6aIWj" />
              </div>
              <span className="font-label-caps text-label-caps text-[var(--ef-on-surface)] tracking-widest block text-center">CHAIRS</span>
            </Link>
            <Link className="group block" href="/shop">
              <div className="aspect-square bg-[var(--ef-surface-container-high)] rounded-[6px] overflow-hidden mb-4 border border-[var(--ef-outline-variant)]">
                <img alt="Desks Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByQLjUpGmnL6iw7fz1SwStwjav6-LreAvr1JoheHQvK1uB8uxeVwm8ze9GeEcCYbnqp8idyf6sr9L_Awd64sUC3s5Q1qqwg-KC2Pi8bg_uoBfBB05Y0aVKJX8siJF-E6HjedmBs5F7YwDbiH-vcwpLxwmCH4E6VWwCZfgU7u-6tMyPnuuag7Ml-tV-IXr5yyiRNrGc4zjOB1NWkcrkOZC8RPQk5LZJLTdZgshQsAc3A4jYqSC7FLmv6DmABrz30ZacT4xIz1bfNItO" />
              </div>
              <span className="font-label-caps text-label-caps text-[var(--ef-on-surface)] tracking-widest block text-center">DESKS</span>
            </Link>
            <Link className="group block" href="/shop">
              <div className="aspect-square bg-[var(--ef-surface-container-high)] rounded-[6px] overflow-hidden mb-4 border border-[var(--ef-outline-variant)]">
                <img alt="Monitor Arms Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxhaY88vBzOLtR878hr9OUTNqNfd7MV6H_P17sbvCZkx9QgQZPkJIOmGLWE9lV8A7NRwELTqfkyIEprYIKUn7YOpaRsgaS17WjVePVsJw_XsaxsWq6c8XiVsW3Kgb9SYHpa7jRF3AOlJHRqOvQANd2hLqd7Moi2J5KJurzKu6UICXM-fEpdmLt53PAlAD4sH2BM0N5x8yTlaNoUcffFLuPhgUWnUN6pilN8157JfNfTcRUYGPue6Nx81Qgs8J9krCVIh6j3evy-GX1" />
              </div>
              <span className="font-label-caps text-label-caps text-[var(--ef-on-surface)] tracking-widest block text-center">MONITOR ARMS</span>
            </Link>
            <Link className="group block" href="/shop">
              <div className="aspect-square bg-[var(--ef-surface-container-high)] rounded-[6px] overflow-hidden mb-4 border border-[var(--ef-outline-variant)]">
                <img alt="Accessories Category" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxK7ftBBYfYGvvtKWRiwlw45IbSv7NNuJs5nL9DbXCuHcTVq2Gk9CX86A5NcoLO87n0oWLLGQMXOlXkZqA2XufTyoPvFX8xUXDoM0cVGbbdFU_cUUQg3KHBQGfT2FwxTysBQ6GnIO3Cnl07jhgyVRDX4a0_L7ze9vb8Ppz8Or9Y92MgUlRdlkjw2x6VddH32GmDeGjkt3_3mmgk6uz6xKunASRSd6n_PvL80J-JSul_zeu2haGwt5vz_jmVMreFd0iRjB7RuOViQXS" />
              </div>
              <span className="font-label-caps text-label-caps text-[var(--ef-on-surface)] tracking-widest block text-center">ACCESSORIES</span>
            </Link>
          </div>
        </section>

        {/* Featured Product */}
        <section className="py-[var(--ef-section-padding)] bg-[var(--ef-surface-container-low)]">
          <div className="max-w-[var(--ef-container-max)] mx-auto px-[var(--ef-container-padding-x)] grid md:grid-cols-2 gap-24 items-center">
            <div className="relative max-w-[420px] mx-auto w-full">
              <div className="aspect-[4/5] bg-[var(--ef-surface)] rounded-[6px] overflow-hidden border border-[var(--ef-outline-variant)]">
                <img alt="The Ergonomix Desk" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ugGYmQ5alfRqx7jAu0wb6YHgd-_osxbSMaI_mB2gWaOOh9yKwz9xOdDKCDUPd2qfQTiTnCLWCLUrvFRCxbXSLw64wIqu4wAgDzq7wK_-jmHk3Yra23Q7pGakE_DuIqp0hKRULU9_lhSPz0g80IXTMTvNez4lUvbzlIEdJSSQQnrssB3rliWgK1qCs3qg7GqvJ90QKlyngHF2t1frSjeeul16z6XtE8iGPVZr6Dby8fbPW5ru6PU3_XAn3SK" />
              </div>
            </div>
            <div className="flex flex-col gap-[var(--ef-stack-md)]">
              <span className="font-label-caps text-label-caps text-[var(--ef-on-surface-variant)] tracking-[2px]">EDITOR'S PICK</span>
              <h2 className="font-headline-section text-headline-section">The Ergonomix Desk</h2>
              <span className="text-xl font-body-main text-[var(--ef-primary)]">$1,250.00</span>
              <p className="font-body-main text-body-main text-[var(--ef-on-surface-variant)] mt-2">Crafted with a solid oak top and a precision-engineered motor system, the Ergonomix Desk adapts to your micro-movements, ensuring total spinal alignment throughout the working day.</p>
              <ul className="mt-4 border-t border-[var(--ef-outline-variant)] pt-6 flex flex-col gap-3">
                <li className="flex justify-between items-center border-b border-[var(--ef-outline-variant)] pb-2">
                  <span className="font-label-caps text-label-caps">FRAME</span>
                  <span className="font-body-main text-body-main">Forest Green Steel</span>
                </li>
                <li className="flex justify-between items-center border-b border-[var(--ef-outline-variant)] pb-2">
                  <span className="font-label-caps text-label-caps">SURFACE</span>
                  <span className="font-body-main text-body-main">Solid European Oak</span>
                </li>
                <li className="flex justify-between items-center border-b border-[var(--ef-outline-variant)] pb-2">
                  <span className="font-label-caps text-label-caps">WARRANTY</span>
                  <span className="font-body-main text-body-main">10 Years</span>
                </li>
              </ul>
              <Button className="mt-8 bg-[var(--ef-primary)] text-[var(--ef-on-primary)] w-full py-4 rounded-[4px] font-label-caps text-[13px] uppercase tracking-wider hover:opacity-90 transition-opacity h-auto">Add to Cart</Button>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto border-b border-[var(--ef-outline-variant)]">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-[var(--ef-stack-md)]">
              <span className="material-symbols-outlined text-[var(--ef-primary)] text-4xl">schedule</span>
              <h3 className="font-label-caps text-label-caps tracking-widest">DESIGNED FOR LONG HOURS</h3>
              <p className="font-body-main text-body-main text-[var(--ef-on-surface-variant)]">Every contour is calculated to reduce pressure on lumbar discs and promote active sitting.</p>
            </div>
            <div className="flex flex-col items-center gap-[var(--ef-stack-md)]">
              <span className="material-symbols-outlined text-[var(--ef-primary)] text-4xl">shield</span>
              <h3 className="font-label-caps text-label-caps tracking-widest">BUILT TO LAST</h3>
              <p className="font-body-main text-body-main text-[var(--ef-on-surface-variant)]">We use industrial-grade components and sustainable materials that age beautifully over decades.</p>
            </div>
            <div className="flex flex-col items-center gap-[var(--ef-stack-md)]">
              <span className="material-symbols-outlined text-[var(--ef-primary)] text-4xl">local_shipping</span>
              <h3 className="font-label-caps text-label-caps tracking-widest">SHIPS IN 3 DAYS</h3>
              <p className="font-body-main text-body-main text-[var(--ef-on-surface-variant)]">In-stock essentials are processed and shipped from our regional hubs within 72 hours.</p>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline-section text-headline-section">Our bestsellers.</h2>
            <Link className="font-label-caps text-label-caps text-[var(--ef-primary)] border-b border-[var(--ef-primary)] pb-1 hover:text-[var(--ef-primary-container)] hover:border-[var(--ef-primary-container)] transition-all" href="/shop">VIEW ALL PRODUCTS</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--ef-gutter)]">
            <div className="group flex flex-col">
              <div className="aspect-[3/4] bg-[var(--ef-surface-container-low)] rounded-[6px] border border-[var(--ef-outline-variant)] overflow-hidden mb-[var(--ef-stack-md)] relative">
                <img alt="Task Light" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKP9xz1IzYyDEpITVxTHHp3fNDzLXzSJ_arXJjgdxp2V3pS0evh_7MuVyVTs0cEBxQR6_XDL8Dzj3dYDb0vuF6in0yGy_CKl1Z4VI2jcewtK4HRvCU1YxWqIwFf_to4f271K5K426s5zZTUe4LwtDpw2Aq99NGxFGMFZ2Fl82npJUmV97i6-zUBSBlmy_2LbiwMcz7oENo01s2o1AxdtpiUQwmwmqiLNQ47qcGEAFptgiiXTD8YGJaN9fLSztbWUOEvlODEi_zTuEA" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--ef-primary)] text-[var(--ef-on-primary)] font-label-caps text-[9px] px-2 py-1 rounded-full uppercase">Top Rated</span>
                </div>
              </div>
              <h4 className="font-headline-card text-headline-card">Norden Task Light</h4>
              <p className="font-body-main text-[var(--ef-on-surface-variant)]">$185.00</p>
            </div>
            <div className="group flex flex-col">
              <div className="aspect-[3/4] bg-[var(--ef-surface-container-low)] rounded-[6px] border border-[var(--ef-outline-variant)] overflow-hidden mb-[var(--ef-stack-md)]">
                <img alt="Foundation Desk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjWgyGoHOFzMyvp1O26ktgFcsFsATVkgJgAr5KERnyLy1VN4dVUB4tClFoI-QvcOgvQ8EDsYqnxPokBCOiUMi-rYyxVT3pdNKJs_ZNzjWGgvpYFmZElfFE0m5BjyOENHTH81tZnXTIEcVjrzFwYQd-wOeXpTPTDieWD3LxPLvy3xyrCyMcXM7Ob_4J9eQxvmIR9TqUJByHoQWJh0QAS3yt6xOF1VVwiJyciz3EqzRlmUNtVMBo825ZcfwfjWjVFAJN6HL_4dOrBsqw" />
              </div>
              <h4 className="font-headline-card text-headline-card">Foundation Desk</h4>
              <p className="font-body-main text-[var(--ef-on-surface-variant)]">$1,250.00</p>
            </div>
            <div className="group flex flex-col">
              <div className="aspect-[3/4] bg-[var(--ef-surface-container-low)] rounded-[6px] border border-[var(--ef-outline-variant)] overflow-hidden mb-[var(--ef-stack-md)]">
                <img alt="Keyboard Tray" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHbPgF6hmIXDiZCDhXov26oS5Lhh2YQllKdfQeDFpGjCj0Zqv41VyUjP1lrHFXNVZiPBjql0Mp4OSyYMuOD6du-Go0YT6ZgO6Y7m9U1kzWAsiHsAJPd0C21dvjq0-is2ttk3-NKjAoVB_66cK1u8t7k-TfLrpmZnXOiogW4BLOcCl7LRnZ_hPdp7zCidw3Io2jyUETW3aFcZ24dSH2aom5_YdhrOJ5AG-aFVsqkHv8PItLTfqoLWkcrIrfFDhXfB9VB_hcxN8eEC1E" />
              </div>
              <h4 className="font-headline-card text-headline-card">Axis Keyboard Tray</h4>
              <p className="font-body-main text-[var(--ef-on-surface-variant)]">$95.00</p>
            </div>
            <div className="group flex flex-col">
              <div className="aspect-[3/4] bg-[var(--ef-surface-container-low)] rounded-[6px] border border-[var(--ef-outline-variant)] overflow-hidden mb-[var(--ef-stack-md)]">
                <img alt="Felt Desk Mat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK4urfpqHm83IPwCEv5AHpdHb-hWLXh4P9Vpgx3hJMb9wa8XC9ORX4KezmeLUL1kZhksWzRSaS58jsZ3pP6c1JY75WWeIjWiHs6l7amRbV_sgP-b8BM_Yqy8b33LpI9hhIQrI2IhPpTr4hklYWiLFDMXtliIH4IxyCsMaJJ9aYC3fcdzuku2Kh6t4dNffac9xG3vUTI4lvAG-TVj0N5o2VZ_K3Q2tBxe3huIe_ae8GCq8OX9-zZdc3TF1uTqJtZwQaaKlBYZGCLLeG" />
              </div>
              <h4 className="font-headline-card text-headline-card">Linear Felt Mat</h4>
              <p className="font-body-main text-[var(--ef-on-surface-variant)]">$65.00</p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-[var(--ef-section-padding)] bg-[var(--ef-surface-container-low)]">
          <div className="max-w-[var(--ef-container-max)] mx-auto px-[var(--ef-container-padding-x)] text-center flex flex-col items-center">
            <h2 className="font-headline-section text-headline-section mb-[var(--ef-stack-sm)]">Good things, straight to your inbox.</h2>
            <p className="font-body-main text-body-main text-[var(--ef-on-surface-variant)] max-w-md mb-[var(--ef-stack-lg)]">Join our community for early access to product launches, ergonomic tips, and curated design inspiration.</p>
            <form className="flex flex-col sm:flex-row w-full max-w-lg gap-4" onSubmit={handleSubscribe}>
              <div className="flex-grow flex flex-col gap-2">
                <Input
                  className="w-full bg-[var(--ef-surface-container-lowest)] border border-[var(--ef-outline-variant)] px-6 py-4 rounded-[4px] focus-visible:ring-1 focus-visible:ring-[var(--ef-primary)] font-body-main h-[58px]"
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
                className="bg-[var(--ef-primary)] text-[var(--ef-on-primary)] px-10 py-4 rounded-[4px] font-label-caps text-[13px] uppercase tracking-wider hover:opacity-90 transition-opacity h-[58px]"
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
