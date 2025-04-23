import React from "react";
import {
  ArrowLeft,
  Download,
} from "lucide-react";

import { toast } from "sonner";

import {
  deleteOrder,
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
import { useNavigate } from "react-router-dom";

function OrderDetailHeader({order_id}) {
  const navigate = useNavigate();

  return (
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
        <h1 className="text-2xl font-medium text-gray-800">Order Details</h1>
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
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={"bg-red-500"}
                onClick={async () => {
                  try {
                    await deleteOrder(order_id);
                    toast.success("Order deleted successfully");
                    navigate(-1);
                  } catch (error) {
                    console.log(error)
                    toast.error("Failed to delete order");
                  }
                }}
              >                Delete
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
  );
}

export default OrderDetailHeader;

/**
 * <AlertDialogAction
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
 */
