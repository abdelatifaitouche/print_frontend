import React, {useState } from "react";
import OrderDetailItemDetails from "./OrderDetailItemDetails";
function OrderDetailItems({ orderDatas }) {
  const [itemStatus, setItemStatus] = useState();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
      <h2 className="px-6 py-4 border-b border-gray-200 font-medium">
        Order Items
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                Product
              </th>
              <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                Files
              </th>
              <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderDatas?.items.map((item) => (
              <OrderDetailItemDetails key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetailItems;
