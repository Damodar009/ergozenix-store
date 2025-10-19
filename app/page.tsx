import { Header } from "@/components/header"
import { Hero } from "@/components/home/Hero"
import { FeaturedProducts, type Product } from "@/components/home/FeaturedProducts"
import { Features } from "@/components/home/Features"
import { Testimonials, type Testimonial } from "@/components/home/Testimonials"

const featuredProducts: Product[] = [
  {
    name: "ErgoChair Pro",
    description: "The ultimate chair for all-day comfort and support.",
    price: "$499.00",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv1iTBvPDkvIGDZbxX0L3n2xOVj-gkOt9MpST5bUOKCbcXcgPOz7gbCD5Ej0l2Smd0HOf0AxCO_tQGDODo4ny4TP7UrPw1vkFC9Vu5mGbr5uNyIXYH8znvXFdZqJ2FWNQgBgp7uYEM1mSRAaRMyGX2V3zD6TYa2XQ3VCT2ZwQQ9AsqFNWNz6Ez425vS1INS2yq10ozuEOQbmMF-EELlDe1NWnZSrp7kYLOeo6qks92WwDNEbbeRFwdFwv9BcSApaJj2RpytyrJO9DN",
    alt: "ErgoChair Pro",
  },
  {
    name: "Adjustable Standing Desk",
    description: "Switch between sitting and standing with ease.",
    price: "$599.00",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVTqTKga4GXBCQab4D01F2KxxI8BxytL-gyopydVxpgbG-7_okrjmrFru5Ddh6x0_NL9qJLlzTpCn4mKFQ2xc4qpp2MxK07WfRRLy6IW5YtxGwW9NlpC7Cp_udCxL-waaO0u6MSkh2lC5DBsZWMKnHuL3advIUNFGJayozybmdo8xwTETlA2QqTZ_wz13tL21ySaYJ58xkRzoW-winVbP_YmM0VScWFYbtu0QkU6uKdAxEdzkdThhTQEgI4ZlY0gcqMmVjr28q3NgE",
    alt: "Adjustable Standing Desk",
  },
  {
    name: "Vertical Mouse",
    description: "Designed to reduce wrist strain and improve comfort.",
    price: "$79.00",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6nyQVozpL361XPiLZYsNzwWR-hGfAf9JbkTzAYX-WCNsy3h3_XWH2r4LJf2DF31XjEI6CA_jHTnKkK_1Mx33veRbo38Gb6X3PAcsL8Ku_S5A7snfcqIzUGYRxuLMDKfkm8PnOsIlKHrjLeJeJTowDEe6vTT1T0YT7kV1YValNjr1EXrz_HRvplrrsmm88QNZz-LKoqZNNFyz2iQa6_BI-JXf6Zlf7mDpnRIJCsqDJzDdVi7clDHVDhc9ImqeDVjVt-l7m8lZPempW",
    alt: "Vertical Mouse",
  },
]

const testimonials: Testimonial[] = [
  {
    name: "Alex Johnson",
    quote:
      "The ErgoChair Pro has been a game-changer for my home office. My back pain is gone, and I can focus for longer periods. Highly recommended!",
    rating: 5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwaojhpWg7VPf-XaUif0Pox7evceyfbawiSK2ZkM3XutmbJAWJwzSEpDP6MIrOrmJRy18rHyiGQpm-xRzdI6Y9iRMcc2Sd0I9CJaoBZQMGvLkDIOM_HuznVlVkWw7fW_5gxWzuNZqHrwS--lMQkBKwiPRFTWsQd4ii0b8Nm1GwHVH1CKYj9GibsF80X_2HJ8oRWEgtIGWw5L94_rZ3C0OKF0XmWQibtuNzokX1Cr8Gmo10pFioVb_ZtsBwFH6MJVi0cqMpsfpPMZou",
  },
  {
    name: "Samantha Lee",
    quote:
      "I love my new standing desk! The quality is excellent, and it was easy to assemble. It's made a huge difference in my energy levels throughout the day.",
    rating: 4.5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwqNdbibNUFmrcaAJIBfzyOgv0-VwGFf63QOjTZiRwO3kMLnuMEP0Gy9bWCvUtW8X2j00zjv92v-iDhfN3Dzs5Ml6ZvwxjnTVLWWmUpHz0g19gHYmSBRHlnTcEz2oQnBiKk1FqsQVdhauLuKYjV87xmrWlWwZxaKsDXYlZ0hPJgcCdhJSc7iGd_MwwltHHxzKns97Vt43UwHlcpEufyYEoul8kN-kLUwQVYGF6KbDpNexftQA-5GEUelJ6ZQxrLvHvsVDqUTkDJ6QG",
  },
  {
    name: "David Chen",
    quote:
      "The vertical mouse is so comfortable. I had some wrist pain from my old mouse, but this one has completely solved the issue. Great product.",
    rating: 5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjptnbViQ_X9Z9NSpvYVFqVBolcvRI8ikWEPWfhUHsT6CR4sCcdqtWddisydb59r6ptIwtMMtv-3fN4u9sXV59p98ltsxZcJrGdl44VU94apRgpsjAAJZrPuwfqAdcbIuggI8nBPq_kyoAx7Jo07pfE3NIOdJMRmUvZI_7nBTjh3XUruL6bViF1ivcQB9NvtXVNOkxGcO1ArPm7I2FYSlj7l-hmSk0hwstkEVB6cIa-Ka4J9ikujZsQDveFERKObTl0EtaYpiIAsoR",
  },
]

export default function home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-auto">
        <div className="px-4 md:px-10 lg:px-20 py-5">
          <div className="flex flex-col max-w-7xl mx-auto">
            <Hero
              backgroundUrl=
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCAsV_ZjbY1GbN9kVlleyLUtUVxcdJ8hdiqfUxYu_cFt374R5g_8s9qt7wHHyj726C82roZXyiv-2R71hfXRf7-LQkjludoti816WNBn2S2r0xkRC9fKAS53Rct0aeSjxO5fcI3Az-uJsbFx5x5WXzh-IOgLX-8jolXWtWCYhdR7tBEy-IbCXgSQaPo_vwg236E9KawWGai9GPc6r0ZDmFS0UJQIl46ZVZkA-ufWykk9t0_ob_gbrs6AzvTEzqf25XE7lF3QHWTZhzY"
              title="Upgrade Your Workspace, Elevate Your Well-being"
              subtitle="Discover our range of ergonomic products designed for comfort and productivity."
            />
            <FeaturedProducts products={featuredProducts} />
            <Features />
            <Testimonials testimonials={testimonials} />
          </div>
        </div>
      </main>
    </div>
  )
}
