"use client"

import { useState, useRef } from "react"
import { ContactService } from "@/services/ContactService"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { supabase } from "@/services/supabase"

export function ContactForm() {
  const { toast } = useToast()
  const { sessionId } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [warrantyFiles, setWarrantyFiles] = useState<{
    file: File
    url: string | null
    uploading: boolean
    path: string | null
    error: string | null
  }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    media_urls: [],
    subject: "support",
    orderId: "",
    message: ""
  })

  const isWarranty = formData.subject === "warranty"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    // Clear warranty-specific fields if switching away from warranty
    if (id === "subject" && value !== "warranty") {
      setWarrantyFiles([])
      setFormData(prev => ({ ...prev, [id]: value, orderId: "" }))
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (warrantyFiles.length + selected.length > 5) {
      toast({ title: "Maximum 5 files allowed", variant: "destructive" })
      return
    }

    // Add files immediately with uploading state
    const newEntries = selected.map(file => ({ file, url: null, uploading: true, path: null, error: null }))
    setWarrantyFiles(prev => [...prev, ...newEntries])

    // Upload each file to Supabase Storage
    for (const entry of newEntries) {
      const ext = entry.file.name.split(".").pop()
      const path = `warranty/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from("warranty-attachments")
        .upload(path, entry.file, { cacheControl: "3600", upsert: false })

      if (error) {
        setWarrantyFiles(prev =>
          prev.map(f =>
            f.file === entry.file
              ? { ...f, uploading: false, error: "Upload failed" }
              : f
          )
        )
        toast({ title: `Failed to upload ${entry.file.name}`, variant: "destructive" })
        continue
      }

      const { data: urlData } = supabase.storage
        .from("warranty-attachments")
        .getPublicUrl(path)

      setWarrantyFiles(prev =>
        prev.map(f =>
          f.file === entry.file
            ? { ...f, uploading: false, url: urlData.publicUrl, path }
            : f
        )
      )
    }
  }

  const removeFile = async (index: number) => {
    const entry = warrantyFiles[index]
    if (entry.path) {
      await supabase.storage.from("warranty-attachments").remove([entry.path])
    }
    setWarrantyFiles(prev => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" })
      return
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast({
        title: "Email or Phone is required",
        description: "Please enter either your email address or phone number.",
        variant: "destructive"
      })
      return
    }
    if (!formData.message.trim()) {
      toast({ title: "Message is required", variant: "destructive" })
      return
    }
    const isUploading = warrantyFiles.some(f => f.uploading)
    if (isWarranty && isUploading) {
      toast({ title: "Please wait for uploads to finish", variant: "destructive" })
      return
    }
    if (isWarranty && warrantyFiles.length === 0) {
      toast({ title: "Please attach at least one photo for warranty claims", variant: "destructive" })
      return
    }
    if (isWarranty && warrantyFiles.some(f => f.error)) {
      toast({ title: "Some files failed to upload. Please remove them and try again.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const urls = warrantyFiles.map(f => f.url).filter(Boolean) as string[]

      await ContactService.sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        media_urls: urls.length > 0 ? urls : undefined,
        subject: formData.subject,
        order_id: isWarranty && formData.orderId ? formData.orderId.trim() : undefined,
        message: formData.message.trim(),
        session_id: sessionId || "",
      })

      setSuccess(true)
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon."
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        media_urls: [],
        subject: "support",
        orderId: "",
        message: ""
      })
      setWarrantyFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ""

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
              <option value="warranty">Warranty Claim</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--ef-stack-lg)]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" variant="ef-caps">
                PHONE NUMBER
              </Label>
              <Input
                id="phone"
                variant="underline"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+977 9XXXXXXXXX"
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
              />
            </div>
          </div>
          <span className="text-[12px] text-muted-foreground font-body-main mt-1">
            * Please provide at least one contact method (email or phone number) so we can respond to your request.
          </span>
        </div>

        {/* Order ID — only shown for warranty */}
        {isWarranty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--ef-stack-lg)]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="orderId" variant="ef-caps">
                ORDER ID <span className="text-muted-foreground font-normal normal-case">(required for warranty)</span>
              </Label>
              <Input
                id="orderId"
                variant="underline"
                type="text"
                value={formData.orderId}
                onChange={handleChange}
                placeholder="#EY-12345"
                required={isWarranty}
              />
            </div>
            <div className="hidden md:block" />
          </div>
        )}

        {/* Photo upload — only shown for warranty */}
        {isWarranty && (
          <div className="flex flex-col gap-3">
            <Label variant="ef-caps">
              ATTACH PHOTOS{" "}
              <span className="text-muted-foreground font-normal normal-case">(required — max 5)</span>
            </Label>
            <div
              className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="material-symbols-outlined text-3xl text-muted-foreground group-hover:text-primary transition-colors block mb-2">
                upload_file
              </span>
              <p className="font-body-main text-body-main text-muted-foreground text-sm">
                Click to upload photos or drag and drop
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG, WEBP — up to 5 files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* File preview chips */}
            {warrantyFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {warrantyFiles.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 border rounded-full px-3 py-1 text-sm font-body-main transition-colors ${entry.error
                      ? "bg-destructive/10 border-destructive/40"
                      : entry.uploading
                        ? "bg-accent border-border opacity-70"
                        : "bg-accent border-border"
                      }`}
                  >
                    {entry.uploading ? (
                      <span className="material-symbols-outlined text-[16px] text-primary animate-spin">sync</span>
                    ) : entry.error ? (
                      <span className="material-symbols-outlined text-[16px] text-destructive">error</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                    )}
                    <span className="max-w-[140px] truncate">{entry.file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="message" variant="ef-caps">
            MESSAGE
          </Label>
          <Textarea
            id="message"
            variant="underline"
            value={formData.message}
            onChange={handleChange}
            placeholder={isWarranty ? "Describe the issue clearly — when it started, what happened, and any steps taken so far." : "How can we assist you?"}
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
