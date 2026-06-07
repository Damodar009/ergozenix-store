"use client"

export function ContactDetails() {
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
            <a
              href="tel:+9779760682990"
              className="font-body-main text-body-main text-secondary-foreground hover:text-primary transition-colors leading-relaxed"
            >
              +977 9760682990
            </a>
          </div>
        </div>

        {/* Email */}
        <div>
          <span className="font-label-caps text-label-caps text-primary mb-[var(--ef-stack-sm)] block">
            EMAIL
          </span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">mail</span>
            <a
              href="mailto:ergozenix@gmail.com"
              className="font-body-main text-body-main text-secondary-foreground hover:text-primary transition-colors leading-relaxed break-words"
            >
              ergozenix@gmail.com
            </a>
          </div>
        </div>

        {/* Address */}
        <div>
          <span className="font-label-caps text-label-caps text-primary mb-[var(--ef-stack-sm)] block">
            SHOWROOM ADDRESS
          </span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
            <p className="font-body-main text-body-main text-secondary-foreground leading-relaxed">
              Basundhara, Chakrapath Ring Road,<br />
              Kathmandu 44600,<br />
              Nepal.
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border border-border group">
          <iframe
            allowFullScreen
            data-location="Ergozenix Showroom, Kathmandu"
            height="100%"
            loading="lazy"
            src="https://maps.google.com/maps?q=27.7405445,85.3347168&t=&z=17&ie=UTF8&iwloc=&output=embed"
            style={{ border: 0 }}
            width="100%"
            title="Ergozenix Showroom Location"
            className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
        </div>

        {/* Direct Maps Link */}
        <a
          href="https://maps.app.goo.gl/skZBtU9wV6pp263i9"
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
