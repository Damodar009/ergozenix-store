"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { items, isLoading, updateQuantity, removeFromCart, cartTotal } = useCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9f3]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#114734]"></div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Hanken+Grotesk:wght@100..900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .font-display-hero {
          font-family: 'Playfair Display', serif;
        }
        .font-headline-card {
          font-family: 'Playfair Display', serif;
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

        /* Scandi card micro-interactions */
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

      <div className="font-body-main min-h-screen bg-[#fdf9f3] text-[#1c1c19] flex flex-col selection:bg-[#a1d7bc] selection:text-[#114734]">

        {/* Cart Page Header */}
        <header className="pt-12 pb-6 max-w-[1280px] mx-auto w-full px-6 md:px-16">
          <h1 className="font-headline-section text-[36px] md:text-[48px] leading-[1.3] text-[#1c1c19] font-normal">
            Your Cart
          </h1>
        </header>

        {/* Main Content Grid */}
        <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 md:px-16 pb-24">
          {items.length === 0 ? (
            /* Empty State */
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[64px] text-[#c0c9c2] mb-6">shopping_basket</span>
              <p className="font-headline-section text-[28px] text-[#404944] mb-8 font-light">
                Your cart is empty.
              </p>
              <Link
                href="/shop"
                className="text-[11px] font-semibold tracking-[2px] text-[#114734] border-b border-[#114734] pb-1 hover:opacity-80 transition-all uppercase"
              >
                START EXPLORING
              </Link>
            </div>
          ) : (
            /* Cart Grid populated */
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* Left: Cart Items (60% / lg:w-[60%]) */}
              <section className="w-full lg:w-[60%] flex flex-col gap-6">
                {items.map((item) => {
                  const price = item.price || item.product?.price || 0;
                  const itemTotal = price * item.quantity;
                  const imageUrl = item.product?.image_url || "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=200&auto=format&fit=crop";
                  const attributeStr = item.attributes && item.attributes.length > 0
                    ? item.attributes.map((a) => a.attribute_value).join(" / ")
                    : "Standard";

                  return (
                    <div
                      key={item.id}
                      className="scandi-card p-4 sm:p-6 rounded-lg flex gap-4 sm:gap-6 items-center"
                    >
                      <img
                        alt={item.product?.name || "Product image"}
                        src={imageUrl}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-sm border border-[#c0c9c2] transition-transform duration-500 hover:scale-105 shrink-0"
                      />
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-headline-card text-[18px] sm:text-[20px] font-semibold text-[#1c1c19]">
                            {item.product?.name}
                          </h3>
                          <p className="text-[#404944] text-[14px] sm:text-[15px] font-light mt-0.5">
                            {attributeStr}
                          </p>
                          <div className="mt-1.5 md:hidden">
                            <span className="font-semibold text-[15px] text-[#1c1c19]">
                              Rs. {itemTotal.toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="mt-2 text-[11px] font-semibold tracking-[2px] text-[#114734] hover:underline transition-all uppercase block"
                          >
                            REMOVE
                          </button>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-8 md:gap-12">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-[#c0c9c2] rounded px-2 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 hover:text-[#114734] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-[18px]">remove</span>
                            </button>
                            <span className="px-3 font-semibold text-[15px] text-[#1c1c19]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-[#114734] transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">add</span>
                            </button>
                          </div>

                          {/* Product Price */}
                          <span className="hidden md:inline font-semibold text-[15px] text-[#1c1c19] whitespace-nowrap min-w-[90px] text-right">
                            Rs. {itemTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Right: Summary (40% / lg:w-[40%]) */}
              <aside className="w-full lg:w-[40%]">
                <div
                  className="p-6 sm:p-8 rounded-lg border border-[#c0c9c2] sticky top-[96px]"
                  style={{ backgroundColor: "#f1ede8" }}
                >
                  <h2 className="font-label-caps text-[11px] font-semibold text-[#404944] uppercase mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-[15px] text-[#404944] font-light">Subtotal</span>
                      <span className="text-[15px] font-semibold text-[#1c1c19]">
                        Rs. {cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[15px] text-[#404944] font-light">Shipping</span>
                      <span className="text-[15px] font-semibold text-[#1c1c19]">
                        Rs. 1,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#c0c9c2] pt-4">
                      <span className="font-headline-card text-[20px] font-semibold text-[#1c1c19]">Total</span>
                      <span className="font-headline-card text-[20px] font-bold text-[#114734]">
                        Rs. {(cartTotal + 1000).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full h-[52px] bg-[#114734] hover:bg-[#2c5f4a] active:scale-[0.99] text-white font-label-caps text-[11px] font-bold tracking-widest transition-all cursor-pointer rounded uppercase"
                  >
                    CHECKOUT
                  </button>

                  <Link
                    href="/shop"
                    className="block text-center mt-4 text-[11px] font-semibold text-[#404944] hover:text-[#114734] transition-colors uppercase tracking-[2px]"
                  >
                    Continue Shopping
                  </Link>

                  <div className="mt-8 pt-6 border-t border-[#c0c9c2]">
                    <div className="flex items-start gap-3 text-[#404944]">
                      <span className="material-symbols-outlined text-[20px] shrink-0 text-[#114734]">verified_user</span>
                      <p className="text-[12px] font-light leading-snug">
                        Secure checkout and 2-year manufacturer warranty included.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
