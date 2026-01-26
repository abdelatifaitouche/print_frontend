import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Download, Plus, RefreshCw, Search } from "lucide-react";
import getOrders from "@/Services/OrdersService";

function Commandes() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({ status: "", startDate: "", endDate: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch = Object.values(order).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = filters.status ? order.status.toLowerCase() === filters.status.toLowerCase() : true;
    const orderDate = new Date(order.created_at);
    const matchesStart = filters.startDate ? orderDate >= new Date(filters.startDate) : true;
    const matchesEnd = filters.endDate ? orderDate <= new Date(filters.endDate) : true;

    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = [
    { title: "Total Orders", value: orders.length },
    { title: "Pending", value: orders.filter(o => o.status === "pending").length },
    { title: "Completed", value: orders.filter(o => o.status === "completed").length },
  ];

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "default";
      case "processing": return "secondary";
      case "pending": return "outline";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">Order Management</CardTitle>
            <CardDescription className="text-muted-foreground">Track and manage all customer orders</CardDescription>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => console.log("Export orders")}>
              <Download size={16} /> Export
            </Button>
            <Button variant="default" className="gap-2" onClick={() => navigate('/commandes/creer')}>
              <Plus size={16} /> New Order
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{isLoading ? '--' : stat.value}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="border rounded-lg px-3 py-2 text-sm w-full sm:w-48"
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="date"
                className="border rounded-lg px-3 py-2 text-sm w-full sm:w-36"
                value={filters.startDate}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              />
              <input
                type="date"
                className="border rounded-lg px-3 py-2 text-sm w-full sm:w-36"
                value={filters.endDate}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <Button variant="ghost" size="sm" className="gap-2" onClick={fetchOrders} disabled={isRefreshing}>
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> Refresh
            </Button>
          </div>

          {/* Orders Table */}
          <Card className="overflow-x-auto border rounded-lg">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : (
              <>
                <Table className="min-w-full divide-y divide-gray-200">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left">Order ID</TableHead>
                      <TableHead className="px-4 py-2 text-left">Customer</TableHead>
                      <TableHead className="px-4 py-2 text-left">Date</TableHead>
                      <TableHead className="px-4 py-2 text-left">Amount</TableHead>
                      <TableHead className="px-4 py-2 text-left">Status</TableHead>
                      <TableHead className="px-4 py-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.length > 0 ? paginatedOrders.map(order => (
                      <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="px-4 py-2 font-medium">{order.order_number}</TableCell>
                        <TableCell className="px-4 py-2">{order.created_by}</TableCell>
                        <TableCell className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="px-4 py-2">${order.order_price}</TableCell>
                        <TableCell className="px-4 py-2">
                          <Badge variant={getStatusVariant(order.status)} className="capitalize">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(`/commandes/OrderDetails/${order.id}`, { state: { order } })}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="px-4 py-12 text-center text-gray-500">
                          {searchTerm ? "No matching orders found" : "No orders available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </Button>
                    <span className="text-sm">{currentPage} / {totalPages}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default Commandes;
