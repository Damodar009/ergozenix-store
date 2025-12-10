import { supabase } from '@/lib/supabase/client'
import { CartItem } from './cart-service'

export interface CheckoutFormData {
    fullName: string
    phoneNumber: string
    email: string
    province: string
    district: string
    city: string
    streetAddress: string
    landmark?: string
    notes?: string
}

export class OrderService {
    static async placeOrder(
        checkoutData: CheckoutFormData,
        cartItems: CartItem[],
        cartSummary: { subtotal: number; shipping: number; total: number },
        userId: string | null,
        sessionId: string | null
    ) {
        // Helper to safely handle BIGINT user_id
        const safeUserId = (uid: string | null) => {
            if (!uid) return null;
            const num = Number(uid);
            return isNaN(num) ? null : num;
        }

        const dbUserId = safeUserId(userId);

        // 1. Insert Customer Info
        const { error: customerError } = await supabase
            .from('customer_info')
            .insert({
                user_id: dbUserId,
                session_id: sessionId,
                full_name: checkoutData.fullName,
                phone_number: checkoutData.phoneNumber,
                email: checkoutData.email,
                province: checkoutData.province,
                district: checkoutData.district,
                city: checkoutData.city,
                street_address: checkoutData.streetAddress,
                landmark: checkoutData.landmark,
                notes: checkoutData.notes,
                is_default: true
            })
            .select()
            .single()

        if (customerError) {
            console.error("Customer Info Error:", customerError)
            throw new Error(`Failed to save customer info: ${customerError.message}`)
        }

        // 2. Insert Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: dbUserId,
                session_id: sessionId,
                order_status: 'PENDING',
                subtotal: cartSummary.subtotal,
                discount: 0,
                delivery_charge: cartSummary.shipping,
                total_amount: cartSummary.total
            })
            .select()
            .single()

        if (orderError) {
            console.error("Order Creation Error:", orderError)
            throw new Error(`Failed to create order: ${orderError.message}`)
        }

        // 3. Insert Order Items
        for (const item of cartItems) {
            const { data: orderItemData, error: orderItemError } = await supabase
                .from('order_items')
                .insert({
                    order_id: orderData.id,
                    product_id: item.product_id,
                    product_name: item.product?.name || 'Unknown Product',
                    product_image: item.product?.image_url,
                    quantity: item.quantity,
                    price: item.price
                })
                .select()
                .single()

            if (orderItemError) {
                console.error("Order Item Error:", orderItemError)
                throw new Error(`Failed to create order item: ${orderItemError.message}`)
            }

            // 4. Insert Attributes
            if (item.attributes && item.attributes.length > 0) {
                const attrInserts = item.attributes.map(attr => ({
                    order_item_id: orderItemData.id,
                    attribute_name: attr.attribute_name,
                    attribute_value: attr.attribute_value
                }))

                const { error: attrError } = await supabase
                    .from('order_item_attributes')
                    .insert(attrInserts)

                if (attrError) {
                    console.error("Order Attribute Error:", attrError)
                    throw new Error(`Failed to save order attributes: ${attrError.message}`)
                }
            }
        }

        return orderData
    }
}
