// OrderDetailHeader.jsx
import React from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteOrder } from "@/Services/OrdersService";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/Components/ui/alert-dialog";

function OrderDetailHeader({ order_id }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-sm rounded-lg p-4 md:p-6 mb-4">
      <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 truncate">
          Order #{order_id}
        </h1>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <AlertDialog>
          <AlertDialogTrigger className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-sm justify-center text-sm md:text-base">
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Deleting this order is permanent and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="space-x-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={async () => {
                  try {
                    await deleteOrder(order_id);
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

        <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition shadow-sm justify-center flex items-center text-sm md:text-base">
          <Download size={18} className="mr-2" /> Download
        </button>
      </div>
    </div>
  );
}

export default OrderDetailHeader;
