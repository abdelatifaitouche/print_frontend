import { CheckCircle } from "lucide-react";
import React from "react";

function StatusBadge({ status }) {
  const getBgColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-600";
      case "printed":
        return "bg-green-50 text-green-600";
      case "in_progress":
        return "bg-blue-50 text-blue-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <span
      className={`flex items-center ${getBgColor(
        status
      )} px-3 py-1 rounded-full text-sm`}
    >
      <CheckCircle size={16} className="mr-1" />
      {status}
    </span>
  );
}

export default StatusBadge;
