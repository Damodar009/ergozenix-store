"use client"

const categories = [
  {
    icon: "support_agent",
    title: "Customer Support",
    description: "Product help & tech issues.",
    details: (
      <>
        <div>
          <span className="font-label-caps text-label-caps block text-[var(--ef-outline)] mb-1 uppercase">Toll Free</span>
          <p className="font-body-main text-body-main font-medium">1800 103 3464</p>
        </div>
        <div>
          <span className="font-label-caps text-label-caps block text-[var(--ef-outline)] mb-1 uppercase">Availability</span>
          <p className="font-body-main text-body-main">Mon-Fri 10am-6pm</p>
          <p className="font-body-main text-body-main">Sat 10am-5pm</p>
        </div>
        <a className="text-[var(--ef-primary)] font-medium hover:underline font-body-main text-body-main break-words" href="mailto:support.ergoyou@innofitt.com">
          support.ergoyou@innofitt.com
        </a>
      </>
    ),
  },
  {
    icon: "corporate_fare",
    title: "Business & Bulk",
    description: "B2B orders & custom solutions.",
    details: (
      <>
        <div>
          <span className="font-label-caps text-label-caps block text-[var(--ef-outline)] mb-1 uppercase">Direct Line</span>
          <p className="font-body-main text-body-main font-medium">1800 103 3464</p>
        </div>
        <div>
          <span className="font-label-caps text-label-caps block text-[var(--ef-outline)] mb-1 uppercase">Availability</span>
          <p className="font-body-main text-body-main">Mon-Fri 10am-6pm</p>
          <p className="font-body-main text-body-main">Sat 10am-5pm</p>
        </div>
        <a className="text-[var(--ef-primary)] font-medium hover:underline font-body-main text-body-main break-words" href="mailto:navin@innofitt.com">
          navin@innofitt.com
        </a>
      </>
    ),
  },
  {
    icon: "verified",
    title: "Warranty Claims",
    description: "Include photos/videos, Order ID, and Invoice in your email.",
    details: (
      <>
        <a className="text-[var(--ef-primary)] font-medium hover:underline font-body-main text-body-main break-words" href="mailto:support.ergoyou@innofitt.com">
          support.ergoyou@innofitt.com
        </a>
        <p className="text-[12px] text-[var(--ef-on-surface-variant)] leading-relaxed">Response time: 24-48 business hours.</p>
      </>
    ),
  },
  {
    icon: "chat_bubble",
    title: "Feedback",
    description: "We value your complaints and suggestions to improve.",
    details: (
      <>
        <a className="text-[var(--ef-primary)] font-medium hover:underline font-body-main text-body-main break-words" href="mailto:support.ergoyou@innofitt.com">
          support.ergoyou@innofitt.com
        </a>
        <p className="text-[12px] text-[var(--ef-on-surface-variant)] italic">&ldquo;Scandinavian Functionalism starts with listening.&rdquo;</p>
      </>
    ),
  },
]

export function ContactCategories() {
  return (
    <section className="py-[var(--ef-section-padding)] px-[var(--ef-container-padding-x)] max-w-[var(--ef-container-max)] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--ef-gutter)]">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="bg-[var(--ef-surface-container-lowest)] border border-[var(--ef-outline-variant)] p-[var(--ef-stack-lg)] rounded-lg flex flex-col h-full group hover:border-[var(--ef-primary)] transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[var(--ef-primary)] mb-[var(--ef-stack-md)] text-3xl">
              {cat.icon}
            </span>
            <h3 className="font-headline-card text-headline-card mb-[var(--ef-stack-sm)] text-[var(--ef-on-surface)]">
              {cat.title}
            </h3>
            <p className="font-body-main text-body-main text-[var(--ef-on-surface-variant)] mb-6 flex-grow">
              {cat.description}
            </p>
            <div className="space-y-4 pt-4 border-t border-[var(--ef-outline-variant)]">
              {cat.details}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
