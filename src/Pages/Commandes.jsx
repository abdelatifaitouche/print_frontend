import CustomDataCard from "@/Components/CustomDataCard";
import CustomTable from "@/Components/CustomTable";
import { Button } from "@/Components/ui/button";
import React from "react";

function Commandes() {
  return (
    <div className="p-4">
      <div>
        <nav className="flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold">Commandes</h1>
          <ul className="flex gap-2 mt-2 sm:mt-0">
            <Button className={"bg-white text-black border-2"}>Export</Button>
            <Button className={'bg-blue-400'}>Create Order</Button>
          </ul>
        </nav>

        <div className="flex flex-wrap gap-2 mt-3">
          {[1, 2, 3].map((item, index) => {
            return <CustomDataCard key={index} />;
          })}
        </div>
      </div>

      <div className="mt-6">
        <CustomTable />
      </div>
    </div>
  );
}

export default Commandes;
