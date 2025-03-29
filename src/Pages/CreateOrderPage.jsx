import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import axios from "axios";
import React, { useState } from "react";

function CreateOrderPage() {
  const [orderData, setOrderData] = useState({user : 1 , company : 1});
  const [orderItemList, setOrderItemList] = useState([]);

  // Handle order name change
 

  // Add a new blank order item
  const addOrderItem = () => {
    setOrderItemList([...orderItemList, { item_name: "", file: "" }]);
  };

  // Update a specific order item
  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...orderItemList];
    updatedItems[index][field] = value;
    setOrderItemList(updatedItems);
  };

  // Remove an order item by index
  const removeOrderItem = (index) => {
    const updatedItems = orderItemList.filter((_, i) => i !== index);
    setOrderItemList(updatedItems);
  };


  const createOrderApi = ()=>{
    axios.post("" , )
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...orderData, items: orderItemList });
    // Send data to backend here
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter une Commande</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        

        {/* Order Items */}
        {orderItemList.map((orderItem, index) => (
          <OrderItemForm
            key={index}
            index={index}
            orderItem={orderItem}
            updateOrderItem={updateOrderItem}
            removeOrderItem={removeOrderItem}
          />
        ))}

        {/* Add Order Item Button */}
        <div className="flex gap-2">
          <Button type="button" onClick={addOrderItem} className="bg-green-500">
            + Add Item
          </Button>

          {/* Submit Button */}
          <Button type="submit" className="bg-blue-500">
            Créer
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrderPage;

// Order Item Component
function OrderItemForm({ index, orderItem, updateOrderItem, removeOrderItem }) {
  return (
    <div className="flex gap-2 items-center">
      {/* Item Name Input */}
      <Input
        placeholder="Item Name"
        value={orderItem.item_name}
        onChange={(e) => updateOrderItem(index, "item_name", e.target.value)}
      />

      {/* File Input */}
      <Input
        placeholder="File"
        value={orderItem.file}
        onChange={(e) => updateOrderItem(index, "file", e.target.value)}
      />

      {/* Remove Button */}
      <Button
        type="button"
        onClick={() => removeOrderItem(index)}
        className="bg-red-500"
      >
        🗑️
      </Button>
    </div>
  );
}
