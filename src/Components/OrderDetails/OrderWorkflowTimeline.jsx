import React from "react";
import { CheckCircle, Circle, Clock, Package, Truck, CreditCard, XCircle } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";

function OrderWorkflowTimeline({ status }) {
  const statusUpper = status?.toUpperCase();

  // Define workflow stages
  const stages = [
    { key: "PENDING", label: "Pending", icon: Clock },
    { key: "ACCEPTED", label: "Accepted", icon: CheckCircle },
    { key: "PROCESSING", label: "Processing", icon: Package },
    { key: "PROCESSED", label: "Processed", icon: Package },
    { key: "PARTIAL_DELIVERED", label: "Partial Delivered", icon: Truck },
    { key: "DELIVRED", label: "Delivered", icon: Truck },
    { key: "PARTIAL_PAIED", label: "Partial Paid", icon: CreditCard },
    { key: "PAIED", label: "Paid", icon: CreditCard },
    { key: "FINISHED", label: "Finished", icon: CheckCircle },
  ];

  // Special states
  const isRejected = statusUpper === "REJECTED";
  const isCancelled = statusUpper === "CANCELLED";

  // Find current stage index
  const currentStageIndex = stages.findIndex(stage => stage.key === statusUpper);

  const getStageStatus = (index) => {
    if (isRejected || isCancelled) {
      return "cancelled";
    }
    if (index < currentStageIndex) {
      return "completed";
    }
    if (index === currentStageIndex) {
      return "current";
    }
    return "upcoming";
  };

  const getStageColor = (stageStatus) => {
    switch (stageStatus) {
      case "completed":
        return "bg-green-500 border-green-500 text-white";
      case "current":
        return "bg-blue-600 border-blue-600 text-white animate-pulse";
      case "cancelled":
        return "bg-red-500 border-red-500 text-white";
      default:
        return "bg-slate-200 border-slate-300 text-slate-400";
    }
  };

  const getLineColor = (index) => {
    if (isRejected || isCancelled) {
      return "bg-red-200";
    }
    if (index < currentStageIndex) {
      return "bg-green-500";
    }
    return "bg-slate-200";
  };

  return (
    <Card className="border-slate-200 shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Order Progress</h3>
          <p className="text-sm text-slate-600 mt-1">
            {isRejected && "This order has been rejected"}
            {isCancelled && "This order has been cancelled"}
            {!isRejected && !isCancelled && "Track your order through each stage"}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 hidden sm:block"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-green-500 transition-all duration-500 hidden sm:block"
            style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          ></div>

          {/* Stages */}
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const stageStatus = getStageStatus(index);
              const isActive = index === currentStageIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStageColor(stageStatus)}`}>
                    {stageStatus === "completed" ? (
                      <CheckCircle size={20} strokeWidth={2.5} />
                    ) : stageStatus === "cancelled" ? (
                      <XCircle size={20} strokeWidth={2.5} />
                    ) : stageStatus === "current" ? (
                      <Icon size={20} strokeWidth={2.5} />
                    ) : (
                      <Circle size={20} strokeWidth={2} />
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-2">
                    <p className={`text-xs font-medium ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {stage.label}
                    </p>
                    {isActive && !isRejected && !isCancelled && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rejected/Cancelled State */}
        {(isRejected || isCancelled) && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                <XCircle className="text-white" size={20} />
              </div>
              <div>
                <p className="font-semibold text-red-900">
                  {isRejected ? "Order Rejected" : "Order Cancelled"}
                </p>
                <p className="text-sm text-red-700 mt-0.5">
                  This order will not be processed further
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OrderWorkflowTimeline;