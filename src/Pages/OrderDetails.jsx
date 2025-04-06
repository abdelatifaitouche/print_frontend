import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle,
  File,
  FileText,
  Eye,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOrderDetails } from "@/Services/OrdersService";

function OrderDetails() {
  // Sample order data - replace with your actual data fetching logic

  const [orderDatas, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderDetails(33);
        setOrderData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderDetails();
  }, []);

  const navigate = useNavigate();
  const orderData = {
    orderId: "ORD-7839",
    orderDate: "March 30, 2025",
    status: "Delivered",
    customer: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
    },
    shippingAddress: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
    },
    billingAddress: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
    },
    payment: {
      method: "Credit Card",
      cardNumber: "**** **** **** 4242",
      subtotal: 89.97,
      shipping: 4.99,
      tax: 7.65,
      total: 102.61,
    },
    items: [
      {
        id: 1,
        name: "Premium T-Shirt",
        sku: "TS-1001",
        price: 29.99,
        quantity: 2,
        image: "/api/placeholder/60/60",
        file: {
          name: "tshirt_design_spec.pdf",
          size: "1.2 MB",
          type: "application/pdf",
        },
      },
      {
        id: 2,
        name: "Designer Jeans",
        sku: "DJ-2050",
        price: 59.99,
        quantity: 1,
        image: "/api/placeholder/60/60",
        file: {
          name: "jeans_care_instructions.pdf",
          size: "842 KB",
          type: "application/pdf",
        },
      },
    ],
    timeline: [
      {
        date: "Mar 30, 2025",
        status: "Delivered",
        description: "Package delivered to customer",
      },
      {
        date: "Mar 28, 2025",
        status: "Shipped",
        description: "Package shipped via Express Delivery",
      },
      {
        date: "Mar 27, 2025",
        status: "Processing",
        description: "Payment confirmed, preparing order",
      },
      {
        date: "Mar 26, 2025",
        status: "Placed",
        description: "Order placed by customer",
      },
    ],
  };

  // Function to handle file download (in a real app, this would trigger an actual download)
  const handleFileDownload = (file) => {
    // In a real implementation, this would trigger the actual file download
    console.log(`Downloading file: ${file.name}`);
    // Example implementation:
    // window.location.href = `/api/download/${file.id}`;
  };

  // Function to handle file preview
  const handleFilePreview = (file) => {
    // In a real implementation, this would open a preview modal or redirect to a preview page
    console.log(`Previewing file: ${file.name}`);
    // Example implementation:
    // window.open(`/preview/${file.id}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="mr-4 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-medium text-gray-800">
              Order Details
            </h1>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-700 border border-gray-200 text-white rounded-lg shadow-sm hover:bg-blue-500">
              <Settings size={18} className="mr-2" />
              <span>Update</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
              <Download size={18} className="mr-2" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium">
                Order #{orderDatas?.order_name}
              </h2>
              <div className="mt-1 text-gray-500">
                Placed on {orderDatas?.created_at}
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="flex items-center bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                <CheckCircle size={16} className="mr-1" />
                {orderDatas?.status}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Customer</h3>
                <div className="text-gray-600">
                  <div>{orderDatas?.user.username}</div>
                  <div>{orderDatas?.user.email}</div>
                  <div>{orderDatas?.user.phone_number}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Company</h3>
                <div className="text-gray-600">
                  <div>{orderDatas?.company.company_name}</div>
                  <div>{orderDatas?.company.company_phone}</div>
                  <div>{orderDatas?.company.address}</div>
                  <div>{orderDatas?.company.contact_email}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="text-gray-600">
                  <div>{orderData.payment.method}</div>
                  <div>{orderData.payment.cardNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <h2 className="px-6 py-4 border-b border-gray-200 font-medium">
            Order Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                    Files
                  </th>
                  <th className="text-left px-6 py-3 text-sm text-gray-500 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderDatas?.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover mr-4"
                        />
                        <span className="font-medium">{item.item_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.file && (
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <FileText size={16} className="mr-2" />
                            <span>{item.file}</span>
                            <span className="ml-2 text-xs">
                              ({item.file.size})
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleFileDownload(item.file)}
                              className="flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <Download size={12} className="mr-1" />
                              Download
                            </button>
                            <button
                              onClick={() => handleFilePreview(item.file)}
                              className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            >
                              <Eye size={12} className="mr-1" />
                              Preview
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 ">
                      <div className="flex items-center">
                        <span className="flex items-center bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                          <CheckCircle size={16} className="mr-1" />
                          {item?.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-medium mb-4">Order Timeline</h2>
          <div className="space-y-6">
            {orderData.timeline.map((event, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`rounded-full w-3 h-3 ${
                      index === 0 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  {index !== orderData.timeline.length - 1 && (
                    <div className="h-16 w-px bg-gray-300 my-1"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{event.status}</h3>
                    <span className="text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

/**
 * <td className="px-6 py-4">${item.price.toFixed(2)}</td>
 */
