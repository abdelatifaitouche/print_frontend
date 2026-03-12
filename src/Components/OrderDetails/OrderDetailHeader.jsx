import React, { useState } from "react";
import { ArrowLeft, Download, Trash2, Check, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteOrder, acceptOrder, rejectOrder } from "@/Services/OrdersService";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";

function OrderDetailHeader({ order_data, onStatusChange , userRole}) {
  const [orderStatus, setOrderStatus] = useState(order_data?.status);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();

  if (!order_data) return null;

  const isPending = orderStatus?.toUpperCase() === "PENDING";
  const isAccepted = orderStatus?.toUpperCase() === "ACCEPTED";
  const isRejected = orderStatus?.toUpperCase() === "REJECTED";

  const handleAcceptOrder = async () => {
    setIsAccepting(true);
    try {
      await acceptOrder(order_data.id);
      setOrderStatus("ACCEPTED");
      toast.success("Order accepted");
      onStatusChange?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept order");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsRejecting(true);
    try {
      await rejectOrder(order_data.id, { reason: rejectionReason });
      setOrderStatus("REJECTED");
      setShowRejectDialog(false);
      toast.success("Order rejected");
      onStatusChange?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject order");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {order_data.order_number}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">Order Details</p>
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 ml-auto">
          {isPending && userRole == "ADMIN" && (
            <>
              <Button
                onClick={handleAcceptOrder}
                disabled={isAccepting}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                {isAccepting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Accept
                  </>
                )}
              </Button>

              <Button
                onClick={() => setShowRejectDialog(true)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 gap-2"
              >
                <X size={18} />
                Reject
              </Button>
            </>
          )}

          {isAccepted && (
            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="text-green-600 w-4 h-4" />
                <span className="text-green-700 font-semibold text-sm">
                  Accepted
                </span>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <X className="text-red-600 w-4 h-4" />
                <span className="text-red-700 font-semibold text-sm">
                  Rejected
                </span>
              </div>
            </div>
          )}

          <Button variant="outline" className="border-slate-300 gap-2">
            <Download size={18} />
            Download
          </Button>
          {isPending && userRole == "ADMIN" && 
            <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 gap-2">
                <Trash2 size={18} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <span className="font-semibold">{order_data.order_number}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    try {
                      await deleteOrder(order_data.id);
                      toast.success("Order deleted");
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
          }
          {
            isPending && <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 gap-2">
                <Trash2 size={18} />
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <span className="font-semibold">{order_data.order_number}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    try {
                      await deleteOrder(order_data.id);
                      toast.success("Order deleted");
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
          }
          
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-red-600 w-5 h-5" />
              Reject Order
            </DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting <span className="font-semibold">{order_data.order_number}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="e.g., Out of stock, Invalid requirements..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectOrder}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X size={16} className="mr-2" />
                  Reject Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrderDetailHeader;