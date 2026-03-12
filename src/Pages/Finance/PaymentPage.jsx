import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Loader2,
  Package,
  Receipt,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
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
import { toast } from "sonner";
import { getOrders } from "@/Services/OrdersService";
import { getOrderDocuments } from "@/Services/FinanceService";
import AXIOS_CONFIG from "@/config/axiosConfig";

function PaymentPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [factures, setFactures] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [orderComboboxOpen, setOrderComboboxOpen] = useState(false);
  const [factureComboboxOpen, setFactureComboboxOpen] = useState(false);

  const [formData, setFormData] = useState({
    facture_id: "",
    amount: "",
    payment_method: "",
    reference: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { value: "CCP", label: "CCP", icon: Receipt, color: "text-blue-600" },
    { value: "BADR", label: "BADR Bank", icon: Building2, color: "text-green-600" },
    { value: "CASH", label: "Cash", icon: DollarSign, color: "text-emerald-600" },
    { value: "CHECK", label: "Check", icon: Receipt, color: "text-purple-600" },
    { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2, color: "text-indigo-600" },
  ];

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch factures when order is selected
  useEffect(() => {
    if (selectedOrder) {
      fetchFactures(selectedOrder.id);
    } else {
      setFactures([]);
      setSelectedFacture(null);
      setFormData(prev => ({ ...prev, facture_id: "" }));
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getOrders({ all: true });
      const ordersList = Array.isArray(response) ? response[0] : response;
      setOrders(ordersList || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFactures = async (orderId) => {
    try {
      const [documents] = await getOrderDocuments(orderId);
      const facturesList = documents.filter(doc => doc.document_type === "FACTURE");
      setFactures(facturesList || []);
    } catch (error) {
      console.error("Failed to fetch factures:", error);
      toast.error("Failed to load invoices");
      setFactures([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.facture_id) {
      newErrors.facture_id = "Please select an invoice";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.payment_method) {
      newErrors.payment_method = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
      };

      await AXIOS_CONFIG.post(`/payments/${formData.facture_id}/payment/create/`, payload);

      toast.success("Payment recorded successfully");

      // Reset form
      setFormData({
        facture_id: "",
        amount: "",
        payment_method: "",
        reference: "",
        notes: "",
      });
      setSelectedOrder(null);
      setSelectedFacture(null);
      setErrors({});

      // Navigate back or to payments list
      setTimeout(() => {
        navigate("/payments"); // Adjust route as needed
      }, 1500);

    } catch (error) {
      console.error("Failed to record payment:", error);
      const errorMessage = error.response?.data?.detail || "Failed to record payment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">Record Payment</h1>
            <p className="text-slate-600 mt-1">Add a new payment for an invoice</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="text-green-600" size={16} />
            <span className="text-sm text-green-900 font-medium">New Payment</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Invoice Selection */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Receipt size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Invoice Selection</h2>
                    <p className="text-sm text-slate-600">Select the order and invoice to pay</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Order *
                    </Label>
                    <Popover open={orderComboboxOpen} onOpenChange={setOrderComboboxOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={`w-full h-11 justify-between ${errors.facture_id ? 'border-red-300' : 'border-slate-300'}`}
                          disabled={isLoading}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Package size={16} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">
                              {selectedOrder
                                ? `${selectedOrder.order_number}`
                                : isLoading ? "Loading..." : "Select order..."}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search orders..." />
                          <CommandList>
                            <CommandEmpty>No order found.</CommandEmpty>
                            <CommandGroup>
                              {orders.map((order) => (
                                <CommandItem
                                  key={order.id}
                                  value={`${order.order_number} ${order.company?.name || ''}`}
                                  onSelect={() => {
                                    setSelectedOrder(order);
                                    setOrderComboboxOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                      <Package size={14} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-slate-900 truncate">{order.order_number}</div>
                                      <div className="text-xs text-slate-500">{order.company?.name || "—"}</div>
                                    </div>
                                    <Check
                                      className={`ml-auto h-4 w-4 ${
                                        selectedOrder?.id === order.id ? "opacity-100" : "opacity-0"
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

                  {/* Facture Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Invoice (Facture) *
                    </Label>
                    <Popover 
                      open={factureComboboxOpen} 
                      onOpenChange={setFactureComboboxOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={`w-full h-11 justify-between ${errors.facture_id ? 'border-red-300' : 'border-slate-300'}`}
                          disabled={!selectedOrder || factures.length === 0}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Receipt size={16} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">
                              {selectedFacture
                                ? `${selectedFacture.document_number} - ${selectedFacture.total_remaining} DZD`
                                : factures.length === 0 
                                ? "No invoices" 
                                : "Select invoice..."}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search invoices..." />
                          <CommandList>
                            <CommandEmpty>No invoice found.</CommandEmpty>
                            <CommandGroup>
                              {factures.map((facture) => (
                                <CommandItem
                                  key={facture.id}
                                  value={`${facture.document_number}`}
                                  onSelect={() => {
                                    setSelectedFacture(facture);
                                    handleSelectChange("facture_id", facture.id);
                                    setFactureComboboxOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                      <Receipt size={14} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-slate-900 truncate">{facture.document_number}</div>
                                      <div className="text-xs text-slate-500">
                                        Remaining: {facture.total_remaining?.toLocaleString()} DZD
                                      </div>
                                    </div>
                                    <Check
                                      className={`ml-auto h-4 w-4 ${
                                        selectedFacture?.id === facture.id ? "opacity-100" : "opacity-0"
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
                    {errors.facture_id && (
                      <p className="text-xs text-red-600">{errors.facture_id}</p>
                    )}
                  </div>
                </div>

                {/* Selected Facture Info */}
                {selectedFacture && (
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Total</p>
                        <p className="font-semibold text-slate-900">{selectedFacture.total?.toLocaleString()} DZD</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Paid</p>
                        <p className="font-semibold text-green-600">{selectedFacture.total_paid?.toLocaleString()} DZD</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Remaining</p>
                        <p className="font-semibold text-red-600">{selectedFacture.total_remaining?.toLocaleString()} DZD</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Status</p>
                        <Badge 
                          variant="outline" 
                          className={selectedFacture.status === "PAID" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-amber-50 text-amber-700 border-amber-200"}
                        >
                          {selectedFacture.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <DollarSign size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
                    <p className="text-sm text-slate-600">Enter payment information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                      Amount (DZD) *
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.0001"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`h-11 ${errors.amount ? 'border-red-300' : 'border-slate-300'}`}
                    />
                    {errors.amount && (
                      <p className="text-xs text-red-600">{errors.amount}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Payment Method *
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.slice(0, 2).map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => handleSelectChange("payment_method", method.value)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.payment_method === method.value
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Icon size={18} />
                              <span className="text-xs font-medium">{method.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {paymentMethods.slice(2).map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => handleSelectChange("payment_method", method.value)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.payment_method === method.value
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Icon size={18} />
                              <span className="text-xs font-medium">{method.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.payment_method && (
                      <p className="text-xs text-red-600">{errors.payment_method}</p>
                    )}
                  </div>

                  {/* Reference */}
                  <div className="space-y-2">
                    <Label htmlFor="reference" className="text-sm font-medium text-slate-700">
                      Reference Number
                    </Label>
                    <Input
                      id="reference"
                      name="reference"
                      type="text"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder="e.g., TRX-20240315-1234"
                      className="h-11 border-slate-300"
                    />
                    <p className="text-xs text-slate-500">Optional transaction reference</p>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                      Notes
                    </Label>
                    <Input
                      id="notes"
                      name="notes"
                      type="text"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g., Partial payment"
                      className="h-11 border-slate-300"
                    />
                    <p className="text-xs text-slate-500">Optional payment notes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-slate-600">
                    <p>All fields marked with * are required</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="flex-1 sm:flex-none border-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Recording...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Record Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;