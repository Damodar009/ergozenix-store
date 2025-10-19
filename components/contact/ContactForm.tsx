"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  return (
    <form className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#111718] dark:text-white text-base font-medium leading-normal">
            Your Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            className="h-14 text-base font-normal leading-normal border-[#dbe4e6] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary placeholder:text-[#618389] dark:placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#111718] dark:text-white text-base font-medium leading-normal">
            Your Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="h-14 text-base font-normal leading-normal border-[#dbe4e6] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary placeholder:text-[#618389] dark:placeholder:text-gray-400"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-[#111718] dark:text-white text-base font-medium leading-normal">
          Your Message
        </Label>
        <Textarea
          id="message"
          placeholder="Enter your message"
          className="min-h-48 text-base font-normal leading-normal border-[#dbe4e6] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary placeholder:text-[#618389] dark:placeholder:text-gray-400"
        />
      </div>
      <Button type="submit" className="max-w-xs h-12 bg-primary text-white hover:bg-primary/90">
        Send Message
      </Button>
    </form>
  )
}
