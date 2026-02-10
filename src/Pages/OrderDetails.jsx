import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "@/Services/OrdersService";
import { RefreshCw } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import OrderDetailHeader from "@/Components/OrderDetails/OrderDetailHeader";
import OrderDetailSummary from "@/Components/OrderDetails/OrderDetailSummary";
import OrderDetailItems from "@/Components/OrderDetails/OrderDetailItems";

function OrderDetails() {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { id } = useParams();

  const fetchOrderDetails = useCallback(async (showToast = false) => {
    if (showToast) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getOrderDetails(id);
      console.log("Order details:", response);
      setOrderData(response);
      
      if (showToast) {
        toast.success("Order details refreshed");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Auto-refresh every 10 seconds if there are uploading files
  useEffect(() => {
    if (!orderData?.items) return;

    const hasUploadingFiles = orderData.items.some(
      (item) => item.file?.status === "uploading" || item.file?.status === "pending"
    );

    if (!hasUploadingFiles) return;

    const intervalId = setInterval(() => {
      console.log("Auto-refreshing order details...");
      fetchOrderDetails(false);
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [orderData, fetchOrderDetails]);

  const handleManualRefresh = () => {
    fetchOrderDetails(true);
  };

  const handleUpdateSuccess = () => {
    fetchOrderDetails(false);
  };

  if (isLoading && !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const hasUploadingFiles = orderData?.items?.some(
    (item) => item.file?.status === "uploading" || item.file?.status === "pending"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-6">
          <OrderDetailHeader order_data={orderData} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Upload Status Banner */}
        {hasUploadingFiles && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Files are being uploaded to Google Drive
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  This page will auto-refresh every 10 seconds to show the latest status
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <OrderDetailSummary orderDatas={orderData} />

        {/* Order Items */}
        <OrderDetailItems 
          orderDatas={orderData} 
          onUpdateSuccess={handleUpdateSuccess}
        />
      </div>
    </div>
  );
}

export default OrderDetails;