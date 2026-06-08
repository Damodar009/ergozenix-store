import { supabase } from '@/services/supabase'
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

        // const dbUserId = safeUserId(userId);

        // 1. Insert Customer Info
        const { error: customerError } = await supabase
            .from('customer_info')
            .insert({
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

    static async getOrderDetails(orderId: string | number) {
        // 1. Fetch Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            console.error("Fetch Order Error:", orderError)
            throw new Error(`Failed to fetch order: ${orderError?.message || 'Not found'}`)
        }

        // 2. Fetch Customer Info
        let customerInfo = null
        if (order.session_id) {
            const { data: customer, error: customerError } = await supabase
                .from('customer_info')
                .select('*')
                .eq('session_id', order.session_id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (!customerError) {
                customerInfo = customer
            }
        }

        // 3. Fetch Order Items and their Attributes
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id)

        if (itemsError) {
            console.error("Fetch Order Items Error:", itemsError)
            throw new Error(`Failed to fetch order items: ${itemsError.message}`)
        }

        const itemsWithAttributes = []
        for (const item of (items || [])) {
            const { data: attrs } = await supabase
                .from('order_item_attributes')
                .select('*')
                .eq('order_item_id', item.id)

            itemsWithAttributes.push({
                id: item.id,
                name: item.product_name,
                imageUrl: item.product_image || null,
                price: item.price,
                quantity: item.quantity,
                attributes: (attrs || []).map(a => ({
                    name: a.attribute_name,
                    value: a.attribute_value
                }))
            })
        }

        return {
            orderNumber: `EZ-${order.id}`,
            customerName: customerInfo?.full_name || "Valued Customer",
            email: customerInfo?.email || "customer@example.com",
            items: itemsWithAttributes,
            subtotal: order.subtotal,
            shipping: order.delivery_charge,
            total: order.total_amount
        }
    }
}
