"use client"

import { useState } from "react"

export function ContactDetails() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "email") {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      } else {
        setCopiedPhone(true)
        setTimeout(() => setCopiedPhone(false), 2000)
      }
    }).catch(err => {
      console.error("Failed to copy text: ", err)
    })
  }

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = "mailto:ergozenix@gmail.com"
    copyToClipboard("ergozenix@gmail.com", "email")
  }

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = "tel:+9779760682990"
    copyToClipboard("+9779760682990", "phone")
  }

  return (
    <div className="flex flex-col justify-between space-y-12">
      <div className="space-y-10">
        {/* Phone */}
        <div>
          <span className="font-label-caps text-label-caps text-primary mb-[var(--ef-stack-sm)] block">
            PHONE
          </span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">phone</span>
            <div className="flex flex-col">
              <a
                href="tel:+9779760682990"
                onClick={handlePhoneClick}
                className="font-body-main text-body-main text-secondary-foreground hover:text-primary transition-colors leading-relaxed"
              >
                +977 9760682990
              </a>
              {copiedPhone && (
                <span className="text-[10px] text-primary font-medium mt-0.5 animate-pulse">
                  Copied phone to clipboard!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <span className="font-label-caps text-label-caps text-primary mb-[var(--ef-stack-sm)] block">
            EMAIL
          </span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">mail</span>
            <div className="flex flex-col">
              <a
                href="mailto:ergozenix@gmail.com"
                onClick={handleEmailClick}
                className="font-body-main text-body-main text-secondary-foreground hover:text-primary transition-colors leading-relaxed break-words"
              >
                ergozenix@gmail.com
              </a>
              {copiedEmail && (
                <span className="text-[10px] text-primary font-medium mt-0.5 animate-pulse">
                  Copied email to clipboard!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <span className="font-label-caps text-label-caps text-primary mb-[var(--ef-stack-sm)] block">
            SHOWROOM ADDRESS
          </span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
            <a
              href="https://www.google.com/maps/search/?api=1&query=27.741013,85.335037"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body-main text-body-main text-secondary-foreground hover:text-primary transition-colors leading-relaxed block"
            >
              Basundhara, Chakrapath Ring Road,<br />
              Kathmandu 44600,<br />
              Nepal.
            </a>
          </div>
        </div>

        {/* Map */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=27.741013,85.335037"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border border-border group block"
        >
          <iframe
            allowFullScreen
            data-location="Ergozenix Showroom, Kathmandu"
            height="100%"
            loading="lazy"
            src="https://maps.google.com/maps?q=27.741013,85.335037&t=&z=17&ie=UTF8&iwloc=&output=embed"
            style={{ border: 0, pointerEvents: "none" }}
            width="100%"
            title="Ergozenix Showroom Location"
            className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
        </a>

        {/* Direct Maps Link */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=27.741013,85.335037"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          OPEN IN GOOGLE MAPS
        </a>
      </div>
    </div>
  )
}
