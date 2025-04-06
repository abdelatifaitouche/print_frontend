import React from 'react';

const OrderDataCard = ({ 
  title = "Orders", 
  count = 156, 
  icon = "📦", 
  timeframe = "Today",
  color = "blue" 
}) => {
  // Color variants
  const colorVariants = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700"
  };
  
  const selectedColor = colorVariants[color] || colorVariants.blue;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${selectedColor}`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
      
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800">{count.toLocaleString()}</h2>
        <span className="text-sm text-gray-500 mt-1">{timeframe}</span>
      </div>
    </div>
  );
};

export default OrderDataCard;