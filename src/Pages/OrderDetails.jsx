import React, { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import {
  getOrderDetails,
} from "@/Services/OrdersService";



import OrderDetailHeader from "@/Components/OrderDetails/OrderDetailHeader";
import OrderDetailSummary from "@/Components/OrderDetails/OrderDetailSummary";
import OrderDetailItems from "@/Components/OrderDetails/OrderDetailItems";

function OrderDetails() {

  const [orderDatas, setOrderData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderDetails(id);
        console.log(response)
        setOrderData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderDetails();
  }, []);


  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <OrderDetailHeader order_id={orderDatas?.id} />
        {/* Order Summary */}
        <OrderDetailSummary orderDatas={orderDatas} />
        {/* Order Items */}
        <OrderDetailItems orderDatas={orderDatas}/>
      </div>
    </div>
  );
}

export default OrderDetails;
