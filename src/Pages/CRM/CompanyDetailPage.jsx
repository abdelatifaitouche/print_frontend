import { getCompanyDetails } from "@/Services/CompanyService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDataCard from "@/Components/CustomDataCard";

function CompanyDetailPage() {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);

  const fetchCompanyDetails = async (id) => {
    try {
      const response = await getCompanyDetails(id);
      setCompanyData(response);
    } catch (error) {
      console.error("Failed to fetch company details:", error);
    }
  };

  useEffect(() => {
    fetchCompanyDetails(id);
  }, [id]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Company Overview</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition">
          Edit Company
        </button>
      </div>

      {/* Main content area */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Company Info
          </h2>
          {companyData ? (
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Name:</span>{" "}
                {companyData.company_name}
              </p>
              <p>
                <span className="font-medium text-gray-800">Email:</span>{" "}
                {companyData.contact_email}
              </p>
              <p>
                <span className="font-medium text-gray-800">Phone:</span>{" "}
                {companyData.company_phone}
              </p>
              <p>
                <span className="font-medium text-gray-800">Address:</span>{" "}
                {companyData.address}
              </p>
              <p>
                <span className="font-medium text-gray-800">Joined:</span>{" "}
                {new Date(companyData.date_joined).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">Loading company data...</p>
          )}
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <OrderDataCard />
          <OrderDataCard />
          <OrderDataCard />
          <OrderDataCard />
        </div>

        
      </div>

      {/* Users List Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Company Users
        </h2>
        {/* You can replace this with a proper table or list */}
        <p className="text-gray-500">User list will be displayed here...</p>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
