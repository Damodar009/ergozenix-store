"use client"

import { Header } from "@/components/header"
import { ContactHero } from "@/components/contact/ContactHero"
import { ContactForm } from "@/components/contact/ContactForm"
import { ContactDetails } from "@/components/contact/ContactDetails"

export default function contact() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1">
            <ContactHero
              title="Contact Us"
              subtitle="We'd love to hear from you. Please fill out the form below to get in touch."
              backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCWZewNoG5NzvFj1rOwkt1HcxKr6s9H2X3SdQeuxyT5gXY9VOBAJ--ReyeFTh5Ta2Qxf8-eN1CcfFRqKuda6hnScJ4ur4B-gSqfxESeBC6aX4nSDT7wXOU4aRJ5rOxWlqdlqY6ZsY1cdJQY1Lk2zSyuzBuqjvzpveUjEHvkZoBvXG-JISuR7RZ3T_s2km6s-buVkNg2xaGIVdGX8KrXdSRiFEWb2xgVjynWVtQGOoJToPVWOZY7vTQszVQXrpDGA0b29oQohYQIbAw6"
            />
            
            <div className="px-4 py-16 md:px-10 lg:px-20 bg-background">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2">
                  <ContactForm />
                </div>
                <div className="lg:col-span-1">
                  <ContactDetails />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
