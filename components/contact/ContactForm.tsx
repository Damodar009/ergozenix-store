"use client"

import { useState } from "react"
import { ContactService } from "@/services/ContactService"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  const { toast } = useToast()
  const { userId, sessionId } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "support",
    orderId: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" })
      return
    }
    if (!formData.email.trim()) {
      toast({ title: "Email is required", variant: "destructive" })
      return
    }
    if (!formData.message.trim()) {
      toast({ title: "Message is required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await ContactService.sendMessage({
        name: formData.name,
        email: formData.email,
        phone: "",
        message: `[${formData.subject}]${formData.orderId ? ` Order: ${formData.orderId}` : ""}\n\n${formData.message}`,
        user_id: userId,
        session_id: sessionId
      })

      setSuccess(true)
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon."
      })

      setFormData({ name: "", email: "", subject: "support", orderId: "", message: "" })

      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card p-10 md:p-12 rounded-lg border border-border">
      <h2 className="font-headline-section text-headline-section text-primary mb-[var(--ef-stack-lg)]">
        Send a Message
      </h2>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--ef-stack-lg)]">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" variant="ef-caps">
              FULL NAME
            </Label>
            <Input
              id="name"
              variant="underline"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" variant="ef-caps">
              EMAIL ADDRESS
            </Label>
            <Input
              id="email"
              variant="underline"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--ef-stack-lg)]">
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject" variant="ef-caps">
              SUBJECT
            </Label>
            <select
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              className="bg-transparent border-b border-border focus:border-primary focus:ring-0 px-0 py-2 font-body-main outline-none transition-colors appearance-none h-12"
            >
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="warranty">Warranty</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="orderId" variant="ef-caps">
              ORDER ID (OPTIONAL)
            </Label>
            <Input
              id="orderId"
              variant="underline"
              type="text"
              value={formData.orderId}
              onChange={handleChange}
              placeholder="#EY-12345"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="message" variant="ef-caps">
            MESSAGE
          </Label>
          <Textarea
            id="message"
            variant="underline"
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we assist you?"
            rows={4}
            className="resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`${success ? "bg-green-700 hover:bg-green-700" : ""} group w-auto`}
          size="ef"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              Sending...
            </>
          ) : success ? (
            <>
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Sent Successfully
            </>
          ) : (
            <>
              Send Message
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
