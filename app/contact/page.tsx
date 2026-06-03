"use client"

import { ContactHero } from "@/components/contact/ContactHero"
import { ContactCategories } from "@/components/contact/ContactCategories"
import { ContactForm } from "@/components/contact/ContactForm"
import { ContactDetails } from "@/components/contact/ContactDetails"

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <ContactHero />

      {/* Category Cards Grid */}
      <ContactCategories />

      {/* Form & Details Section */}
      <section className="py-[var(--ef-section-padding)] bg-accent border-y border-border">
        <div className="px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right: Extra Info & Map (5 cols) */}
          <div className="lg:col-span-5">
            <ContactDetails />
          </div>
        </div>
      </section>
    </main>
  )
}
