import React, { useEffect, useState } from "react";
import { Download, Eye, Settings, Loader, Upload, CheckCircle, XCircle, Clock, ChevronRight, DollarSign, Package, FileText } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import StatusBadge from "@/Components/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/Components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import { updateOrderItem, nextStageOrderItem } from "@/Services/OrdersService";
import AXIOS_CONFIG from "@/config/axiosConfig";

function OrderDetailItemDetails({ item, onUpdateSuccess, userRole = "USER" }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemStatus, setItemStatus] = useState(item?.status);
  const [itemPrice, setItemPrice] = useState(item?.item_price || 0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [downloadLink , setDownloadLink] = useState(null)
  // Role checks
  const isClient = userRole?.toUpperCase() === "CLIENT";
  const isAdminOrUser = userRole?.toUpperCase() === "ADMIN" || userRole?.toUpperCase() === "USER";

  const fileStatus = item?.file?.status || "UNKNOWN";
  const fileName = item?.file?.file_name || "No file";
  const googleFileId = item?.file?.google_file_id;

  const getDownloadLink = async () =>{
    if (!googleFileId) return toast.error("No file available to download");
    setIsDownloading(true);

    const download_link = await AXIOS_CONFIG.post(`/drive/${googleFileId}/download/`)

    setDownloadLink(download_link.data);
    setIsDownloading(false)

  }

  useEffect(()=>{
    getDownloadLink();
    console.log(downloadLink)
  },[])

  // Download file
  const handleDownload = async () => {

    if(downloadLink){

try {
      const link = document.createElement("a");
      link.href = `${downloadLink}`;
      link.download = fileName;
      link.target = "_blank";
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
    }
    
  };

  const handleFilePreview = () => {
    if (!googleFileId) return toast.error("No file available to preview");
    window.open(`https://drive.google.com/file/d/${googleFileId}/view`, "_blank");
  };

  // Manual status and price update
  const handleUpdateItem = async () => {
    if (!itemStatus) return toast.warning("Select a status");
    
    const updateData = {
      status: itemStatus,
      item_price: parseFloat(itemPrice) || 0,
    };

    setIsUpdating(true);
    try {
      await updateOrderItem(item.id, updateData);
      toast.success("Item updated successfully");
      onUpdateSuccess?.();
      setSheetOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    } finally {
      setIsUpdating(false);
    }
  };

  // Automatic next stage
  const handleNextStage = async () => {
    if (!item.id) return;
    setIsUpdating(true);
    try {
      const data = await nextStageOrderItem(item.id);
      toast.success(`Status updated to ${data.status}`);
      setItemStatus(data.status);
      onUpdateSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderFileStatusBadge = (status) => {
    const statusMap = {
      PENDING: { icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" },
      UPLOADING: { icon: Upload, color: "bg-blue-50 text-blue-700 border-blue-200", label: "Uploading" },
      UPLOADED: { icon: CheckCircle, color: "bg-green-50 text-green-700 border-green-200", label: "Uploaded" },
      FAILED: { icon: XCircle, color: "bg-red-50 text-red-700 border-red-200", label: "Failed" },
      UNKNOWN: { icon: XCircle, color: "bg-slate-50 text-slate-700 border-slate-200", label: "Unknown" },
    };
    const cfg = statusMap[status.toUpperCase()] || statusMap.UNKNOWN;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.color}`}>
        <Icon size={12} className={status.toUpperCase() === "UPLOADING" ? "animate-spin" : ""} />
        {cfg.label}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-500",
      ACCEPTED: "bg-green-500",
      REJECTED: "bg-red-500",
      WAIT_FOR_PROCESSING: "bg-blue-500",
      PROCESSING: "bg-indigo-500",
      PRINTED: "bg-purple-500",
      PAIED: "bg-emerald-500",
      FINISHED: "bg-green-600",
      DELIVERED: "bg-teal-500",
      CANCELLED: "bg-slate-500",
    };
    return colors[status] || "bg-slate-400";
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      {/* Product */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-slate-900">{item.product?.name || item.item_number}</span>
          <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <span className="font-semibold text-slate-900">{item.item_price?.toLocaleString()} DZD</span>
      </td>

      {/* File */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 truncate max-w-[200px]" title={fileName}>{fileName}</span>
            {renderFileStatusBadge(fileStatus)}
          </div>
          {fileStatus.toUpperCase() === "UPLOADED" && (
            <div className="flex gap-2">
              

              <Button size="sm" variant="outline" disabled={isDownloading} onClick={handleDownload} className="text-xs h-8 border-slate-300">
                {isDownloading ? <Loader size={14} className="animate-spin" /> : <><Download size={14} className="mr-1" />Download</>}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleFilePreview} className="text-xs h-8">
                <Eye size={14} className="mr-1" />Preview
              </Button>
            </div>
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
          {/* Next Stage - Only for ADMIN/USER */}
          {isAdminOrUser && (
            <Button 
              size="sm" 
              onClick={handleNextStage} 
              disabled={isUpdating} 
              className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
            >
              {isUpdating ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <>
                  <span className="text-xs">Next Stage</span>
                  <ChevronRight size={14} />
                </>
              )}
            </Button>
          )}

          {/* Manual Update - Only for ADMIN/USER */}
          {isAdminOrUser && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5 border-slate-300">
                  <Settings size={14} />
                  <span className="hidden sm:inline">Customize</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader className="pb-6 border-b border-slate-200">
                  <SheetTitle className="text-xl font-semibold text-slate-900">Customize Item</SheetTitle>
                  <SheetDescription className="text-sm text-slate-600">
                    Update price and status for this order item
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                  {/* Product Summary */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Package size={18} className="text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900">{item.product?.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.item_number}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm font-semibold text-slate-900">
                            {item.item_price?.toLocaleString()} DZD
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.product?.description && (
                      <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200">
                        {item.product.description}
                      </p>
                    )}
                  </div>

                  {/* File Status */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">File Status</span>
                      </div>
                      {renderFileStatusBadge(fileStatus)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                        {fileStatus.toUpperCase() === "UPLOADED" ? (
                          <CheckCircle size={18} className="text-green-600" />
                        ) : fileStatus.toUpperCase() === "UPLOADING" ? (
                          <Upload size={18} className="text-blue-600 animate-spin" />
                        ) : fileStatus.toUpperCase() === "FAILED" ? (
                          <XCircle size={18} className="text-red-600" />
                        ) : (
                          <Clock size={18} className="text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm" title={fileName}>
                          {fileName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {fileStatus.toUpperCase() === "UPLOADED" && "Ready to download"}
                          {fileStatus.toUpperCase() === "UPLOADING" && "Processing..."}
                          {fileStatus.toUpperCase() === "PENDING" && "Queued"}
                          {fileStatus.toUpperCase() === "FAILED" && "Error occurred"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item Price */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-slate-600" />
                      <Label htmlFor="item_price" className="text-sm font-medium text-slate-900">
                        Item Price (DZD)
                      </Label>
                    </div>
                    <Input
                      id="item_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="h-11 border-slate-300"
                      placeholder="Enter price"
                    />
                    <p className="text-xs text-slate-500">
                      Update the price for this specific item
                    </p>
                  </div>

                  {/* Manual Status Update */}
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-sm font-medium text-slate-900">
                      Item Status
                    </Label>
                    <Select value={itemStatus} onValueChange={setItemStatus}>
                      <SelectTrigger className="w-full h-11 border-slate-300">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "PENDING",
                          "ACCEPTED",
                          "REJECTED",
                          "WAIT_FOR_PROCESSING",
                          "PROCESSING",
                          "PRINTED",
                          "PAIED",
                          "FINISHED",
                          "DELIVERED",
                          "CANCELLED"
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2 py-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                              <span>{status.replace(/_/g, " ")}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      Manually override the item workflow status
                    </p>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <span className="font-semibold">Note:</span> Changes will be saved immediately and will update the order total if the price is modified.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <SheetClose asChild>
                      <Button variant="outline" className="flex-1 border-slate-300">
                        Cancel
                      </Button>
                    </SheetClose>
                    <Button 
                      onClick={handleUpdateItem} 
                      disabled={isUpdating}
                      className="flex-1 bg-slate-900 hover:bg-slate-800"
                    >
                      {isUpdating ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Client View - Info Only */}
          {isClient && (
            <p className="text-xs text-slate-500 italic">
              Contact support for updates
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}

export default OrderDetailItemDetails;