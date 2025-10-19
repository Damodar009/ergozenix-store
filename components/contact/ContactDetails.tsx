"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export function ContactDetails() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4 text-[#111718] dark:text-white">Contact Information</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            <a 
              className="text-base text-[#111718] dark:text-white hover:text-primary dark:hover:text-primary transition-colors" 
              href="mailto:contact@ergoflex.com"
            >
              contact@ergoflex.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-primary" />
            <a 
              className="text-base text-[#111718] dark:text-white hover:text-primary dark:hover:text-primary transition-colors" 
              href="tel:+1234567890"
            >
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 text-[#111718] dark:text-white">Our Location</h3>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <iframe 
            allowFullScreen 
            data-location="New York, USA" 
            height="100%" 
            loading="lazy" 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617418706341!2d-73.98784538459424!3d40.74844097932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1617307049487!5m2!1sen!2sus" 
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
