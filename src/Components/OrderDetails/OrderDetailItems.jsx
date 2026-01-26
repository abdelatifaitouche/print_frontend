import React from "react";
import OrderDetailItemDetails from "./OrderDetailItemDetails";

function OrderDetailItems({ orderDatas, onUpdateSuccess }) {
  if (!orderDatas?.items?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No items found in this order</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <h2 className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">
        Order Items ({orderDatas.items.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 uppercase text-gray-500 font-medium tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 uppercase text-gray-500 font-medium tracking-wider">
                Item Price
              </th>
              <th className="px-6 py-3 uppercase text-gray-500 font-medium tracking-wider">
                File & Upload Status
              </th>
              <th className="px-6 py-3 uppercase text-gray-500 font-medium tracking-wider">
                Item Status
              </th>
              <th className="px-6 py-3 uppercase text-gray-500 font-medium tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderDatas.items.map((item) => (
              <OrderDetailItemDetails 
                key={item.id} 
                item={item}
                onUpdateSuccess={onUpdateSuccess}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetailItems;