import axios from "axios";
import React, { useState } from "react";
import { PlusCircle, Upload, Trash2, X } from "lucide-react";

function CreateOrderPage() {
  const [order, setOrder] = useState({ items: [], user: 1, company: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOrderItem = () => {
    setOrder((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: "", file: null }],
    }));
  };

  const updateItemData = (index, field, value) => {
    const updatedItem = [...order.items];
    updatedItem[index][field] = value;
    setOrder((prev) => ({ ...prev, items: updatedItem }));
  };

  const removeOrderItem = (indexToRemove) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("user", order.user);
    formData.append("company", order.company);
    
    order.items.forEach((item, index) => {
      formData.append(`items[${index}][item_name]`, item.item_name);
      formData.append(`items[${index}][file]`, item.file);
    });

    axios
      .post("http://127.0.0.1:8000/api/v1/orders/ordersList/", formData, {
        withCredentials : true , 
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response);
        setIsSubmitting(false);
      })
      .catch((errors) => {
        console.error(errors);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-800 mb-2">Create Order</h1>
          <p className="text-zinc-500">Add items to your order and upload relevant files</p>
        </div>

        {/* Add Item Button */}
        <button
          type="button"
          onClick={addOrderItem}
          className="mb-8 px-5 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center gap-2 font-medium"
        >
          <PlusCircle size={18} />
          <span>Add Item</span>
        </button>

        {/* Empty State */}
        {order.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-zinc-200">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <PlusCircle size={24} className="text-zinc-400" />
            </div>
            <p className="text-zinc-800 font-medium">No items added yet</p>
            <p className="text-zinc-500 text-sm mt-1">Click "Add Item" to get started</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <OrderItemForm
                  key={index}
                  item={item}
                  index={index}
                  updateItemData={updateItemData}
                  removeOrderItem={removeOrderItem}
                />
              ))}
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting || order.items.length === 0}
                className="w-full sm:w-auto py-3 px-8 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Order"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function OrderItemForm({ item, index, updateItemData, removeOrderItem }) {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      updateItemData(index, "file", file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      updateItemData(index, "file", file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-zinc-500">Item {index + 1}</span>
        <button 
          type="button" 
          onClick={() => removeOrderItem(index)}
          className="text-zinc-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Item Name</label>
        <input
          type="text"
          placeholder="Enter item name"
          value={item.item_name}
          onChange={(e) => updateItemData(index, "item_name", e.target.value)}
          className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Upload File</label>
        <div 
          className={`relative ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-zinc-300 bg-white'} border rounded-lg transition-all`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={`file-${index}`}
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor={`file-${index}`}
            className="flex items-center justify-center w-full px-4 py-3 cursor-pointer transition-all text-zinc-500"
          >
            {fileName ? (
              <div className="flex w-full items-center justify-between">
                <span className="text-zinc-800 truncate">{fileName}</span>
                <button 
                  type="button"
                  className="p-1 hover:bg-zinc-100 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setFileName("");
                    updateItemData(index, "file", null);
                  }}
                >
                  <X size={16} className="text-zinc-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Upload size={18} className="text-teal-500 mr-2" />
                <span>Choose or drop a file</span>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;