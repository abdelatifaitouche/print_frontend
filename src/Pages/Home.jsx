import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Activity, Users, CheckCircle, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getOrdersStats } from "@/Services/OrdersService";
import React, { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";

function Home() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Uncomment when ready
  /*
  const getOrdersStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await getOrdersStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      toast.error("Impossible de charger les statistiques");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrdersStatistics();
  }, []);
  */

  const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200/70 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {value ?? "—"}
            </div>
            {change && (
              <div className={`mt-2 text-xs flex items-center gap-1 font-medium ${
                trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {change}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-8 md:space-y-10">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Tableau de bord
        </h1>
        <p className="text-slate-600 text-base md:text-lg">
          {isLoading
            ? "Chargement des insights de votre activité..."
            : "Vue d'ensemble des performances et indicateurs clés"}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total des commandes" 
          value={stats?.total_orders ?? "—"} 
          change="+12.5%" 
          trend="up" 
          icon={ShoppingCart} 
        />
        <MetricCard 
          title="Commandes récentes" 
          value={stats?.new_orders_last_7_days ?? "—"} 
          change="+8.2%" 
          trend="up" 
          icon={Activity} 
        />
        <MetricCard 
          title="Commandes terminées" 
          value={stats?.orders_by_status?.[0]?.count ?? "—"} 
          change="+4.3%" 
          trend="up" 
          icon={CheckCircle} 
        />
        <MetricCard 
          title="Clients actifs" 
          value={stats?.total_clients ?? "—"} 
          change="+5.1%" 
          trend="up" 
          icon={Users} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Order Trends Chart */}
        <Card className="md:col-span-4 border-slate-200/70 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Tendances des commandes</CardTitle>
            <CardDescription className="text-slate-600">
              Activité des commandes sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pb-6">
            {isLoading ? (
              <Skeleton className="h-[320px] w-full rounded-xl" />
            ) : (
              <div className="h-[320px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-200">
                <div className="text-center text-slate-500">
                  <Activity className="h-10 w-10 mx-auto mb-3 opacity-70" />
                  <p className="text-lg font-medium">Graphique d'analyse à venir</p>
                  <p className="text-sm mt-1">Intégrez Recharts ou ApexCharts ici</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="md:col-span-3 border-slate-200/70 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Commandes récentes</CardTitle>
            <CardDescription className="text-slate-600">
              Dernières transactions finalisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : stats?.recent_order?.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_order.slice(0, 5).map((order, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200 border border-slate-100"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{order.order_name || "Commande #" + (index + 1)}</p>
                      <p className="text-sm text-slate-500">{order.company?.company_name || "Client inconnu"}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      Terminée
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 rounded-xl border border-slate-200">
                <ShoppingCart className="h-12 w-12 mb-4 opacity-70" />
                <p className="text-lg font-medium">Aucune commande récente</p>
                <p className="text-sm mt-2">Les dernières commandes apparaîtront ici</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Order Status */}
        <Card className="border-slate-200/70 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Statut des commandes</CardTitle>
            <CardDescription className="text-slate-600">
              Distribution actuelle des statuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full rounded-xl" />
            ) : (
              <div className="h-[240px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-200 text-slate-500">
                <div className="text-center">
                  <Activity className="h-10 w-10 mx-auto mb-3 opacity-70" />
                  <p>Graphique de répartition</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Activity */}
        <Card className="border-slate-200/70 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Activité clients</CardTitle>
            <CardDescription className="text-slate-600">
              Interactions récentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full rounded-xl" />
            ) : (
              <div className="h-[240px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-200 text-slate-500">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-70" />
                  <p>Métriques clients à venir</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="border-slate-200/70 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Performance</CardTitle>
            <CardDescription className="text-slate-600">
              Indicateurs clés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full rounded-xl" />
            ) : (
              <div className="h-[240px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-200 text-slate-500">
                <div className="text-center">
                  <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-70" />
                  <p>Métriques performance</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;