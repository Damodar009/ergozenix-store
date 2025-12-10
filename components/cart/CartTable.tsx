import { FC } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";

export interface CartTableItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  altText: string;
  cartItemId: number; // Changed to number
}

interface CartTableProps {
  items: CartTableItem[];
}

const CartTable: FC<CartTableProps> = ({ items }) => {
  const { removeFromCart, updateQuantity } = useCart()

  return (
  <div className="px-4 py-3 @container">
    <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
      <table className="flex-1 w-full">
        <thead>
          <tr className="bg-white dark:bg-slate-900 border-b border-b-gray-200 dark:border-b-gray-800">
            <th className="px-4 py-3 text-left text-gray-900 dark:text-white w-2/5 text-sm font-medium leading-normal">
              Product
            </th>
            <th className="px-4 py-3 text-left text-gray-900 dark:text-white w-1/5 text-sm font-medium leading-normal">
              Price
            </th>
            <th className="px-4 py-3 text-center text-gray-900 dark:text-white w-1/5 text-sm font-medium leading-normal">
              Quantity
            </th>
            <th className="px-4 py-3 text-right text-gray-900 dark:text-white w-1/5 text-sm font-medium leading-normal">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-t-gray-200 dark:border-t-gray-800">
              <td className="h-[88px] px-4 py-2">
                <div className="flex items-center gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-16 h-16 bg-gray-100 dark:bg-slate-800"
                    style={{ backgroundImage: `url("${item.imageUrl}")` }}
                    aria-label={item.altText}
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white text-sm font-medium leading-normal">
                      {item.name}
                    </span>
                    <button 
                      className="text-red-500 text-xs font-medium leading-normal text-left mt-1 flex items-center gap-1 hover:underline"
                      onClick={() => removeFromCart(item.cartItemId)}
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </td>
              <td className="h-[88px] px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Rs. {item.price.toFixed(2)}
              </td>
              <td className="h-[88px] px-4 py-2">
                <div className="flex items-center justify-center">
                  <input
                    className="w-16 text-center bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (val > 0) {
                        updateQuantity(item.cartItemId, val)
                      }
                    }}
                    min="1"
                  />
                </div>
              </td>
              <td className="h-[88px] px-4 py-2 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] text-right">
                Rs. {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
};

export default CartTable;
