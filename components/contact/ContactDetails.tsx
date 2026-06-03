"use client"

export function ContactDetails() {
  return (
    <div className="flex flex-col justify-between space-y-12">
      <div className="space-y-10">
        {/* Address */}
        <div>
          <span className="font-label-caps text-label-caps text-primary mb-[var(--ef-stack-sm)] block">
            REGISTERED ADDRESS
          </span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
            <p className="font-body-main text-body-main text-secondary-foreground leading-relaxed">
              #114, Ramtekdi Industrial Estate,<br />
              Hadapsar, Pune 411013,<br />
              Maharashtra, India.
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border border-border group">
          <iframe
            allowFullScreen
            data-location="Ramtekdi Industrial Estate, Pune"
            height="100%"
            loading="lazy"
            src="https://maps.google.com/maps?q=Ramtekdi+Industrial+Estate,+Hadapsar,+Pune&t=&z=14&ie=UTF8&iwloc=&output=embed"
            style={{ border: 0 }}
            width="100%"
            title="Map Location"
            className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
        </div>
      </div>
    </div>
  )
}
