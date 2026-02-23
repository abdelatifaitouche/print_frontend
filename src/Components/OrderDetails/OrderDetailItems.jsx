import React, { useState } from "react";
import {
  Package,
  ChevronRight,
  Download,
  Eye,
  Loader,
  CheckCircle,
  Upload,
  Clock,
  XCircle
} from "lucide-react";

import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { toast } from "sonner";
import { nextStageOrderItem } from "@/Services/OrdersService";

function OrderDetailItems({ orderDatas, onUpdateSuccess }) {
  if (!orderDatas?.items?.length) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No items in this order</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Order Items
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({orderDatas.items.length})
          </span>
        </h2>

        <div className="space-y-4">
          {orderDatas.items.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              onUpdateSuccess={onUpdateSuccess}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderItemCard({ item, onUpdateSuccess }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const fileStatus = item?.file?.status || "unknown";
  const fileName = item?.file?.file_name || "No file";
  const googleFileId = item?.file?.google_file_id;

  const handleNextStage = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const updatedItem = await nextStageOrderItem(item.id);

      toast.success("Item updated");

      if (onUpdateSuccess) {
        onUpdateSuccess(updatedItem);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = () => {
    if (!googleFileId) {
      toast.error("No file available");
      return;
    }

    window.open(
      `https://drive.google.com/uc?id=${googleFileId}&export=download`,
      "_blank"
    );
  };

  const handlePreview = () => {
    if (!googleFileId) {
      toast.error("No file available");
      return;
    }

    window.open(
      `https://drive.google.com/file/d/${googleFileId}/view`,
      "_blank"
    );
  };

  const normalize = (s) => s?.toUpperCase();

  const getStatusBadge = (statusRaw) => {
    const status = normalize(statusRaw);

    const configs = {
      PENDING: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
      ACCEPTED: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
      PROCESSING: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Package },
      PROCESSED: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: CheckCircle },
      FINISHED: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
      CANCELLED: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle }
    };

    const config =
      configs[status] || {
        color: "bg-slate-50 text-slate-700 border-slate-200",
        icon: Package
      };

    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.color} border gap-1.5`}>
        <Icon size={12} />
        {status}
      </Badge>
    );
  };

  const getFileStatusBadge = (statusRaw) => {
    const status = statusRaw?.toLowerCase();

    const configs = {
      pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
      uploading: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Upload },
      uploaded: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
      failed: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle }
    };

    const config =
      configs[status] || {
        color: "bg-slate-50 text-slate-700 border-slate-200",
        icon: XCircle
      };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}
      >
        <Icon size={12} className={status === "uploading" ? "animate-spin" : ""} />
        {status}
      </span>
    );
  };

  return (
    <div className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Package className="text-slate-600" size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {item.product?.name || item.item_number}
              </h3>

              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span>Qty: {item.quantity}</span>
                <span className="font-semibold text-slate-900">
                  {item.item_price?.toLocaleString()} DZD
                </span>
              </div>

              <div className="mt-2">
                {getStatusBadge(item.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700 truncate">
                {fileName}
              </span>
              {getFileStatusBadge(fileStatus)}
            </div>

            {fileStatus === "uploaded" && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleDownload} className="h-8 text-xs">
                  <Download size={14} className="mr-1" />
                  Download
                </Button>

                <Button size="sm" variant="ghost" onClick={handlePreview} className="h-8 text-xs">
                  <Eye size={14} className="mr-1" />
                  Preview
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={handleNextStage}
            disabled={isUpdating}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
          >
            {isUpdating ? (
              <>
                <Loader size={14} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Update
                <ChevronRight size={14} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailItems;