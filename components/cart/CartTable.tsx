import { FC } from "react";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/app/cart/page";


interface CartTableProps {
  items: CartItem[];
}

const CartTable: FC<CartTableProps> = ({ items }) => (
  <div className="px-4 py-3 @container">
    <div className="flex overflow-hidden rounded-lg border border-[#dbe4e6] dark:border-gray-700 bg-white dark:bg-background-dark">
      <table className="flex-1 w-full">
        <thead>
          <tr className="bg-white dark:bg-background-dark border-b border-b-[#dbe4e6] dark:border-b-gray-700">
            <th className="px-4 py-3 text-left text-[#111718] dark:text-white w-2/5 text-sm font-medium leading-normal">
              Product
            </th>
            <th className="px-4 py-3 text-left text-[#111718] dark:text-white w-1/5 text-sm font-medium leading-normal">
              Price
            </th>
            <th className="px-4 py-3 text-center text-[#111718] dark:text-white w-1/5 text-sm font-medium leading-normal">
              Quantity
            </th>
            <th className="px-4 py-3 text-right text-[#111718] dark:text-white w-1/5 text-sm font-medium leading-normal">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-t-[#dbe4e6] dark:border-t-gray-700">
              <td className="h-[88px] px-4 py-2">
                <div className="flex items-center gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-16 h-16"
                    style={{ backgroundImage: `url("${item.imageUrl}")` }}
                    aria-label={item.altText}
                  />
                  <div className="flex flex-col">
                    <span className="text-[#111718] dark:text-white text-sm font-medium leading-normal">
                      {item.name}
                    </span>
                    <button className="text-red-500 text-xs font-medium leading-normal text-left mt-1 flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </td>
              <td className="h-[88px] px-4 py-2 text-[#618389] dark:text-gray-400 text-sm font-normal leading-normal">
                ${item.price.toFixed(2)}
              </td>
              <td className="h-[88px] px-4 py-2">
                <div className="flex items-center justify-center">
                  <input
                    className="w-16 text-center bg-[#f0f4f4] dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary"
                    type="number"
                    defaultValue={item.quantity}
                    min="1"
                  />
                </div>
              </td>
              <td className="h-[88px] px-4 py-2 text-[#111718] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CartTable;
