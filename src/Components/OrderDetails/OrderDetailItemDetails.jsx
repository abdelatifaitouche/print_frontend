import React, { useState } from "react";
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle,
  File,
  FileText,
  Eye,
  Settings,
  Loader,
} from "lucide-react";

import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { updateOrderItem } from "@/Services/OrdersService";
import { toast } from "sonner";

import StatusBadge from "@/Components/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/Components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import axios from "axios";
import AXIOS_CONFIG from "@/config/axiosConfig";

function OrderDetailItemDetails({ item, onUpdateSuccess }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemStatus, setItemStatus] = useState(item?.status);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleDownload = async (fileId) => {
    setIsDownloading(true);
    try {
      const response = await AXIOS_CONFIG.get(
        `orders/download/${fileId}/`,
        {
          withCredentials: true,
          responseType: "blob", // crucial to receive binary data
        }
      );

      // Extract filename from content-disposition
      const disposition = response.headers["content-disposition"];
      let filename = "downloaded-file";

      if (disposition && disposition.includes("filename=")) {
        const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          filename = fileNameMatch[1];
        }
      }

      // Create blob link to download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to handle file preview
  const handleFilePreview = (file) => {
    // In a real implementation, this would open a preview modal or redirect to a preview page
    toast.info(`Opening preview for file: ${file}`);
    // Example implementation:
    // window.open(`/preview/${file}`, '_blank');
  };

  const handleUpdateItem = async (e) => {
    
    if (!itemStatus) {
      toast.warning("Please select a status");
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateOrderItem(item.id, {
        status: itemStatus,
      });
      
      toast.success("Item status updated successfully");
      setSheetOpen(false);
      
      // If a callback was provided for refresh/update
      if (onUpdateSuccess && typeof onUpdateSuccess === 'function') {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <span className="font-medium">{item.item_name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {item.google_drive_file_id && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <FileText size={16} className="mr-2" />
              <span className="truncate max-w-xs">{item.google_drive_file_id}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(item.google_drive_file_id)}
                disabled={isDownloading}
                className="flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <Loader size={12} className="mr-1 animate-spin" />
                ) : (
                  <Download size={12} className="mr-1" />
                )}
                {isDownloading ? "Downloading..." : "Download"}
              </button>
              <button
                onClick={() => handleFilePreview(item.google_drive_file_id)}
                className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                <Eye size={12} className="mr-1" />
                Preview
              </button>
            </div>
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger className="flex items-center px-4 py-2 bg-blue-700 border border-gray-200 text-white rounded-lg shadow-sm hover:bg-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none">
            <Settings size={18} className="mr-2" /> <span>Update</span>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Update Item Status</SheetTitle>
              <SheetDescription>
                Change the status of "{item.item_name}"
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-6">
              <form onSubmit={handleUpdateItem}>
                <div className="grid grid-cols-4 items-center gap-4 mb-6">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    id="status"
                    value={itemStatus}
                    onValueChange={(value) => setItemStatus(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="printed">Printed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex items-center"
                  >
                    {isUpdating && <Loader size={16} className="mr-2 animate-spin" />}
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </td>
    </tr>
  );
}

export default OrderDetailItemDetails;