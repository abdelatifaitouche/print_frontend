import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { 
  Activity, 
  ShoppingCart, 
  ArrowUpRight, 
  CheckCircle, 
  Clock,
  Receipt,
  DollarSign,
  TrendingUp,
  Package,
  CreditCard,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { get_order_analytics } from "@/Services/AnalyticsService";
import { toast } from "sonner";

function Home() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getOrdersStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await get_order_analytics();
      setStats(response);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrdersStatistics();
  }, []);

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-slate-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            {isLoading ? (
              <Skeleton className="h-9 w-24 rounded-md" />
            ) : (
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                {value ?? "—"}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Calculate percentages for invoice status
  const totalInvoices = stats?.facture_stats 
    ? Object.values(stats.facture_stats).reduce((sum, val) => sum + val, 0)
    : 0;

  const getInvoicePercentage = (value) => {
    if (!totalInvoices) return 0;
    return Math.round((value / totalInvoices) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-600 text-base">
            {isLoading
              ? "Loading your business insights..."
              : "Overview of your business performance and key metrics"}
          </p>
        </div>

        {/* Order Statistics - 4 Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Total Orders" 
            value={stats?.order_stats?.total_orders ?? "—"} 
            subtitle="All time orders"
            icon={ShoppingCart} 
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <MetricCard 
            title="Recent Orders" 
            value={stats?.order_stats?.recent_created ?? "—"} 
            subtitle="Created recently"
            icon={Clock} 
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <MetricCard 
            title="Completed Orders" 
            value={stats?.order_stats?.total_finished ?? "—"} 
            subtitle="Successfully finished"
            icon={CheckCircle} 
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <MetricCard 
            title="Accepted Orders" 
            value={stats?.order_stats?.total_accepted ?? "—"} 
            subtitle="Approved & processing"
            icon={Package} 
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Order Status Distribution */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">Order Overview</CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Distribution of order statuses
                  </CardDescription>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Activity size={20} className="text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Total Orders Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-slate-700">Total Orders</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {stats?.order_stats?.total_orders || 0}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Accepted Orders Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                        <span className="font-medium text-slate-700">Accepted</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {stats?.order_stats?.total_accepted || 0}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats?.order_stats?.total_orders 
                            ? Math.round((stats.order_stats.total_accepted / stats.order_stats.total_orders) * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">
                      {stats?.order_stats?.total_orders 
                        ? Math.round((stats.order_stats.total_accepted / stats.order_stats.total_orders) * 100) 
                        : 0}% of total
                    </p>
                  </div>

                  {/* Recent Orders Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="font-medium text-slate-700">Recent</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {stats?.order_stats?.recent_created || 0}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats?.order_stats?.total_orders 
                            ? Math.round((stats.order_stats.recent_created / stats.order_stats.total_orders) * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">
                      {stats?.order_stats?.total_orders 
                        ? Math.round((stats.order_stats.recent_created / stats.order_stats.total_orders) * 100) 
                        : 0}% of total
                    </p>
                  </div>

                  {/* Finished Orders Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="font-medium text-slate-700">Completed</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {stats?.order_stats?.total_finished || 0}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats?.order_stats?.total_orders 
                            ? Math.round((stats.order_stats.total_finished / stats.order_stats.total_orders) * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">
                      {stats?.order_stats?.total_orders 
                        ? Math.round((stats.order_stats.total_finished / stats.order_stats.total_orders) * 100) 
                        : 0}% of total
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Status Distribution */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">Invoice Status</CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Payment status breakdown
                  </CardDescription>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Receipt size={20} className="text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Paid Invoices */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <CheckCircle size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">Paid</p>
                          <p className="text-xs text-green-700">Fully settled</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-900">
                          {stats?.facture_stats?.PAID || 0}
                        </p>
                        <p className="text-xs text-green-700">
                          {getInvoicePercentage(stats?.facture_stats?.PAID || 0)}%
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${getInvoicePercentage(stats?.facture_stats?.PAID || 0)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Partial Paid Invoices */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <CreditCard size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">Partial Paid</p>
                          <p className="text-xs text-blue-700">Partially settled</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-900">
                          {stats?.facture_stats?.PARTIAL_PAID || 0}
                        </p>
                        <p className="text-xs text-blue-700">
                          {getInvoicePercentage(stats?.facture_stats?.PARTIAL_PAID || 0)}%
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${getInvoicePercentage(stats?.facture_stats?.PARTIAL_PAID || 0)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pending Payment Invoices */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Clock size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-amber-900">Pending Payment</p>
                          <p className="text-xs text-amber-700">Awaiting payment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-900">
                          {stats?.facture_stats?.PENDING_PAYMENT || 0}
                        </p>
                        <p className="text-xs text-amber-700">
                          {getInvoicePercentage(stats?.facture_stats?.PENDING_PAYMENT || 0)}%
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${getInvoicePercentage(stats?.facture_stats?.PENDING_PAYMENT || 0)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Total Invoices</span>
                      <span className="text-lg font-bold text-slate-900">{totalInvoices}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Completion Rate */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                  <p className="text-xs text-slate-500 mt-1">Orders finished vs total</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {stats?.order_stats?.total_orders 
                      ? Math.round((stats.order_stats.total_finished / stats.order_stats.total_orders) * 100) 
                      : 0}%
                  </p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats?.order_stats?.total_orders 
                          ? Math.round((stats.order_stats.total_finished / stats.order_stats.total_orders) * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Rate */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Payment Rate</p>
                  <p className="text-xs text-slate-500 mt-1">Invoices paid vs total</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <DollarSign size={20} className="text-emerald-600" />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {getInvoicePercentage(stats?.facture_stats?.PAID || 0)}%
                  </p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${getInvoicePercentage(stats?.facture_stats?.PAID || 0)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acceptance Rate */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Acceptance Rate</p>
                  <p className="text-xs text-slate-500 mt-1">Orders accepted vs total</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <CheckCircle size={20} className="text-purple-600" />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {stats?.order_stats?.total_orders 
                      ? Math.round((stats.order_stats.total_accepted / stats.order_stats.total_orders) * 100) 
                      : 0}%
                  </p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats?.order_stats?.total_orders 
                          ? Math.round((stats.order_stats.total_accepted / stats.order_stats.total_orders) * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;