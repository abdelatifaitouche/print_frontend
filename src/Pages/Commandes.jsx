import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Download, Plus, Loader2, RefreshCw, Search, ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getOrders from '@/Services/OrdersService';

function Commandes() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      const data = await getOrders();
      setOrders(data.Orders || []);
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

  const filteredOrders = orders.filter(order =>
    Object.values(order).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = [
    { title: "Total Orders", value: orders.length, change: "+8%", trend: "up" },
    { title: "Pending", value: orders.filter(o => o.status === "pending").length, change: "+3%", trend: "up" },
    { title: "Completed", value: orders.filter(o => o.status === "completed").length, change: "+12%", trend: "up" }
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
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">Order Management</CardTitle>
              <CardDescription className="text-muted-foreground">
                Track and manage all customer orders
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => console.log("Export orders")}
              >
                <Download size={16} />
                Export
              </Button>
              <Button
                onClick={() => navigate('/commandes/creer')}
                className="gap-2"
                variant="default"
              >
                <Plus size={16} />
                New Order
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-none bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{isLoading ? '--' : stat.value}</h3>
                    </div>
                    <Badge variant={stat.trend === "up" ? "secondary" : "destructive"}>
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={fetchOrders}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

          {/* Orders Table */}
          <Card className="overflow-hidden border">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-medium">All Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
                  </p>
                </div>
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[120px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.company.company_name}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>${order.amount}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/Commandes/OrderDetails/${order.id}` , {
                                state : {order}
                              })}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {searchTerm ? "No matching orders found" : "No orders available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default Commandes;