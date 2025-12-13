"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export function ContactDetails() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4 text-foreground">Contact Information</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            <a 
              className="text-base text-foreground hover:text-primary transition-colors" 
              href="mailto:ergozenix.store@gmail.com"
            >
              ergozenix.store@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-primary" />
            <a 
              className="text-base text-[#111718] dark:text-white hover:text-primary dark:hover:text-primary transition-colors" 
              href="tel:+9779768602990"
            >
              +977 9768602990
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            <a 
              className="text-base text-[#111718] dark:text-white hover:text-primary dark:hover:text-primary transition-colors" 
              href="https://www.google.com/maps/place/Basundhara+Kathmandu"
            >
              Basundhara, Kathmandu
            </a>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 text-[#111718] dark:text-white">Our Location</h3>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <iframe 
            allowFullScreen 
            data-location="Basundhara, Kathmandu" 
            height="100%" 
            loading="lazy" 
            src="https://maps.google.com/maps?q=27.7405123,85.3350013&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{ border: 0 }} 
            width="100%"
            title="Map Location"
            className="w-full h-64"
          />
        </div>
      </div>
    </div>
  )
}
