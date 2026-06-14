'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CarouselSlide {
    id: number
    image: string
    message: string
    description: string
}

const slides: CarouselSlide[] = [
    {
        id: 1,
        image: '/carousel-1.jpg',
        message: 'Perfect Posture, Perfect Productivity',
        description: 'Maintain ideal alignment throughout your workday with our adjustable standing desk.',
    },
    {
        id: 2,
        image: '/carousel-2.jpg',
        message: 'Ultimate Comfort Support',
        description: 'Experience premium lumbar support designed for all-day comfort and reduced back strain.',
    },
    {
        id: 3,
        image: '/carousel-3.jpg',
        message: 'Eye Level Viewing',
        description: 'Position your monitor at the ideal height to eliminate neck strain and fatigue.',
    },
    {
        id: 4,
        image: '/carousel-4.jpg',
        message: 'Complete Leg Support',
        description: 'Reduce fatigue and improve circulation with ergonomic footrest technology.',
    },
    {
        id: 5,
        image: '/carousel-1.jpg',
        message: 'Boost Your Productivity Today',
        description: 'Transform your workspace into an ergonomic powerhouse with our premium collection.',
    },
    {
        id: 6,
        image: '/carousel-2.jpg',
        message: 'Invest in Your Health',
        description: 'Long-term comfort means better performance. Your body will thank you.',
    },
]

export function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)

    useEffect(() => {
        if (!autoPlay) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [autoPlay])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setAutoPlay(false)
        setTimeout(() => setAutoPlay(true), 1000)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setAutoPlay(false)
        setTimeout(() => setAutoPlay(true), 3000)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setAutoPlay(false)
        setTimeout(() => setAutoPlay(true), 8000)
    }

    const handleMouseEnter = () => setAutoPlay(false)
    const handleMouseLeave = () => setAutoPlay(true)

    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl bg-muted h-[60vh] md:h-[60vh]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Slides */}
            <div className="relative h-full w-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.message}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                ))}
            </div>

            {/* Text Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white space-y-6 px-4 sm:px-8">
                    <h2
                        key={`heading-${currentSlide}`}
                        className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        {slides[currentSlide].message}
                    </h2>
                    <p
                        key={`description-${currentSlide}`}
                        className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
                    >
                        {slides[currentSlide].description}
                    </p>
                    <div
                        key={``}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
                    >
                        <Link href="/shop">
                            <Button size="lg" className="bg-white text-foreground hover:bg-white/90">
                                Shop Now
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 hover:bg-white/40 transition-colors p-2 sm:p-3"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 hover:bg-white/40 transition-colors p-2 sm:p-3"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75 w-2'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
