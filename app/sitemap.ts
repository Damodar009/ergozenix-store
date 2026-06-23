import type { MetadataRoute } from "next"
import { ProductService } from "@/services/product-service"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ergozenix.com"

  // Fetch all active products
  let products: any[] = []
  try {
    products = await ProductService.getProducts({ status: "active" })
  } catch (error) {
    console.error("Sitemap dynamic products fetch failed:", error)
  }

  // Define static routes
  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/order-tracking",
    "/wishlist",
    "/cart",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  // Define dynamic product slug routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug || product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
