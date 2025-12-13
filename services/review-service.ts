import { supabase } from '@/lib/supabase/client'
import type { ProductReview } from '@/models/product'

export interface CreateReviewData {
    product_id: number
    user_id: number // or string depending on auth, but schema says INT
    full_name: string
    phone_or_email: string
    rating: number
    review: string
}

export class ReviewService {
    /**
     * Get all active reviews for a specific product
     */
    static async getReviews(productId: number): Promise<ProductReview[]> {
        const { data, error } = await supabase
            .from('product_reviews')
            .select('*')
            .eq('product_id', productId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching reviews:', error)
            throw error
        }

        return data || []
    }

    /**
     * Create a new review
     */
    static async createReview(reviewData: CreateReviewData): Promise<ProductReview> {
        const { data, error } = await supabase
            .from('product_reviews')
            .insert({
                product_id: reviewData.product_id,
                user_id: reviewData.user_id,
                full_name: reviewData.full_name,
                phone_or_email: reviewData.phone_or_email,
                rating: reviewData.rating,
                review: reviewData.review
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating review:', error)
            throw error
        }

        return data
    }
    /**
     * Get top rated reviews for homepage (5 stars)
     */
    static async getTopReviews(limit: number = 3): Promise<ProductReview[]> {
        const { data, error } = await supabase
            .from('product_reviews')
            .select('*')
            .eq('rating', 5)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching top reviews:', error)
            return [] // Return empty array on error to allow fallback
        }

        return data || []
    }
}
