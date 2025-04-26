import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Activity, Users, CheckCircle, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getOrdersStats } from "@/Services/OrdersService";
import React, { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";

function Home() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getOrdersStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await getOrdersStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrdersStatistics();
  }, []);

  const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <div className={`text-xs flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {change}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          {isLoading ? "Loading your business insights..." : "Key metrics and performance indicators"}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Orders" 
          value={stats?.total_orders} 
          change="+12.5%" 
          trend="up" 
          icon={ShoppingCart} 
        />
        <MetricCard 
          title="Recent Orders" 
          value={stats?.new_orders_last_7_days} 
          change="+8.2%" 
          trend="up" 
          icon={Activity} 
        />
        <MetricCard 
          title="Completed" 
          value={stats?.orders_by_status?.[0]?.count} 
          change="+4.3%" 
          trend="up" 
          icon={CheckCircle} 
        />
        <MetricCard 
          title="Active Clients" 
          value={stats?.total_clients} 
          change="+5.1%" 
          trend="up" 
          icon={Users} 
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Analytics Chart */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
            <CardDescription>Last 30 days order activity</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full rounded-md" />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <Activity className="h-8 w-8 mr-2" />
                Analytics chart would display here
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest completed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : stats?.recent_order?.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_order.map((order, index) => (
                  <div key={index} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{order.order_name}</p>
                      <p className="text-sm text-muted-foreground">{order.company?.company_name}</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mb-2" />
                <p>No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Order Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full rounded-md" />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Pie chart would display here
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Client Activity</CardTitle>
            <CardDescription>Recent client interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full rounded-md" />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Client metrics would display here
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full rounded-md" />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Performance metrics would display here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;