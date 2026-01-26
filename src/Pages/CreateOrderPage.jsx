import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import AXIOS_CONFIG from "@/config/axiosConfig";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";

function CreateOrderPage() {
  const [order, setOrder] = useState({ items: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { data } = await AXIOS_CONFIG.get("/products/", { withCredentials: true });
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addOrderItem = () => {
    setOrder((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, file: null, filePreview: null }],
    }));
  };

  const updateItemData = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleFileChange = (index, file) => {
    if (!file) return;

    const maxSize = 1 * 1024 * 1024 * 1024; // 1GB
    if (file.size > maxSize) {
      toast.error("File size must be less than 1GB");
      return;
    }

    let previewUrl = null;
    if (file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);
    }

    const updatedItems = [...order.items];
    updatedItems[index].file = file;
    updatedItems[index].filePreview = previewUrl;
    setOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeFile = (index) => {
    const updatedItems = [...order.items];
    
    if (updatedItems[index].filePreview) {
      URL.revokeObjectURL(updatedItems[index].filePreview);
    }
    
    updatedItems[index].file = null;
    updatedItems[index].filePreview = null;
    setOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeOrderItem = (indexToRemove) => {
    if (order.items[indexToRemove].filePreview) {
      URL.revokeObjectURL(order.items[indexToRemove].filePreview);
    }

    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (order.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const hasInvalidItem = order.items.some(
      (item) => !item.product_id || !item.quantity || !item.file
    );

    if (hasInvalidItem) {
      toast.error("Please fill in all fields and upload files for each item");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      const itemsData = order.items.map((item) => ({
        product_id: item.product_id,
        quantity: parseInt(item.quantity),
      }));

      formData.append("items_data", JSON.stringify(itemsData));

      order.items.forEach((item) => {
        if (item.file) {
          formData.append("files", item.file);
        }
      });

      await AXIOS_CONFIG.post("/orders/", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Order created successfully!");
      
      order.items.forEach((item) => {
        if (item.filePreview) {
          URL.revokeObjectURL(item.filePreview);
        }
      });
      
      setOrder({ items: [] });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.detail || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      order.items.forEach((item) => {
        if (item.filePreview) {
          URL.revokeObjectURL(item.filePreview);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 mb-1">Create Order</h1>
          <p className="text-zinc-500">Add products, set quantities, and upload files</p>
        </div>

        <Button onClick={addOrderItem} className="mb-6 gap-2 flex items-center" variant="default">
          <PlusCircle size={18} />
          Add Item
        </Button>

        {order.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-zinc-200">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <PlusCircle size={24} className="text-zinc-400" />
            </div>
            <p className="text-zinc-800 font-medium">No items added yet</p>
            <p className="text-zinc-500 text-sm mt-1">Click "Add Item" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <Card key={index} className="p-4 border border-zinc-200 rounded-lg hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-zinc-600">Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeOrderItem(index)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Product <span className="text-red-500">*</span>
                    </label>
                    {isLoadingProducts ? (
                      <Input type="text" placeholder="Loading products..." disabled />
                    ) : (
                      <select
                        value={item.product_id}
                        onChange={(e) => updateItemData(index, "product_id", e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ${p.base_price}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItemData(index, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Upload File <span className="text-red-500">*</span>
                  </label>
                  
                  {!item.file ? (
                    <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 hover:border-teal-500 transition-colors">
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload size={32} className="text-zinc-400 mb-2" />
                        <span className="text-sm text-zinc-600 mb-1">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-zinc-400">
                          PDF, images, or any file (max 1GB)
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange(index, file);
                          }}
                          accept="*/*"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="border border-zinc-300 rounded-lg p-4 bg-zinc-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.filePreview ? (
                            <img
                              src={item.filePreview}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-zinc-200 rounded flex items-center justify-center">
                              <Upload size={20} className="text-zinc-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-800 truncate">
                              {item.file.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {item.file.size >= 1024 * 1024 
                                ? `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`
                                : `${(item.file.size / 1024).toFixed(2)} KB`}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto py-3 px-6 mt-4 flex items-center justify-center gap-2"
              variant="default"
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateOrderPage;