"use client"

import { useState } from "react"
import Link from "next/link"
import { Link as UiLink } from "@/components/ui/link"
import { socialLinks } from "@/lib/social-links"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
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
    window.location.href = "mailto:ergozenix.store@gmail.com"
    copyToClipboard("ergozenix.store@gmail.com", "email")
  }

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = "tel:+9779768602990"
    copyToClipboard("+9779768602990", "phone")
  }

  return (
    <footer className="bg-accent w-full py-[var(--ef-section-padding)] border-t border-border">
      <div className="max-w-[var(--ef-container-max)] mx-auto px-[var(--ef-container-padding-x)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Mission */}
          <div className="flex flex-col gap-[var(--ef-stack-md)]">
            <span className="font-label-caps text-label-caps text-foreground tracking-[3px]">
              ERGOZENIX STORE
            </span>
            <p className="font-body-main text-body-main text-muted-foreground mt-2">
              Comfort for a better life. Redefining workspaces with Scandinavian precision and functionalist beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-[var(--ef-stack-md)]">
            <h4 className="font-label-caps text-label-caps tracking-widest text-muted-foreground">
              QUICK LINKS
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={`footer-${label}`}>
                  <UiLink
                    className="font-body-main text-body-main text-muted-foreground hover:text-primary transition-colors"
                    href={href}
                  >
                    {label}
                  </UiLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-[var(--ef-stack-md)]">
            <h4 className="font-label-caps text-label-caps tracking-widest text-muted-foreground">
              CONTACT INFO
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <Mail className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href="mailto:ergozenix.store@gmail.com"
                    onClick={handleEmailClick}
                    className="font-body-main text-body-main text-muted-foreground hover:text-primary transition-colors"
                  >
                    ergozenix.store@gmail.com
                  </a>
                  {copiedEmail && (
                    <span className="text-[10px] text-primary font-medium mt-0.5">
                      Copied email to clipboard!
                    </span>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href="tel:+9779768602990"
                    onClick={handlePhoneClick}
                    className="font-body-main text-body-main text-muted-foreground hover:text-primary transition-colors"
                  >
                    +977 9768602990
                  </a>
                  {copiedPhone && (
                    <span className="text-[10px] text-primary font-medium mt-0.5">
                      Copied phone to clipboard!
                    </span>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=27.741013,85.335037"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body-main text-body-main text-muted-foreground hover:text-primary transition-colors"
                >
                  Basundhara, Kathmandu
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col gap-[var(--ef-stack-md)]">
            <h4 className="font-label-caps text-label-caps tracking-widest text-muted-foreground">
              FOLLOW US
            </h4>
            <div className="flex gap-4">
              {socialLinks.map(({ name, href, Icon }) => (
                <Link
                  key={name}
                  href={href}
                  aria-label={name}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-body-main text-xs opacity-60">
            © 2026 ErgoZenix Store. All rights reserved.
          </p>
          <div className="flex gap-[var(--ef-stack-lg)]">
            <Link
              href="#"
              className="font-label-caps text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="font-label-caps text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}