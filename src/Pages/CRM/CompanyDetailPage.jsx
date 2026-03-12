import { getCompanyDetails, deleteCompany, updateCompany } from "@/Services/CompanyService";
import { getOrders } from "@/Services/OrdersService";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  Receipt,
  ShoppingCart,
  CheckCircle,
  Clock,
  Loader2,
  TrendingUp,
  Package,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/Components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AXIOS_CONFIG from "@/config/axiosConfig";
import StatusBadge from "@/Components/StatusBadge";

function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total_items: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sheet State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCompanyDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await getCompanyDetails(id);
      setCompanyData(response);
      setEditForm({
        name: response.name || "",
        email: response.email || "",
        phone: response.phone || "",
        address: response.address || "",
      });
    } catch (error) {
      console.error("Failed to fetch company details:", error);
      toast.error("Failed to load company details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyStats = async (id) => {
    try {
      setIsLoadingStats(true);
      const response = await AXIOS_CONFIG.get(`/company/${id}/stats/`);
      setStatsData(response.data);
    } catch (error) {
      console.error("Failed to fetch company stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchOrders = async (page = 1, status = "") => {
    try {
      setIsLoadingOrders(true);
      const [ordersData, paginationData] = await getOrders({
        page,
        status,
        company_id: id,
      });
      setOrders(ordersData || []);
      setPagination(paginationData || { page: 1, total_pages: 1, total_items: 0 });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails(id);
    fetchCompanyStats(id);
    fetchOrders(1, "");
  }, [id]);

  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCompany(id);
      toast.success("Company deleted successfully");
      navigate("/companies");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete company");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateCompany(id, editForm);
      toast.success("Company updated successfully");
      setIsEditOpen(false);
      fetchCompanyDetails(id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update company");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "created":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "inactive":
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount) => {
    const num = amount || 0;
    
    // For large numbers, use abbreviated format
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M DZD`;
    } else if (num >= 10000) {
      return `${(num / 1000).toFixed(1)}K DZD`;
    }
    
    return `${num.toLocaleString()} DZD`;
  };

  const formatCurrencyFull = (amount) => {
    return `${(amount || 0).toLocaleString()} DZD`;
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setCurrentPage(newPage);
    }
  };

  const LoadingSkeleton = ({ className }) => (
    <div className={`bg-slate-200 rounded animate-pulse ${className}`}></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Companies
          </button>

          <div className="flex gap-2">
            {/* Edit Button */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-slate-300">
                  <Edit2 size={16} />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader className="pb-6 border-b border-slate-200">
                  <SheetTitle className="text-xl font-semibold text-slate-900">Edit Company</SheetTitle>
                </SheetHeader>

                <div className="space-y-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Company Name *
                    </Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      placeholder="Company Name"
                      className="h-11 border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleEditChange("email", e.target.value)}
                      placeholder="company@example.com"
                      className="h-11 border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => handleEditChange("phone", e.target.value)}
                      placeholder="+213 XXX XXX XXX"
                      className="h-11 border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => handleEditChange("address", e.target.value)}
                      placeholder="Company address"
                      className="h-11 border-slate-300"
                    />
                  </div>
                </div>

                <SheetFooter className="border-t border-slate-200 pt-6">
                  <SheetClose asChild>
                    <Button variant="outline" className="border-slate-300">
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button 
                    onClick={handleUpdate} 
                    disabled={isUpdating}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Delete Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this company? This action cannot be undone and will affect all associated orders and data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => document.body.click()}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="ml-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Company"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Info Card */}
          <Card className="border-slate-200 shadow-sm lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-300 flex-shrink-0">
                  {isLoading ? (
                    <LoadingSkeleton className="h-8 w-8 rounded" />
                  ) : (
                    <span className="text-2xl font-bold text-slate-700">
                      {companyData?.name?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {isLoading ? (
                    <>
                      <LoadingSkeleton className="h-6 w-full mb-2" />
                      <LoadingSkeleton className="h-5 w-24" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-xl font-bold text-slate-900 truncate">
                        {companyData?.name || "Company Name"}
                      </h1>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg border mt-2 ${getStatusBadge(
                          companyData?.folder_status
                        )}`}
                      >
                        {companyData?.folder_status || "Unknown"}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0">
                    <Mail size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    {isLoading ? (
                      <LoadingSkeleton className="h-4 w-full" />
                    ) : (
                      <p className="font-medium text-slate-900 break-words text-sm">
                        {companyData?.email || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0">
                    <Phone size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    {isLoading ? (
                      <LoadingSkeleton className="h-4 w-32" />
                    ) : (
                      <p className="font-medium text-slate-900 text-sm">
                        {companyData?.phone || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0">
                    <MapPin size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Address</p>
                    {isLoading ? (
                      <LoadingSkeleton className="h-4 w-full" />
                    ) : (
                      <p className="font-medium text-slate-900 text-sm">
                        {companyData?.address || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0">
                    <Calendar size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Date Joined</p>
                    {isLoading ? (
                      <LoadingSkeleton className="h-4 w-28" />
                    ) : (
                      <p className="font-medium text-slate-900 text-sm">
                        {formatDate(companyData?.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finance & Orders Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Summary */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <DollarSign size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Financial Overview</h2>
                    <p className="text-sm text-slate-600">Revenue and payment status</p>
                  </div>
                </div>

                {isLoadingStats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <LoadingSkeleton className="h-4 w-20" />
                        <LoadingSkeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-900" title={formatCurrencyFull(statsData?.finance?.total || 0)}>
                        {formatCurrency(statsData?.finance?.total || 0)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {statsData?.finance?.total_factures || 0} invoice(s)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Total Paid</p>
                      <p className="text-2xl font-bold text-green-600" title={formatCurrencyFull(statsData?.finance?.total_paid || 0)}>
                        {formatCurrency(statsData?.finance?.total_paid || 0)}
                      </p>
                      <p className="text-xs text-green-600">Collected</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Outstanding</p>
                      <p className="text-2xl font-bold text-red-600" title={formatCurrencyFull(statsData?.finance?.total_remaining || 0)}>
                        {formatCurrency(statsData?.finance?.total_remaining || 0)}
                      </p>
                      <p className="text-xs text-red-600">Pending</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Payment Rate</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {statsData?.finance?.total > 0
                          ? Math.round(
                              (statsData.finance.total_paid / statsData.finance.total) * 100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-blue-600">Completed</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orders Summary */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShoppingCart size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Orders Overview</h2>
                    <p className="text-sm text-slate-600">Order statistics and status</p>
                  </div>
                </div>

                {isLoadingStats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="border-slate-200">
                        <CardContent className="p-4">
                          <LoadingSkeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total Orders */}
                    <Card className="border-slate-200 bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Package size={16} className="text-slate-600" />
                          </div>
                          <TrendingUp size={16} className="text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-600 mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {statsData?.orders?.total_orders || 0}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Pending */}
                    <Card className="border-amber-200 bg-amber-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Clock size={16} className="text-amber-600" />
                          </div>
                        </div>
                        <p className="text-xs text-amber-700 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-amber-900">
                          {statsData?.orders?.pending || 0}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Accepted */}
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CheckCircle size={16} className="text-blue-600" />
                          </div>
                        </div>
                        <p className="text-xs text-blue-700 mb-1">Accepted</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {statsData?.orders?.accepted || 0}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Paid */}
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <Receipt size={16} className="text-green-600" />
                          </div>
                        </div>
                        <p className="text-xs text-green-700 mb-1">Paid</p>
                        <p className="text-2xl font-bold text-green-900">
                          {statsData?.orders?.paid || 0}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start gap-2 border-slate-300"
                    onClick={() => navigate(`/commandes?company=${id}`)}
                  >
                    <ShoppingCart size={16} />
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 border-slate-300"
                    onClick={() => navigate(`/create-order?company=${id}`)}
                  >
                    <Package size={16} />
                    New Order
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 border-slate-300"
                    onClick={() => navigate(`/payments?company=${id}`)}
                  >
                    <Receipt size={16} />
                    View Payments
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 border-slate-300"
                    onClick={() => navigate(`/documents?company=${id}`)}
                  >
                    <Building2 size={16} />
                    Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Orders Table Section */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShoppingCart size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Company Orders</h2>
                    <p className="text-sm text-slate-600">
                      {pagination.total_items > 0 
                        ? `Showing ${pagination.total_items} order(s)`
                        : "No orders yet"}
                    </p>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-500" />
                  <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-[180px] h-10 border-slate-300">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="PROCESSED">Processed</SelectItem>
                      <SelectItem value="PARTIAL_DELIVERED">Partial Delivered</SelectItem>
                      <SelectItem value="DELIVRED">Delivered</SelectItem>
                      <SelectItem value="PARTIAL_PAIED">Partial Paid</SelectItem>
                      <SelectItem value="PAIED">Paid</SelectItem>
                      <SelectItem value="FINISHED">Finished</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Orders Content */}
            {isLoadingOrders ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <LoadingSkeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">No orders found</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {statusFilter 
                        ? `No ${statusFilter.toLowerCase().replace(/_/g, ' ')} orders for this company`
                        : "This company hasn't placed any orders yet. Get started by creating your first order"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700 whitespace-nowrap">
                          Order
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700 whitespace-nowrap">
                          Customer
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700 whitespace-nowrap">
                          Date
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700 whitespace-nowrap">
                          Amount
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700 whitespace-nowrap">
                          Status
                        </th>
                        <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const statusUpper = order.status?.toUpperCase();
                        const statusConfigs = {
                          PENDING: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
                          ACCEPTED: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
                          PROCESSING: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Package },
                          PROCESSED: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Package },
                          PARTIAL_DELIVERED: { color: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: Package },
                          DELIVRED: { color: "bg-teal-50 text-teal-700 border-teal-200", icon: CheckCircle },
                          PARTIAL_PAIED: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: DollarSign },
                          PAIED: { color: "bg-green-50 text-green-700 border-green-200", icon: DollarSign },
                          FINISHED: { color: "bg-slate-50 text-slate-700 border-slate-200", icon: CheckCircle },
                          CANCELLED: { color: "bg-gray-50 text-gray-700 border-gray-300", icon: Clock },
                          REJECTED: { color: "bg-red-50 text-red-700 border-red-200", icon: Clock },
                        };
                        
                        const statusConfig = statusConfigs[statusUpper] || { 
                          color: "bg-gray-50 text-gray-700 border-gray-200", 
                          icon: Package 
                        };
                        const StatusIcon = statusConfig.icon;

                        return (
                          <tr
                            key={order.id}
                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/commandes/${order.id}`)}
                          >
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="font-medium text-slate-900">{order.order_number}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{order.created_by || "—"}</div>
                            </td>
                            <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                              {order.user?.username || "—"}
                            </td>
                            <td className="py-4 px-6 text-slate-600 whitespace-nowrap text-sm">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div 
                                className="font-semibold text-slate-900"
                                title={formatCurrencyFull(order.order_price)}
                              >
                                {formatCurrency(order.order_price)}
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <Badge 
                                variant="outline" 
                                className={`${statusConfig.color} border font-medium gap-1.5 text-xs`}
                              >
                                <StatusIcon size={12} strokeWidth={2} />
                                {order.status?.replace(/_/g, ' ')}
                              </Badge>
                            </td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/commandes/${order.id}`);
                                }}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="border-t border-slate-200 px-4 sm:px-6 py-4 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-slate-600 text-center sm:text-left">
                        Showing <span className="font-semibold text-slate-900">{((pagination.page - 1) * 10) + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(pagination.page * 10, pagination.total_items)}</span> of <span className="font-semibold text-slate-900">{pagination.total_items}</span> orders
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="border-slate-300"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-slate-600">
                          Page <span className="font-semibold text-slate-900">{pagination.page}</span> of {pagination.total_pages}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.total_pages}
                          className="border-slate-300"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
