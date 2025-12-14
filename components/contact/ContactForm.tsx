"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ContactService } from "@/services/ContactService"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useCart } from "@/context/cart-context"

export function ContactForm() {
  const { toast } = useToast()
  const { userId, sessionId } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic Validation
    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" })
      return
    }
    if (!formData.message.trim()) {
      toast({ title: "Message is required", variant: "destructive" })
      return
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast({ title: "Please provide either Email or Phone", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await ContactService.sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        user_id: userId,
        session_id: sessionId
      })
      
      toast({ 
        title: "Message Sent!", 
        description: "Thank you for reaching out. We'll get back to you soon." 
      })
      
      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" })
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground text-base font-medium leading-normal">
            Your Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="h-14 text-base font-normal leading-normal border-border bg-background focus:border-primary placeholder:text-muted-foreground"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground text-base font-medium leading-normal">
            Your Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="h-14 text-base font-normal leading-normal border-border bg-background focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground text-base font-medium leading-normal">
             Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="h-14 text-base font-normal leading-normal border-border bg-background focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground text-base font-medium leading-normal">
          Your Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter your message"
          className="min-h-48 text-base font-normal leading-normal border-border bg-background focus:border-primary placeholder:text-muted-foreground"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        className="max-w-xs h-12 bg-primary text-white hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
