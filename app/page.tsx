import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { Carousel } from "@/components/home/carousel"
import { CompleteSetup } from "@/components/home/CompleteSetup"
import { Benefits } from "@/components/home/Benefits"
import { Testimonials } from "@/components/home/Testimonials"
import { TrustSection } from "@/components/home/TrustSection"

export default async function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-auto">
        <div className=" py-5">
          <div className="flex flex-col max-w-7xl mx-auto">
            {/* Carousel Section */}
            <section className="">
              <div className="">
                <Carousel />
              </div>
            </section>
            <FeaturedProducts />
            <CompleteSetup />
            <Benefits />
            <Testimonials />
            <TrustSection />
          </div>
        </div>
      </main>
    </div>
  )
}

