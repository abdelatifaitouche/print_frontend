import React, { useState } from "react";
import { Download, Eye, Settings, Loader, Upload, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/Components/ui/button";
import StatusBadge from "@/Components/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/Components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import { updateOrderItem } from "@/Services/OrdersService";
import AXIOS_CONFIG from "@/config/axiosConfig";

function OrderDetailItemDetails({ item, onUpdateSuccess }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemStatus, setItemStatus] = useState(item?.status);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Get file upload status and data
  const fileStatus = item?.file?.status || "unknown";
  const fileName = item?.file?.file_name || "No file";
  const googleFileId = item?.file?.google_file_id;

  const handleDownload = async () => {
    if (!googleFileId) {
      toast.error("No file available to download");
      return;
    }

    setIsDownloading(true);
    try {
      // Direct download from Google Drive
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${googleFileId}`;
      
      // Create a temporary link and trigger download
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
    // Open Google Drive preview in new tab
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

  // Render file status badge with appropriate styling
  const renderFileStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Pending Upload"
      },
      uploading: {
        icon: Upload,
        color: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Uploading..."
      },
      uploaded: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700 border-green-200",
        label: "Uploaded"
      },
      failed: {
        icon: XCircle,
        color: "bg-red-100 text-red-700 border-red-200",
        label: "Upload Failed"
      },
      unknown: {
        icon: XCircle,
        color: "bg-gray-100 text-gray-700 border-gray-200",
        label: "Unknown"
      }
    };

    const config = statusConfig[status] || statusConfig.unknown;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon size={12} className={status === "uploading" ? "animate-spin" : ""} />
        {config.label}
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{item.product?.name || item.item_number}</span>
          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-medium">{item.item_price} dzd</td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          {/* File Name & Status */}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 truncate max-w-xs" title={fileName}>
              {fileName}
            </span>
            {renderFileStatusBadge(fileStatus)}
          </div>

          {/* Action Buttons - Show based on file status */}
          {fileStatus === "uploaded" ? (
            <div className="flex gap-2">
              <Button
                size="xs"
                variant="outline"
                disabled={isDownloading}
                onClick={handleDownload}
              >
                {isDownloading ? (
                  <Loader size={12} className="animate-spin mr-1" />
                ) : (
                  <Download size={12} className="mr-1" />
                )}
                Download
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={handleFilePreview}
              >
                <Eye size={12} className="mr-1" /> Preview
              </Button>
            </div>
          ) : fileStatus === "uploading" ? (
            <span className="text-xs text-blue-600 animate-pulse flex items-center gap-1">
              <Upload size={12} className="animate-spin" />
              Upload in progress...
            </span>
          ) : fileStatus === "pending" ? (
            <span className="text-xs text-yellow-600 flex items-center gap-1">
              <Clock size={12} />
              Waiting for upload to start...
            </span>
          ) : fileStatus === "failed" ? (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <XCircle size={12} />
              Upload failed. Please retry.
            </span>
          ) : (
            <span className="text-xs text-gray-400">No file information</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={itemStatus} />
      </td>
      <td className="px-6 py-4 text-center">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm" variant="default" className="flex items-center gap-1">
              <Settings size={14} /> Update
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader className="space-y-3 pb-6 border-b">
              <SheetTitle className="text-xl font-semibold">Update Order Item</SheetTitle>
              <SheetDescription className="text-sm text-gray-600">
                Manage status for {item.product?.name || item.item_number}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              {/* Product Info Card */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.product?.name}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{item.item_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-teal-700">{item.item_price} dzd</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                {item.product?.description && (
                  <p className="text-xs text-gray-700 bg-white/50 rounded-lg px-3 py-2">
                    {item.product.description}
                  </p>
                )}
              </div>

              {/* File Upload Status Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    File Upload Status
                  </span>
                  {renderFileStatusBadge(fileStatus)}
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    {fileStatus === "uploaded" ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : fileStatus === "uploading" ? (
                      <Upload size={16} className="text-blue-600 animate-spin" />
                    ) : fileStatus === "failed" ? (
                      <XCircle size={16} className="text-red-600" />
                    ) : (
                      <Clock size={16} className="text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate" title={fileName}>
                      {fileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {fileStatus === "uploaded" && "Ready to download"}
                      {fileStatus === "uploading" && "Processing upload..."}
                      {fileStatus === "pending" && "Queued for upload"}
                      {fileStatus === "failed" && "Upload encountered an error"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Item Status Update Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-900 mb-3 block">
                    Update Item Status
                  </Label>
                  <Select value={itemStatus} onValueChange={setItemStatus}>
                    <SelectTrigger className="w-full h-11 border-2 border-gray-200 hover:border-teal-400 focus:border-teal-500 transition-colors">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Pending</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="in_progress" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>In Progress</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="printed" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Printed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Cancelled</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-11 border-2 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button 
                    type="button" 
                    onClick={handleUpdateItem} 
                    disabled={isUpdating}
                    className="flex-1 h-11 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-teal-500/30"
                  >
                    {isUpdating ? (
                      <>
                        <Loader size={16} className="mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Update Status
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </td>
    </tr>
  );
}

export default OrderDetailItemDetails;