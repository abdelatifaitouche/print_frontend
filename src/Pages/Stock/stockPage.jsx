import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Plus, Download, RefreshCw, Search } from "lucide-react";
import getRawMaterials from "@/Services/StockService"; // API call

function RawMaterialsPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMaterials = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      const data = await getRawMaterials();
      setMaterials(data || []);
    } catch (error) {
      console.error("Failed to fetch raw materials:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((material) =>
    Object.values(material).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = [
    { title: "Total Materials", value: materials.length, change: "+4%", trend: "up" },
    { title: "Low Stock", value: materials.filter(m => parseFloat(m.stock_quantity) <= 10).length, change: "-1%", trend: "down" },
    { title: "High Cost", value: materials.filter(m => parseFloat(m.cost_per_unit) >= 100).length, change: "+8%", trend: "up" }
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Raw Materials Management</h1>
          <p className="text-muted-foreground mt-1">Admin overview of all raw materials</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => console.log("Export raw materials")}
          >
            <Download size={16} /> Export
          </Button>
          <Button
            onClick={() => navigate('/stock/create')}
            className="gap-2"
            variant="default"
          >
            <Plus size={16} /> Add Material
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{isLoading ? "--" : stat.value}</h3>
            </div>
            <Badge variant={stat.trend === "up" ? "secondary" : "destructive"}>
              {stat.change}
            </Badge>
          </div>
        ))}
      </div>

      {/* Search & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search raw materials..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={fetchMaterials}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border mt-4">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Stock Quantity</TableHead>
                <TableHead>Cost per Unit</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.stock_quantity}</TableCell>
                    <TableCell>${material.cost_per_unit}</TableCell>
                    <TableCell>{new Date(material.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/stock/${material.id}`, { state: { material } })}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchTerm ? "No matching materials found" : "No raw materials available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default RawMaterialsPage;
