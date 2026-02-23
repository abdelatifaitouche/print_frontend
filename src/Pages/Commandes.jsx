import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { Download, Plus, RefreshCw, Search, Package, CheckCircle, Clock, XCircle, Truck, CreditCard, DollarSign, PackageCheck, ArrowRight } from "lucide-react";
import { getOrders } from "@/Services/OrdersService";

function Commandes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [companies, setCompanies] = useState([]);
  
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total_items: 0
  });

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "all";
  const currentCompanyId = searchParams.get("company_id") || "";

  const fetchOrders = async (page = currentPage, status = currentStatus, companyId = currentCompanyId) => {
    setIsRefreshing(true);
    try {
      const params = { page };
      if (status && status !== "all") {
        params.status = status;
      }
      if (companyId) {
        params.company_id = companyId;
      }

      const response = await getOrders(params);
      setOrders(response[0] || []);
      setPagination(response[1] || { page: 1, total_pages: 1, total_items: 0 });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
      setPagination({ page: 1, total_pages: 1, total_items: 0 });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, currentStatus, currentCompanyId);
  }, [currentPage, currentStatus, currentCompanyId]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const uniqueCompanies = [...new Map(
          orders
            .filter(o => o.company?.id)
            .map(o => [o.company.id, { id: o.company.id, name: o.company.name }])
        ).values()];
        setCompanies(uniqueCompanies);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };
    
    if (orders.length > 0) {
      fetchCompanies();
    }
  }, [orders]);

  const handleTabChange = (newStatus) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", newStatus);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleCompanyChange = (companyId) => {
    const params = new URLSearchParams(searchParams);
    if (companyId) {
      params.set("company_id", companyId);
    } else {
      params.delete("company_id");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  const getStatusConfig = (status) => {
    const statusUpper = status?.toUpperCase();
    
    const configs = {
      PENDING: { 
        color: "bg-amber-50 text-amber-700 border-amber-200", 
        icon: Clock,
        badge: "secondary"
      },
      ACCEPTED: { 
        color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
        icon: CheckCircle,
        badge: "success"
      },
      PROCESSING: { 
        color: "bg-blue-50 text-blue-700 border-blue-200", 
        icon: Package,
        badge: "info"
      },
      PROCESSED: { 
        color: "bg-indigo-50 text-indigo-700 border-indigo-200", 
        icon: PackageCheck,
        badge: "info"
      },
      PARTIAL_DELIVERED: { 
        color: "bg-cyan-50 text-cyan-700 border-cyan-200", 
        icon: Truck,
        badge: "info"
      },
      DELIVRED: { 
        color: "bg-teal-50 text-teal-700 border-teal-200", 
        icon: Truck,
        badge: "success"
      },
      PARTIAL_PAIED: { 
        color: "bg-purple-50 text-purple-700 border-purple-200", 
        icon: DollarSign,
        badge: "warning"
      },
      PAIED: { 
        color: "bg-green-50 text-green-700 border-green-200", 
        icon: CreditCard,
        badge: "success"
      },
      FINISHED: { 
        color: "bg-slate-50 text-slate-700 border-slate-200", 
        icon: CheckCircle,
        badge: "default"
      },
      CANCELLED: { 
        color: "bg-gray-50 text-gray-700 border-gray-300", 
        icon: XCircle,
        badge: "secondary"
      },
      REJECTED: { 
        color: "bg-red-50 text-red-700 border-red-200", 
        icon: XCircle,
        badge: "destructive"
      },
    };

    return configs[statusUpper] || { 
      color: "bg-gray-50 text-gray-700 border-gray-200", 
      icon: Package,
      badge: "default"
    };
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    return Object.values(order).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Individual status counts
  const statusCounts = {
    PENDING: orders.filter(o => o.status?.toUpperCase() === "PENDING").length,
    ACCEPTED: orders.filter(o => o.status?.toUpperCase() === "ACCEPTED").length,
    PROCESSING: orders.filter(o => o.status?.toUpperCase() === "PROCESSING").length,
    PROCESSED: orders.filter(o => o.status?.toUpperCase() === "PROCESSED").length,
    PARTIAL_DELIVERED: orders.filter(o => o.status?.toUpperCase() === "PARTIAL_DELIVERED").length,
    DELIVRED: orders.filter(o => o.status?.toUpperCase() === "DELIVRED").length,
    PARTIAL_PAIED: orders.filter(o => o.status?.toUpperCase() === "PARTIAL_PAIED").length,
    PAIED: orders.filter(o => o.status?.toUpperCase() === "PAIED").length,
    FINISHED: orders.filter(o => o.status?.toUpperCase() === "FINISHED").length,
    CANCELLED: orders.filter(o => o.status?.toUpperCase() === "CANCELLED").length,
    REJECTED: orders.filter(o => o.status?.toUpperCase() === "REJECTED").length,
  };

  const stats = [
    { 
      title: "Total Orders", 
      value: pagination.total_items,
      icon: Package,
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    },
    { 
      title: "Pending", 
      value: statusCounts.PENDING,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    { 
      title: "In Progress", 
      value: statusCounts.PROCESSING + statusCounts.PROCESSED,
      icon: ArrowRight,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Completed", 
      value: statusCounts.FINISHED,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
  ];

  const renderOrdersTable = () => (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50">
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Order</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Company</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Date</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Amount</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? filteredOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <TableRow 
                  key={order.id} 
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/commandes/OrderDetails/${order.id}`, { state: { order } })}
                >
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium text-slate-900">{order.order_number}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{order.created_by || "—"}</div>
                  </TableCell>
                  <TableCell className="text-slate-600 whitespace-nowrap">{order.company?.name || "—"}</TableCell>
                  <TableCell className="text-slate-600 whitespace-nowrap text-sm">
                    {new Date(order.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{order.order_price?.toLocaleString()} DZD</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="outline" className={`${statusConfig.color} border font-medium gap-1.5 text-xs`}>
                      <StatusIcon size={12} strokeWidth={2} />
                      {order.status?.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/commandes/OrderDetails/${order.id}`, { state: { order } });
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-medium">No orders found</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {searchTerm ? "Try adjusting your search" : "Get started by creating your first order"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-600 mt-1">Manage your print orders and track progress</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-slate-300 justify-center" onClick={() => console.log("Export orders")}>
              <Download size={16} /> Export
            </Button>
            <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800 justify-center" onClick={() => navigate('/commandes/creer')}>
              <Plus size={16} /> New Order
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1 text-slate-900">
                        {isLoading ? (
                          <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
                        ) : (
                          stat.value
                        )}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Status Tabs */}
        <Tabs value={currentStatus} onValueChange={handleTabChange} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="overflow-x-auto -mx-5 px-5">
                <TabsList className="bg-slate-100 p-1 h-auto inline-flex w-auto">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="PENDING" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="ACCEPTED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Accepted
                  </TabsTrigger>
                  <TabsTrigger value="PROCESSING" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Processing
                  </TabsTrigger>
                  <TabsTrigger value="PROCESSED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Processed
                  </TabsTrigger>
                  <TabsTrigger value="PARTIAL_DELIVERED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Partial Delivered
                  </TabsTrigger>
                  <TabsTrigger value="DELIVRED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Delivered
                  </TabsTrigger>
                  <TabsTrigger value="PARTIAL_PAIED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Partial Paid
                  </TabsTrigger>
                  <TabsTrigger value="PAIED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Paid
                  </TabsTrigger>
                  <TabsTrigger value="FINISHED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Finished
                  </TabsTrigger>
                  <TabsTrigger value="CANCELLED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Cancelled
                  </TabsTrigger>
                  <TabsTrigger value="REJECTED" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">
                    Rejected
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by order number, company, or customer..."
                    className="pl-10 border-slate-300 h-10 focus:ring-slate-400"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 h-10 w-full sm:w-56"
                  value={currentCompanyId}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                >
                  <option value="">All Companies</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 h-10 border-slate-300" 
                  onClick={() => fetchOrders(currentPage, currentStatus, currentCompanyId)} 
                  disabled={isRefreshing}
                >
                  <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> 
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <TabsContent value={currentStatus} className="mt-0">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-8 space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                renderOrdersTable()
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Commandes;