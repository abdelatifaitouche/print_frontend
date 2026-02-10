import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

function OrderDetailSummary({ orderDatas }) {
  if (!orderDatas) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-600";
      case "pending":
        return "bg-yellow-50 text-yellow-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
           {orderDatas.order_number}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Placed on {new Date(orderDatas.created_at).toLocaleString()}
          </p>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDatas.status)}`}
          >
            {orderDatas.status === "completed" && <CheckCircle size={16} className="mr-1" />}
            {orderDatas.status === "pending" && <Clock size={16} className="mr-1" />}
            {orderDatas.status === "cancelled" && <XCircle size={16} className="mr-1" />}
            {orderDatas.status}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
        {/* Customer Info */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Customer</h3>
          <div className="text-gray-600 text-sm space-y-1">
            <div>{orderDatas.customer_name || orderDatas.created_by}</div>
            <div>{orderDatas.customer_email || "customer@example.com"}</div>
            <div>{orderDatas.customer_phone || "+1 555 555 555"}</div>
          </div>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Company</h3>
          <div className="text-gray-600 text-sm space-y-1">
            <div>{orderDatas.company_name || "-"}</div>
            <div>{orderDatas.company_email || "-"}</div>
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
          <div className="text-gray-600 text-sm space-y-1">
            <div>{orderDatas.payment_method || "CCP"}</div>
            <div>{orderDatas.payment_reference || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailSummary;
