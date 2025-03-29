import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import axios from "axios";
import React, { useState } from "react";

function CreateOrderPage() {
  const [orderData, setOrderData] = useState({
    user: 1,
    company: 1,
    items: [],
  });

  // Add a new blank order item inside orderData.items
  const addOrderItem = () => {
    setOrderData((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: "", file: null }],
    }));
  };

  // Update a specific order item inside orderData.items
  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...orderData.items];
    updatedItems[index][field] = value;
    setOrderData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Remove an order item by index
  const removeOrderItem = (index) => {
    const updatedItems = orderData.items.filter((_, i) => i !== index);
    setOrderData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Handle file change for each order item
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    updateOrderItem(index, "file", file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append order fields
    formData.append("user", orderData.user);
    formData.append("company", orderData.company);

    // Append order items
    orderData.items.forEach((item, index) => {
      formData.append(`items[${index}][item_name]`, item.item_name);
      if (item.file) {
        formData.append(`items[${index}][file]`, item.file);
      }
    });

    console.log("📤 Sending FormData:", formData);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/orders/ordersList/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Order Created:", response.data);
    } catch (error) {
      console.error("❌ Order Creation Error:", error.response?.data || error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter une Commande</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Items */}
        {orderData.items.map((orderItem, index) => (
          <OrderItemForm
            key={index}
            index={index}
            orderItem={orderItem}
            updateOrderItem={updateOrderItem}
            removeOrderItem={removeOrderItem}
            handleFileChange={handleFileChange}  // Pass file handler to the component
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
function OrderItemForm({ index, orderItem, updateOrderItem, removeOrderItem, handleFileChange }) {
  return (
    <div className="flex gap-2 items-center">
      {/* Item Name Input */}
      <Input
        placeholder="Item Name"
        value={orderItem.item_name}
        onChange={(e) => updateOrderItem(index, "item_name", e.target.value)}
      />

      {/* File Input */}
      <input 
        type="file" 
        onChange={(e) => handleFileChange(index, e)} 
        className="border p-2 rounded-md"
      />

      {/* Remove Button */}
      <Button type="button" onClick={() => removeOrderItem(index)} className="bg-red-500">
        🗑️
      </Button>
    </div>
  );
}
