"use client"

import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "../ui/select";
import { Textarea } from "../ui/textarea"; 
import { PROVINCES, DISTRICTS } from "@/lib/nepal-locations";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { OrderService } from "@/services/order-service";

const CheckoutForm: FC = () => {
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, cartTotal, clearCart, sessionId, userId } = useCart(); // Assuming sessionId/userId exposed, or we add them now
  const { toast } = useToast();
  const router = useRouter();

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setDistrict(""); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
        toast({ title: "Cart is empty", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const checkoutData: any = {
      fullName: formData.get("name") as string,
      phoneNumber: formData.get("phone") as string,
      email: formData.get("email") as string,
      province, // State
      district, // State
      city: formData.get("city") as string,
      streetAddress: formData.get("address") as string,
      landmark: formData.get("landmark") as string,
      notes: formData.get("notes") as string,
    };

    try {
      // Calculate summary - simplified (shipping fixed at 15 for now as per CartPage)
      // Ideally CartContext should provide the full summary object or we recalculate.
      // CartPage used `cartTotal + 15`.
      const shipping = 15;
      const total = cartTotal + shipping;
      const summary = { subtotal: cartTotal, shipping, total };

      await OrderService.placeOrder(
        checkoutData,
        items,
        summary,
        userId || null,
        sessionId || null
      );

      await clearCart();
      toast({ title: "Order Placed Successfully!", description: "Thank you for your purchase." });
      router.push("/"); // Redirect home for now
    } catch (error: any) {
      console.error("Order Error:", error);
      toast({ title: "Failed to place order", description: error.message || "Unknown error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-6 shadow-sm">
      <p className="text-gray-900 dark:text-white text-2xl font-black leading-tight tracking-[-0.033em] mb-6">Checkout</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name & Phone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">Full Name</label>
            <Input id="name" name="name" placeholder="John Doe" required className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">Phone Number</label>
            <Input id="phone" name="phone" type="tel" placeholder="98XXXXXXXX" required className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700" />
          </div>
        </div>
        
        {/* Email */}
        <div className="space-y-2">
           <label htmlFor="email" className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Email Address</label>
           <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Province & District */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Province</label>
            <Select onValueChange={handleProvinceChange} value={province} required>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700">
                {PROVINCES.map((p) => (
                  <SelectItem key={p} value={p} className="focus:bg-slate-100 dark:focus:bg-slate-700">{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">District</label>
            <Select 
              onValueChange={setDistrict} 
              value={district} 
              disabled={!province}
              required
            >
              <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700 disabled:opacity-50">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700">
                {province && DISTRICTS[province as keyof typeof DISTRICTS]?.map((d) => (
                  <SelectItem key={d} value={d} className="focus:bg-slate-100 dark:focus:bg-slate-700">{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Town/City */}
        <div className="space-y-2">
           <label htmlFor="city" className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Town / City</label>
           <Input id="city" name="city" placeholder="e.g. Kathmandu, Pokhara" required className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Street Address */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Street Address</label>
          <Input id="address" name="address" placeholder="House No, Street Name, Tole" required className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Landmark */}
        <div className="space-y-2">
          <label htmlFor="landmark" className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Landmark (Optional)</label>
          <Input id="landmark" name="landmark" placeholder="Near Temple / School / Hospital" className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Order Notes (Optional)</label>
          <textarea 
            id="notes" 
            name="notes"
            className="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
            placeholder="Special delivery instructions..."
          />
        </div>

        <div className="pt-2">
          <Button 
            className="w-full py-6 text-lg font-bold bg-[#00B5D8] hover:bg-[#00A3C4] text-white" 
            disabled={isSubmitting || items.length === 0}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
