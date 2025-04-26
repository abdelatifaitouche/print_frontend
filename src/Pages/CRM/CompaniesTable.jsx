import React, { useState, useEffect , useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Eye,
  ArrowUpDown,
  X
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";

const CompaniesTable = ({ data = [], onRowClick, isLoading = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date_joined",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    status: "",
    industry: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Sort data
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Filter data
  const filteredData = useMemo(() => {
    return sortedData.filter((company) => {
      const matchesSearch = 
        company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        !filters.status || company.status?.toLowerCase() === filters.status.toLowerCase();

      const matchesIndustry = 
        !filters.industry || company.industry?.toLowerCase() === filters.industry.toLowerCase();

      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [sortedData, searchTerm, filters]);

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "default";
      case "pending": return "secondary";
      case "inactive": return "destructive";
      default: return "outline";
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ status: "", industry: "" });
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={isFilterOpen ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} />
            Filters
            {Object.values(filters).some(Boolean) && (
              <Badge variant="secondary" className="px-1.5">
                {Object.values(filters).filter(Boolean).length}
              </Badge>
            )}
          </Button>

          {Object.values(filters).some(Boolean) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={clearFilters}
            >
              <X size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="p-4 bg-muted/50 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full p-2 border rounded-md bg-background text-sm"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <Input
              placeholder="Filter by industry"
              value={filters.industry}
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/75"
                onClick={() => requestSort("company_name")}
              >
                <div className="flex items-center gap-1">
                  Company
                  <ArrowUpDown size={14} className="text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/75"
                onClick={() => requestSort("date_joined")}
              >
                <div className="flex items-center gap-1">
                  Joined
                  <ArrowUpDown size={14} className="text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-[40px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((company) => (
                <TableRow 
                  key={company.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => onRowClick ? onRowClick(company) : null}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {company.company_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div>{company.company_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {company.contact_email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{company.contact_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {company.company_phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-1">{company.address}</div>
                  </TableCell>
                  <TableCell>{formatDate(company.date_joined)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(company.status)}>
                      {company.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/companies/companyDetails/${company.id}` , {
                          state : {company}
                        });
                      }}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm || Object.values(filters).some(Boolean) 
                    ? "No matching companies found" 
                    : "No companies available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} companies
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={true} // Add your pagination logic here
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true} // Add your pagination logic here
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;