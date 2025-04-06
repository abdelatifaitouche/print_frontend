import CustomDataCard from "@/Components/CustomDataCard";
import CustomTable from "@/Components/CustomTable";
import { Button } from "@/Components/ui/button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getOrders from '@/Services/OrdersService';
import { Download, Plus, Loader2, RefreshCw } from "lucide-react";

function Commandes() {
  const navigate = useNavigate();
  const [ordersData, setOrdersData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getOrders();
      console.log(data.Orders);
      setOrdersData(data.Orders);
    } catch (errors) {
      console.log(errors);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Orders</h1>
            <p className="text-zinc-500 mt-1">
              {isLoading 
                ? "Loading orders..." 
                : ordersData 
                  ? `${ordersData.length} orders found` 
                  : "No orders available"}
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </Button>
            
            <Button 
              className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2"
              onClick={() => navigate('/commandes/creer')}
            >
              <Plus size={16} />
              Create Order
            </Button>
          </div>
        </div>

        {/* Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((item, index) => (
            <CustomDataCard key={index} />
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="font-medium text-zinc-800">All Orders</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-zinc-500 hover:text-zinc-800"
              onClick={fetchOrders}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <RefreshCw size={16} className="mr-2" />
              )}
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-teal-500 mr-2" />
              <span className="text-zinc-500">Loading orders...</span>
            </div>
          ) : (
            <CustomTable data={ordersData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Commandes;