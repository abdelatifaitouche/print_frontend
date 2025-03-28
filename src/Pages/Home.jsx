import { CustomChart } from "@/Components/CustomChart";
import CustomDataCard from "@/Components/CustomDataCard";
import React from "react";

function Home() {
  return (
    <div className="p-4 w-full min-h-screen flex">
      {/* Main Content Area */}
      <div className="flex-1">
        <header>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5  mt-4">
          {/* Custom Data Cards */}
          {[1, 2, 3].map((item, index) => {
            return <CustomDataCard key={index} />;
          })}
          <div className="col-span-1 sm:col-span-2 lg:col-start-4 lg:col-span-2">
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2>Pie Charts</h2>

              {/* Add your recent orders content here */}
            </div>
          </div>

          {/* Custom Chart */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 lg:col-start-1 row-span-3 sm:row-span-2">
            <CustomChart />
          </div>

          {/* Recent Orders */}
          

          {/* Pie Charts */}
          <div className="col-span-1 sm:col-span-2 lg:col-start-4 lg:col-span-2 row-span-2 sm:row-span-1">
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <h2>Recent Orders</h2>
              {/* Add pie charts content here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
