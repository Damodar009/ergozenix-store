export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Software Engineer",
      quote: "Switching to an ergonomic setup completely eliminated my chronic back pain. I can finally focus on writing code instead of shifting in my chair all day."
    },
    {
      name: "Marcus Chen",
      role: "Freelance Designer",
      quote: "The quality of these products is exceptional. The adjustable desk moves smoothly and the chair supports me perfectly during long design sprints."
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Director",
      quote: "Not only did this setup improve my posture, but it also looks incredibly sleek in my home office. It's the perfect blend of form and function."
    }
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Loved by Customers</h2>
          <p className="text-muted-foreground text-lg">See what people are saying about their ergonomic journey</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-8 space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-foreground italic leading-relaxed">{`"${testimonial.quote}"`}</p>
              <div className="space-y-1 pt-4 border-t border-border">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


