"use client"

import Link from "next/link"
import { LogoIcon } from "@/components/logo-icon"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Link as UiLink } from "@/components/ui/link"
import { socialLinks } from "@/lib/social-links"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
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
                <span className="font-body-main text-body-main text-muted-foreground">
                  ergozenix.store@gmail.com
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" />
                <span className="font-body-main text-body-main text-muted-foreground">
                  +977 9768602990
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" />
                <span className="font-body-main text-body-main text-muted-foreground">
                  Basundhara, Kathmandu
                </span>
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
                  <Icon className="w-5 h-5 fill-current" />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-body-main text-xs opacity-60">
            © 2024 ErgoZenix Store. All rights reserved.
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