import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { Plus, RefreshCw, Search, Building2, CheckCircle, XCircle, Clock } from "lucide-react";
import { getCompanies } from "@/Services/CompanyService";

function CompaniesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "all";

  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total_items: 0,
  });

  const fetchCompanies = async (page = currentPage, status = currentStatus) => {
    setIsRefreshing(true);
    try {
      const params = { page };
      if (status !== "all") params.status = status;

      const response = await getCompanies(params);
      setCompanies(response[0] || []);
      setPagination(response[1] || pagination);
    } catch (e) {
      console.error("Failed to fetch companies:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage, currentStatus);
  }, [currentPage, currentStatus]);

  const handleTabChange = (status) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();

    if (s === "active")
      return { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle };

    if (s === "inactive")
      return { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle };

    return { color: "bg-gray-50 text-gray-700 border-gray-200", icon: Clock };
  };

  const filteredCompanies = companies.filter((c) => {
    if (!searchTerm) return true;
    return Object.values(c).some(
      (v) => v && v.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const stats = [
    { title: "Total", value: pagination.total_items, icon: Building2 },
    { title: "Page", value: `${pagination.page}/${pagination.total_pages}`, icon: Clock },
    { title: "Showing", value: companies.length, icon: Building2 },
  ];

  const renderTable = () => (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/50">
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => {
                const status = getStatusConfig(company.status);
                const Icon = status.icon;

                return (
                  <TableRow
                    key={company.id}
                    className="hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>

                    <TableCell>{company.email || "—"}</TableCell>

                    <TableCell>
                      {new Date(company.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={`${status.color} gap-1.5`}>
                        <Icon size={12} />
                        {company.status || "Unknown"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/companies/companyDetails/${company.id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.total_pages > 1 && (
        <div className="border-t px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {companies.length} of {pagination.total_items} companies
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Prev
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page === pagination.total_pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Companies</h1>
            <p className="text-gray-500">Manage partner companies</p>
          </div>

          <Button
            className="gap-2 bg-slate-900 hover:bg-slate-800"
            onClick={() => navigate("/companies/create")}
          >
            <Plus size={16} /> New Company
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;

            return (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">{s.title}</p>
                    <h3 className="text-2xl font-semibold">
                      {isLoading ? "--" : s.value}
                    </h3>
                  </div>
                  <Icon className="w-5 h-5 text-gray-500" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={currentStatus} onValueChange={handleTabChange}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 pb-0">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => fetchCompanies()}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </Button>
            </CardContent>
          </Card>

          {/* Table */}
          <TabsContent value={currentStatus}>
            <Card className="border-0 shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                renderTable()
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CompaniesPage;