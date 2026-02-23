import React from "react";
import { User, Building2, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";

function OrderDetailSummary({ orderDatas }) {
  if (!orderDatas) return null;

  return (
    <Card className="border-slate-200 shadow-sm mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Customer</h3>
            </div>
            <div className="space-y-3 pl-10">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm text-slate-900 font-medium">{orderDatas.creator?.username || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-slate-700">{orderDatas.creator?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="text-sm text-slate-700">{orderDatas.creator?.phone || "—"}</p>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Building2 size={16} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Company</h3>
            </div>
            <div className="space-y-3 pl-10">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm text-slate-900 font-medium">{orderDatas.company?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-slate-700">{orderDatas.company?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="text-sm text-slate-700">{orderDatas.company?.phone || "—"}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                <DollarSign size={16} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Details</h3>
            </div>
            <div className="space-y-3 pl-10">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Order Date</p>
                <p className="text-sm text-slate-900 font-medium">
                  {new Date(orderDatas.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Amount</p>
                <p className="text-lg text-slate-900 font-bold">{orderDatas.order_price?.toLocaleString()} DZD</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Items</p>
                <p className="text-sm text-slate-700">{orderDatas.items?.length || 0} item(s)</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderDetailSummary;