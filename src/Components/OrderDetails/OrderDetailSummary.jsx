import React from "react";
import { CheckCircle } from "lucide-react";
function OrderDetailSummary({ orderDatas }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">
            Order #{orderDatas?.order_name}
          </h2>
          <div className="mt-1 text-gray-500">
            Placed on {orderDatas?.created_at}
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <span className="flex items-center bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
            <CheckCircle size={16} className="mr-1" />
            {orderDatas?.status}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Customer</h3>
            <div className="text-gray-600">
              <div>{orderDatas?.user.username}</div>
              <div>{orderDatas?.user.email}</div>
              <div>{orderDatas?.user.phone_number}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Company</h3>
            <div className="text-gray-600">
              <div>{orderDatas?.company.company_name}</div>
              <div>{orderDatas?.company.company_phone}</div>
              <div>{orderDatas?.company.address}</div>
              <div>{orderDatas?.company.contact_email}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <div className="text-gray-600">
              <div>CCP</div>
              <div>44445256555</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailSummary;
