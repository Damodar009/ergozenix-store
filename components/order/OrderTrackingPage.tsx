"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";

interface TrackingEvent {
  title: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  attributes: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export default function OrderTrackingPage() {
  const router = useRouter();

  // Mock data matching the design template exactly
  const [orderNumber] = useState("EF-20482");
  const [orderDate] = useState("March 12, 2024");
  const [orderStatus] = useState("IN TRANSIT");
  const [shippingMethod] = useState("White Glove Delivery");
  const [shippingMethodDesc] = useState(
    "Professional assembly, placement in your room of choice, and removal of all packaging materials."
  );

  const [shippingAddress] = useState({
    name: "Niklas Sørensen",
    street: "Vesterbrogade 14, 3. th.",
    cityCode: "1620 København V",
    country: "Denmark",
  });

  const [trackingEvents] = useState<TrackingEvent[]>([
    {
      title: "Departed from local sorting facility",
      location: "Copenhagen, DK",
      date: "March 14, 2024",
      time: "04:30 PM",
      completed: true,
    },
    {
      title: "Arrived at sorting facility",
      location: "Copenhagen, DK",
      date: "March 14, 2024",
      time: "09:12 AM",
      completed: false,
    },
    {
      title: "Picked up by carrier",
      location: "Aarhus, DK",
      date: "March 14, 2024",
      time: "08:00 AM",
      completed: false,
    },
  ]);

  const [items] = useState<OrderItem[]>([
    {
      id: 1,
      name: "KONTUR Executive Chair",
      attributes: "Smoked Oak / Obsidian Leather",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBC8JVXw4MPIafEspZetovilyqu4hczBcXal3xRYogXxS2IUzGZGXq9maOWprF_OYMJQr5adbm3l_rx8HDxjTft6dAmkFKfJ38PdVekuFRsIQ5Xv-h4pwxp29OJHHm5ZKjQP_bqVboyy06Q-tmIieox0ok6F_6FmpKgk4qrBKyhMxBFk5Oo-toH11ny6o0UakQhiygdtWfX2J3f7fJ8DUxOIiKdseONoU_iEKsI976xSFHoZ9T_8oGBFZevWTWx0ihYI1Zchz42-K6j",
      price: 1450,
      quantity: 1,
    },
    {
      id: 2,
      name: "ORBIT Task Light",
      attributes: "Matte White",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBcxm0IGt9sqqC_beDU5gNKKh-lWcEUICwrUb5W3TI8VcdcWaI8EayfDN-9AIdZvGN6jg72AjASSx4BucVS7MIs5Pxll5qXrQvSo7ga9CL3feCy7N4SfTZxhwTRycJr_3Xc_qHI6OJHkUtrDu8POBMYE8XZ4vzuaSUWGDjaz7LHCeqaHsPxNAXn3ciUn2PN0h0B0KWWAGrcxutysyMr0qHQ-tbEhQHIP4cZps0qDRFdVeemrxKLyEiZzfoYlCTFBsCkhxLsEWVE-4_E",
      price: 280,
      quantity: 1,
    },
  ]);

  const subtotal = 1730;
  const shippingCost = 45;
  const tax = 432.5;
  const total = 2207.5;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Hanken+Grotesk:wght@100..900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .font-display-hero {
          font-family: 'Playfair Display', serif;
        }
        .font-headline-card {
          font-family: 'Playfair Display', serif;
          font-weight: 500;
        }
        .font-headline-section {
          font-family: 'Playfair Display', serif;
        }
        .font-body-main {
          font-family: 'Hanken Grotesk', sans-serif;
        }
        .font-label-caps {
          font-family: 'Hanken Grotesk', sans-serif;
          letter-spacing: 2px;
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }

        /* Scandi micro-interaction border styling */
        .scandi-card {
          border: 1px solid #c0c9c2;
          background-color: #ffffff;
          transition: border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .scandi-card:hover {
          border-color: #356852;
        }
      `}</style>

      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          opacity: 0.03,
          mixBlendMode: "multiply",
          backgroundImage: "url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')",
        }}
      />

      <div className="font-body-main min-h-screen bg-[#f7f3ee] text-[#1c1c19] flex flex-col selection:bg-[#a1d7bc] selection:text-[#114734]">
        {/* ── Main Content Canvas ── */}
        <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 md:px-16 py-8 md:py-12">

          {/* Header Section */}
          <header className="mb-12 md:mb-16">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "My Orders", href: "#" },
                { label: `#${orderNumber}` },
              ]}
            />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display-hero text-[36px] md:text-[56px] leading-[1.1] text-[#1c1c19] tracking-tight font-normal">
                  Order #{orderNumber}
                </h1>
                <p className="font-body-main text-[15px] font-light text-[#404944] mt-2">
                  Ordered on {orderDate}
                </p>
              </div>
              <div className="self-start md:self-auto inline-flex items-center bg-[#b8eed3] text-[#1b503c] px-4 py-1.5 rounded-full font-label-caps text-[11px] font-bold tracking-widest uppercase">
                {orderStatus}
              </div>
            </div>
          </header>

          {/* Progress Tracker */}
          <section className="mb-16 md:mb-20">
            <div className="relative flex justify-between items-start">
              {/* Connector Line */}
              <div className="absolute top-4 left-0 w-full h-[2px] bg-[#e1dfdc] z-0">
                <div className="h-full bg-[#2c5f4a]" style={{ width: "66%" }}></div>
              </div>

              {/* Steps */}
              {/* Step 1: Order Placed */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className="w-8 h-8 rounded-full bg-[#2c5f4a] flex items-center justify-center mb-4 transition-transform hover:scale-110">
                  <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                </div>
                <span className="font-label-caps text-[11px] font-semibold text-[#1c1c19] uppercase">ORDER PLACED</span>
                <span className="text-[12px] font-light text-[#404944] mt-1">Mar 12, 10:30 AM</span>
              </div>

              {/* Step 2: Processing */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className="w-8 h-8 rounded-full bg-[#2c5f4a] flex items-center justify-center mb-4 transition-transform hover:scale-110">
                  <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                </div>
                <span className="font-label-caps text-[11px] font-semibold text-[#1c1c19] uppercase">PROCESSING</span>
                <span className="text-[12px] font-light text-[#404944] mt-1">Mar 13, 02:15 PM</span>
              </div>

              {/* Step 3: Shipped (Active) */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-[#2c5f4a] border-4 border-[#e6e2dd] flex items-center justify-center mb-4 ring-4 ring-[#f7f3ee] transition-transform hover:scale-110">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span className="font-label-caps text-[11px] font-bold text-[#114734] uppercase">SHIPPED</span>
                <span className="text-[12px] font-light text-[#404944] mt-1">Mar 14, 09:00 AM</span>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className="w-8 h-8 rounded-full bg-[#e6e2dd] border border-[#c0c9c2] flex items-center justify-center mb-4 ring-4 ring-[#f7f3ee]"></div>
                <span className="font-label-caps text-[11px] font-semibold text-[#474745] uppercase">DELIVERED</span>
                <span className="text-[12px] font-light text-[#404944] mt-1">Est. Mar 18</span>
              </div>
            </div>
          </section>

          {/* Two Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column (60% / col-span-7) */}
            <div className="lg:col-span-7 flex flex-col gap-8">

              {/* Shipping Updates */}
              <div className="scandi-card p-6 md:p-8 rounded-lg">
                <h2 className="font-headline-card text-[20px] text-[#1c1c19] mb-6">
                  Shipping Updates
                </h2>
                <div className="space-y-6">
                  {trackingEvents.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-2 transition-transform duration-300 hover:scale-125 ${event.completed ? "bg-[#114734]" : "bg-[#c0c9c2]"
                            }`}
                        ></div>
                        {index < trackingEvents.length - 1 && (
                          <div className="w-px h-full bg-[#c0c9c2] mt-2"></div>
                        )}
                      </div>
                      <div className="pb-1">
                        <p
                          className={`font-body-main font-semibold text-[15px] ${event.completed ? "text-[#1c1c19]" : "text-[#404944]"
                            }`}
                        >
                          {event.title}
                        </p>
                        <p className="text-[13px] text-[#474745] mt-0.5">
                          {event.location} • {event.date} • {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Shipping Address */}
                <div className="scandi-card p-6 md:p-8 rounded-lg">
                  <h2 className="font-label-caps text-[11px] font-semibold text-[#404944] mb-4 uppercase">
                    Shipping Address
                  </h2>
                  <address className="not-italic font-body-main text-[15px] text-[#1c1c19] font-light leading-relaxed">
                    {shippingAddress.name}
                    <br />
                    {shippingAddress.street}
                    <br />
                    {shippingAddress.cityCode}
                    <br />
                    {shippingAddress.country}
                  </address>
                </div>

                {/* Shipping Method */}
                <div className="scandi-card p-6 md:p-8 rounded-lg">
                  <h2 className="font-label-caps text-[11px] font-semibold text-[#404944] mb-4 uppercase">
                    Shipping Method
                  </h2>
                  <p className="font-body-main text-[15px] font-semibold text-[#1c1c19] mb-1">
                    {shippingMethod}
                  </p>
                  <p className="font-body-main text-[13px] font-light text-[#404944] leading-relaxed">
                    {shippingMethodDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (40% / col-span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-8">

              {/* Order Summary Card */}
              <div className="scandi-card rounded-lg overflow-hidden">
                <div className="p-6 md:p-8 border-b border-[#c0c9c2]">
                  <h2 className="font-headline-card text-[20px] text-[#1c1c19]">Order Summary</h2>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 bg-[#ece7e2] rounded flex-shrink-0 overflow-hidden border border-[#e1dfdc]">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      {/* Product Details */}
                      <div className="flex-grow min-w-0">
                        <p className="font-body-main font-semibold text-[15px] text-[#1c1c19] truncate">
                          {item.name}
                        </p>
                        <p className="text-[13px] text-[#404944] font-light mt-0.5">
                          {item.attributes}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[12px] text-[#474745] font-light mt-0.5">
                            Qty: {item.quantity}
                          </p>
                        )}
                      </div>
                      {/* Product Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-body-main text-[15px] font-light text-[#1c1c19]">
                          €{(item.price * item.quantity).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Totals Section */}
                  <div className="pt-6 border-t border-[#c0c9c2] space-y-3">
                    <div className="flex justify-between font-body-main text-[15px] font-light text-[#404944]">
                      <span>Subtotal</span>
                      <span>
                        €
                        {subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-main text-[15px] font-light text-[#404944]">
                      <span>Shipping</span>
                      <span>
                        €
                        {shippingCost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-main text-[15px] font-light text-[#404944]">
                      <span>Tax (VAT)</span>
                      <span>
                        €
                        {tax.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-headline-card text-[20px] text-[#114734] pt-2">
                      <span>Total</span>
                      <span>
                        €
                        {total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Section Card */}
              <div className="bg-[#2c5f4a] text-[#ffffff] p-6 md:p-8 rounded-lg transition-transform duration-300 hover:shadow-md">
                <h3 className="font-headline-card text-[20px] text-white mb-2">Need help?</h3>
                <p className="font-body-main text-[13px] font-light mb-6 text-emerald-100 leading-relaxed">
                  Our concierge team is available 24/7 to assist with your order or shipping inquiries.
                </p>
                <a
                  href="mailto:concierge@ergoform.com"
                  className="inline-flex items-center gap-2 font-label-caps text-[11px] font-bold text-white border-b border-white/30 pb-1 hover:border-white transition-all duration-300 uppercase"
                >
                  CONTACT SUPPORT
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
