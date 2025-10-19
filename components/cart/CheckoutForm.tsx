import { FC } from "react";
import { Button } from "../ui/button";

const CheckoutForm: FC = () => (
  <div className="bg-white dark:bg-background-dark rounded-lg border border-[#dbe4e6] dark:border-gray-700 p-6">
    <p className="text-[#111718] dark:text-white text-2xl font-black leading-tight tracking-[-0.033em] mb-6">Checkout</p>
    <form action="#" className="space-y-6" method="POST">
      {[
        { id: "name", label: "Full Name", type: "text", autocomplete: "name" },
        { id: "email", label: "Email Address", type: "email", autocomplete: "email" },
        { id: "address", label: "Shipping Address", type: "text", autocomplete: "street-address" },
      ].map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium text-[#111718] dark:text-white">{field.label}</label>
          <div className="mt-1">
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              autoComplete={field.autocomplete}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>
      ))}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-[#111718] dark:text-white">City</label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="postal-code" className="block text-sm font-medium text-[#111718] dark:text-white">Postal Code</label>
          <input
            id="postal-code"
            name="postal-code"
            type="text"
            autoComplete="postal-code"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111718] dark:text-white">Payment Details</label>
        <div className="mt-1 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center text-gray-500 dark:text-gray-400">
          Stripe Payment Gateway Placeholder
        </div>
      </div>

      <Button className="w-full py-3">Place Order</Button>
    </form>
  </div>
);

export default CheckoutForm;
