import { CustomChart } from "@/Components/CustomChart";
import CustomDataCard from "@/Components/CustomDataCard";
import RecentOrderItem from "@/Components/RecentOrderItem";
import { getOrdersStats } from "@/Services/OrdersService";
import React, { useEffect, useState } from "react";

function Home() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  const getOrdersStatistics = async () => {
    try {
      const response = await getOrdersStats();
      setStats(response.data);
      console.log(stats);
    } catch (error) {}
  };

  useEffect(() => {
    getOrdersStatistics();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-2xl font-medium text-gray-800">Dashboard</h1>
        </header>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Key Metrics Cards */}
          <div className="col-span-12 grid grid-cols-1 sm:grid-cols-4 gap-8">
            <CustomDataCard
              title={"Orders"}
              data={stats?.total_orders}
              timeframe="total"
            />
            <CustomDataCard
              title={"Recent Orders"}
              data={stats?.new_orders_last_7_days}
              timeframe={"last 7 days"}
            />
            <CustomDataCard
              title={"Completed"}
              data={stats?.orders_by_status[0].count}
              timeframe={"Completed"}
            />
            <CustomDataCard
              title={"Clients"}
              data={stats?.total_clients}
              timeframe={"clients"}
            />
          </div>

          {/* Main Chart */}
          <div className="col-span-12 md:col-span-8 bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Analytics Overview
            </h2>
            <div className="w-full h-64 overflow-hidden">
              <CustomChart />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Recent Orders
            </h2>
            <div className="space-y-4">
              {/* Your recent orders content would go here */}
              <div className="h-64 flex flex-col items-start justify-center text-gray-400">
                {stats?.recent_order?.map((order, index) => {
                  return (
                    <RecentOrderItem
                      order_name={order.order_name}
                      company_name={order.company.company_name}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Distribution
            </h2>
            <div className="w-full h-56 overflow-hidden flex items-center justify-center text-gray-400">
              Pie chart would display here
            </div>
          </div>

          {/* Additional Stats or Information */}
          <div className="col-span-12 md:col-span-8 bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Performance Metrics
            </h2>
            <div className="w-full h-56 overflow-hidden flex items-center justify-center text-gray-400">
              Additional metrics would display here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
