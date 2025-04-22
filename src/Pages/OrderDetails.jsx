import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle,
  File,
  FileText,
  Eye,
  Settings,
  WindArrowDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteOrder,
  getOrderDetails,
  updateOrderItem,
} from "@/Services/OrdersService";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AXIOS_CONFIG from "@/config/axiosConfig";
import axios from "axios";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import StatusBadge from "@/Components/StatusBadge";

function OrderDetails() {
  // Sample order data - replace with your actual data fetching logic

  const [orderDatas, setOrderData] = useState(null);
  const { id } = useParams();

  const [userRole, setUserRole] = useState("admin");

  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (fileId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/orders/download/${fileId}/`,
        {
          withCredentials: true,
          responseType: "blob", // crucial to receive binary data
        }
      );

      // Extract filename from content-disposition
      const disposition = response.headers["content-disposition"];
      console.log("disposition : ", disposition);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderDetails(id);
        setOrderData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderDetails();
  }, []);

  const navigate = useNavigate();

  // Function to handle file download (in a real app, this would trigger an actual download)
  const handleFileDownload = (file) => {
    // In a real implementation, this would trigger the actual file download
    console.log(`Downloading file: ${file.name}`);
    // Example implementation:
    // window.location.href = `/api/download/${file.id}`;
  };

  // Function to handle file preview
  const handleFilePreview = (file) => {
    // In a real implementation, this would open a preview modal or redirect to a preview page
    console.log(`Previewing file: ${file.name}`);
    // Example implementation:
    // window.open(`/preview/${file.id}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="mr-4 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-medium text-gray-800">
              Order Details
            </h1>
          </div>
          <div className="flex space-x-3">
            <AlertDialog>
              <AlertDialogTrigger className="mr-4 p-2 rounded-md bg-red-500 text-white shadow-sm hover:bg-red-300">
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={"bg-red-500"}
                    onClick={async () => {
                      try {
                        await deleteOrder(id);
                        toast.success("Order deleted successfully");
                        navigate(-1);
                      } catch (error) {
                        toast.error("Failed to delete order");
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
              <Download size={18} className="mr-2" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
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

        {/* Order Items */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <h2 className="px-6 py-4 border-b border-gray-200 font-medium">
            Order Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                    Files
                  </th>
                  <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderDatas?.items.map((item) => (
                  <tr key={item.id}>
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
                            <span>{item.google_drive_file_id}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleDownload(item.google_drive_file_id)
                              }
                              className="flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <Download size={12} className="mr-1" />
                              {isLoading ? "Downloading ..." : "Download"}
                            </button>
                            <button
                              onClick={() =>
                                handleFilePreview(item.google_drive_file_id)
                              }
                              className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            >
                              <Eye size={12} className="mr-1" />
                              Preview
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 ">
                    <StatusBadge status={item?.status}/>
                    </td>
                    <td className="px-6 py-4 ">
                      <Sheet>
                        <SheetTrigger className="flex items-center px-4 py-2 bg-blue-700 border border-gray-200 text-white rounded-lg shadow-sm hover:bg-blue-500">
                          <Settings size={18} className="mr-2" />{" "}
                          <span>Update</span>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>Update Item</SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 p-4">
                            <form>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="status"
                                  className={"text-right"}
                                >
                                  Status
                                </Label>
                                <Select id="status" defaultValue={item?.status} onChange={()=>{
                                  
                                }}>
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="in_progress">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="pending">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="printed">
                                      Printed
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                onClick={() => {
                                  updateOrderItem(item.id, {
                                    status: "cancelled",
                                  });
                                }}
                              >
                                Update
                              </Button>
                            </form>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Timeline */}
      </div>
    </div>
  );
}

export default OrderDetails;
