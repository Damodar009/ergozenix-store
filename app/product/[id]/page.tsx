"use client"

import { Header } from "@/components/header"
import { Breadcrumbs, type BreadcrumbItem } from "@/components/product/Breadcrumbs"
import { ProductGallery, type ProductImage } from "@/components/product/ProductGallery"
import { ProductDetails, type ProductSpec } from "@/components/product/ProductDetails"
import { ReviewSummary, type RatingDistribution } from "@/components/product/ReviewSummary"
import { RelatedProducts, type RelatedProduct } from "@/components/product/RelatedProducts"

// Mock product data - in real app, this would come from API/database
const productData = {
  id: "ergoflex-pro",
  title: "ErgoFlex Pro Ergonomic Office Chair",
  rating: 4.5,
  reviewCount: 125,
  price: "399.99",
  description: "The ErgoFlex Pro is designed to provide ultimate comfort and support for long hours of work. Its adjustable features and breathable materials ensure you stay productive and pain-free throughout the day.",
  images: [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOvbsuRc7kah34EXTvwjIIhyNKIJAuA8MoYuOHc6Pc5EV49q6vwhMq6JVhLbPFZ_BZikfTlpWKXUMqeiFuYsBi8QIOQKhJN-F_PhM-N2YiEXBOxCLC4eAsO3oY_1aegd2W3zymmb5wWIPJiWTeLI147DtNeB7nzecNcecAdcQDOQyyLNGGr7uL1_8DfZAnGshDgQRFoIkG9swlwf8l06UlAMiX0eMr0CA468oII2MW_ZyeoYCCVf4-Mz5vcLYDzZTpseH7WOeQc-BE",
      alt: "ErgoFlex Pro chair from the side",
      primary: true,
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY8gFfNVTl0TiQ8VxEv3l4EXFd_UQYvJkxCXyXHUJz6ZJtjWN-_DjU6FQIqCIpOOmdDYvg8E2z82bcV31kejuCHRLWJbBdBt6YLONhLxkPgGk8pxt-rjmonPJLLaLodErqyuN2V20_YUxrZ-1sGWrlWu8dzX2X0SqcMfKVVpeCl85RQlKUk19fdjUVCB4gnCthe7q6DSGjZ72_xb8KyNpjaDJxNzL7WyFvdhvFsCxHntMCeZvmN3xqVk6SY-N-sscwjVvGSF1D9ovN",
      alt: "ErgoFlex Pro chair from the front",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpj1V4qCqr7y-tHGRXkuucp7tqaR-APZRvthUDI1CCjgSYi4zf1gM4wZ4W2uq-SO0_t4NgZy8lje5S9aPrEN3OszDNcYbmeUdENbI-oB8VibXBvBl7Roqf30BS7ZoAKCIHlL5N9cu3QZa2GVMPuVIEFLXf-rqef6qqpeCJncKxv1q0XICV7jdsV3y9I39yY5ABpmOB3GQlAIwv8YP2zhMTy7YzQuoPTAA0X2dDcfBQsPVogCM65M7y-EuhNA90tSnU_MKBIq6Fjmr6",
      alt: "ErgoFlex Pro chair from the back",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpl4TK43Iwychr_q9Zkuz00GP_VvPZA762g28gxoeJuphq2HzvU7TgU36uZUm_ccufN_VHvmXk7Q6FBR8IZiGFCh51XKr-qM3yKmoZMPB55NcLWlm_VdmH6GrKTSicHiAuw6zyt4bhJ8KItw0nfCkXNN-NCNdycBm7NEPa7lVQiBAWcS-QVqRTR89NrK6uGGrzWsIg13sXleE06O0v_SlDiH0gLuhoEJbwdoVo98l6K8KPiqqsWyxka-Hszx7lrE0lLigMTJ0EVuYF",
      alt: "Close up of the chair's armrest",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAMoBXUvCva-lVAgWX2DpPjySSRxDWSlidCWUHfHLLcU9payJyqtbn3ntEp-Ofh-4apEsdjl8fW4a6QLvBoA9mvcvW-FdbaWvA8cSYEyw-8GuDVbOsmp3Rc5fPsy1CDlwAOCfqewfM-taNQpYcjlc1I-CRHsWxbbkdiLsJI9KKVZZpIVAYE1X568Tm3KkfdqbhBKSFBWPY8NE9AzjWZapRLBlE8w1osJFUal90nl13HiWuWKvy0bxSZUYmYX4xKjYO_Z6r1iWu5yhW",
      alt: "Close up of the chair's wheels",
    },
  ] as ProductImage[],
  specifications: [
    { label: "Material", value: "Breathable Mesh, Aluminum Base" },
    { label: "Weight", value: "45 lbs" },
    { label: "Dimensions", value: '25"W x 27"D x 45-48"H' },
  ] as ProductSpec[],
  ratingDistribution: [
    { rating: 5, percent: 70 },
    { rating: 4, percent: 15 },
    { rating: 3, percent: 8 },
    { rating: 2, percent: 4 },
    { rating: 1, percent: 3 },
  ] as RatingDistribution[],
  relatedProducts: [
    {
      name: "ErgoFlex Standing Desk",
      price: "599",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTl-qekC5Ld-PdI8o2jyRao0wJ6NqBig-kv1AH0IHGNUYAsHCKi9y4gMIq0aCqH7lrP87bFtacwtKiMgXwid5p61WMp14hMPApAaaLKirCuI3PQ90QT-v_Al2SpeD5ndIsERPiGx3QaQqsm-ULraoQEYfB8jtCxaAzOa-AHU_Rg4UeYU2E_TPxq20sIZMKRN-8VBb9InJ3KMRICEYkzK8KMCnqmSCBAV-3gNcBdWpU43L8glhXlP6q2bUL38bEKRCoFZJQ4VQdWwl0",
      altText: "A standing desk with a laptop on it",
      href: "/product/standing-desk",
    },
    {
      name: "ErgoFlex Lumbar Pillow",
      price: "49",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHaji760C3q8BeLR2Rsem9zzrG2xD-Yl5qwuM_lCdlTfF-1tISo3AdvkPa1vM3zB1ZEyliM4ExtBXyurDU28kFwr_30Y950ZWc7fTbg-4H6FJZTfbpvTcpehEHT9m_HSDIobvqZS9i5aGYlxJdF7o6LdoMvfqh8JuUaA1W9iltsxLpKNqDvgTIjCkpVMEjL-FOJbh54WTuBgKXmAjYU8s6VQ2-OGEh2Xj2kpp0yQP-YaB-TU8noDnF1jfZWWP9uKr-lLl45joQz2MB",
      altText: "A lumbar support pillow on a chair",
      href: "/product/lumbar-pillow",
    },
    {
      name: "ErgoTech Keyboard",
      price: "129",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTxAB5Caq87ju5u34--j_amE40KhurH2Etz9jBj4bzm2huEtNTljkSsq7WEWfGldpSue80gkbLYhp9x6Ua4hINunRWgInkMMmdB9LJd23J8jjsOoyQbn4KVDYhDvstFU-cBzuHSIwy7cAAgps29w90R2t76pgD9R21L1jtjN0bTvQXa6NQgVVoIY-vqeMZ80QsQ4ASWJsyj9sHph-QNNr1yvICh1OZ3jjt5Ue03L911x71Y3qQKMezgxI8AjRY3vkAYdafSSkRBciJ",
      altText: "An ergonomic keyboard and mouse",
      href: "/product/keyboard",
    },
    {
      name: "ErgoView Monitor Stand",
      price: "79",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvAXpowihuNrepZ7Ow52KPcLVttgcS_I6PcdUQT3hMmHBYnMIKYr6DwSOpuQIkYkeFj-GeUXTVwvtPJkTJCRbCV6gID_TEtAxkrma91OB8UWiiVCE3JdH3MqmCeTq-NMUTB771NjkOwu6okXp8DAFVmzu3wBGi7HVL-xwbjxjgEX_ulWvaX6-8ng1p-Dcg4OaJVFKA2qcGS_BPGxz4h6hoVIeLkfrNwpN-joFZs0_68qngd7gnA_ZhWqBHyZ7kpmWgOl1wKQ5XpKlm",
      altText: "A monitor stand with a monitor on it",
      href: "/product/monitor-stand",
    },
  ] as RelatedProduct[],
}

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Chairs", href: "/shop?category=chairs" },
  { label: "ErgoFlex Pro" },
]

export default function product({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch product data based on params.id
  const product = productData

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <Header />
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
                <ProductGallery images={product.images} />
                <ProductDetails
                  title={product.title}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  price={product.price}
                  description={product.description}
                  specifications={product.specifications}
                />
              </div>
              
              <ReviewSummary
                averageRating={product.rating}
                totalReviews={product.reviewCount}
                ratingDistribution={product.ratingDistribution}
              />
              
              <RelatedProducts products={product.relatedProducts} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
