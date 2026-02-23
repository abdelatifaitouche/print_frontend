import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, Upload, X, Package, ArrowLeft, CheckCircle, FileText, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AXIOS_CONFIG from "@/config/axiosConfig";
import { getProducts } from "@/Services/ProductsService";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";

function CreateOrderPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState({ items: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [openComboboxIndex, setOpenComboboxIndex] = useState(null);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await getProducts({ all: true });
      const productsList = Array.isArray(response) ? response[0] : response;
      setProducts(productsList || []);
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
      items: [...prev.items, { product_id: "", quantity: 1, file: null, filePreview: null, fileType: null }],
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
    let fileType = "document";
    
    if (file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);
      fileType = "image";
    } else if (file.type === "application/pdf") {
      fileType = "pdf";
    }

    const updatedItems = [...order.items];
    updatedItems[index].file = file;
    updatedItems[index].filePreview = previewUrl;
    updatedItems[index].fileType = fileType;
    setOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeFile = (index) => {
    const updatedItems = [...order.items];
    
    if (updatedItems[index].filePreview) {
      URL.revokeObjectURL(updatedItems[index].filePreview);
    }
    
    updatedItems[index].file = null;
    updatedItems[index].filePreview = null;
    updatedItems[index].fileType = null;
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
      
      // Navigate back after success
      setTimeout(() => {
        navigate("/commandes");
      }, 1500);
      
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

  const getSelectedProduct = (productId) => {
    return products.find((p) => p.id.toString() === productId);
  };

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">Create Order</h1>
            <p className="text-slate-600 mt-1">Add products, quantities, and upload files</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <Package className="text-blue-600" size={16} />
            <span className="text-sm text-blue-900 font-medium">{order.items.length} Item(s)</span>
          </div>
        </div>

        {/* Add Item Button */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <Button 
              onClick={addOrderItem} 
              className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800"
            >
              <PlusCircle size={18} />
              Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Items List */}
        {order.items.length === 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-900 font-semibold text-lg">No items added yet</p>
              <p className="text-slate-600 mt-1">Click "Add Item" to start building your order</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {order.items.map((item, index) => {
              const selectedProduct = getSelectedProduct(item.product_id);
              
              return (
                <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Item Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Package size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Item {index + 1}</h3>
                          {selectedProduct && (
                            <p className="text-sm text-slate-600">{selectedProduct.name}</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Product and Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Product Selection - Combobox */}
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          Product *
                        </Label>
                        <Popover 
                          open={openComboboxIndex === index} 
                          onOpenChange={(open) => setOpenComboboxIndex(open ? index : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openComboboxIndex === index}
                              className="w-full h-11 justify-between border-slate-300"
                              disabled={isLoadingProducts}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Package size={16} className="text-slate-400 flex-shrink-0" />
                                <span className="truncate">
                                  {item.product_id
                                    ? `${selectedProduct?.name} - ${selectedProduct?.base_price} DZD`
                                    : isLoadingProducts ? "Loading..." : "Select product..."}
                                </span>
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search products..." />
                              <CommandList>
                                <CommandEmpty>No product found.</CommandEmpty>
                                <CommandGroup>
                                  {products.map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={`${product.name} ${product.base_price}`}
                                      onSelect={() => {
                                        updateItemData(index, "product_id", product.id.toString());
                                        setOpenComboboxIndex(null);
                                      }}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                          <Package size={14} className="text-slate-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-slate-900 truncate">{product.name}</div>
                                          <div className="text-xs text-slate-500">{product.base_price} DZD</div>
                                        </div>
                                        <Check
                                          className={`ml-auto h-4 w-4 ${
                                            item.product_id === product.id.toString()
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Quantity */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          Quantity *
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItemData(index, "quantity", parseInt(e.target.value) || 1)}
                          className="h-11 border-slate-300"
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Upload File *
                      </Label>
                      
                      {!item.file ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-slate-400 transition-colors bg-slate-50/50">
                          <label className="cursor-pointer flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                              <Upload size={24} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 mb-1">
                              Click to upload or drag and drop
                            </span>
                            <span className="text-xs text-slate-500">
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
                        <div className="border border-slate-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center gap-4">
                            {/* File Preview/Icon */}
                            {item.fileType === "image" && item.filePreview ? (
                              <img
                                src={item.filePreview}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                {item.fileType === "pdf" ? (
                                  <FileText size={24} className="text-red-500" />
                                ) : item.fileType === "image" ? (
                                  <ImageIcon size={24} className="text-blue-500" />
                                ) : (
                                  <Upload size={24} className="text-slate-500" />
                                )}
                              </div>
                            )}
                            
                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {item.file.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500">
                                  {formatFileSize(item.file.size)}
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle size={12} />
                                  Uploaded
                                </span>
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Submit Button */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-slate-600">
                    <p>{order.items.length} item(s) ready to submit</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="flex-1 sm:flex-none border-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Submit Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateOrderPage;