
import { supabase } from "@/services/supabase"



export interface ContactMessage {
    name: string
    email?: string
    phone?: string
    media_urls?: string[]
    subject: string
    order_id?: string
    message: string
    status?: "unread" | "read" | "replied" | "archived"
    session_id: string
    user_id?: string | null
}

export const ContactService = {
    async sendMessage(data: ContactMessage) {
        // Validation: email IS NOT NULL OR phone IS NOT NULL (or let database handle it, but keep client side validation)
        if (!data.email && !data.phone) {
            throw new Error("Either Email or Phone is required.")
        }

        const { error } = await supabase
            .from('contact_messages')
            .insert([
                {
                    name: data.name,
                    email: data.email || null,
                    phone: data.phone || null,
                    media_urls: data.media_urls || [],
                    subject: data.subject,
                    order_id: data.order_id || null,
                    message: data.message,
                    status: data.status || 'unread',
                    session_id: data.session_id,
                }
            ])

        if (error) {
            console.error("Error sending message:", error)
            throw new Error("Failed to send message. Please try again.")
        }

        return true
    }
}
