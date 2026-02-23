import React, { useState , useEffect } from "react";
import { Download, Eye, Settings, Loader, Upload, CheckCircle, XCircle, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import StatusBadge from "@/Components/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/Components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import { updateOrderItem } from "@/Services/OrdersService";

function OrderDetailItemDetails({ item, onUpdateSuccess }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemStatus, setItemStatus] = useState(item?.status);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nextStage, setNextStage] = useState(null);
  const [isLoadingNextStage, setIsLoadingNextStage] = useState(false);

  // Get file upload status and data
  const fileStatus = item?.file?.status || "unknown";
  const fileName = item?.file?.file_name || "No file";
  const googleFileId = item?.file?.google_file_id;

  // Fetch next stage from backend
  useEffect(() => {
    const fetchNextStage = async () => {
      setIsLoadingNextStage(true);
      try {
        // TODO: Replace with your actual API endpoint
        // const response = await fetch(`/api/order-items/${item.id}/next-stage`);
        // const data = await response.json();
        // setNextStage(data.next_stage);
        
        // For now, you can mock it or leave null until you implement the endpoint
        // Example response: { next_stage: "ACCEPTED", label: "Accept Item" }
      } catch (error) {
        console.error("Failed to fetch next stage:", error);
      } finally {
        setIsLoadingNextStage(false);
      }
    };

    if (item?.id) {
      fetchNextStage();
    }
  }, [item?.id]);


  const handleDownload = async () => {
    if (!googleFileId) {
      toast.error("No file available to download");
      return;
    }

    setIsDownloading(true);
    try {
      const downloadUrl = `https://drive.google.com/uc?id=1VqGUaQRmcT_wHWAf3DyJyoy_qCXPo3HU&export=download`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFilePreview = () => {
    if (!googleFileId) {
      toast.error("No file available to preview");
      return;
    }
    window.open(`https://drive.google.com/file/d/${googleFileId}/view`, "_blank");
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!itemStatus) return toast.warning("Select a status");

    setIsUpdating(true);
    try {
      await updateOrderItem(item.id, { status: itemStatus });
      toast.success("Status updated");
      setSheetOpen(false);
      onUpdateSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle automatic next stage transition
  const handleNextStage = async () => {
    if (!nextStage) return;

    setIsUpdating(true);
    try {
      await updateOrderItem(item.id, { status: nextStage.status });
      toast.success(`Status updated to ${nextStage.status}`);
      setItemStatus(nextStage.status);
      onUpdateSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Render file status badge
  const renderFileStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        label: "Pending"
      },
      uploading: {
        icon: Upload,
        color: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Uploading"
      },
      uploaded: {
        icon: CheckCircle,
        color: "bg-green-50 text-green-700 border-green-200",
        label: "Uploaded"
      },
      failed: {
        icon: XCircle,
        color: "bg-red-50 text-red-700 border-red-200",
        label: "Failed"
      },
      unknown: {
        icon: XCircle,
        color: "bg-gray-50 text-gray-700 border-gray-200",
        label: "Unknown"
      }
    };

    const config = statusConfig[status] || statusConfig.unknown;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
        <Icon size={12} className={status === "uploading" ? "animate-spin" : ""} />
        {config.label}
      </span>
    );
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* Product Info */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">{item.product?.name || item.item_number}</span>
          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <span className="font-medium text-gray-900">{item.item_price} DZD</span>
      </td>

      {/* File Info */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 truncate max-w-[200px]" title={fileName}>
              {fileName}
            </span>
            {renderFileStatusBadge(fileStatus)}
          </div>

          {/* Action Buttons */}
          {fileStatus === "uploaded" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isDownloading}
                onClick={handleDownload}
                className="text-xs h-8"
              >
                {isDownloading ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  <>
                    <Download size={14} className="mr-1" />
                    Download
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleFilePreview}
                className="text-xs h-8"
              >
                <Eye size={14} className="mr-1" />
                Preview
              </Button>
            </div>
          )}

          {fileStatus === "uploading" && (
            <span className="text-xs text-blue-600 flex items-center gap-1">
              <Upload size={12} className="animate-spin" />
              Uploading...
            </span>
          )}

          {fileStatus === "pending" && (
            <span className="text-xs text-yellow-600 flex items-center gap-1">
              <Clock size={12} />
              Waiting...
            </span>
          )}

          {fileStatus === "failed" && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <XCircle size={12} />
              Upload failed
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={itemStatus} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Next Stage Button - Shows if backend provides next stage */}
          {nextStage && (
            <Button
              size="sm"
              onClick={handleNextStage}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
            >
              {isUpdating ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <>
                  <span className="text-xs">{nextStage.label || `Move to ${nextStage.status}`}</span>
                  <ChevronRight size={14} />
                </>
              )}
            </Button>
          )}

          {/* Manual Update Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Settings size={14} />
                <span className="hidden sm:inline">Customize</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader className="pb-6 border-b border-gray-200">
                <SheetTitle className="text-xl font-semibold">Update Item Status</SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  {item.product?.name || item.item_number}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {/* Workflow Progress Info */}
                {nextStage && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 rounded-full p-2">
                        <ArrowRight className="text-white w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">Next Stage Available</p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          Click "Next Stage" to move to <span className="font-semibold">{nextStage.status}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Summary */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.product?.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.item_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{item.item_price} DZD</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  {item.product?.description && (
                    <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                      {item.product.description}
                    </p>
                  )}
                </div>

                {/* File Status */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase">File Status</span>
                    {renderFileStatusBadge(fileStatus)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      {fileStatus === "uploaded" ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : fileStatus === "uploading" ? (
                        <Upload size={18} className="text-blue-600 animate-spin" />
                      ) : fileStatus === "failed" ? (
                        <XCircle size={18} className="text-red-600" />
                      ) : (
                        <Clock size={18} className="text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm" title={fileName}>
                        {fileName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {fileStatus === "uploaded" && "Ready to download"}
                        {fileStatus === "uploading" && "Processing..."}
                        {fileStatus === "pending" && "Queued"}
                        {fileStatus === "failed" && "Error occurred"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manual Status Update */}
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                    Manual Status Override
                  </Label>
                  <Select value={itemStatus} onValueChange={setItemStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Pending</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ACCEPTED">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Accepted</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="REJECTED">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Rejected</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="WAIT_FOR_PROCESSING">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Waiting for Processing</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="processing">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span>Processing</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="printed">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Printed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="shipped">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          <span>Shipped</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="delivred">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span>Delivered</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span>Cancelled</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Use this to manually set any status, bypassing the workflow
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <SheetClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button 
                    onClick={handleUpdateItem} 
                    disabled={isUpdating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating ? (
                      <>
                        <Loader size={16} className="mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </td>
    </tr>
  );
}

export default OrderDetailItemDetails;