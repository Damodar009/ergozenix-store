import { supabase } from '@/services/supabase'
import { CartItem, CartService } from './cart-service'

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

        // 5. Mark cart as completed and clear items
        if (sessionId) {
            try {
                await CartService.clearCart(sessionId, userId || undefined)
            } catch (cartErr) {
                // Non-fatal: order is already placed, log and continue
                console.warn('Could not clear cart after order placement:', cartErr)
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

    /**
     * Get all orders for admin view (newest first), joined with customer info
     */
    static async getAllOrders() {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('placed_at', { ascending: false })

        if (error) {
            console.error('Error fetching all orders:', error)
            throw new Error(`Failed to fetch orders: ${error.message}`)
        }

        if (!orders || orders.length === 0) return []

        // Fetch customer info and item counts in parallel for each order
        const enriched = await Promise.all(
            orders.map(async (order) => {
                // Customer info via session_id
                let customerInfo: any = null
                if (order.session_id) {
                    const { data: customer } = await supabase
                        .from('customer_info')
                        .select('full_name, email, phone_number, province, district, city, street_address, landmark, notes')
                        .eq('session_id', order.session_id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle()
                    customerInfo = customer
                }

                // Item count
                const { count } = await supabase
                    .from('order_items')
                    .select('id', { count: 'exact', head: true })
                    .eq('order_id', order.id)

                // Order items with images
                const { data: items } = await supabase
                    .from('order_items')
                    .select('id, product_name, product_image, quantity, price')
                    .eq('order_id', order.id)

                return {
                    id: order.id,
                    orderNumber: `EZ-${order.id}`,
                    status: order.order_status as string,
                    createdAt: order.placed_at as string,
                    subtotal: order.subtotal as number,
                    shipping: order.delivery_charge as number,
                    total: order.total_amount as number,
                    itemCount: count ?? 0,
                    items: (items || []).map((it: any) => ({
                        id: it.id,
                        name: it.product_name,
                        imageUrl: it.product_image || null,
                        quantity: it.quantity,
                        price: it.price,
                    })),
                    customer: customerInfo ? {
                        name: customerInfo.full_name,
                        email: customerInfo.email,
                        phone: customerInfo.phone_number,
                        address: [
                            customerInfo.street_address,
                            customerInfo.city,
                            customerInfo.district,
                            customerInfo.province,
                        ].filter(Boolean).join(', '),
                        landmark: customerInfo.landmark,
                        notes: customerInfo.notes,
                    } : null,
                }
            })
        )

        return enriched
    }

    /**
     * Update the status of a single order
     */
    static async updateOrderStatus(orderId: number, status: string) {
        const { error } = await supabase
            .from('orders')
            .update({ order_status: status, updated_at: new Date().toISOString() })
            .eq('id', orderId)

        if (error) {
            console.error('Error updating order status:', error)
            throw new Error(`Failed to update status: ${error.message}`)
        }
    }

    /**
     * Get all orders for a given session ID (customer-facing order tracking)
     */
    static async getOrdersBySessionId(sessionId: string) {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('session_id', sessionId)
            .order('placed_at', { ascending: false })

        if (error) {
            console.error('Error fetching orders by session:', error)
            throw new Error(`Failed to fetch orders: ${error.message}`)
        }

        if (!orders || orders.length === 0) return []

        // Get customer info once (most recent for this session)
        const { data: customerInfo } = await supabase
            .from('customer_info')
            .select('full_name, email, phone_number, province, district, city, street_address, landmark, notes')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        const enriched = await Promise.all(
            orders.map(async (order) => {
                // Fetch order items
                const { data: items } = await supabase
                    .from('order_items')
                    .select('id, product_name, product_image, quantity, price')
                    .eq('order_id', order.id)

                // Fetch attributes for each item
                const itemsWithAttrs = await Promise.all(
                    (items || []).map(async (item: any) => {
                        const { data: attrs } = await supabase
                            .from('order_item_attributes')
                            .select('attribute_name, attribute_value')
                            .eq('order_item_id', item.id)

                        return {
                            id: item.id,
                            name: item.product_name,
                            imageUrl: item.product_image || null,
                            quantity: item.quantity,
                            price: item.price,
                            attributes: (attrs || []).map((a: any) => ({
                                name: a.attribute_name,
                                value: a.attribute_value,
                            })),
                        }
                    })
                )

                return {
                    id: order.id,
                    orderNumber: `EZ-${order.id}`,
                    status: order.order_status as string,
                    placedAt: order.placed_at as string,
                    subtotal: order.subtotal as number,
                    shipping: order.delivery_charge as number,
                    total: order.total_amount as number,
                    items: itemsWithAttrs,
                    customer: customerInfo ? {
                        name: customerInfo.full_name,
                        email: customerInfo.email,
                        phone: customerInfo.phone_number,
                        address: [
                            customerInfo.street_address,
                            customerInfo.city,
                            customerInfo.district,
                            customerInfo.province,
                        ].filter(Boolean).join(', '),
                        landmark: customerInfo.landmark,
                        notes: customerInfo.notes,
                    } : null,
                }
            })
        )

        return enriched
    }
}
