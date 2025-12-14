
import { supabase } from "@/lib/supabase/client"



export interface ContactMessage {
    name: string
    email?: string
    phone?: string
    message: string
    user_id?: string | null
    session_id?: string | null
}

export const ContactService = {
    async sendMessage(data: ContactMessage) {
        // Validation matches database constraint: email IS NOT NULL OR phone IS NOT NULL
        if (!data.email && !data.phone) {
            throw new Error("Either Email or Phone is required.")
        }

        const { error } = await supabase
            .from('contact_messages')
            .insert([
                {
                    name: data.name,
                    email: data.email || null, // Ensure empty string becomes null
                    phone: data.phone || null,
                    message: data.message,
                    user_id: data.user_id || null,
                    session_id: data.session_id || null
                }
            ])

        if (error) {
            console.error("Error sending message:", error)
            throw new Error("Failed to send message. Please try again.")
        }

        return true
    }
}
